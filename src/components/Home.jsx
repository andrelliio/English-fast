import { useState, useMemo, useEffect, useRef } from 'react';
import { LEVELS, TOTAL_WORDS, LEVEL_NAMES, WORDS_PER_LEVEL } from '../data/words';

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
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  modal: { background: 'var(--brand-white)', width: '100%', maxWidth: 460, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, display: 'flex', flexDirection: 'column', minHeight: '50vh', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)' },
  close: { background: 'var(--brand-gray)', border: 'none', color: 'var(--text-dim)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  coins: { background: 'rgba(245,158,11,0.1)', padding: '16px 20px', borderRadius: 20, textAlign: 'center', color: 'var(--yellow)', fontWeight: 800, marginBottom: 24, fontSize: 18 },
  item: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--brand-gray)', borderRadius: 24, marginBottom: 12 },
  itemIcon: { fontSize: 32 },
  itemBody: { flex: 1 },
  itemName: { fontWeight: 800, fontSize: 16 },
  itemDesc: { fontSize: 12, color: 'var(--text-dim)' },
  buyBtn: { background: 'var(--brand-purple)', border: 'none', color: '#fff', fontWeight: 800, padding: '10px 20px', borderRadius: 100, fontSize: 14, cursor: 'pointer', transition: '0.2s' }
};

function GhostMascot({ style, mood = 'happy' }) {
  const emojis = { happy: '👻', thinking: '🤔', sad: '😢', cool: '😎' };
  return (
    <div style={{ ...style, fontSize: 48 }} className="anim-float">
      {emojis[mood] || emojis.happy}
    </div>
  );
}

