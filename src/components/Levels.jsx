import { LEVELS, LEVEL_NAMES, WORDS_PER_LEVEL } from '../data/words';

export default function Levels({ store, go }) {
  const { data } = store;

  const lvlProgress = (l) => {
    const start = l * WORDS_PER_LEVEL;
    let mastered = 0;
    if (!LEVELS[l]) return { mastered: 0, total: 0 };
    LEVELS[l].forEach((_, i) => { const w = data.wordProgress[start + i]; if (w?.mastered) mastered++; });
    return { mastered, total: LEVELS[l].length };
  };

  const isUnlocked = (l) => data.unlockedLevels.includes(l);
  const isPassed = (l) => data.passedLessons.includes(l);

  // Levels that are unlocked but not exam-passed
  const untestedLevels = data.unlockedLevels.filter(l => !data.passedExams.includes(l));
  const showExamBanner = untestedLevels.length >= 5;

  return (
    <div style={S.page} className="anim-in">
      <div className="app-header">
        <button className="back-btn-round" onClick={() => go('home')}>←</button>
        <div className="header-title">Уровни</div>
      </div>

      {/* Exam banner */}
      {showExamBanner && (
        <button style={S.examBanner} className="glass-card" onClick={() => go('levelExam')}>
          <span style={{ fontSize: 28, filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.4))' }}>📝</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--yellow)' }}>Пора сдать экзамен!</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>{untestedLevels.length} уровней ждут проверки</div>
          </div>
          <span style={{ color: 'var(--yellow)', fontSize: 20 }}>→</span>
        </button>
      )}

      <div style={S.list}>
        {LEVELS.map((_, l) => {
          const p = lvlProgress(l);
          const pct = p.total > 0 ? Math.round((p.mastered / p.total) * 100) : 0;
          const ok = isUnlocked(l);
          const passed = isPassed(l);
          return (
            <button key={l} style={{ ...S.item, ...(ok ? {} : S.locked) }} className="glass-card"
              onClick={() => ok && go('cards', l)}
              onMouseEnter={e => { if (ok) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}>

              <div style={{ ...S.num, background: passed ? 'rgba(0, 255, 135, 0.2)' : ok ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: passed ? 'var(--green)' : ok ? 'var(--accent)' : 'var(--text-muted)', border: `1px solid ${passed ? 'var(--green)' : ok ? 'var(--accent)' : 'transparent'}` }}>
                {passed ? '✓' : ok ? l + 1 : '🔒'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={S.name}>{LEVEL_NAMES[l] || `Уровень ${l + 1}`}</div>
                <div style={S.sub}>{pct}% пройдено</div>
                <div style={S.miniBar}><div style={{ ...S.miniBarIn, width: `${pct}%` }} /></div>
              </div>

              {ok && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={S.smallBtn} onClick={e => { e.stopPropagation(); go('cards', l); }}>🃏</span>
                  <span style={{ ...S.smallBtn, background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--accent)' }} onClick={e => { e.stopPropagation(); go('quiz', l); }}>⚡</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', zIndex: 1, position: 'relative' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text)', textAlign: 'left', transition: 'all 0.3s ease' },
  locked: { opacity: 0.4, filter: 'grayscale(1)', pointerEvents: 'none' },
  num: { fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  name: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4, letterSpacing: 0.5 },
  sub: { fontSize: 12, color: 'var(--text-dim)', fontWeight: 600 },
  miniBar: { height: 4, background: 'rgba(0,0,0,0.3)', borderRadius: 2, overflow: 'hidden', marginTop: 8, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' },
  miniBarIn: { height: '100%', borderRadius: 2, background: 'var(--accent-gradient)', boxShadow: '0 0 8px var(--accent-glow)' },
  smallBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer', transition: 'all 0.2s ease', backdropFilter: 'blur(4px)' },
  examBanner: { width: '100%', padding: '18px 20px', marginBottom: 20, border: '1px solid rgba(255, 215, 0, 0.3)', display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text)', background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent)' },
};
