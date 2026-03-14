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
        <button className="back-btn-round" onClick={() => go('home')}>✕</button>
        <div className="header-title">Твои уровни</div>
      </div>

      <div style={S.content}>
        {/* Exam banner */}
        {showExamBanner && (
          <button style={S.examBanner} className="glass-card" onClick={() => go('levelExam')}>
            <span style={{ fontSize: 28 }}>📝</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--yellow)' }}>Пора сдать экзамен!</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{untestedLevels.length} уровней ждут проверки</div>
            </div>
            <span style={{ color: 'var(--yellow)', fontSize: 20 }}>→</span>
          </button>
        )}

        <div style={S.list}>
          {LEVEL_NAMES.map((name, l) => {
            const p = lvlProgress(l);
            const pct = p.total > 0 ? Math.round((p.mastered / p.total) * 100) : 0;
            const ok = isUnlocked(l);
            const passed = isPassed(l);
            
            return (
              <button key={l} style={{ ...S.item, opacity: ok ? 1 : 0.5 }} className="glass-card"
                onClick={() => ok && go('cards', l)}>

                <div style={{ 
                  ...S.icon, 
                  background: passed ? 'var(--brand-purple)' : ok ? 'var(--brand-purple-light)' : 'var(--brand-gray-dark)',
                  color: ok ? '#fff' : 'rgba(0,0,0,0.2)'
                }}>
                  {passed ? '✓' : ok ? l + 1 : '🔒'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={S.name}>{name}</div>
                  <div style={S.sub}>{pct}% пройдено</div>
                  <div style={S.miniBar}><div style={{ ...S.miniBarIn, width: `${pct}%` }} /></div>
                </div>

                {ok && <div style={S.chevron}>→</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--brand-gray)', display: 'flex', flexDirection: 'column' },
  content: { padding: 20, flex: 1 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', transition: '0.2s' },
  icon: { width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flexShrink: 0 },
  name: { fontSize: 16, fontWeight: 800, marginBottom: 4, fontFamily: 'var(--font-display)' },
  sub: { fontSize: 12, color: 'var(--text-dim)', fontWeight: 600 },
  miniBar: { height: 6, background: 'var(--brand-gray)', borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  miniBarIn: { height: '100%', borderRadius: 3, background: 'var(--brand-purple)' },
  chevron: { fontSize: 18, color: 'var(--brand-purple)', fontWeight: 800 },
  examBanner: { width: '100%', padding: '20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(135deg, var(--brand-white), #fff9e6)', border: '2px solid var(--yellow)' }
};
