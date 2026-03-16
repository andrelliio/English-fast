import { LEVELS, LEVEL_NAMES, WORDS_PER_LEVEL, GRAMMAR_ISLANDS } from '../data/words';

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

  const giUnlocked = (giId) => {
    if (giId === 'irreg_verbs') {
      return data.grammarProgress['present_simple']?.['exam']?.passed;
    }
    if (giId === 'past_simple') {
      return data.grammarProgress['irreg_verbs']?.['exam_100']?.passed;
    }
    if (giId === 'final_battle') {
      return (
        data.grammarProgress['past_simple']?.['exam']?.passed &&
        data.grammarProgress['future_simple']?.['exam']?.passed
      );
    }
    return true;
  };

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
        {/* Grammar Islands Section */}
        <div style={S.sectionLabel}>ОСНОВЫ ГРАММАТИКИ</div>
        {GRAMMAR_ISLANDS.map((gi) => {
          const unlocked = giUnlocked(gi.id);
          return (
            <div key={gi.id} 
              style={{ 
                ...S.card, 
                marginBottom: 16, 
                border: `1px solid ${unlocked ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.05)'}`, 
                opacity: unlocked ? 1 : 0.7, 
                filter: unlocked ? 'none' : 'grayscale(0.6)',
                background: unlocked ? 'var(--bg-card)' : 'rgba(255,255,255,0.02)'
              }} 
              className="glass-card anim-up"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ 
                  ...S.giIconBox, 
                  background: unlocked ? 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,240,255,0.05))' : 'rgba(255,255,255,0.03)',
                  borderColor: unlocked ? 'var(--accent)' : 'transparent'
                }}>
                  {unlocked ? (gi.icon || '💎') : '🔒'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S.giTitle}>{gi.title}</div>
                  <div style={S.giSubtitle}>{unlocked ? (gi.subtitle || gi.label) : 'Пройдите предыдущие испытания'}</div>
                </div>
              </div>

              <div style={{ 
                ...S.lessonGrid, 
                gridTemplateColumns: gi.lessons.length <= 4 ? `repeat(${gi.lessons.length}, 1fr)` : 'repeat(auto-fit, minmax(80px, 1fr))',
                pointerEvents: unlocked ? 'auto' : 'none' 
              }}>
                {gi.lessons.map((l, lIdx) => {
                  const isPassed = data.grammarProgress[gi.id]?.[l.id]?.passed;
                  const isLessonUnlocked = lIdx === 0 || data.grammarProgress[gi.id]?.[gi.lessons[lIdx - 1].id]?.passed;
                  
                  return (
                    <button 
                      key={l.id} 
                      style={{ 
                        ...S.lessonCard, 
                        borderColor: isPassed ? 'var(--green)' : isLessonUnlocked ? 'rgba(255,255,255,0.1)' : 'transparent',
                        opacity: isLessonUnlocked ? 1 : 0.4,
                        pointerEvents: isLessonUnlocked ? 'auto' : 'none',
                        background: l.isSuper 
                          ? 'linear-gradient(135deg, rgba(255,51,102,0.15), rgba(112,0,255,0.15))' 
                          : isPassed ? 'rgba(0, 255, 135, 0.05)' : 'rgba(255,255,255,0.03)'
                      }} 
                      onClick={() => unlocked && isLessonUnlocked && go('grammarTrainer', { islandId: gi.id, lessonId: l.id })}
                    >
                      <div style={S.lessonIcon}>
                        {isPassed ? '✅' : !isLessonUnlocked ? '🔒' : l.isSuper ? '⚔️' : (l.isExam ? '🎓' : (l.id === 'mix' ? '🌪️' : '📖'))}
                      </div>
                      <div style={S.lessonLabel}>{l.title.split(' ')[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{ ...S.sectionLabel, marginTop: 24 }}>ТРОПИНКА СЛОВ</div>
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
  page: { minHeight: '100vh', padding: '16px 16px 100px', maxWidth: 460, margin: '0 auto', zIndex: 1, position: 'relative' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text)', textAlign: 'left', borderRadius: 24, transition: 'all 0.3s ease' },
  locked: { opacity: 0.4, filter: 'grayscale(1)', pointerEvents: 'none' },
  num: { fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  name: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4, letterSpacing: 0.5 },
  sub: { fontSize: 12, color: 'var(--text-dim)', fontWeight: 600 },
  
  miniBar: { height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  miniBarIn: { height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.5s ease' },
  
  smallBtn: { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 10, fontSize: 16, cursor: 'pointer', transition: '0.2s' },

  sectionLabel: { fontSize: 11, fontWeight: 900, color: 'var(--accent)', letterSpacing: 2, marginBottom: 16, marginTop: 10, opacity: 0.8, textTransform: 'uppercase' },
  
  card: { padding: '24px 20px', borderRadius: 32, position: 'relative', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' },
  
  giIconBox: { width: 50, height: 50, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 },
  giTitle: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 2 },
  giSubtitle: { fontSize: 12, color: 'var(--text-dim)', fontWeight: 600 },

  lessonGrid: { display: 'grid', gap: 8 },
  lessonCard: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8, 
    padding: '12px 6px', 
    border: '1px solid rgba(255,255,255,0.08)', 
    borderRadius: 16, 
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: 'var(--text)',
    minHeight: 80
  },
  lessonIcon: { fontSize: 18, marginBottom: 2 },
  lessonLabel: { fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.8 },

  examBanner: { width: '100%', padding: '20px 24px', marginBottom: 24, borderRadius: 28, border: '1px solid rgba(255, 215, 0, 0.2)', display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text)', background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), transparent)', cursor: 'pointer' },
};
