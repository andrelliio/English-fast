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
  const isPassed = (l) => data.passedExams.includes(l);

  // Levels that are unlocked but not exam-passed
  const untestedLevels = data.unlockedLevels.filter(l => !data.passedExams.includes(l));
  const showExamBanner = untestedLevels.length >= 5;

  return (
    <div style={S.page} className="anim-in">
      <div style={S.header}>
        <button style={S.back} onClick={() => go('home')}>←</button>
        <h1 style={S.title}>Уровни</h1>
      </div>

      {/* Exam banner */}
      {showExamBanner && (
        <button style={S.examBanner} onClick={() => go('levelExam')}>
          <span style={{ fontSize: 24 }}>📝</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--yellow)' }}>Пора сдать экзамен!</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{untestedLevels.length} уровней ждут проверки</div>
          </div>
          <span style={{ color: 'var(--yellow)' }}>→</span>
        </button>
      )}

      <div style={S.list}>
        {LEVELS.map((_, l) => {
          const p = lvlProgress(l);
          const pct = p.total > 0 ? Math.round((p.mastered / p.total) * 100) : 0;
          const ok = isUnlocked(l);
          const passed = isPassed(l);
          return (
            <button key={l} style={{ ...S.item, ...(ok ? {} : S.locked) }}
              onClick={() => ok && go('cards', l)}
              onMouseEnter={e => { if (ok) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}>
              <div style={{ ...S.num, background: passed ? 'var(--green)' : ok ? 'var(--accent)' : 'var(--text-muted)', color: 'white' }}>
                {passed ? '✓' : ok ? l + 1 : '🔒'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={S.name}>{LEVEL_NAMES[l] || `Уровень ${l + 1}`}</div>
                <div style={S.sub}>{p.mastered}/{p.total} • {pct}%</div>
                <div style={S.miniBar}><div style={{ ...S.miniBarIn, width: `${pct}%` }} /></div>
              </div>
              {ok && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={S.smallBtn} onClick={e => { e.stopPropagation(); go('cards', l); }}>🃏</span>
                  <span style={{ ...S.smallBtn, background: 'var(--accent)' }} onClick={e => { e.stopPropagation(); go('quiz', l); }}>✅</span>
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
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingTop: 8 },
  back: { background: 'var(--bg-card)', color: 'var(--text)', borderRadius: 50, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '1px solid #ffffff08' },
  title: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  item: { background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', border: '1px solid #ffffff08', display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text)', textAlign: 'left', transition: 'background 0.2s' },
  locked: { opacity: 0.35, pointerEvents: 'none' },
  num: { fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  name: { fontWeight: 700, fontSize: 14, marginBottom: 2 },
  sub: { fontSize: 12, color: 'var(--text-dim)' },
  miniBar: { height: 4, background: 'var(--bg)', borderRadius: 2, overflow: 'hidden', marginTop: 5 },
  miniBarIn: { height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, var(--accent), var(--yellow))' },
  smallBtn: { background: 'var(--bg-elevated)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer' },
  examBanner: { width: '100%', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 14, border: '1px solid var(--yellow)', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)' },
};
