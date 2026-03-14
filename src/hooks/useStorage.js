import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { auth, db } from '../utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const KEY = 'vocabflame_v1';
const STREAK_RESET_VERSION = 2; // Increment this to force-reset everyone's streak

const defaults = () => ({
  username: '',
  wordProgress: {},
  streak: 0,
  streakResetVer: 0,
  lastVisit: null,
  xp: 0,
  totalCorrect: 0,
  totalWrong: 0,
  createdAt: null,
  // New fields for level management
  unlockedLevels: [0],        // Initially only the first level is open
  touchedLevels: [],          // Levels the user has entered at least once
  passedLessons: [],          // Individual levels completed via quiz
  passedExams: [],            // Levels that have been passed via exam
  onboardingDone: false,      // Whether the welcome screen was seen
  lastActiveLevel: 0,         // The level the user was last looking at
  achievements: [],           // Earned badges: { id, date }
  coins: 0,                   // In-game currency
  unlockedThemes: ['default'], // List of unlocked theme IDs
  currentTheme: 'default',    // The active theme ID
});

export function useStorage() {
  const [user, setUser] = useState(null); // Firebase user
  const [data, setData] = useState(defaults());
  const [initialized, setInitialized] = useState(false);
  const isSyncing = useRef(false);

  // Persistence is now handled in utils/firebase.js

  // Load from LocalStorage initially (fast but local)
  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed && typeof parsed === 'object') {
          setData(prev => {
            const next = { 
              ...prev, 
              ...parsed,
              coins: parsed.coins ?? prev.coins,
              unlockedThemes: parsed.unlockedThemes ?? prev.unlockedThemes,
              currentTheme: parsed.currentTheme ?? prev.currentTheme,
              achievements: parsed.achievements ?? prev.achievements,
              xp: parsed.xp ?? prev.xp,
              streakResetVer: parsed.streakResetVer || 0
            };
            
            // Global Streak Reset Migration
            if ((next.streakResetVer || 0) < STREAK_RESET_VERSION) {
              next.streak = 1;
              next.streakResetVer = STREAK_RESET_VERSION;
            }

            // Streak Check during Init
            const d = new Date();
            const today = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
            if (next.lastVisit !== today) {
              const last = next.lastVisit;
              if (!last) {
                next.lastVisit = today;
                next.streak = 1;
              } else {
                const lastDate = new Date(last + 'T00:00:00');
                const todayDate = new Date(today + 'T00:00:00');
                const diffTime = todayDate.getTime() - lastDate.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                  next.streak = (next.streak || 0) + 1;
                  next.lastVisit = today;
                } else if (diffDays > 1) {
                  next.streak = 1;
                  next.lastVisit = today;
                } else {
                  // Already visited today or clock in future
                  next.lastVisit = today;
                }
              }
            }

            return syncRewards(next);
          });
        }
      }
    } catch {}
    setInitialized(true);
  }, []);

  const getRankInfo = useCallback((xp) => {
    // New formula: Level 10 @ 5000 XP, Level 30 @ 45000 XP
    const level = Math.floor(Math.sqrt((xp || 0) / 50)) + 1;
    let title = 'Странник';
    if (level >= 50) title = 'Мастер';
    else if (level >= 35) title = 'Дипломат';
    else if (level >= 30) title = 'Марафонец';
    else if (level >= 25) title = 'Активист';
    else if (level >= 20) title = 'Резидент';
    else if (level >= 15) title = 'Исследователь';
    else if (level >= 10) title = 'Проводник';
    else if (level >= 5) title = 'Скаут';
    return { level, title };
  }, []);

  const checkLevelUp = useCallback((prevData, nextData) => {
    const oldLvl = getRankInfo(prevData.xp).level;
    const newLvl = getRankInfo(nextData.xp).level;
    if (newLvl <= oldLvl) return nextData;
    let bonusCoins = 0;
    let newThemes = [...nextData.unlockedThemes];
    for (let l = oldLvl + 1; l <= newLvl; l++) {
      if (l === 5) { bonusCoins += 500; newThemes.push('dark'); }
      if (l === 10) { bonusCoins += 1000; newThemes.push('steel'); }
      if (l === 15) { bonusCoins += 1000; newThemes.push('emerald'); }
      if (l === 20) { bonusCoins += 1000; newThemes.push('neon'); }
      if (l === 25) { bonusCoins += 1500; newThemes.push('sunset'); }
      if (l === 30) { bonusCoins += 1500; newThemes.push('ocean'); }
      if (l === 35) { bonusCoins += 2000; newThemes.push('gold'); }
      bonusCoins += 50;
    }
    return { ...nextData, coins: (nextData.coins || 0) + bonusCoins, unlockedThemes: [...new Set(newThemes)] };
  }, [getRankInfo]);

  const syncRewards = useCallback((currentData) => {
    const { level } = getRankInfo(currentData.xp || 0);
    let themes = [...(currentData.unlockedThemes || ['default'])];
    const rules = [
      { lvl: 5, id: 'dark' },
      { lvl: 10, id: 'steel' },
      { lvl: 15, id: 'emerald' },
      { lvl: 20, id: 'neon' },
      { lvl: 25, id: 'sunset' },
      { lvl: 30, id: 'ocean' },
      { lvl: 35, id: 'gold' }
    ];
    let changed = false;
    rules.forEach(r => {
      if (level >= r.lvl && !themes.includes(r.id)) {
        themes.push(r.id);
        changed = true;
      }
    });
    if (changed) {
      return { ...currentData, unlockedThemes: [...new Set(themes)] };
    }
    return currentData;
  }, [getRankInfo]);

  const checkAchievements = useCallback((prevData) => {
    const news = [];
    const has = (id) => (prevData.achievements || []).some(a => a.id === id);
    const learned = Object.values(prevData.wordProgress || {}).filter(w => w.mastered).length;
    if (learned >= 10 && !has('first_10_words')) news.push('first_10_words');
    if (learned >= 50 && !has('wizard_50')) news.push('wizard_50');
    if (prevData.streak >= 7 && !has('streak_7')) news.push('streak_7');
    if ((prevData.unlockedLevels || []).length >= 10 && !has('level_10')) news.push('level_10');
    if (prevData.totalCorrect >= 100 && !has('hundred_correct')) news.push('hundred_correct');
    if (news.length === 0) return prevData.achievements || [];
    const today = new Date().toISOString().slice(0, 10);
    return [...(prevData.achievements || []), ...news.map(id => ({ id, date: today }))];
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data, initialized]);

  const update = useCallback((fn) => setData(prev => typeof fn === 'function' ? fn(prev) : { ...prev, ...fn }), []);

  const register = useCallback((username) => {
    const today = new Date().toISOString().slice(0, 10);
    setData(prev => ({
      ...prev,
      username,
      lastVisit: today,
      streak: 1,
      createdAt: today
    }));
  }, []);

  // Streak check moved to sync logic to avoid race conditions

  const markSeen = useCallback((idx) => {
    setData(prev => {
      const wp = { ...prev.wordProgress };
      wp[idx] = { ...(wp[idx] || { correct: 0, wrong: 0, mastered: false }), seen: true, lastSeen: Date.now() };
      return { ...prev, wordProgress: wp };
    });
  }, []);

  const recordResult = useCallback((idx, ok) => {
    setData(prev => {
      const wp = { ...prev.wordProgress };
      const e = wp[idx] || { seen: true, correct: 0, wrong: 0, mastered: false, lastSeen: Date.now(), interval: 0, nextReview: 0 };
      
      const correct = e.correct + (ok ? 1 : 0);
      const newMastered = correct >= 3;
      
      // SRS Logic: simple Leitner-inspired
      // interval is in days
      let nextInterval = e.interval || 0;
      if (ok) {
        if (nextInterval === 0) nextInterval = 1;
        else nextInterval = nextInterval * 2; // Doubling the interval
      } else {
        nextInterval = 0; // Reset on error
      }
      
      const nextReview = Date.now() + (nextInterval * 24 * 60 * 60 * 1000);

      wp[idx] = { 
        ...e, 
        correct, 
        wrong: e.wrong + (ok ? 0 : 1), 
        lastSeen: Date.now(), 
        mastered: newMastered,
        interval: nextInterval,
        nextReview: nextReview
      };

      const curLvl = getRankInfo(prev.xp).level;
      const boost = curLvl >= 20 ? 1.1 : 1.0;
      const xpGain = Math.round((ok ? 10 : 2) * boost);

      const nextData = {
        ...prev, wordProgress: wp,
        totalCorrect: prev.totalCorrect + (ok ? 1 : 0),
        totalWrong: prev.totalWrong + (ok ? 0 : 1),
        xp: prev.xp + xpGain,
      };
      
      const leveled = checkLevelUp(prev, nextData);
      return { ...leveled, achievements: checkAchievements(leveled) };
    });
  }, [checkAchievements, checkLevelUp]);

  // Track that a user entered a level
  const resetProgress = useCallback(async () => {
    if (!confirm('Вы уверены? Весь ваш прогресс будет безвозвратно удален!')) return;
    
    const freshData = {
      ...defaults(),
      username: data.username,
      streakResetVer: STREAK_RESET_VERSION // Keep the reset version so it doesn't re-trigger
    };

    setData(freshData);
    localStorage.setItem(KEY, JSON.stringify(freshData));

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userRef, freshData);
      } catch (e) {
        console.error("Reset cloud error:", e);
      }
    }
  }, [data.username, user]);

  const touchLevel = useCallback((lvl) => {
    setData(prev => {
      const isNew = !prev.touchedLevels.includes(lvl);
      const isNewActive = prev.lastActiveLevel !== lvl;
      if (!isNew && !isNewActive) return prev;
      
      const next = { ...prev, lastActiveLevel: lvl };
      if (isNew) next.touchedLevels = [...prev.touchedLevels, lvl];
      return next;
    });
  }, []);

  // Mark a level as completed (passed quiz). Unlock next level if under 5-untested cap.
  const completeLevel = useCallback((lvl) => {
    setData(prev => {
      const newPassedLessons = [...new Set([...prev.passedLessons, lvl])];
      let newUnlocked = [...prev.unlockedLevels];

      const untestedCount = newUnlocked.filter(l => !prev.passedExams.includes(l)).length;

      let newLastActive = prev.lastActiveLevel;
      if (untestedCount < 5) {
        const sortedUnlocked = [...newUnlocked].sort((a, b) => a - b);
        const maxUnlocked = sortedUnlocked[sortedUnlocked.length - 1];
        const nextLvl = maxUnlocked + 1;
        
        if (!newUnlocked.includes(nextLvl)) {
           newUnlocked.push(nextLvl);
           newLastActive = nextLvl;
        }
      }

      const nextData = { 
        ...prev, 
        passedLessons: newPassedLessons, 
        unlockedLevels: newUnlocked,
        lastActiveLevel: newLastActive
      };
      return { ...nextData, achievements: checkAchievements(nextData) };
    });
  }, [checkAchievements]);

  // Pass an exam: mark levels as passed, unlock 1 more
  const passExam = useCallback((levels) => {
    setData(prev => {
      const newPassed = [...new Set([...prev.passedExams, ...levels])];
      let newUnlocked = [...prev.unlockedLevels];

      const maxUnlocked = Math.max(...newUnlocked);
      const nextLvl = maxUnlocked + 1;
      if (!newUnlocked.includes(nextLvl)) newUnlocked.push(nextLvl);

      const nextData = { ...prev, passedExams: newPassed, unlockedLevels: newUnlocked };
      return { ...nextData, achievements: checkAchievements(nextData) };
    });
  }, [checkAchievements]);

  const logout = useCallback(() => { 
    auth.signOut();
    localStorage.removeItem(KEY); 
    setData(defaults()); 
  }, []);

  // Get count of unlocked levels that haven't passed exam
  const untestedCount = data.unlockedLevels.filter(l => !data.passedExams.includes(l)).length;

  // Sync with Firestore when user logs in or data changes
  useEffect(() => {
    if (!initialized || !user || isSyncing.current) return;

    const syncWithCloud = async () => {
      const userRef = doc(db, 'users', user.uid);
      try {
        isSyncing.current = true;
        // 1. First time after login: try to fetch from cloud
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const cloudData = snap.data();
          
          // Intelligent merge: take the "best" of both worlds
          setData(prev => {
            const merged = { ...prev, ...cloudData };
            
            // 1. Union of levels
            merged.unlockedLevels = [...new Set([...(prev.unlockedLevels || []), ...(cloudData.unlockedLevels || [])])];
            merged.touchedLevels = [...new Set([...(prev.touchedLevels || []), ...(cloudData.touchedLevels || [])])];
            merged.passedLessons = [...new Set([...(prev.passedLessons || []), ...(cloudData.passedLessons || [])])];
            merged.passedExams = [...new Set([...(prev.passedExams || []), ...(cloudData.passedExams || [])])];
            
            // 2. Max XP and stats
            merged.xp = Math.max(prev.xp || 0, cloudData.xp || 0);
            merged.totalCorrect = Math.max(prev.totalCorrect || 0, cloudData.totalCorrect || 0);
            
            // 3. Merged word progress
            const mergedWP = { ...(prev.wordProgress || {}) };
            Object.entries(cloudData.wordProgress || {}).forEach(([id, cWord]) => {
              const pWord = mergedWP[id] || {};
              mergedWP[id] = {
                ...pWord, ...cWord,
                correct: Math.max(pWord.correct || 0, cWord.correct || 0),
                mastered: pWord.mastered || cWord.mastered
              };
            });
            merged.wordProgress = mergedWP;

            // 4. Streak Merge & Check Logic
            const d = new Date();
            const today = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
            
            const localLast = prev.lastVisit;
            const cloudLast = cloudData.lastVisit;
            const localStreak = prev.streak || 0;
            const cloudStreak = cloudData.streak || 0;
            
            // Source with most recent date wins
            let baseLast = localLast;
            let baseStreak = localStreak;

            if (cloudLast && (!localLast || cloudLast > localLast)) {
              baseLast = cloudLast;
              baseStreak = cloudStreak;
            } else if (cloudLast === localLast) {
              baseStreak = Math.max(localStreak, cloudStreak);
            }
            
            // Global Streak Reset Migration
            const cloudResetVer = cloudData.streakResetVer || 0;
            const currentResetVer = Math.max(prev.streakResetVer || 0, cloudResetVer);
            
            if (currentResetVer < STREAK_RESET_VERSION) {
              baseStreak = 1;
              merged.streakResetVer = STREAK_RESET_VERSION;
            } else {
              merged.streakResetVer = currentResetVer;
            }

            if (!baseLast) {
              merged.streak = 1;
              merged.lastVisit = today;
            } else if (baseLast === today) {
              merged.streak = baseStreak || 1;
              merged.lastVisit = today;
            } else {
              const lastDate = new Date(baseLast + 'T00:00:00');
              const todayDate = new Date(today + 'T00:00:00');
              const diffTime = todayDate.getTime() - lastDate.getTime();
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 1) {
                merged.streak = baseStreak + 1;
                merged.lastVisit = today;
              } else if (diffDays > 1) {
                merged.streak = 1;
                merged.lastVisit = today;
              } else {
                // Future date or clock error
                merged.streak = baseStreak || 1;
                merged.lastVisit = today;
              }
            }
            
            return syncRewards(merged);
          });
        } else {
          // New user or first time sync: push local data to cloud
          await setDoc(userRef, data);
        }
      } catch (e) {
        console.error("Sync error:", e);
      } finally {
        isSyncing.current = false;
      }
    };

    syncWithCloud();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Periodic push to cloud whenever data changes
  useEffect(() => {
    if (!initialized || !user || isSyncing.current) return;
    
    localStorage.setItem(KEY, JSON.stringify(data));

    const timeout = setTimeout(async () => {
      const userRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userRef, data, { merge: true });
      } catch (e) {
        console.error("Cloud push error:", e);
      }
    }, 2000); // Debounce sync by 2 seconds

    return () => clearTimeout(timeout);
  }, [data, user, initialized]);

  // Guarded calculations
  const rankInfo = useMemo(() => getRankInfo(data?.xp || 0), [data?.xp, getRankInfo]);
  const learnedCountRaw = useMemo(() => 
    Object.values(data?.wordProgress || {}).filter(w => w.mastered).length
  , [data?.wordProgress]);

  return useMemo(() => ({
    data: data || defaults(), 
    update, register, markSeen, recordResult, logout, resetProgress,
    isLoggedIn: !!user, learned: learnedCountRaw,
    touchLevel, completeLevel, passExam, untestedCount,
    user, setUser,
    checkAchievements, checkLevelUp, getRankInfo,
    level: rankInfo.level, rankTitle: rankInfo.title,
    initialized
  }), [
    data, user, update, register, markSeen, recordResult, logout, 
    touchLevel, completeLevel, passExam, untestedCount, setUser, 
    checkAchievements, checkLevelUp, getRankInfo, rankInfo, learnedCountRaw, initialized
  ]);
}
