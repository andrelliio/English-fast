import { useState, useMemo } from 'react';
import { LEVELS, TOTAL_WORDS, LEVEL_NAMES, WORDS_PER_LEVEL, GRAMMAR_ISLANDS } from '../data/words';

function MarketModal({ store, onClose }) {
  const canAfford = store.data.coins >= 100;
  const isFull = store.data.lives >= 3;

  return (
    <div style={M.overlay} onClick={onClose} className="anim-in">
      <div style={M.modal} onClick={e => e.stopPropagation()} className="anim-up">
        <div style={M.header}>
          <div style={M.title}>🏛️ Маркет</div>
          <button style={M.close} onClick={onClose}>✕</button>
        </div>
        
        <div style={M.coins}>У тебя 💰 <strong>{store.data.coins}</strong></div>

        <div style={M.item}>
          <div style={M.itemIcon}>💖</div>
          <div style={M.itemBody}>
            <div style={M.itemName}>Восстановить жизни</div>
            <div style={M.itemDesc}>Мгновенно пополни до 3 сердец</div>
          </div>
          <button 
            style={{ ...M.buyBtn, opacity: (!canAfford || isFull) ? 0.5 : 1 }} 
            disabled={!canAfford || isFull}
            onClick={() => { store.refillLives(); onClose(); }}
          >
            {isFull ? 'Полные' : '💰 100'}
          </button>
        </div>

        <div style={M.item} className="dim">
          <div style={M.itemIcon}>🎨</div>
          <div style={M.itemBody}>
            <div style={M.itemName}>Новые темы</div>
            <div style={M.itemDesc}>Скоро в продаже...</div>
          </div>
          <button style={M.buyBtn} disabled>Locked</button>
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center', padding: 20, color: 'var(--text-dim)', fontSize: 12 }}>
          Зарабатывай монеты, изучая новые слова!
        </div>
      </div>
    </div>
  );
}

const M = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  modal: { background: 'var(--bg-card)', width: '100%', maxWidth: 460, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, display: 'flex', flexDirection: 'column', minHeight: '60vh', borderTop: '1px solid rgba(255,255,255,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-display)' },
  close: { background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 20, cursor: 'pointer' },
  coins: { background: 'rgba(255,215,0,0.1)', padding: '12px 20px', borderRadius: 16, textAlign: 'center', color: 'var(--yellow)', fontWeight: 700, marginBottom: 24 },
  item: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, marginBottom: 12, border: '1px solid rgba(255,255,255,0.05)' },
  itemIcon: { fontSize: 32 },
  itemBody: { flex: 1 },
  itemName: { fontWeight: 800, fontSize: 16 },
  itemDesc: { fontSize: 12, color: 'var(--text-dim)' },
  buyBtn: { background: 'var(--accent)', border: 'none', color: '#000', fontWeight: 900, padding: '10px 16px', borderRadius: 12, fontSize: 13, cursor: 'pointer', transition: '0.2s' }
};

