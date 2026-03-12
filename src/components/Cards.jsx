import { useState, useEffect } from 'react';
import { LEVELS, LEVEL_NAMES, WORDS_PER_LEVEL } from '../data/words';

export default function Cards({ store, go, level }) {
  const words = LEVELS[level] || [];
  const base = level * WORDS_PER_LEVEL;
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const [indices, setIndices] = useState([]);
  useEffect(() => {
    const ids = words.map((_, i) => i).filter(i => {
      const w = store.data.wordProgress[base + i];
      return !w || !w.mastered;
    });
    setIndices(ids.length ? ids : words.map((_, i) => i));
  }, [level]);

  const next = () => {
    store.markSeen(base + indices[idx]);
    if (idx + 1 >= indices.length) setDone(true);
    else { setIdx(idx + 1); setFlipped(false); }
  };

  if (done || !indices.length) {
    return (
      <div style={S.page}>
        <Header go={go} title={LEVEL_NAMES[level]} />
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 56 }}>🎉</div>
          <div style={S.doneTitle}>Карточки пройдены!</div>
          <div style={S.dim}>Закрепи слова в тесте</div>
          <button style={S.btnPrimary} onClick={() => go('quiz', level)}>Пройти тест ✅</button>
          <button style={S.btnGhost} onClick={() => go('home')}>На главную</button>
        </div>
      </div>
    );
  }

  const w = words[indices[idx]];
  const pct = ((idx + 1) / indices.length) * 100;

  return (
    <div style={S.page} className="anim-in">
      <Header go={go} title={LEVEL_NAMES[level]} right={`${idx + 1}/${indices.length}`} />
      <div style={S.bar}><div style={{ ...S.barIn, width: `${pct}%` }} /></div>

      <div style={S.cardArea} onClick={() => setFlipped(!flipped)}>
        <div style={{ ...S.cardWrap, transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
          {/* Front */}
          <div style={{ ...S.face, ...S.front }}>
            <div style={S.word}>{w.en}</div>
            {w.hint && <div style={S.hint}>{w.hint}</div>}
            <div style={S.tap}>нажми чтобы перевернуть</div>
          </div>
          {/* Back */}
          <div style={{ ...S.face, ...S.back }}>
            <div style={{ fontSize: 15, color: 'var(--blue)', fontWeight: 600, marginBottom: 6 }}>{w.en}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>{w.ru}</div>
            {w.hint && <div style={S.hint}>{w.hint}</div>}
          </div>
        </div>
      </div>

      <div style={S.btns}>
        <button style={S.btnGhost} onClick={() => setFlipped(!flipped)}>
          {flipped ? '↩ Обратно' : '🔄 Перевернуть'}
        </button>
        <button style={S.btnPrimary} onClick={next}>Далее →</button>
      </div>
    </div>
  );
}

function Header({ go, title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingTop: 8 }}>
      <button style={S.backBtn} onClick={() => go('home')}>←</button>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, flex: 1 }}>{title}</div>
      {right && <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>{right}</div>}
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column' },
  backBtn: { background: 'var(--bg-card)', color: 'var(--text)', borderRadius: 50, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '1px solid #ffffff08' },
  bar: { height: 5, background: 'var(--bg-card)', borderRadius: 3, overflow: 'hidden', marginBottom: 20 },
  barIn: { height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, var(--accent), var(--yellow))', transition: 'width 0.3s' },
  cardArea: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 800, cursor: 'pointer', marginBottom: 16, minHeight: 260 },
  cardWrap: { width: '100%', maxWidth: 340, height: 250, position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.45s ease' },
  face: { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 'var(--radius)', padding: '28px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #ffffff08', boxShadow: '0 10px 36px #00000044' },
  front: { background: 'linear-gradient(145deg, var(--bg-card), var(--bg-elevated))' },
  back: { background: 'linear-gradient(145deg, #1a2435, #14202e)', transform: 'rotateY(180deg)' },
  word: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 10, lineHeight: 1.3 },
  hint: { fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.5 },
  tap: { fontSize: 12, color: 'var(--text-muted)', marginTop: 14 },
  btns: { display: 'flex', gap: 10 },
  btnPrimary: { flex: 1, padding: 15, background: 'linear-gradient(135deg, var(--accent), #ff8c5a)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 16px var(--accent-glow)' },
  btnGhost: { flex: 1, padding: 15, background: 'var(--bg-card)', color: 'var(--text)', borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 700, border: '1px solid #ffffff08' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 },
  doneTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 },
  dim: { color: 'var(--text-dim)', fontSize: 14 },
};
