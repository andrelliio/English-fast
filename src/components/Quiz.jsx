import { useState, useEffect } from 'react';
import { LEVELS, LEVEL_NAMES, WORDS_PER_LEVEL, getSimilarWords } from '../data/words';

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
    // Touch level on enter
    store.touchLevel(level);

    // Reset component state when level changes
    setCur(0);
    setSel(null);
    setOk(0);
    setBad(0);
    setDone(false);
    setXp(0);

    const questions = shuffle(words.map((w, i) => ({ ...w, idx: i }))).map(word => {
      const globalIdx = base + word.idx;
      // Use semantically similar distractors
      const wrongs = getSimilarWords(globalIdx, 4, word.ru);
      return { word, options: shuffle([...wrongs, word.ru]), answer: word.ru };
    });
    setQs(questions);
  }, [level]);

  // Find next available level
  const getNextLevel = () => {
    for (let l = level + 1; l < LEVELS.length; l++) {
      if (store.data.unlockedLevels.includes(l)) return l;
    }
    return null;
  };

  const handleNextTask = () => {
    // If the user has accumulated 5 unlocked but untested levels, force them to the exam
    const untestedCount = store.data.unlockedLevels.filter(l => !store.data.passedExams.includes(l)).length;
    if (untestedCount >= 5) {
      go('levelExam');
    } else {
      const nextLvl = getNextLevel();
      if (nextLvl !== null) {
        go('cards', nextLvl);
      } else {
        go('home');
      }
    }
  };

  if (!qs.length) return null;

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
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: acc >= 70 ? 'var(--green)' : acc >= 50 ? 'var(--yellow)' : 'var(--red)', filter: `drop-shadow(0 0 15px \${acc >= 70 ? 'var(--green-glow)' : acc >= 50 ? 'var(--yellow-glow)' : 'var(--pink-glow)'})` }}>{acc}%</div>
          <div style={S.dim}>✅ {ok}  ❌ {bad}</div>
          <div style={{ color: 'var(--yellow)', fontWeight: 700 }}>+{xp} XP</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8, width: '100%', maxWidth: 320 }}>
            <button style={S.btnPrimary} onClick={handleNextTask}>Следующее задание ➡️</button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={S.btnGhost} onClick={() => go('home')}>🏠 Домой</button>
              <button style={S.btnGhost} onClick={() => { setCur(0); setSel(null); setOk(0); setBad(0); setDone(false); setXp(0); setQs(shuffle(qs)); }}>🔄 Ещё раз</button>
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
    store.recordResult(base + q.word.idx, correct);
    if (correct) { setOk(o => o + 1); setXp(x => x + 10); }
    else { setBad(b => b + 1); setXp(x => x + 2); }
  };

  const next = () => {
    if (cur + 1 >= qs.length) setDone(true);
    else { setCur(c => c + 1); setSel(null); }
  };

  return (
    <div style={S.page} className="anim-in">
      <Hdr go={go} title={LEVEL_NAMES[level]} right={`${cur + 1}/${qs.length}`} />
      <div style={S.bar}><div style={{ ...S.barIn, width: `${pct}%`, background: bad > ok ? 'linear-gradient(90deg, var(--red), #fb923c)' : 'linear-gradient(90deg, var(--green), #2dd4bf)' }} /></div>

      <div style={S.score}>
        <span style={{ color: 'var(--green)' }}>✅ {ok}</span>
        <span style={{ color: 'var(--red)' }}>❌ {bad}</span>
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
        <button style={{ ...S.btnPrimary, marginTop: 14, width: '100%' }} onClick={next} className="anim-in">
          {cur + 1 >= qs.length ? 'Результаты →' : 'Далее →'}
        </button>
      )}
    </div>
  );
}

function Hdr({ go, title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingTop: 8 }}>
      <button style={S.backBtn} onClick={() => go('home')}>←</button>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, flex: 1 }}>{title}</div>
      {right && <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>{right}</div>}
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' },
  backBtn: { color: 'var(--text-dim)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  bar: { height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', marginBottom: 20, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' },
  barIn: { height: '100%', borderRadius: 4, transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', boxShadow: '0 0 10px var(--accent-glow)' },
  score: { display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 20, fontSize: 16, fontWeight: 800 },
  questionBox: { padding: '32px 20px', textAlign: 'center', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 },
  enWord: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
  opts: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
  opt: { padding: '16px 20px', borderRadius: 'var(--radius)', fontSize: 16, fontWeight: 700, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(10px)' },
  optOk: { background: 'rgba(0, 255, 135, 0.15)', border: '1px solid var(--green)', color: 'var(--green)', boxShadow: '0 0 15px rgba(0, 255, 135, 0.2)' },
  optBad: { background: 'rgba(255, 51, 102, 0.15)', border: '1px solid var(--red)', color: 'var(--red)', boxShadow: '0 0 15px rgba(255, 51, 102, 0.2)' },
  btnPrimary: { flex: 1, padding: 18, background: 'var(--accent-gradient)', color: 'white', borderRadius: 'var(--radius-pill)', fontSize: 16, fontWeight: 800, boxShadow: '0 8px 24px rgba(0, 85, 255, 0.4)', letterSpacing: 0.5 },
  btnGhost: { flex: 1, padding: 18, background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text)', borderRadius: 'var(--radius-pill)', fontSize: 16, fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 },
  doneTitle: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' },
  dim: { color: 'var(--text-dim)', fontSize: 15, fontWeight: 600 },
};
