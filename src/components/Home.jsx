import { LEVELS, TOTAL_WORDS, LEVEL_NAMES, WORDS_PER_LEVEL } from '../data/words';

export default function Home({ store, go }) {
  const { data, learned, logout } = store;
  const pct = Math.round((learned / TOTAL_WORDS) * 100);
  const accuracy = data.totalCorrect + data.totalWrong > 0
    ? Math.round((data.totalCorrect / (data.totalCorrect + data.totalWrong)) * 100) : 0;

  // Next unfinished level
  const nextLevel = (() => {
    for (let l = 0; l < LEVELS.length; l++) {
      const start = l * WORDS_PER_LEVEL;
      const done = LEVELS[l].every((_, i) => data.wordProgress[start + i]?.mastered);
      if (!done) return l;
    }
    return LEVELS.length - 1;
  })();

  // Review count
  const reviewCount = Object.entries(data.wordProgress)
    .filter(([_, w]) => w.seen && !w.mastered).length;

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
      <div style={S.card}>
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
          <div key={s.l} style={S.stat}>
            <div style={{ ...S.statVal, color: s.c }}>{s.v}</div>
            <div style={S.statLbl}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Review banner */}
      {reviewCount > 0 && (
        <button style={S.reviewBanner} onClick={() => go('review')}>
          <span style={{ fontSize: 24 }}>🔄</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--yellow)' }}>Время повторить!</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{reviewCount} слов ждут</div>
          </div>
          <span style={{ color: 'var(--yellow)' }}>→</span>
        </button>
      )}

      {/* Continue button */}
      <button style={S.continueBtn} onClick={() => go('cards', nextLevel)}>
        ▶ Продолжить обучение
      </button>
      <div style={S.levelHint}>Уровень {nextLevel + 1}: {LEVEL_NAMES[nextLevel] || ''}</div>

      {/* Nav grid */}
      <div style={S.grid}>
        {[
          { icon: '📋', title: 'Уровни', desc: 'Выбери уровень', action: () => go('levels') },
          { icon: '🔄', title: 'Повторение', desc: 'Закрепи слова', action: () => go('review') },
          { icon: '⚡', title: 'Быстрый тест', desc: 'Случайный уровень', action: () => go('quiz', Math.floor(Math.random() * Math.min(nextLevel + 1, LEVELS.length))) },
          { icon: '🃏', title: 'Карточки', desc: 'Смотри и учи', action: () => go('cards', nextLevel) },
        ].map(n => (
          <button key={n.title} style={S.navCard} onClick={n.action}
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
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 8 },
  greeting: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 },
  headerR: { display: 'flex', gap: 10, alignItems: 'center' },
  streak: { display: 'flex', alignItems: 'center', gap: 5, background: 'var(--bg-card)', borderRadius: 50, padding: '7px 13px', fontSize: 15, fontWeight: 700, border: '1px solid #ffffff08' },
  streakFire: { fontSize: 18, animation: 'fireGlow 2s ease-in-out infinite' },
  logoutBtn: { background: 'var(--bg-card)', color: 'var(--text-dim)', borderRadius: 50, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: '1px solid #ffffff08' },
  card: { background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: 22, marginBottom: 16, border: '1px solid #ffffff08' },
  label: { fontSize: 11, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: 1, marginBottom: 6 },
  bigNum: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: 'var(--text)' },
  dimText: { fontSize: 13, color: 'var(--text-dim)' },
  barOuter: { height: 10, background: 'var(--bg)', borderRadius: 5, overflow: 'hidden', marginBottom: 6 },
  barInner: { height: '100%', borderRadius: 5, background: 'linear-gradient(90deg, var(--accent), var(--yellow))', transition: 'width 0.6s ease' },
  statsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 },
  stat: { background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '14px 10px', textAlign: 'center', border: '1px solid #ffffff08' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 },
  statLbl: { fontSize: 10, color: 'var(--text-dim)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
  reviewBanner: { width: '100%', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 14, border: '1px solid var(--yellow)', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)' },
  continueBtn: { width: '100%', padding: 16, background: 'linear-gradient(135deg, var(--accent), #ff8c5a)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 16, fontWeight: 700, boxShadow: '0 4px 20px var(--accent-glow)', marginBottom: 6 },
  levelHint: { fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  navCard: { background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '20px 14px', textAlign: 'center', border: '1px solid #ffffff08', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text)', transition: 'background 0.2s' },
  navTitle: { fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600 },
  navDesc: { fontSize: 11, color: 'var(--text-dim)' },
};
