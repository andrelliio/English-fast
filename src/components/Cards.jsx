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
    const nextLvl = getNextLevel();
    if (nextLvl !== null) {
      go('cards', nextLvl);
    } else {
      go('quiz', level);
    }
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
  const typeBadgeColor = isReview ? '#f59e0b40' : isPhrase ? '#ff6b3540' : isGlue ? '#a78bfa40' : '#60a5fa40';

  return (
    <div style={S.page} className="anim-in">
      <Header go={go} title={LEVEL_NAMES[level]} right={`${idx + 1}/${allCards.length}`} />
      <div style={S.bar}><div style={{ ...S.barIn, width: `${pct}%` }} /></div>

      <div style={S.cardArea} onClick={() => setFlipped(!flipped)}>
        <div style={{ ...S.cardWrap, transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
          {/* Front */}
          <div style={{ ...S.face, ...S.front, ...(isPhrase ? S.frontPhrase : isGlue ? S.frontGlue : {}) }}>
            {/* Type badge */}
            <div style={{ ...S.badge, background: typeBadgeColor }}>{typeBadge}</div>
            <div style={{ ...S.word, fontSize: isPhrase ? 24 : isGlue ? 22 : 28 }}>{w.en}</div>
            {w.context && <div style={S.context}>💡 {w.context}</div>}
            {w.hint && !w.context && <div style={S.hint}>{w.hint}</div>}
            <div style={S.tap}>нажми чтобы перевернуть</div>
          </div>
          {/* Back */}
          <div style={{ ...S.face, ...S.back }}>
            <div style={{ ...S.badge, background: typeBadgeColor }}>{typeBadge}</div>
            <div style={{ fontSize: 15, color: 'var(--blue)', fontWeight: 600, marginBottom: 6 }}>{w.en}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--green)', marginBottom: 8, textAlign: 'center' }}>{w.ru}</div>
            {w.hint && <div style={S.hint}>{w.hint}</div>}
            {w.island && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{w.islandIcon} {w.island}</div>}
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
  cardArea: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 800, cursor: 'pointer', marginBottom: 16, minHeight: 280 },
  cardWrap: { width: '100%', maxWidth: 340, height: 280, position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.45s ease' },
  face: { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 'var(--radius)', padding: '22px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #ffffff08', boxShadow: '0 10px 36px #00000044' },
  front: { background: 'linear-gradient(145deg, var(--bg-card), var(--bg-elevated))' },
  frontPhrase: { borderLeft: '3px solid var(--accent)' },
  frontGlue: { borderLeft: '3px solid #a78bfa' },
  back: { background: 'linear-gradient(145deg, #1a2435, #14202e)', transform: 'rotateY(180deg)' },
  badge: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, marginBottom: 12, letterSpacing: 0.5 },
  word: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 10, lineHeight: 1.3 },
  context: { fontSize: 13, color: 'var(--yellow)', textAlign: 'center', lineHeight: 1.5, fontWeight: 600 },
  hint: { fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.5 },
  tap: { fontSize: 12, color: 'var(--text-muted)', marginTop: 14 },
  btns: { display: 'flex', gap: 10 },
  btnPrimary: { flex: 1, padding: 15, background: 'linear-gradient(135deg, var(--accent), #ff8c5a)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 16px var(--accent-glow)' },
  btnGhost: { flex: 1, padding: 15, background: 'var(--bg-card)', color: 'var(--text)', borderRadius: 'var(--radius-sm)', fontSize: 15, fontWeight: 700, border: '1px solid #ffffff08' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 },
  doneTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 },
  dim: { color: 'var(--text-dim)', fontSize: 14 },
};
