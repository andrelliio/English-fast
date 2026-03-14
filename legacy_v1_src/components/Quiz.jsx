import { useState, useEffect } from 'react';
import { LEVELS, LEVEL_NAMES, WORDS_PER_LEVEL, getSimilarWords } from '../data/words';
import { tts } from '../utils/tts';
import confetti from 'canvas-confetti';

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export default function Quiz({ store, go, level }) {
  const words = LEVELS[level] || [];
  const base = level * WORDS_PER_LEVEL;
  const [qs, setQs] = useState([]);
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [ok, setOk] = useState(0);
  const [bad, setBad] = useState(0);
  const [done, setDone] = useState(false);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    // Touch level on enter (updates lastActiveLevel)
    store.touchLevel(level);

    // Reset component state when level changes
    setCur(0);
    setSel(null);
    setOk(0);
    setBad(0);
    setDone(false);
    setXp(0);

    // Core words for this level
    const coreQs = words.map((w, i) => ({ word: w, globalIdx: base + i }));
    
    // Pick review words from previous levels
    const reviewPool = [];
    Object.entries(store.data.wordProgress).forEach(([idx, wp]) => {
      const gIdx = parseInt(idx);
      if (wp.seen && (gIdx < base || gIdx >= base + WORDS_PER_LEVEL)) {
        reviewPool.push(gIdx);
      }
    });
    
    // Mix in 3-5 random review words if available
    const reviewCount = Math.min(reviewPool.length, Math.floor(Math.random() * 3) + 3);
    const selectedReviews = shuffle(reviewPool).slice(0, reviewCount).map(gIdx => {
      const lvl = Math.floor(gIdx / WORDS_PER_LEVEL);
      const lIdx = gIdx % WORDS_PER_LEVEL;
      return { word: LEVELS[lvl][lIdx], globalIdx: gIdx };
    });

    const finalPool = shuffle([...coreQs, ...selectedReviews]);

    const questions = finalPool.map(item => {
      const { word, globalIdx } = item;
      const wrongs = getSimilarWords(globalIdx, 4, word.ru);
      return { word, globalIdx, options: shuffle([...wrongs, word.ru]), answer: word.ru };
    });
    setQs(questions);
  }, [level]);

  // Find next uncompleted level (among unlocked)
  const getNextLevel = () => {
    const unlocked = [...store.data.unlockedLevels].sort((a, b) => a - b);
    for (const l of unlocked) {
      if (l >= LEVELS.length) continue;
      if (!store.data.passedLessons.includes(l)) return l;
    }
    return null;
  };

  const handleNextTask = () => {
    const nextLvl = getNextLevel();
    if (nextLvl !== null) {
      go('cards', nextLvl);
    } else {
      go('home');
    }
  };

  useEffect(() => {
    if (qs.length > 0 && cur < qs.length && !done) {
      tts.speak(qs[cur].word.en);
    }
  }, [cur, qs, done]);

  // Completion logic moved to useEffect to avoid stale closures
  useEffect(() => {
    if (done) {
      const acc = Math.round((ok / qs.length) * 100);
      if (acc >= 50) store.completeLevel(level);
      if (acc >= 70) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#00F0FF', '#00FF87', '#FFD700'] });
      }
    }
  }, [done]);

  const next = (force = false) => {
    if (!force && sel === null) return; 
    setCur(prev => {
      if (prev + 1 >= qs.length) {
        setDone(true);
        return prev;
      }
      setSel(null); // This is fine here, it will trigger after render
      return prev + 1;
    });
  };

  if (!qs.length) return null;

  if (store.data.lives === 0 && !done) {
    return (
      <div style={S.page}>
        <Hdr go={go} title="Жизни кончились" />
        <div style={S.center}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>💔</div>
          <div style={S.doneTitle}>Упс! Жизни закончились</div>
          <div style={{ color: 'var(--text-dim)', marginBottom: 30, textAlign: 'center' }}>
            Ты совершил слишком много ошибок. <br/>
            Восстанови жизни, чтобы продолжить!
          </div>
          
          <button 
            className="btn-primary btn-full" 
            style={{ marginBottom: 12, background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000' }}
            disabled={store.data.coins < 100}
            onClick={() => store.refillLives()}
          >
            Восстановить за 💰 100
          </button>
          <button className="btn-ghost btn-full" onClick={() => go('home')}>Вернуться домой</button>
          
          {store.data.coins < 100 && (
            <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 10 }}>Недостаточно монет 💰</div>
          )}
        </div>
      </div>
    );
  }

  if (done) {
    const total = ok + bad;
    const acc = total ? Math.round((ok / total) * 100) : 0;
    const emoji = acc >= 90 ? '🏆' : acc >= 70 ? '🎉' : acc >= 50 ? '💪' : '📚';
    return (
      <div style={S.page}>
        <Hdr go={go} title="Результат" />
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 56 }}>{emoji}</div>
          <div style={S.doneTitle}>{acc >= 90 ? 'Превосходно!' : acc >= 70 ? 'Отлично!' : acc >= 50 ? 'Хорошо!' : 'Нужна практика'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: acc >= 70 ? 'var(--green)' : acc >= 50 ? 'var(--yellow)' : 'var(--red)', filter: `drop-shadow(0 0 15px ${acc >= 70 ? 'var(--green-glow)' : acc >= 50 ? 'var(--yellow-glow)' : 'var(--pink-glow)'})` }}>{acc}%</div>
          <div style={S.dim}>✅ {ok}  ❌ {bad}</div>
          <div style={{ color: 'var(--yellow)', fontWeight: 700, marginBottom: 16 }}>+{xp} XP</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
            <button className="btn-primary btn-full" onClick={handleNextTask}>Следующее задание ➡️</button>
            <div className="btn-row">
              <button className="btn-ghost btn-flex" onClick={() => go('home')}>🏠 Домой</button>
              <button className="btn-primary btn-flex" onClick={() => { 
                setCur(0); setSel(null); setOk(0); setBad(0); setDone(false); 
                // Reshuffle questions AND their internal options
                const reshuffled = shuffle(qs.map(q => ({ ...q, options: shuffle(q.options) })));
                setQs(reshuffled); 
              }}>🔄 Ещё раз</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = qs[cur];
  const pct = ((cur + 1) / qs.length) * 100;
  const answered = sel !== null;

  const pick = (opt) => {
    if (answered) return;
    setSel(opt);
    const correct = opt === q.answer;

    if (navigator.vibrate) {
      navigator.vibrate(correct ? 20 : 100);
    }

    store.recordResult(q.globalIdx, correct);
    if (correct) { 
      setOk(o => o + 1); 
      setXp(x => x + 10);
      // Auto-next on correct - lightning fast
      setTimeout(() => next(true), 50);
    }
    else { setBad(b => b + 1); setXp(x => x + 2); }
  };

  return (
    <div style={S.page} className="anim-in">
      <Hdr go={go} title={LEVEL_NAMES[level] || 'Быстрый тест'} />
      <div style={S.bar}><div style={{ ...S.barIn, width: `${pct}%` }} /></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={S.score}>
          <span style={{ color: 'var(--green)' }}>✅ {ok}</span>
          <span style={{ color: 'var(--red)' }}>❌ {bad}</span>
        </div>
        <div style={S.livesDisplay}>
          {'❤️'.repeat(store.data.lives)}{'🖤'.repeat(3 - store.data.lives)}
        </div>
      </div>

      <div style={S.questionBox} key={cur} className="glass-card anim-pop" onClick={() => tts.speak(q.word.en)}>
        <div style={S.enWord}>{q.word.en}</div>
        <div style={{ position: 'absolute', top: 12, right: 12, opacity: 0.5, fontSize: 18 }}>🔊</div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 14 }}>Выбери правильный перевод</div>

      <div style={S.opts}>
        {q.options.map((opt, i) => {
          let style = { ...S.opt };
          if (answered) {
            if (opt === q.answer) style = { ...style, ...S.optOk };
            else if (opt === sel) style = { ...style, ...S.optBad };
            else style = { ...style, opacity: 0.35 };
          }
          return (
            <button key={i} style={style} onClick={() => pick(opt)}
              className={answered && opt === sel && opt !== q.answer ? 'anim-shake' : ''}
              onMouseEnter={e => { if (!answered) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; } }}
              onMouseLeave={e => { if (!answered) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; } }}>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && sel !== q.answer && (
        <button className="btn-primary btn-full anim-in" style={{ marginTop: 14 }} onClick={next}>
          {cur + 1 >= qs.length ? 'Результаты →' : 'Далее →'}
        </button>
      )}
    </div>
  );
}

