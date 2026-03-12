import { useState, useEffect } from 'react';
import allWords, { LEVELS, LEVEL_NAMES, WORDS_PER_LEVEL } from '../data/words';

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export default function Cards({ store, go, level }) {
  const words = LEVELS[level] || [];
  const base = level * WORDS_PER_LEVEL;
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  // allCards: array of { globalIdx, word } — mix of new + review
  const [allCards, setAllCards] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    store.touchLevel(level);

    // Reset component state when level changes
    setIdx(0);
    setFlipped(false);
    setDone(false);

    // New cards from this level
    const newCards = words.map((w, i) => ({ globalIdx: base + i, word: w }))
      .filter(c => {
        const wp = store.data.wordProgress[c.globalIdx];
        return !wp || !wp.mastered;
      });
    const cardsToShow = newCards.length ? newCards : words.map((w, i) => ({ globalIdx: base + i, word: w }));

    // Review cards from previous levels (3-5 random previously seen words)
    const reviewPool = [];
    for (let l = 0; l < level; l++) {
      const lvlBase = l * WORDS_PER_LEVEL;
      const lvlWords = LEVELS[l] || [];
      lvlWords.forEach((w, i) => {
        const wp = store.data.wordProgress[lvlBase + i];
        if (wp && wp.seen) {
          reviewPool.push({ globalIdx: lvlBase + i, word: w });
        }
      });
    }
    const reviewCards = shuffle(reviewPool).slice(0, Math.min(5, Math.max(3, Math.floor(reviewPool.length * 0.1))));
    setReviewCount(reviewCards.length);

    // Mix: new cards first, then insert review cards at random positions
    const mixed = [...cardsToShow];
    for (const rc of reviewCards) {
      const pos = Math.floor(Math.random() * (mixed.length + 1));
      mixed.splice(pos, 0, rc);
    }
    setAllCards(mixed);
  }, [level]);

  const next = () => {
    store.markSeen(allCards[idx].globalIdx);
    if (idx + 1 >= allCards.length) setDone(true);
    else { setIdx(idx + 1); setFlipped(false); }
  };

  // Find next available level
  const getNextLevel = () => {
    for (let l = level + 1; l < LEVELS.length; l++) {
      if (store.data.unlockedLevels.includes(l)) return l;
    }
    return null;
  };

  const handleNextTask = () => {
    // After Cards, the user should always go to the Quiz for this level to test their knowledge.
    go('quiz', level);
  };

  if (done || !allCards.length) {
    return (
      <div style={S.page}>
        <Header go={go} title={LEVEL_NAMES[level]} />
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 56 }}>🎉</div>
          <div style={S.doneTitle}>Карточки пройдены!</div>
          <div style={S.dim}>Закрепи слова в тесте или продолжай обучение</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
            <button style={S.btnPrimary} onClick={handleNextTask}>Следующее задание ➡️</button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={S.btnGhost} onClick={() => go('home')}>🏠 Домой</button>
              <button style={S.btnGhost} onClick={() => { setIdx(0); setFlipped(false); setDone(false); }}>🔄 Ещё раз</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const w = allCards[idx].word;
  const pct = ((idx + 1) / allCards.length) * 100;
  const isPhrase = w.type === 'phrase';
  const isGlue = w.type === 'glue';
  const isWord = w.type === 'word' || !w.type;

  // Check if this card is from a previous level (review)
  const isReview = allCards[idx].globalIdx < base || allCards[idx].globalIdx >= base + WORDS_PER_LEVEL;

  // Type badge
  const typeBadge = isReview ? '🔄 Повторение' : isPhrase ? '🏝️ Фраза' : isGlue ? '🧩 Связка' : '📝 Слово';
  const typeBadgeColor = isReview ? 'rgba(255, 215, 0, 0.15)' : isPhrase ? 'rgba(255, 51, 102, 0.15)' : isGlue ? 'rgba(178, 36, 239, 0.15)' : 'rgba(0, 240, 255, 0.15)';

  return (
    <div style={S.page} className="anim-in">
      <Header go={go} title={LEVEL_NAMES[level]} right={`${idx + 1}/${allCards.length}`} />
      <div style={S.bar}><div style={{ ...S.barIn, width: `${pct}%`, background: 'var(--accent-gradient)', boxShadow: '0 0 10px var(--accent-glow)' }} /></div>

      <div style={S.cardArea} onClick={() => setFlipped(!flipped)}>
        <div style={{ ...S.cardWrap, transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
          {/* Front */}
          <div className="glass-card" style={{ ...S.face, ...S.front, ...(isPhrase ? S.frontPhrase : isGlue ? S.frontGlue : {}) }}>
            {/* Type badge */}
            <div style={{ ...S.badge, background: typeBadgeColor }}>{typeBadge}</div>
            <div style={{ ...S.word, fontSize: isPhrase ? 26 : isGlue ? 24 : 32 }}>{w.en}</div>
            {w.hint && <div style={S.hint}>{w.hint}</div>}
            {w.context && <div style={{ ...S.context, marginTop: 16 }}>💡 {w.context}</div>}
            <div style={S.tap}>нажми чтобы перевернуть</div>
          </div>
          {/* Back */}
          <div className="glass-card" style={{ ...S.face, ...S.back }}>
            <div style={{ ...S.badge, background: typeBadgeColor }}>{typeBadge}</div>
            <div style={{ fontSize: 16, color: 'var(--accent)', fontWeight: 800, marginBottom: 8, letterSpacing: 0.5 }}>{w.en}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: 'var(--green)', marginBottom: 12, textAlign: 'center', filter: 'drop-shadow(0 0 8px rgba(0, 255, 135, 0.3))' }}>{w.ru}</div>
            {w.hint && <div style={S.hint}>{w.hint}</div>}
            {w.island && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{w.islandIcon} {w.island}</div>}
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
  cardArea: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1000, cursor: 'pointer', marginBottom: 24, minHeight: 320 },
  cardWrap: { width: '100%', maxWidth: 360, height: 320, position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' },
  face: { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 'var(--radius)', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  front: { },
  frontPhrase: { borderLeft: '4px solid var(--pink)', boxShadow: 'inset 4px 0 15px rgba(255, 51, 102, 0.1), var(--glass-shadow)' },
  frontGlue: { borderLeft: '4px solid var(--purple)', boxShadow: 'inset 4px 0 15px rgba(178, 36, 239, 0.1), var(--glass-shadow)' },
  back: { transform: 'rotateY(180deg)', background: 'rgba(10, 13, 24, 0.7)' },
  badge: { fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 20, marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' },
  word: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 10, lineHeight: 1.3 },
  context: { fontSize: 13, color: 'var(--yellow)', textAlign: 'center', lineHeight: 1.5, fontWeight: 600 },
  hint: { fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.5 },
  tap: { fontSize: 12, color: 'var(--text-muted)', marginTop: 14 },
  btns: { display: 'flex', gap: 12 },
  btnPrimary: { flex: 1, padding: 18, background: 'var(--accent-gradient)', color: 'white', borderRadius: 'var(--radius-pill)', fontSize: 16, fontWeight: 800, boxShadow: '0 8px 24px rgba(0, 85, 255, 0.4)', letterSpacing: 0.5 },
  btnGhost: { flex: 1, padding: 18, background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text)', borderRadius: 'var(--radius-pill)', fontSize: 16, fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 },
  doneTitle: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' },
  dim: { color: 'var(--text-dim)', fontSize: 15, fontWeight: 600 },
};
