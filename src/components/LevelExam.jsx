import { useState, useEffect } from 'react';
import allWords, { LEVELS, WORDS_PER_LEVEL, getSimilarWords } from '../data/words';

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export default function LevelExam({ store, go }) {
  const [qs, setQs] = useState([]);
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [ok, setOk] = useState(0);
  const [bad, setBad] = useState(0);
  const [done, setDone] = useState(false);
  const [examLevels, setExamLevels] = useState([]);

  useEffect(() => {
    // Get all unlocked levels not yet exam-passed
    const untested = store.data.unlockedLevels.filter(l => !store.data.passedExams.includes(l)).sort((a, b) => a - b);
    setExamLevels(untested);

    // Gather words from untested levels, up to 50
    const wordPool = [];
    for (const lvl of untested) {
      const base = lvl * WORDS_PER_LEVEL;
      const words = LEVELS[lvl] || [];
      words.forEach((w, i) => {
        wordPool.push({ ...w, globalIdx: base + i, level: lvl });
      });
    }

    // Shuffle and take up to 50
    const selected = shuffle(wordPool).slice(0, 50);

    const questions = selected.map(word => {
      const wrongs = getSimilarWords(word.globalIdx, 4, word.ru);
      return { word, options: shuffle([...wrongs, word.ru]), answer: word.ru };
    });

    setQs(questions);
  }, []);

  useEffect(() => {
    if (done) {
      const total = ok + bad;
      const acc = total ? Math.round((ok / total) * 100) : 0;
      if (acc >= 90) {
        store.passExam(examLevels);
      }
    }
  }, [done, ok, bad, examLevels, store]);

  if (!qs.length) return null;

  if (done) {
    const total = ok + bad;
    const acc = total ? Math.round((ok / total) * 100) : 0;
    const passed = acc >= 90;

    return (
      <div style={S.page}>
        <Hdr go={go} title="Результат экзамена" />
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 56 }}>{passed ? '🏆' : '📚'}</div>
          <div style={S.doneTitle}>{passed ? 'Экзамен сдан!' : 'Не сдано — нужно ≥90%'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: passed ? 'var(--green)' : 'var(--red)', filter: `drop-shadow(0 0 15px \${passed ? 'var(--green-glow)' : 'var(--pink-glow)'})` }}>{acc}%</div>
          <div style={S.dim}>✅ {ok}  ❌ {bad}  (из {total})</div>
          {passed && <div style={{ color: 'var(--green)', fontWeight: 700, fontSize: 14 }}>🎉 Новые уровни разблокированы!</div>}
          {!passed && <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Повтори материал и попробуй снова</div>}
          <div className="btn-row" style={{ marginTop: 20, maxWidth: 320, padding: '0 20px' }}>
            <button className="btn-ghost btn-flex" onClick={() => go('home')}>🏠 Домой</button>
            {!passed && <button className="btn-primary btn-flex" onClick={() => { setCur(0); setSel(null); setOk(0); setBad(0); setDone(false); setQs(shuffle(qs)); }}>🔄 Ещё раз</button>}
            {passed && <button className="btn-primary btn-flex" onClick={() => go('levels')}>📋 Уровни</button>}
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
    store.recordResult(q.word.globalIdx, correct);
    if (correct) {
      setOk(o => o + 1);
      // Auto-next on correct - lightning fast
      setTimeout(() => next(), 50);
    } else {
      setBad(b => b + 1);
    }
  };

  const next = () => {
    setCur(prev => {
      if (prev + 1 >= qs.length) {
        setDone(true);
        return prev;
      }
      setSel(null);
      return prev + 1;
    });
  };

  return (
    <div style={S.page} className="anim-in">
      <Hdr go={go} title="📝 Экзамен" right={`${cur + 1}/${qs.length}`} />
      <div style={S.bar}><div style={{ ...S.barIn, width: `${pct}%` }} /></div>

      <div style={S.score}>
        <span style={{ color: 'var(--green)' }}>✅ {ok}</span>
        <span style={{ color: 'var(--red)' }}>❌ {bad}</span>
        <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>нужно ≥90%</span>
      </div>

      <div style={S.questionBox} key={cur} className="glass-card anim-pop">
        <div style={S.enWord}>{q.word.en}</div>
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

      {answered && (
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
  barIn: { height: '100%', borderRadius: 4, background: 'var(--yellow)', transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)' },
  score: { display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 20, fontSize: 16, fontWeight: 800, alignItems: 'center' },
  questionBox: { padding: '32px 20px', textAlign: 'center', marginBottom: 16, border: '1px solid rgba(255, 215, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 },
  enWord: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
  opts: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
  opt: { padding: '16px 20px', borderRadius: 'var(--radius)', fontSize: 16, fontWeight: 700, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(10px)' },
  optOk: { background: 'rgba(0, 255, 135, 0.15)', border: '1px solid var(--green)', color: 'var(--green)', boxShadow: '0 0 15px rgba(0, 255, 135, 0.2)' },
  optBad: { background: 'rgba(255, 51, 102, 0.15)', border: '1px solid var(--red)', color: 'var(--red)', boxShadow: '0 0 15px rgba(255, 51, 102, 0.2)' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 },
  doneTitle: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' },
  dim: { color: 'var(--text-dim)', fontSize: 15, fontWeight: 600 },
};
