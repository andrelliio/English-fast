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
});

export function useStorage() {
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch {}
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
      const learned = Object.values(wp).filter(w => w.mastered).length;
      return {
        ...prev, wordProgress: wp,
        totalCorrect: prev.totalCorrect + (ok ? 1 : 0),
        totalWrong: prev.totalWrong + (ok ? 0 : 1),
        xp: prev.xp + (ok ? 10 : 2),
      };
    });
  }, []);

  const logout = useCallback(() => { localStorage.removeItem(KEY); setData(defaults()); }, []);

  const learned = Object.values(data.wordProgress).filter(w => w.mastered).length;

  return { data, update, register, checkStreak, markSeen, recordResult, logout, isLoggedIn: !!data.username, learned };
}