function Hdr({ go, title, right }) {
  return (
    <div className="app-header">
      <button className="back-btn-round" onClick={() => go('home')}>←</button>
      <div className="header-title">{title}</div>
      {right && <div className="header-right">{right}</div>}
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' },
  backBtn: { color: 'var(--text-dim)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  bar: { height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', marginBottom: 20, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' },
  barIn: { height: '100%', borderRadius: 4, background: 'var(--accent)', transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', boxShadow: '0 0 10px var(--accent-glow)' },
  score: { display: 'flex', gap: 16, fontSize: 16, fontWeight: 800 },
  livesDisplay: { fontSize: 18, background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 20 },
  questionBox: { padding: '32px 20px', textAlign: 'center', marginBottom: 16, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 },
  enWord: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
  opts: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
  opt: { padding: '16px 20px', borderRadius: 'var(--radius)', fontSize: 16, fontWeight: 700, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(10px)' },
  optOk: { background: 'rgba(0, 255, 135, 0.15)', border: '1px solid var(--green)', color: 'var(--green)', boxShadow: '0 0 15px rgba(0, 255, 135, 0.2)' },
  optBad: { background: 'rgba(255, 51, 102, 0.15)', border: '1px solid var(--red)', color: 'var(--red)', boxShadow: '0 0 15px rgba(255, 51, 102, 0.2)' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 },
  doneTitle: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' },
  dim: { color: 'var(--text-dim)', fontSize: 15, fontWeight: 600 },
};
