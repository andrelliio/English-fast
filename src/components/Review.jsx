import { useState, useEffect } from 'react';
import allWords, { getSimilarWords } from '../data/words';
import { tts } from '../utils/tts';
import confetti from 'canvas-confetti';

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export default function Review({ store, go }) {
  const [qs, setQs] = useState([]);
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [ok, setOk] = useState(0);
  const [bad, setBad] = useState(0);

  useEffect(() => {
    const now = Date.now();
    const wp = store.data.wordProgress;
    
    // 1. Identify all levels that are UNLOCKED or PASSED
    const unlockedLevels = store.data.unlockedLevels || [0];
    const WORDS_PER_LEVEL = 10; // Match the constant in words.js
    
    // 2. Build a pool of all possible word indices from these levels
    const poolIndices = [];
    unlockedLevels.forEach(lvl => {
      const start = lvl * WORDS_PER_LEVEL;
      for (let i = 0; i < WORDS_PER_LEVEL; i++) {
        if (allWords[start + i]) {
          poolIndices.push(start + i);
        }
      }
    });

    // 3. Get words specifically DUE for review (SRS priority)
    const due = Object.entries(wp)
      .filter(([idx, w]) => poolIndices.includes(parseInt(idx)) && (w.seen || w.mastered) && (w.nextReview || 0) <= now)
      .map(([idx]) => parseInt(idx));

    // 4. Combine: Due (Priority) + Random words from the unlocked pool
    // We shuffle the pool to get random words from any unlocked level
    const randomFromPool = shuffle(poolIndices);

    let selectedIndices = Array.from(new Set([
      ...shuffle(due).slice(0, 15),
      ...randomFromPool.slice(0, 20)
    ])).slice(0, 25); 

    if (selectedIndices.length === 0) {
      setQs([]);
      return;
    }

    const toReview = selectedIndices.map(i => {
      const word = allWords[i];
      if (!word) return null;
      const wrongs = getSimilarWords(i, 4, word.ru);
      return { word, wordIdx: i, options: shuffle([...wrongs, word.ru]), answer: word.ru };
    }).filter(Boolean);

    setQs(shuffle(toReview));
  }, []);

  const isDone = cur >= qs.length;

  useEffect(() => {
    if (qs.length > 0 && cur < qs.length && !isDone) {
      tts.speak(qs[cur].word.en);
    }
  }, [cur, qs, isDone]);

  useEffect(() => {
    if (isDone) {
      const acc = ok + bad > 0 ? Math.round((ok / (ok + bad)) * 100) : 0;
      if (acc >= 70) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#00F0FF', '#00FF87', '#FFD700'] });
      }
    }
  }, [isDone, ok, bad]);

  if (!qs.length) {
    return (
      <div style={S.page}>
        <Hdr go={go} />
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 48 }}>✨</div>
          <div style={S.t}>Нет слов для повторения</div>
          <div style={S.dim}>Сначала выучи слова в карточках!</div>
          <button className="btn-primary" style={{ marginTop: 16, minWidth: 200 }} onClick={() => go('home')}>На главную</button>
        </div>
      </div>
    );
  }

  if (isDone) {
    const acc = ok + bad > 0 ? Math.round((ok / (ok + bad)) * 100) : 0;
    return (
      <div style={S.page}>
        <Hdr go={go} />
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 56, filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.4))' }}>{acc >= 80 ? '🌟' : '💪'}</div>
          <div style={S.t}>{acc >= 80 ? 'Отличная память!' : 'Хороший старт!'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: acc >= 70 ? 'var(--green)' : 'var(--yellow)', filter: `drop-shadow(0 0 15px ${acc >= 70 ? 'var(--green-glow)' : 'var(--yellow-glow)'})` }}>{acc}%</div>
          <div style={S.dim}>✅ {ok}  ❌ {bad}</div>
          <div className="btn-row" style={{ marginTop: 20, maxWidth: 320 }}>
            <button className="btn-ghost btn-flex" onClick={() => go('home')}>🏠 Домой</button>
            <button className="btn-primary btn-flex" onClick={() => { 
              setCur(0); setSel(null); setOk(0); setBad(0); 
              // Reshuffle questions AND their internal options
              const reshuffled = shuffle(qs.map(q => ({ ...q, options: shuffle(q.options) })));
              setQs(reshuffled); 
            }}>🔄 Ещё раз</button>
          </div>
        </div>
      </div>
    );
  }

  const q = qs[cur];
  const answered = sel !== null;
  const pct = qs.length > 0 ? Math.round((cur / qs.length) * 100) : 0;

  const next = () => {
    if (sel === null) return; // Prevent manual skip without answer
    setCur(c => c + 1);
    setSel(null);
  };

  const pick = (opt) => {
    if (answered) return;
    setSel(opt);
    const correct = opt === q.answer;

    if (navigator.vibrate) {
      navigator.vibrate(correct ? 20 : 100);
    }

    store.recordResult(q.wordIdx, correct, true);
    if (correct) {
      setOk(o => o + 1);
      // Auto-next on correct - faster
      setTimeout(() => {
        setCur(c => c + 1);
        setSel(null);
      }, 400);
    } else {
      setBad(b => b + 1);
    }
  };

  return (
    <div style={S.page} className="anim-in">
      <Hdr go={go} title="Повторение слов" />
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
      <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12 }}>Вспомни перевод</div>
      <div style={S.opts}>
        {q.options.map((opt, i) => {
          let style = { ...S.opt };
          if (answered) {
            if (opt === q.answer) style = { ...style, ...S.optOk };
            else if (opt === sel) style = { ...style, ...S.optBad };
            else style = { ...style, opacity: 0.35 };
          }
          return (
            <button key={i} style={style} onClick={() => pick(opt)} className={answered && opt === sel && opt !== q.answer ? 'anim-shake' : ''}
              onMouseEnter={e => { if (!answered) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; } }}
              onMouseLeave={e => { if (!answered) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; } }}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && sel !== q.answer && (
        <button className="btn-primary btn-full anim-in" style={{ marginTop: 16 }} onClick={next}>
          {cur + 1 >= qs.length ? 'Результаты →' : 'Далее →'}
        </button>
      )}
    </div>
  );
}

