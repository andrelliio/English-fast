import { useState, useEffect, useCallback } from 'react';
import { auth } from '../utils/firebase';

const KEY = 'vocabflame_v1';

const defaults = () => ({
  username: '',
  wordProgress: {},
  streak: 0,
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
  touchedLevels: [],          // Levels the user has entered at least once
  passedLessons: [],          // Individual levels completed via quiz
  passedExams: [],            // Levels that have been passed via exam
  onboardingDone: false,      // Whether the welcome screen was seen
  lastActiveLevel: 0,         // The level the user was last looking at
});

export function useStorage() {
  const [user, setUser] = useState(null); // Firebase user
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) {
        const parsed = JSON.parse(s);
        // Migrate old data: add new fields if missing
        if (!parsed.unlockedLevels) parsed.unlockedLevels = [0];
        if (!parsed.touchedLevels) parsed.touchedLevels = [];
        if (!parsed.passedLessons) parsed.passedLessons = [];
        if (!parsed.passedExams) parsed.passedExams = [];
        if (parsed.onboardingDone === undefined) parsed.onboardingDone = false;
        if (parsed.lastActiveLevel === undefined) parsed.lastActiveLevel = 0;
        return parsed;
      }
    } catch {}
    return defaults();
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data]);

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

  const checkStreak = useCallback(() => {
    setData(prev => {
      const today = new Date().toISOString().slice(0, 10);
      if (prev.lastVisit === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      return { ...prev, lastVisit: today, streak: prev.lastVisit === yesterday ? prev.streak + 1 : 1 };
    });
  }, []);

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
      const e = wp[idx] || { seen: true, correct: 0, wrong: 0, mastered: false, lastSeen: Date.now() };
      const correct = e.correct + (ok ? 1 : 0);
      wp[idx] = { ...e, correct, wrong: e.wrong + (ok ? 0 : 1), lastSeen: Date.now(), mastered: correct >= 3 };
      return {
        ...prev, wordProgress: wp,
        totalCorrect: prev.totalCorrect + (ok ? 1 : 0),
        totalWrong: prev.totalWrong + (ok ? 0 : 1),
        xp: prev.xp + (ok ? 10 : 2),
      };
    });
  }, []);

  // Track that a user entered a level
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

      // Count how many unlocked levels haven't passed exam
      const untestedCount = newUnlocked.filter(l => !prev.passedExams.includes(l)).length;

      // Only unlock ONE more if user is under the 5-level cap
      // The user wants strictly no more than 5 untested levels open.
      let newLastActive = prev.lastActiveLevel;
      if (untestedCount < 5) {
        const sortedUnlocked = [...newUnlocked].sort((a, b) => a - b);
        const maxUnlocked = sortedUnlocked[sortedUnlocked.length - 1];
        const nextLvl = maxUnlocked + 1;
        
        // Ensure we don't skip levels and don't re-add
        if (!newUnlocked.includes(nextLvl)) {
           newUnlocked.push(nextLvl);
           // Nudge user to the new level immediately
           newLastActive = nextLvl;
        }
      }

      return { 
        ...prev, 
        passedLessons: newPassedLessons, 
        unlockedLevels: newUnlocked,
        lastActiveLevel: newLastActive
      };
    });
  }, []);

  // Pass an exam: mark levels as passed, unlock 1 more
  const passExam = useCallback((levels) => {
    setData(prev => {
      const newPassed = [...new Set([...prev.passedExams, ...levels])];
      let newUnlocked = [...prev.unlockedLevels];

      // Unlock ONE more level after passing exam (was 2)
      const maxUnlocked = Math.max(...newUnlocked);
      const nextLvl = maxUnlocked + 1;
      if (!newUnlocked.includes(nextLvl)) newUnlocked.push(nextLvl);

      return { ...prev, passedExams: newPassed, unlockedLevels: newUnlocked };
    });
  }, []);

  // Get count of unlocked levels that haven't passed exam
  const untestedCount = data.unlockedLevels.filter(l => !data.passedExams.includes(l)).length;

  const logout = useCallback(() => { 
    auth.signOut();
    localStorage.removeItem(KEY); 
    setData(defaults()); 
  }, []);

  const learned = Object.values(data.wordProgress).filter(w => w.mastered).length;

  return {
    data, update, register, checkStreak, markSeen, recordResult, logout,
    isLoggedIn: !!user || !!data.username, learned,
    touchLevel, completeLevel, passExam, untestedCount,
    user, setUser,
  };
}
