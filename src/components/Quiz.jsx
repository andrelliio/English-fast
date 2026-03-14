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
    store.touchLevel(level);
    const coreQs = words.map((w, i) => ({ word: w, globalIdx: base + i }));
    const questions = coreQs.map(item => {
      const { word, globalIdx } = item;
      const wrongs = getSimilarWords(globalIdx, 4, word.ru);
      return { word, globalIdx, options: shuffle([...wrongs, word.ru]), answer: word.ru };
    });
    setQs(shuffle(questions));
  }, [level]);

  useEffect(() => {
    if (qs.length > 0 && cur < qs.length && !done) {
      tts.speak(qs[cur].word.en);
    }
  }, [cur, qs, done]);

  useEffect(() => {
    if (done) {
      const acc = Math.round((ok / qs.length) * 100);
      if (acc >= 50) store.completeLevel(level);
      if (acc >= 70) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#6A5AE0', '#00FF87', '#FFD700'] });
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
      setSel(null);
      return prev + 1;
    });
  };

  if (!qs.length) return null;

  if (store.data.lives === 0 && !done) {
    return (
      <div style={S.page}>
        <div className="app-header">
           <button className="back-btn-round" onClick={() => go('home')}>✕</button>
           <div className="header-title">Ошибки!</div>
        </div>
        <div style={S.center}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>💔</div>
          <div style={S.doneTitle}>Жизни закончились</div>
          <div style={S.dim}>Восстанови жизни за монетки, чтобы продолжить обучение!</div>
          
          <button 
            className="btn-primary btn-full" 
            style={{ marginTop: 32 }}
            disabled={store.data.coins < 100}
            onClick={() => store.refillLives()}
          >
            Восстановить за 💰 100
          </button>
          <button className="btn-ghost btn-full" style={{ marginTop: 12 }} onClick={() => go('home')}>Вернуться позже</button>
        </div>
      </div>
    );
  }

  if (done) {
    const acc = Math.round((ok / qs.length) * 100);
    const emoji = acc >= 90 ? '🏆' : acc >= 70 ? '🎉' : '💪';
    
    return (
      <div style={S.page}>
        <div className="app-header">
           <button className="back-btn-round" onClick={() => go('home')}>✕</button>
           <div className="header-title">Результат</div>
        </div>
        <div style={S.center} className="anim-pop">
          <div style={{ fontSize: 80, marginBottom: 10 }}>{emoji}</div>
          <div style={S.doneTitle}>Уровень пройден!</div>
          <div style={S.accText}>{acc}%</div>
          <div style={S.dim}>Ты заработал 🪙 {xp} XP</div>
          
          <div style={{ width: '100%', maxWidth: 320, marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn-primary btn-full" onClick={() => go('home')}>К дорожке развития</button>
            <button className="btn-ghost btn-full" onClick={() => { setCur(0); setSel(null); setOk(0); setBad(0); setDone(false); }}>Повторить еще раз</button>
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
    store.recordResult(q.globalIdx, correct);
    if (correct) { 
      setOk(o => o + 1); 
      setXp(x => x + 10);
      setTimeout(() => next(true), 600);
    }
    else { setBad(b => b + 1); }
  };

  return (
    <div style={S.page} className="anim-in">
      <div className="app-header" style={{ border: 'none' }}>
        <button className="back-btn-round" onClick={() => go('home')}>✕</button>
        <div style={S.bar}><div style={{ ...S.barIn, width: `${pct}%` }} /></div>
        <div style={S.lives}>❤️ {store.data.lives}</div>
      </div>

      <div style={S.content}>
        <div style={S.questionLabel}>Как переводится слово?</div>
        <div style={S.qCard} className="anim-pop" onClick={() => tts.speak(q.word.en)}>
          <div style={S.enWord}>{q.word.en}</div>
          <div style={S.speaker}>🔊</div>
        </div>

        <div style={S.opts}>
          {q.options.map((opt, i) => {
            let className = 'opt-btn';
            if (answered) {
              if (opt === q.answer) className += ' opt-correct';
              else if (opt === sel) className += ' opt-wrong';
              else className += ' opt-dim';
            }
            return (
              <button key={i} className={className} style={S.opt} onClick={() => pick(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {answered && sel !== q.answer && (
        <div style={S.footer}>
           <button className="btn-primary btn-full" onClick={next}>Продолжить</button>
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