export default function Home({ store, go }) {
  const { data, learned, logout, untestedCount, level, rankTitle } = store;
  const accuracy = data.totalCorrect + data.totalWrong > 0
    ? Math.round((data.totalCorrect / (data.totalCorrect + data.totalWrong)) * 100) : 0;

  const learnedCount = Object.values(data.wordProgress).filter(w => w.seen || w.mastered).length;
  const masteredCount = Object.values(data.wordProgress).filter(w => w.mastered).length;
  const pct = Math.round((learnedCount / TOTAL_WORDS) * 100);

  const lvlStartXP = 50 * (level - 1) * (level - 1);
  const lvlEndXP = 50 * level * level;
  const xpInLvl = data.xp - lvlStartXP;
  const xpToNext = lvlEndXP - lvlStartXP;
  const xpPct = Math.min(Math.round((xpInLvl / xpToNext) * 100), 100);

  const [showShop, setShowShop] = useState(false);

  // Next unfinished level (among unlocked)
  // Next level logic: Frontier Priority
  // 1. Prioritize unfinished Grammar Lessons
  const nextGrammar = (() => {
    for (const island of GRAMMAR_ISLANDS) {
      for (const lesson of island.lessons) {
        if (!data.grammarProgress[island.id]?.[lesson.id]?.passed) {
          return { type: 'grammar', islandId: island.id, lessonId: lesson.id, title: lesson.title, islandTitle: island.title };
        }
      }
    }
    return null;
  })();

  const nextLevel = nextGrammar || (() => {
    // 1. Prioritize the highest level that is unlocked but NOT yet passed
    const unlocked = [...data.unlockedLevels].sort((a, b) => a - b);
    const unpassed = unlocked.filter(l => !data.passedLessons.includes(l));
    
    if (unpassed.length > 0) {
      // If our "last active" is in the unpassed list, keep it
      if (data.lastActiveLevel !== undefined && unpassed.includes(data.lastActiveLevel)) {
        return data.lastActiveLevel;
      }
      // Otherwise go to the FIRST unpassed level (the frontier)
      return unpassed[0];
    }
    
    // 2. Fallback to the latest unlocked level if all are passed
    return unlocked.length > 0 ? unlocked[unlocked.length - 1] : 0;
  })();

  // Count of words DUE for review (SRS)
  const now = Date.now();
  const dueCount = Object.values(data.wordProgress).filter(w => (w.seen || w.mastered) && (w.nextReview || 0) <= now).length;

  // Show exam banner when 5+ untested levels
  const showExamBanner = untestedCount >= 5;

  return (
    <div style={S.page} className="anim-in">
      {/* Header */}
      <div style={S.header}>
        <div style={S.greeting}>
          <div style={S.rankText}>{rankTitle} / Lvl {level}</div>
          <div style={S.userName}>{data.username}</div>
        </div>
        <div style={S.headerR}>
          <button style={S.statsClicker} onClick={() => setShowShop(true)}>
            <div style={S.lives}>
              <span style={{ color: data.lives > 0 ? '#ff3366' : 'var(--text-dim)', transition: '0.3s' }}>
                {'❤️'.repeat(data.lives)}{'🖤'.repeat(3 - data.lives)}
              </span>
            </div>
            <div style={S.coins}><span style={S.coinIcon}>💰</span> {data.coins}</div>
          </button>
          <div style={S.streak}>
            <span style={{ 
              ...S.streakFire, 
              filter: data.streak <= 1 ? 'grayscale(1) opacity(0.5)' : S.streakFire.filter,
              textShadow: data.streak > 7 ? '0 0 15px #ff6b35' : 'none'
            }}>🔥</span> {data.streak}
          </div>
          <button style={S.settingsBtn} onClick={() => go('settings')}>⚙️</button>
        </div>
      </div>

      {/* Level Card */}
      <div style={{ ...S.card, marginBottom: 16, padding: '16px 20px' }} className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={S.label}>УРОВЕНЬ {level}</div>
          <div style={S.xpText}>{data.xp} / {lvlEndXP} XP</div>
        </div>
        <div style={S.barOuter}><div style={{ ...S.barInner, width: `${xpPct}%`, background: 'linear-gradient(90deg, #00f0ff, #00ff87)' }} /></div>
      </div>

      {/* Progress card */}
      <div style={S.card} className="glass-card">
        <div style={S.label}>ПРОГРЕСС</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
          <span style={S.bigNum}>{learnedCount}</span>
          <span style={S.dimText}>слов в изучении</span>
        </div>
        <div style={S.barOuter}><div style={{ ...S.barInner, width: `${Math.max(pct, 1)}%` }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={S.dimText}>Личный прогресс: {pct}%</div>
          <div style={S.dimText}>🌟 {masteredCount} выучено</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={S.statsRow}>
        {[
          { v: data.xp, l: 'XP', i: '💎', c: 'var(--accent)' },
          { v: accuracy + '%', l: 'Точность', i: '🎯', c: 'var(--green)' },
          { v: data.streak, l: 'Дней подряд', i: '🔥', c: 'var(--yellow)' },
        ].map(s => (
          <div key={s.l} style={S.stat} className="glass-card">
            <div style={{ ...S.statVal, color: s.c }}>
              {s.l === 'Дней подряд' && (
                <span style={{ 
                  marginRight: 4,
                  filter: data.streak <= 1 ? 'grayscale(1) opacity(0.5)' : 'none',
                  textShadow: data.streak > 7 ? '0 0 10px #ff6b35' : 'none'
                }}>🔥</span>
              )}
              {s.v}
            </div>
            <div style={S.statLbl}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Exam banner */}
      {showExamBanner && (
        <button 
          style={{ ...S.examBanner, opacity: data.lives === 0 ? 0.5 : 1, pointerEvents: data.lives === 0 ? 'none' : 'auto' }} 
          onClick={() => go('levelExam')}
        >
          <span style={{ fontSize: 24 }}>📝</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--yellow)' }}>Пора сдать экзамен!</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{untestedCount} уровней без экзамена. Сдай тест чтобы открыть новые</div>
          </div>
          <span style={{ color: 'var(--yellow)' }}>→</span>
        </button>
      )}

      {/* Review banner — prioritized by SRS dueCount */}
      {learnedCount > 0 && (
        <button style={S.reviewBanner} onClick={() => go('review')}>
          <span style={{ fontSize: 24 }}>{dueCount > 0 ? '🧠' : '🔄'}</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--yellow)' }}>
              {dueCount > 0 ? 'Пора повторить!' : 'Повторить материал'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              {dueCount > 0 ? `🔥 ${dueCount} слов ждут тебя` : `Твой личный словарь расширяется!`}
            </div>
          </div>
          <span style={{ color: 'var(--yellow)' }}>→</span>
        </button>
      )}

      {/* Continue button */}
      <button 
        className={`btn-primary btn-full ${data.lives === 0 ? 'btn-disabled' : ''}`}
        disabled={data.lives === 0}
        onClick={() => {
          if (nextLevel.type === 'grammar') {
            go('grammarTrainer', { islandId: nextLevel.islandId, lessonId: nextLevel.lessonId });
          } else {
            go('cards', nextLevel);
          }
        }}
      >
        {data.lives === 0 ? 'НЕТ ЖИЗНЕЙ 💔' : 'НАЧАТЬ УРОК 🚀'}
      </button>
      <div style={S.levelHint}>
        {nextLevel.type === 'grammar' 
          ? `Грамматика: ${nextLevel.islandTitle} — ${nextLevel.title}`
          : `Уровень ${nextLevel + 1}: ${LEVEL_NAMES[nextLevel] || ''}`}
      </div>

      {showShop && <MarketModal store={store} onClose={() => setShowShop(false)} />}

      <div style={{ height: 80 }} />
      {/* Nav grid */}
      <div style={S.grid}>
        {[
          { icon: '📋', title: 'Уровни', desc: 'Выбери уровень', action: () => go('levels') },
          { icon: '🔄', title: 'Повторение', desc: 'Рандомные слова', action: () => data.lives > 0 ? go('review') : null, disabled: data.lives === 0 },
          { icon: '⚡', title: 'Быстрый тест', desc: 'Случайный уровень', action: () => {
            if (data.lives === 0) return;
            const unlocked = data.unlockedLevels.filter(l => l < LEVELS.length);
            go('quiz', unlocked[Math.floor(Math.random() * unlocked.length)] || 0);
          }, disabled: data.lives === 0 },
          { icon: '🏛️', title: 'Маркет', desc: 'Купить жизни', action: () => setShowShop(true) },
          { icon: '📖', title: 'Грамматика', desc: 'Основы времен', action: () => go('levels') },
          { icon: '🃏', title: 'Карточки', desc: 'Смотри и учи', action: () => go('cards', nextLevel) },
          ...(showExamBanner ? [{ icon: '📝', title: 'Экзамен', desc: 'Сдай экзамен', action: () => data.lives > 0 ? go('levelExam') : null, disabled: data.lives === 0 }] : []),
        ].map(n => (
          <button key={n.title} style={{ ...S.navCard, opacity: n.disabled ? 0.5 : 1 }} className="glass-card" onClick={n.action}
            disabled={n.disabled}
            onMouseEnter={e => { if (!n.disabled) e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { if (!n.disabled) e.currentTarget.style.background = 'var(--bg-card)'; }}>
            <span style={{ fontSize: 32 }}>{n.icon}</span>
            <span style={S.navTitle}>{n.title}</span>
            <span style={S.navDesc}>{n.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', zIndex: 1, position: 'relative' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingTop: 8, gap: 12 },
  greeting: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' },
  rankText: { fontSize: 11, fontWeight: 900, color: 'var(--yellow)', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.9 },
  userName: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  headerR: { display: 'flex', alignItems: 'center', gap: 6 },
  statsClicker: { display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: '0.2s', scale: '0.95', transformOrigin: 'right' },
  coins: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', fontSize: 13, fontWeight: 800, background: 'rgba(255,215,0,0.05)', borderRadius: 20, color: '#ffd700' },
  coinIcon: { fontSize: 14, filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.5))' },
  streak: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', fontSize: 13, fontWeight: 800, background: 'rgba(255,255,255,0.05)', borderRadius: 20 },
  streakFire: { fontSize: 15, filter: 'drop-shadow(0 0 10px rgba(255,107,53,0.6))' },
  lives: { display: 'flex', alignItems: 'center', padding: '6px 10px', fontSize: 14, background: 'rgba(255,51,102,0.05)', borderRadius: 20 },
  settingsBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 36, height: 36, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', transition: '0.2s', padding: 0 },
  
  card: { padding: 24, marginBottom: 24 },
  label: { fontSize: 11, color: 'var(--accent)', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' },
  xpText: { fontSize: 11, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: 0.5 },
  bigNum: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, color: 'var(--text)', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' },
  dimText: { fontSize: 14, color: 'var(--text-dim)', fontWeight: 600 },
  barOuter: { height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', marginBottom: 8, marginTop: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' },
  barInner: { height: '100%', borderRadius: 4, background: 'var(--accent-gradient)', transition: 'width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)', boxShadow: '0 0 10px var(--accent-glow)' },
  
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 },
  stat: { padding: '16px 10px', textAlign: 'center' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 },
  statLbl: { fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 },
  
  examBanner: { width: '100%', padding: '16px 20px', marginBottom: 16, border: '1px solid rgba(255, 51, 102, 0.3)', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)', background: 'linear-gradient(90deg, rgba(255, 51, 102, 0.1), transparent)', borderRadius: 'var(--radius)' },
  reviewBanner: { width: '100%', padding: '16px 20px', marginBottom: 16, border: '1px solid rgba(178, 36, 239, 0.3)', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)', background: 'linear-gradient(90deg, rgba(178, 36, 239, 0.1), transparent)', borderRadius: 'var(--radius)' },
  
  levelHint: { fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 24, fontWeight: 600 },
  
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  navCard: { padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text)', transition: 'all 0.3s ease' },
  navTitle: { fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, letterSpacing: 0.5 },
  navDesc: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 },
};
