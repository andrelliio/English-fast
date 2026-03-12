import { useState, useEffect, useCallback } from 'react';

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
  unlockedLevels: [0, 1],    // Initially 2 levels open
  touchedLevels: [],          // Levels the user has entered at least once
  passedExams: [],            // Levels that have been passed via exam
  placementDone: false,       // Whether placement test was completed
  onboardingDone: false,      // Whether the welcome screen was seen
});

export function useStorage() {
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) {
        const parsed = JSON.parse(s);
        // Migrate old data: add new fields if missing
        if (!parsed.unlockedLevels) parsed.unlockedLevels = [0, 1];
        if (!parsed.touchedLevels) parsed.touchedLevels = [];
        if (!parsed.passedExams) parsed.passedExams = [];
        if (parsed.placementDone === undefined) parsed.placementDone = false;
        if (parsed.onboardingDone === undefined) parsed.onboardingDone = false;
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
    setData({ ...defaults(), username, lastVisit: today, streak: 1, createdAt: today });
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

  // Mark a level as "touched" (user entered it). If this creates a trigger, unlock 2 more levels.
  const touchLevel = useCallback((lvl) => {
    setData(prev => {
      if (prev.touchedLevels.includes(lvl)) return prev;
      const newTouched = [...prev.touchedLevels, lvl];
      let newUnlocked = [...prev.unlockedLevels];

      // Count how many unlocked levels haven't passed exam
      const untestedCount = newUnlocked.filter(l => !prev.passedExams.includes(l)).length;

      // If under the cap of 5 untested, unlock 2 more
      if (untestedCount < 5) {
        const maxUnlocked = Math.max(...newUnlocked);
        const toAdd = [];
        for (let i = 1; i <= 2; i++) {
          const nextLvl = maxUnlocked + i;
          if (!newUnlocked.includes(nextLvl)) toAdd.push(nextLvl);
        }
        // Only add if it wouldn't exceed 5 untested
        for (const l of toAdd) {
          const currentUntested = newUnlocked.filter(ul => !prev.passedExams.includes(ul)).length;
          if (currentUntested < 5) {
            newUnlocked.push(l);
          }
        }
      }

      return { ...prev, touchedLevels: newTouched, unlockedLevels: newUnlocked };
    });
  }, []);

  // Pass an exam: mark levels as passed, unlock 2 more
  const passExam = useCallback((levels) => {
    setData(prev => {
      const newPassed = [...new Set([...prev.passedExams, ...levels])];
      let newUnlocked = [...prev.unlockedLevels];

      // Unlock 2 more levels after passing exam
      const maxUnlocked = Math.max(...newUnlocked);
      for (let i = 1; i <= 2; i++) {
        const nextLvl = maxUnlocked + i;
        if (!newUnlocked.includes(nextLvl)) newUnlocked.push(nextLvl);
      }

      return { ...prev, passedExams: newPassed, unlockedLevels: newUnlocked };
    });
  }, []);

  // Unlock up to level and mark words as seen (for placement test)
  const unlockUpToWithWords = useCallback((maxLevel, wordsPerLevel) => {
    setData(prev => {
      const newUnlocked = [];
      const newPassed = [];
      for (let i = 0; i <= maxLevel; i++) {
        newUnlocked.push(i);
        newPassed.push(i);
      }
      // Unlock 2 beyond
      newUnlocked.push(maxLevel + 1);
      newUnlocked.push(maxLevel + 2);

      // Mark all words in passed levels as seen (for review)
      const wp = { ...prev.wordProgress };
      for (let lvl = 0; lvl <= maxLevel; lvl++) {
        for (let w = 0; w < wordsPerLevel; w++) {
          const idx = lvl * wordsPerLevel + w;
          if (!wp[idx]) {
            wp[idx] = { seen: true, correct: 3, wrong: 0, mastered: true, lastSeen: Date.now() };
          }
        }
      }

      return {
        ...prev,
        wordProgress: wp,
        unlockedLevels: [...new Set([...prev.unlockedLevels, ...newUnlocked])],
        passedExams: [...new Set([...prev.passedExams, ...newPassed])],
        placementDone: true,
      };
    });
  }, []);

  // Get count of unlocked levels that haven't passed exam
  const untestedCount = data.unlockedLevels.filter(l => !data.passedExams.includes(l)).length;

  const logout = useCallback(() => { localStorage.removeItem(KEY); setData(defaults()); }, []);

  const learned = Object.values(data.wordProgress).filter(w => w.mastered).length;

  return {
    data, update, register, checkStreak, markSeen, recordResult, logout,
    isLoggedIn: !!data.username, learned,
    touchLevel, passExam, unlockUpToWithWords, untestedCount,
  };
}
