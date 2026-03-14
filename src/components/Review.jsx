import { useState, useEffect, useMemo } from 'react';
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
    const due = Object.entries(wp).filter(([_, w]) => (w.seen || w.mastered) && (w.nextReview || 0) <= now).map(([idx]) => parseInt(idx));
    
    let selectedIndices = [];
    if (due.length > 0) {
      selectedIndices = shuffle(due).slice(0, 30);
    } else {
      const allSeen = Object.entries(wp).filter(([_, w]) => w.seen || w.mastered).map(([idx]) => parseInt(idx));
      selectedIndices = shuffle(allSeen).slice(0, 15);
    }

    if (selectedIndices.length === 0) { setQs([]); return; }

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
    if (qs.length > 0 && cur < qs.length && !isDone) { tts.speak(qs[cur].word.en); }
  }, [cur, qs, isDone]);

  useEffect(() => {
    if (isDone && qs.length > 0) {
      const acc = ok + bad > 0 ? Math.round((ok / (ok + bad)) * 100) : 0;
      if (acc >= 70) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#6A5AE0', '#00FF87', '#FFD700'] });
      }
    }
  }, [isDone, ok, bad, qs.length]);

  if (!qs.length) {
    return (
      <div style={S.page}>
        <div className="app-header">
           <button className="back-btn-round" onClick={() => go('home')}>✕</button>
           <div className="header-title">Повторение</div>
        </div>
        <div style={S.center}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>✨</div>
          <div style={S.doneTitle}>Все слова выучены!</div>
          <div style={S.dim}>Пока нет слов, которые нужно повторить. Возвращайся позже!</div>
          <button className="btn-primary btn-full" style={{ marginTop: 32 }} onClick={() => go('home')}>Вернуться домой</button>
        </div>
      </div>
    );
  }

  if (store.data.lives === 0 && !isDone) {
    return (
      <div style={S.page}>
        <div className="app-header">
           <button className="back-btn-round" onClick={() => go('home')}>✕</button>
           <div className="header-title">Ошибки!</div>
        </div>
        <div style={S.center}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>💔</div>
          <div style={S.doneTitle}>Жизни закончились</div>
          <div style={S.dim}>Восстанови жизни за монетки, чтобы продолжить практику.</div>
          <button className="btn-primary btn-full" style={{ marginTop: 32 }} disabled={store.data.coins < 100} onClick={() => store.refillLives()}>Восстановить за 💰 100</button>
          <button className="btn-ghost btn-full" style={{ marginTop: 12 }} onClick={() => go('home')}>Домой</button>
        </div>
      </div>
    );
  }

  if (isDone) {
    const total = ok + bad;
    const acc = total ? Math.round((ok / total) * 100) : 0;
    return (
      <div style={S.page}>
        <div className="app-header">
           <button className="back-btn-round" onClick={() => go('home')}>✕</button>
           <div className="header-title">Сессия завершена</div>
        </div>
        <div style={S.center} className="anim-pop">
          <div style={{ fontSize: 80 }}>{acc >= 80 ? '🌟' : '💪'}</div>
          <div style={S.doneTitle}>{acc >= 80 ? 'Отличная память!' : 'Хорошая тренировка!'}</div>
          <div style={S.accText}>{acc}%</div>
          <div style={S.dim}>Повторено слов: {total}</div>
          <button className="btn-primary btn-full" style={{ marginTop: 40, maxWidth: 320 }} onClick={() => go('home')}>Вернуться к обучению</button>
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
    store.recordResult(q.wordIdx, correct);
    if (correct) { setOk(o => o + 1); setTimeout(() => next(), 500); }
    else { setBad(b => b + 1); }
  };

  const next = () => {
    if (sel === null) return;
    setCur(c => c + 1);
    setSel(null);
  };

  return (
    <div style={S.page} className="anim-in">
      <div className="app-header" style={{ border: 'none' }}>
        <button className="back-btn-round" onClick={() => go('home')}>✕</button>
        <div style={S.bar}><div style={{ ...S.barIn, width: `${pct}%`, background: 'var(--brand-purple-light)' }} /></div>
        <div style={S.lives}>❤️ {store.data.lives}</div>
      </div>

      <div style={S.content}>
        <div style={S.questionLabel}>Вспомни перевод</div>
        <div style={S.qCard} className="anim-pop" onClick={() => tts.speak(q.word.en)}>
          <div style={S.enWord}>{q.word.en}</div>
          <div style={S.speaker}>🔊</div>
        </div>

        <div style={S.opts}>
          {q.options.map((opt, i) => {
             let className = 'opt-btn';
             return (
               <button key={i} className={className} style={{...S.opt, border: answered ? (opt === q.answer ? '2px solid var(--green)' : opt === sel ? '2px solid var(--red)' : '2px solid var(--brand-gray)') : '2px solid var(--brand-gray)'}} onClick={() => pick(opt)}>{opt}</button>
             );
          })}
        </div>
      </div>

      {answered && sel !== q.answer && (
        <div style={S.footer}>
           <button className="btn-primary btn-full" onClick={next}>Далее</button>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' },
  content: { flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  bar: { flex: 1, height: 8, background: 'var(--brand-gray)', borderRadius: 10, margin: '0 16px', overflow: 'hidden' },
  barIn: { height: '100%', background: 'var(--brand-purple)', borderRadius: 10, transition: 'width 0.3s ease' },
  lives: { fontSize: 16, fontWeight: 800, color: 'var(--red)' },
  
  questionLabel: { fontSize: 15, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 24, alignSelf: 'flex-start' },
  qCard: { width: '100%', minHeight: 180, background: 'var(--brand-white)', border: '2px solid var(--brand-gray)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', marginBottom: 32 },
  enWord: { fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--brand-purple)' },
  speaker: { position: 'absolute', bottom: 16, right: 16, fontSize: 20, opacity: 0.3 },

  opts: { width: '100%', display: 'flex', flexDirection: 'column', gap: 12 },
  opt: { width: '100%', padding: '20px', borderRadius: 20, background: 'var(--brand-white)', border: '2px solid var(--brand-gray)', fontSize: 16, fontWeight: 700, textAlign: 'left', transition: '0.2s' },
  
  footer: { padding: 24, background: 'var(--brand-white)', borderTop: '1px solid var(--brand-gray-dark)' },

  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 },
  doneTitle: { fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 12 },
  accText: { fontSize: 64, fontWeight: 900, color: 'var(--brand-purple)', marginBottom: 8 },
  dim: { color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.5 },
};
