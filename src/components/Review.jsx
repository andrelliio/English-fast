import { useState, useEffect } from 'react';
import allWords from '../data/words';

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export default function Review({ store, go }) {
  const [qs, setQs] = useState([]);
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [ok, setOk] = useState(0);
  const [bad, setBad] = useState(0);

  useEffect(() => {
    const toReview = Object.entries(store.data.wordProgress)
      .filter(([_, w]) => w.seen && !w.mastered)
      .sort((a, b) => a[1].lastSeen - b[1].lastSeen)
      .slice(0, 15)
      .map(([idx]) => {
        const i = parseInt(idx);
        const word = allWords[i];
        if (!word) return null;
        const wrongs = shuffle(allWords.filter(w => w.ru !== word.ru)).slice(0, 4).map(w => w.ru);
        return { word, wordIdx: i, options: shuffle([...wrongs, word.ru]), answer: word.ru };
      }).filter(Boolean);
    setQs(shuffle(toReview));
  }, []);

  if (!qs.length) {
    return (
      <div style={S.page}>
        <Hdr go={go} />
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 48 }}>✨</div>
          <div style={S.t}>Всё повторено!</div>
          <div style={S.dim}>Нет слов для повторения. Учи новые!</div>
          <button style={S.btnP} onClick={() => go('home')}>На главную</button>
        </div>
      </div>
    );
  }

  const isDone = cur >= qs.length;
  if (isDone) {
    const acc = ok + bad > 0 ? Math.round((ok / (ok + bad)) * 100) : 0;
    return (
      <div style={S.page}>
        <Hdr go={go} />
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 48 }}>{acc >= 80 ? '🌟' : '💪'}</div>
          <div style={S.t}>{acc >= 80 ? 'Отличная память!' : 'Хороший старт!'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 900, color: acc >= 70 ? 'var(--green)' : 'var(--yellow)' }}>{acc}%</div>
          <div style={S.dim}>✅ {ok}  ❌ {bad}</div>
          <button style={S.btnP} onClick={() => go('home')}>На главную</button>
        </div>
      </div>
    );
  }

  const q = qs[cur];
  const answered = sel !== null;

  const pick = (opt) => {
    if (answered) return;
    setSel(opt);
    const correct = opt === q.answer;
    store.recordResult(q.wordIdx, correct);
    if (correct) setOk(o => o + 1); else setBad(b => b + 1);
  };

  return (
    <div style={S.page} className="anim-in">
      <Hdr go={go} right={`${cur + 1}/${qs.length}`} />
      <div style={S.bar}><div style={{ ...S.barIn, width: `${((cur + 1) / qs.length) * 100}%` }} /></div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 14, fontSize: 15, fontWeight: 700 }}>
        <span style={{ color: 'var(--green)' }}>✅ {ok}</span>
        <span style={{ color: 'var(--red)' }}>❌ {bad}</span>
      </div>
      <div style={S.qBox} key={cur} className="anim-in">
        <div style={S.enWord}>{q.word.en}</div>
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
          return <button key={i} style={style} onClick={() => pick(opt)} className={answered && opt === sel && opt !== q.answer ? 'anim-shake' : ''}>{opt}</button>;
        })}
      </div>
      {answered && <button style={{ ...S.btnP, marginTop: 12, width: '100%' }} onClick={() => { setCur(c => c + 1); setSel(null); }} className="anim-in">Далее →</button>}
    </div>
  );
}

function Hdr({ go, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingTop: 8 }}>
      <button style={S.back} onClick={() => go('home')}>←</button>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, flex: 1 }}>🔄 Повторение</div>
      {right && <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>{right}</div>}
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column' },
  back: { background: 'var(--bg-card)', color: 'var(--text)', borderRadius: 50, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '1px solid #ffffff08' },
  bar: { height: 5, background: 'var(--bg-card)', borderRadius: 3, overflow: 'hidden', marginBottom: 14 },
  barIn: { height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, var(--yellow), var(--accent))', transition: 'width 0.3s' },
  qBox: { background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '24px 18px', textAlign: 'center', marginBottom: 8, border: '1px solid #ffffff08' },
  enWord: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 },
  opts: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  opt: { padding: '13px 16px', borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 600, background: 'var(--bg-card)', color: 'var(--text)', border: '2px solid transparent', textAlign: 'left', transition: 'all 0.15s', cursor: 'pointer' },
  optOk: { background: '#34d39920', border: '2px solid var(--green)', color: 'var(--green)' },
  optBad: { background: '#f8717120', border: '2px solid var(--red)', color: 'var(--red)' },
  btnP: { padding: 14, background: 'linear-gradient(135deg, var(--accent), #ff8c5a)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 16px var(--accent-glow)' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 10 },
  t: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 },
  dim: { color: 'var(--text-dim)', fontSize: 14 },
};
