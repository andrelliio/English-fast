import { LEVELS, TOTAL_WORDS, LEVEL_NAMES, WORDS_PER_LEVEL } from '../data/words';

export default function Home({ store, go }) {
  const { data, learned, logout, untestedCount } = store;
  const pct = Math.round((learned / TOTAL_WORDS) * 100);
  const accuracy = data.totalCorrect + data.totalWrong > 0
    ? Math.round((data.totalCorrect / (data.totalCorrect + data.totalWrong)) * 100) : 0;

  // Next unfinished level (among unlocked)
  // Next level logic: Frontier Priority
  const nextLevel = (() => {
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

  // Count of learned words (for review availability)
  const learnedCount = Object.values(data.wordProgress).filter(w => w.seen || w.mastered).length;

  // Show exam banner when 5+ untested levels
  const showExamBanner = untestedCount >= 5;

  return (
    <div style={S.page} className="anim-in">
      {/* Header */}
      <div style={S.header}>
        <div style={S.greeting}>Привет, {data.username}!</div>
        <div style={S.headerR}>
          <div style={S.streak}><span style={S.streakFire}>🔥</span> {data.streak}</div>
          <button style={S.logoutBtn} onClick={() => { if (confirm('Выйти? Прогресс удалится.')) logout(); }}>⏻</button>
        </div>
      </div>

      {/* Progress card */}
      <div style={S.card} className="glass-card">
        <div style={S.label}>ПРОГРЕСС</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
          <span style={S.bigNum}>{learned}</span>
          <span style={S.dimText}>из {TOTAL_WORDS} слов</span>
        </div>
        <div style={S.barOuter}><div style={{ ...S.barInner, width: `${Math.max(pct, 1)}%` }} /></div>
        <div style={S.dimText}>{pct}%</div>
      </div>

      {/* Stats row */}
      <div style={S.statsRow}>
        {[
          { v: data.xp, l: 'XP', c: 'var(--accent)' },
          { v: accuracy + '%', l: 'Точность', c: 'var(--green)' },
          { v: data.streak, l: 'Стрик', c: 'var(--yellow)' },
        ].map(s => (
          <div key={s.l} style={S.stat} className="glass-card">
            <div style={{ ...S.statVal, color: s.c }}>{s.v}</div>
            <div style={S.statLbl}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Exam banner */}
      {showExamBanner && (
        <button style={S.examBanner} onClick={() => go('levelExam')}>
          <span style={{ fontSize: 24 }}>📝</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--yellow)' }}>Пора сдать экзамен!</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{untestedCount} уровней без экзамена. Сдай тест чтобы открыть новые</div>
          </div>
          <span style={{ color: 'var(--yellow)' }}>→</span>
        </button>
      )}

      {/* Review banner — always available if there are learned words */}
      {learnedCount > 0 && (
        <button style={S.reviewBanner} onClick={() => go('review')}>
          <span style={{ fontSize: 24 }}>🔄</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--yellow)' }}>Повторить материал</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{learnedCount} слов для повторения</div>
          </div>
          <span style={{ color: 'var(--yellow)' }}>→</span>
        </button>
      )}

      {/* Continue button */}
      <button className="btn-primary btn-full" onClick={() => go('cards', nextLevel)}>
        НАЧАТЬ УРОК 🚀
      </button>
      <div style={S.levelHint}>Уровень {nextLevel + 1}: {LEVEL_NAMES[nextLevel] || ''}</div>

      {/* Nav grid */}
      <div style={S.grid}>
        {[
          { icon: '📋', title: 'Уровни', desc: 'Выбери уровень', action: () => go('levels') },
          { icon: '🔄', title: 'Повторение', desc: 'Рандомные слова', action: () => go('review') },
          { icon: '⚡', title: 'Быстрый тест', desc: 'Случайный уровень', action: () => {
            const unlocked = data.unlockedLevels.filter(l => l < LEVELS.length);
            go('quiz', unlocked[Math.floor(Math.random() * unlocked.length)] || 0);
          }},
          { icon: '🃏', title: 'Карточки', desc: 'Смотри и учи', action: () => go('cards', nextLevel) },
          ...(showExamBanner ? [{ icon: '📝', title: 'Экзамен', desc: 'Сдай экзамен', action: () => go('levelExam') }] : []),
        ].map(n => (
          <button key={n.title} style={S.navCard} className="glass-card" onClick={n.action}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingTop: 8 },
  greeting: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: 0.5 },
  headerR: { display: 'flex', gap: 12, alignItems: 'center' },
  streak: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 15, fontWeight: 800 },
  streakFire: { fontSize: 18, filter: 'drop-shadow(0 0 10px rgba(255,107,53,0.6))' },
  logoutBtn: { color: 'var(--text-dim)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  
  card: { padding: 24, marginBottom: 24 },
  label: { fontSize: 12, color: 'var(--accent)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' },
  bigNum: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, color: 'var(--text)', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' },
  dimText: { fontSize: 14, color: 'var(--text-dim)', fontWeight: 600 },
  barOuter: { height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', marginBottom: 8, marginTop: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' },
  barInner: { height: '100%', borderRadius: 4, background: 'var(--accent-gradient)', transition: 'width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)', boxShadow: '0 0 10px var(--accent-glow)' },
  
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 },
  stat: { padding: '16px 10px', textAlign: 'center' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 },
  statLbl: { fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 },
  
  placementBanner: { width: '100%', padding: '16px 20px', marginBottom: 16, border: '1px solid rgba(0, 240, 255, 0.3)', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)', background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.1), transparent)', borderRadius: 'var(--radius)' },
  examBanner: { width: '100%', padding: '16px 20px', marginBottom: 16, border: '1px solid rgba(255, 51, 102, 0.3)', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)', background: 'linear-gradient(90deg, rgba(255, 51, 102, 0.1), transparent)', borderRadius: 'var(--radius)' },
  reviewBanner: { width: '100%', padding: '16px 20px', marginBottom: 16, border: '1px solid rgba(178, 36, 239, 0.3)', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)', background: 'linear-gradient(90deg, rgba(178, 36, 239, 0.1), transparent)', borderRadius: 'var(--radius)' },
  
  levelHint: { fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 24, fontWeight: 600 },
  
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  navCard: { padding: '24px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text)', transition: 'all 0.3s ease' },
  navTitle: { fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, letterSpacing: 0.5 },
  navDesc: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 },
};
