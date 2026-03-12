import { useState, useEffect } from 'react';
import { LEVELS, LEVEL_NAMES, WORDS_PER_LEVEL } from '../data/words';
import allWords from '../data/words';

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
    const questions = shuffle(words.map((w, i) => ({ ...w, idx: i }))).map(word => {
      const wrongs = shuffle(allWords.filter(w => w.ru !== word.ru)).slice(0, 4).map(w => w.ru);
      return { word, options: shuffle([...wrongs, word.ru]), answer: word.ru };
    });
    setQs(questions);
  }, [level]);

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
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 900, color: acc >= 70 ? 'var(--green)' : acc >= 50 ? 'var(--yellow)' : 'var(--red)' }}>{acc}%</div>
          <div style={S.dim}>✅ {ok}  ❌ {bad}</div>
          <div style={{ color: 'var(--yellow)', fontWeight: 700 }}>+{xp} XP</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8, width: '100%', maxWidth: 320 }}>
            <button style={S.btnGhost} onClick={() => go('home')}>Домой</button>
            <button style={S.btnPrimary} onClick={() => { setCur(0); setSel(null); setOk(0); setBad(0); setDone(false); setXp(0); setQs(shuffle(qs)); }}>Ещё раз</button>
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

      <div style={S.questionBox} key={cur} className="anim-in">
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
              onMouseEnter={e => { if (!answered) e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
              onMouseLeave={e => { if (!answered) e.currentTarget.style.borderColor = 'transparent'; }}>
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
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column' },
  backBtn: { background: 'var(--bg-card)', color: 'var(--text)', borderRadius: 50, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '1px solid #ffffff08' },
  bar: { height: 5, background: 'var(--bg-card)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 },
  barIn: { height: '100%', borderRadius: 3, transition: 'width 0.3s' },
  score: { display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16, fontSize: 15, fontWeight: 700 },
  questionBox: { background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '26px 20px', textAlign: 'center', marginBottom: 8, border: '1px solid #ffffff08' },
  enWord: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 },
  opts: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  opt: { padding: '14px 18px', borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 600, background: 'var(--bg-card)', color: 'var(--text)', border: '2px solid transparent', textAlign: 'left', transition: 'all 0.15s' },
  optOk: { background: '#34d39920', border: '2px solid var(--green)', color: 'var(--green)' },
  optBad: { background: '#f8717120', border: '2px solid var(--red)', color: 'var(--red)' },
  btnPrimary: { flex: 1, padding: 15, background: 'linear-gradient(135deg, var(--accent), #ff8c5a)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 16px var(--accent-glow)' },
  btnGhost: { flex: 1, padding: 15, background: 'var(--bg-card)', color: 'var(--text)', borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 700, border: '1px solid #ffffff08' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 10 },
  doneTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 },
  dim: { color: 'var(--text-dim)', fontSize: 14 },
};