function Hdr({ go, title }) {
  return (
    <div className="app-header">
      <button className="back-btn-round" onClick={() => go('home')}>←</button>
      <div className="header-title">{title}</div>
      {/* {right && <div className="header-right">{right}</div>} */}
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' },
  back: { color: 'var(--text-dim)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  bar: { height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', marginBottom: 14, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' },
  barIn: { height: '100%', borderRadius: 4, background: 'var(--purple)', transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', boxShadow: '0 0 10px rgba(178, 36, 239, 0.6)' },
  score: { display: 'flex', gap: 16, fontSize: 16, fontWeight: 800 },
  livesDisplay: { fontSize: 18, background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 20 },
  questionBox: { padding: '32px 20px', textAlign: 'center', marginBottom: 16, border: '1px solid rgba(178, 36, 239, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 },
  enWord: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
  opts: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
  opt: { padding: '16px 20px', borderRadius: 'var(--radius)', fontSize: 16, fontWeight: 700, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(10px)', cursor: 'pointer' },
  optOk: { background: 'rgba(0, 255, 135, 0.15)', border: '1px solid var(--green)', color: 'var(--green)', boxShadow: '0 0 15px rgba(0, 255, 135, 0.2)' },
  optBad: { background: 'rgba(255, 51, 102, 0.15)', border: '1px solid var(--red)', color: 'var(--red)', boxShadow: '0 0 15px rgba(255, 51, 102, 0.2)' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 },
  t: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' },
  dim: { color: 'var(--text-dim)', fontSize: 15, fontWeight: 600 },
};