export default function Home({ store, go }) {
  const { data, learned, level, rankTitle, untestedCount } = store;
  const [tab, setTab] = useState('journey');
  const [showShop, setShowShop] = useState(false);
  const scrollRef = useRef(null);

  // SRS due count
  const now = Date.now();
  const dueCount = useMemo(() => 
    Object.values(data.wordProgress).filter(w => (w.seen || w.mastered) && (w.nextReview || 0) <= now).length
  , [data.wordProgress, now]);

  // Journey Map logic: Level nodes
  const levels = useMemo(() => {
    return LEVELS.map((_, i) => {
      const isUnlocked = data.unlockedLevels.includes(i);
      const isPassed = data.passedLessons.includes(i);
      const isCurrent = !isPassed && isUnlocked;
      
      // Snake path calculation: x moves back and forth
      const row = i;
      const x = Math.sin(row * 0.8) * 60; // Curve amount
      
      return { id: i, x, isUnlocked, isPassed, isCurrent };
    }).slice(0, Math.max(data.unlockedLevels.length + 5, 10)); // Show some future levels
  }, [data.unlockedLevels, data.passedLessons]);

  // Auto-scroll to current level
  useEffect(() => {
    if (tab === 'journey') {
      const current = levels.find(l => l.isCurrent);
      if (current && scrollRef.current) {
        const el = document.getElementById(`level-${current.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [tab, levels]);

  const renderTopBar = () => (
    <div style={S.topBar}>
      <div style={S.topBadge}>
        <span style={S.badgeIcon}>🔥</span> {data.streak}
      </div>
      <div style={S.topBadge} onClick={() => setShowShop(true)}>
        <span style={S.badgeIcon}>💰</span> {data.coins}
      </div>
      <div style={S.topBadge} onClick={() => setShowShop(true)}>
        <span style={{ ...S.badgeIcon, color: '#ff4b81' }}>❤️</span> {data.lives}
      </div>
      <div style={{ flex: 1 }} />
      <button style={S.profileBtn} onClick={() => go('settings')}>
        <span style={{ fontSize: 20 }}>👤</span>
      </button>
    </div>
  );

  const renderJourney = () => (
    <div className="journey-container" ref={scrollRef}>
      <div style={S.pathLine} />
      {levels.map((l, idx) => {
        const title = LEVEL_NAMES[l.id] || `Уровень ${l.id + 1}`;
        return (
          <div key={l.id} id={`level-${l.id}`} style={{ ...S.levelNode, transform: `translateX(${l.x}px)` }}>
            {l.isCurrent && <GhostMascot style={S.mascotFloating} mood={data.lives === 0 ? 'sad' : 'happy'} />}
            
            <button 
              style={{ 
                ...S.levelCircle, 
                background: l.isPassed ? 'var(--brand-purple)' : l.isUnlocked ? 'var(--brand-purple-light)' : 'var(--brand-gray-dark)',
                color: l.isUnlocked ? '#fff' : 'rgba(0,0,0,0.2)',
                boxShadow: l.isCurrent ? '0 0 20px rgba(106, 90, 224, 0.4)' : 'none',
                scale: l.isCurrent ? '1.1' : '1'
              }}
              disabled={!l.isUnlocked}
              onClick={() => go('cards', l.id)}
            >
              {l.isPassed ? '✓' : l.isUnlocked ? (l.id + 1) : '🔒'}
            </button>
            
            <div style={{ ...S.levelLabel, opacity: l.isUnlocked ? 1 : 0.4 }}>
              {title}
            </div>
            
            {/* Exam indicator */}
            {(l.id + 1) % 5 === 0 && l.isUnlocked && !data.passedExams.includes(l.id) && (
              <div style={S.examFlag}>📝</div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderReview = () => (
    <div style={S.subPage} className="anim-in">
      <div style={S.promoCard} className="glass-card">
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
        <div style={S.promoTitle}>Центр Повторений</div>
        <div style={S.promoDesc}>
          {dueCount > 0 
            ? `У тебя ${dueCount} слов, которые пора закрепить!` 
            : 'Все слова в памяти! Но ты можешь потренироваться еще.'}
        </div>
        <button 
          className="btn-primary btn-full" 
          disabled={data.lives === 0 || learned === 0}
          onClick={() => go('review')}
        >
          Начать практику
        </button>
        {learned === 0 && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 8 }}>Сначала выучи несколько слов</div>}
      </div>
      
      <div style={S.statsGrid}>
        <div style={S.smallStat} className="glass-card">
          <div style={S.smallStatVal}>{learned}</div>
          <div style={S.smallStatLbl}>Слов выучено</div>
        </div>
        <div style={S.smallStat} className="glass-card">
          <div style={S.smallStatVal}>{level}</div>
          <div style={S.smallStatLbl}>Твой уровень</div>
        </div>
      </div>
    </div>
  );

  const renderBottomNav = () => (
    <div className="bottom-nav">
      <button style={S.navItem} className={tab === 'journey' ? 'active' : ''} onClick={() => setTab('journey')}>
        <span className="nav-icon">🗺️</span>
        <span>Путь</span>
      </button>
      <button style={S.navItem} className={tab === 'review' ? 'active' : ''} onClick={() => setTab('review')}>
        <span className="nav-icon">🧠</span>
        <span>Практика</span>
      </button>
      <button style={S.navItem} onClick={() => setShowShop(true)}>
        <span className="nav-icon">🏛️</span>
        <span>Маркет</span>
      </button>
      <button style={S.navItem} onClick={() => go('settings')}>
        <span className="nav-icon">📊</span>
        <span>Статы</span>
      </button>
    </div>
  );

  return (
    <div style={S.page}>
      {renderTopBar()}
      
      <main style={S.content}>
        {tab === 'journey' && renderJourney()}
        {tab === 'review' && renderReview()}
      </main>

      {showShop && <MarketModal store={store} onClose={() => setShowShop(false)} />}
      {renderBottomNav()}
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--brand-gray)', display: 'flex', flexDirection: 'column' },
  topBar: { height: 64, background: 'var(--brand-white)', borderBottom: '1px solid var(--brand-gray-dark)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, position: 'sticky', top: 0, zIndex: 100 },
  topBadge: { display: 'flex', alignItems: 'center', gap: 6, background: 'var(--brand-gray)', padding: '6px 12px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer' },
  badgeIcon: { fontSize: 14 },
  profileBtn: { width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  content: { flex: 1, paddingBottom: 80 },
  
  pathLine: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 8, background: 'rgba(0,0,0,0.05)', height: '2000px', zIndex: 0, borderRadius: 4 },
  levelNode: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '40px 0', zIndex: 1, width: '100%' },
  levelCircle: { width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
  levelLabel: { marginTop: 12, fontSize: 14, fontWeight: 700, color: 'var(--text-dim)', textAlign: 'center', maxWidth: 120 },
  
  mascotFloating: { position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', zIndex: 2 },
  examFlag: { position: 'absolute', top: -10, right: '35%', background: 'var(--yellow)', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, border: '3px solid var(--brand-white)' },

  subPage: { padding: 20, display: 'flex', flexDirection: 'column', gap: 20 },
  promoCard: { padding: 32, textAlign: 'center' },
  promoTitle: { fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: 'var(--font-display)' },
  promoDesc: { color: 'var(--text-dim)', marginBottom: 24, fontSize: 15, lineHeight: 1.5 },
  
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  smallStat: { padding: 20, textAlign: 'center' },
  smallStatVal: { fontSize: 32, fontWeight: 900, color: 'var(--brand-purple)', marginBottom: 4 },
  smallStatLbl: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' },

  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', transition: '0.2s', flex: 1 },
};
