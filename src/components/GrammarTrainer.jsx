import { useState, useEffect, useMemo, useRef } from 'react';
import { GRAMMAR_ISLANDS } from '../data/words';
import confetti from 'canvas-confetti';

export default function GrammarTrainer({ store, go, level }) {
  // 'level' prop here is overloaded to pass { islandId, lessonId }
  const { islandId, lessonId } = level || {};
  const island = GRAMMAR_ISLANDS.find(i => i.id === islandId);
  const initialLesson = island?.lessons.find(l => l.id === lessonId);

  const [step, setStep] = useState('intro'); // intro, training, mix_summary, exam_result, finished
  const [currentIdx, setCurrentIdx] = useState(0);
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, correct, wrong
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [mistakes, setMistakes] = useState({}); // { category: count }
  const [errorFeedback, setErrorFeedback] = useState("");
  const [reviewCategories, setReviewCategories] = useState([]);

  const progress = exercises.length > 0 ? (currentIdx / exercises.length) * 100 : 0;
  const currentEx = exercises[currentIdx];

  const activeFormula = useMemo(() => {
    if (!initialLesson?.formulas) return null;
    if (initialLesson.formulas.length === 1) return initialLesson.formulas[0];
    if (!currentEx) return initialLesson.formulas[0];
    
    const firstWord = currentEx.en[0].toLowerCase();
    // He, She, It, Does -> use second formula (index 1)
    if (['he', 'she', 'it', 'does'].includes(firstWord)) {
      return initialLesson.formulas[1] || initialLesson.formulas[0];
    }
    return initialLesson.formulas[0];
  }, [initialLesson?.formulas, currentEx]);

  // Initialize exercises
  useEffect(() => {
    if (!initialLesson) return;
    let list = [];
    if (initialLesson.isSuper) {
      // Super Exam: Collect EVERYTHING from ALL islands
      const allSource = GRAMMAR_ISLANDS.flatMap(i => i.lessons.filter(l => !l.isMix && !l.isExam).flatMap(l => l.exercises));
      list = [...allSource].sort(() => Math.random() - 0.5).slice(0, initialLesson.count);
    } else if (initialLesson.isMix || initialLesson.isExam) {
      // Collect all exercises from other lessons of THIS island
      const allSource = island.lessons.filter(l => !l.isMix && !l.isExam).flatMap(l => l.exercises);
      list = [...allSource].sort(() => Math.random() - 0.5).slice(0, initialLesson.count);
    } else {
      list = initialLesson.exercises;
    }
    setExercises(list);
  }, [initialLesson, island]);

  // Load current exercise
  useEffect(() => {
    if (exercises.length > 0 && currentIdx < exercises.length) {
      const ex = exercises[currentIdx];
      const correctWords = [...ex.en].map(w => w.toLowerCase());
      
      // Inject distractors
      const trapsCount = (initialLesson.isExam || initialLesson.isSuper) ? 7 : 2;
      const traps = getDistractors(ex, trapsCount, correctWords);
      
      setSelected([]);
      setShuffled([...correctWords, ...traps].sort(() => Math.random() - 0.5));
      setStatus('idle');
      setShowHint(false);
    }
  }, [currentIdx, exercises, initialLesson]);

  function getDistractors(ex, count, correctWords) {
    const category = ex.category || "";
    const pool = new Set();
    
    // Core grammar traps
    if (category.includes('present')) {
      ['do', 'does', 'don\'t', 'doesn\'t', 'is', 'am', 'are'].forEach(w => pool.add(w));
    }
    if (category.includes('past')) {
      ['did', 'do', 'didn\'t', 'don\'t', 'was', 'were'].forEach(w => pool.add(w));
    }
    if (category.includes('future')) {
      ['will', 'won\'t', 'do', 'does', 'did'].forEach(w => pool.add(w));
    }
    
    // Pronoun traps
    if (correctWords.some(w => ['i', 'you', 'we', 'they', 'he', 'she', 'it'].includes(w))) {
      ['i', 'you', 'we', 'they', 'he', 'she', 'it'].forEach(w => pool.add(w));
    }

    // Verb form traps (simple heuristic: if we have "works", add "work")
    correctWords.forEach(w => {
      if (w.endsWith('s') && w.length > 3) pool.add(w.slice(0, -1));
      if (!w.endsWith('s') && w.length > 3 && !['they', 'this', 'does'].includes(w)) pool.add(w + 's');
      if (w.endsWith('ed')) pool.add(w.slice(0, -2));
      if (w === 'go') pool.add('goes');
      if (w === 'went') pool.add('go');
    });

    // Remove actual correct words from the traps pool
    correctWords.forEach(w => pool.delete(w.toLowerCase()));

    // Randomize and limit
    return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  }

  const onWordClick = (word, idx) => {
    if (status !== 'idle') return;
    const newSelected = [...selected, word];
    setSelected(newSelected);
    const remaining = shuffled.filter((_, i) => i !== idx);
    setShuffled(remaining);
  };

  const onRemoveWord = (word, idx) => {
    if (status !== 'idle') return;
    setSelected(prev => prev.filter((_, i) => i !== idx));
    setShuffled(prev => [...prev, word]);
  };

  const handleCheck = () => {
    if (status !== 'idle') return;
    handleValidate(selected);
  };

  const handleValidate = (finalSelected) => {
    const ex = exercises[currentIdx];
    const userSentence = finalSelected.map(w => w.toLowerCase()).join(' ');
    const targetSentence = ex.en.map(w => w.toLowerCase()).join(' ');

    if (userSentence === targetSentence) {
      setStatus('correct');
      setScore(s => s + 1);
      setTimeout(() => {
        if (currentIdx + 1 < exercises.length) {
          setCurrentIdx(i => i + 1);
        } else {
          finishLesson();
        }
      }, 800);
    } else {
      setStatus('wrong');
      setWrongCount(w => w + 1);
      
      if (ex.category) {
        setMistakes(prev => ({ ...prev, [ex.category]: (prev[ex.category] || 0) + 1 }));
      }

      const feedbackMap = {
        present_affirmative_3rd: "Для He / She / It в настоящем времени нужно окончание -s.",
        present_negative: "Используй don't для утверждения 'не делаю'.",
        present_negative_3rd: "Используй doesn't и глагол БЕЗ s для He / She / It.",
        present_question: "Для вопроса используй Do в начале.",
        present_question_3rd: "Для He / She / It используй Does в начале (и убери s у глагола).",
        past_affirmative: "Нужна прошедшая форма глагола (окончание -ed или 2-я колонка).",
        past_negative: "В отрицании используем didn't + глагол в начальной форме.",
        past_question: "Для вопроса в прошлом ставим Did в начало.",
        future_affirmative: "Используй will перед глаголом.",
        future_negative: "Используй won't для отрицания.",
        future_question: "Ставь Will в начало для вопроса."
      };
      setErrorFeedback(feedbackMap[ex.category] || "Попробуй еще раз!");
    }
  };

  const dismissError = () => {
    setStatus('idle');
    // Reset selection for this exercise so user can try again
    const ex = exercises[currentIdx];
    setSelected([]);
    setShuffled([...ex.en].map(w => w.toLowerCase()).sort(() => Math.random() - 0.5));
  };

  const useHint = () => {
    if (status !== 'idle' || shuffled.length === 0) return;
    const ex = exercises[currentIdx];
    const nextTarget = ex.en[selected.length];
    setShowHint(nextTarget);
    // Penalty could be applied here
  };

  const finishLesson = () => {
    const finalScore = score / exercises.length;
    const threshold = initialLesson.threshold || 0.85;

    if (initialLesson.isSuper && finalScore < threshold) {
      // Analyze mistakes and show review
      const sortedMistakes = Object.entries(mistakes)
        .sort(([, a], [, b]) => b - a)
        .filter(([, count]) => count > 0)
        .map(([cat]) => cat)
        .slice(0, 3);

      setReviewCategories(sortedMistakes);
      setStep('review');
      return;
    }

    if (finalScore >= threshold) {
      store.completeGrammarLesson(islandId, lessonId, finalScore);
      setStep('finished');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else {
      setStep('exam_fail');
    }
  };

  const handleContinue = () => {
    const islandIndex = GRAMMAR_ISLANDS.findIndex(i => i.id === islandId);
    if (islandIndex === -1) return go('home');
    
    const currentIsland = GRAMMAR_ISLANDS[islandIndex];
    const lessonIndex = currentIsland.lessons.findIndex(l => l.id === lessonId);

    if (lessonIndex < currentIsland.lessons.length - 1) {
      const nextLesson = currentIsland.lessons[lessonIndex + 1];
      go('grammarTrainer', { islandId, lessonId: nextLesson.id });
    } else if (islandIndex < GRAMMAR_ISLANDS.length - 1) {
      const nextIsland = GRAMMAR_ISLANDS[islandIndex + 1];
      go('grammarTrainer', { islandId: nextIsland.id, lessonId: nextIsland.lessons[0].id });
    } else {
      go('home');
    }
  };

  if (!island || !initialLesson) return <div>Lesson not found</div>;

  if (step === 'intro') {
    return (
      <div style={S.page} className="anim-in">
        <div style={S.header}>
          <button style={S.back} onClick={() => go('levels')}>←</button>
          <div style={S.headerTitle}>{island.title}</div>
        </div>

        <div style={S.introCard} className="glass-card">
          <div style={S.introIcon}>{island.icon}</div>
          <h2 style={S.introTitle}>{initialLesson.title}</h2>
          <p style={S.introText}>{initialLesson.explanation}</p>
          
          {initialLesson.whatAndWhy && (
            <div style={S.introDetailed}>
              <div style={S.introBox}>
                <div style={S.introBoxHeader}>🎯 Что учим?</div>
                <div style={S.introBoxText}>{initialLesson.whatAndWhy.what}</div>
              </div>
              <div style={S.introBox}>
                <div style={S.introBoxHeader}>💡 Зачем это нужно?</div>
                <div style={S.introBoxText}>{initialLesson.whatAndWhy.why}</div>
              </div>
            </div>
          )}

          {initialLesson.formulas && (
            <div style={S.formulaBox}>
              <div style={S.formulaLabel}>Формула:</div>
              {initialLesson.formulas.map(f => <div key={f} style={S.formulaItem}>{f}</div>)}
            </div>
          )}

          {initialLesson.table && (
            <div style={S.tableBox}>
              {initialLesson.table.split(', ').map(t => <div key={t} style={S.tableItem}>{t}</div>)}
            </div>
          )}

          <button className="btn-primary btn-full" style={{ marginTop: 24 }} onClick={() => setStep('training')}>
            ПОЕХАЛИ! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (step === 'finished') {
    return (
      <div style={{ ...S.page, justifyContent: 'center' }} className="anim-in">
        <div style={S.finishCard} className="glass-card">
          <div style={{ fontSize: 64, marginBottom: 20 }}>🏆</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 10 }}>Остров завершен!</h2>
          <div style={S.statsRow}>
            <div style={S.statItem}><div style={S.statVal}>+50</div><div style={S.statLbl}>XP</div></div>
            <div style={S.statItem}><div style={S.statVal}>+25</div><div style={S.statLbl}>💰</div></div>
            <div style={S.statItem}><div style={S.statVal}>{Math.round((score/exercises.length)*100)}%</div><div style={S.statLbl}>Точность</div></div>
          </div>
          <button className="btn-primary btn-full" style={{ marginBottom: 12 }} onClick={handleContinue}>
            ПРОДОЛЖИТЬ ОБУЧЕНИЕ
          </button>
          <button 
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text)', 
              width: '100%', 
              padding: '16px', 
              borderRadius: 16, 
              fontSize: 16, 
              fontWeight: 800,
              cursor: 'pointer'
            }} 
            onClick={() => go('home')}
          >
            ДОМОЙ
          </button>
        </div>
      </div>
    );
  }

  if (step === 'exam_fail') {
    return (
      <div style={S.page} className="anim-in">
        <div style={S.finishCard} className="glass-card">
          <div style={{ fontSize: 64, marginBottom: 20 }}>💔</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 10 }}>Нужно больше практики</h2>
          <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: 24 }}>
            Экзамен не пройден. Результат: {Math.round((score/exercises.length)*100)}%. <br/>
            Нужно минимум {Math.round((initialLesson.threshold || 0.85)*100)}%.
          </p>
          <button className="btn-primary btn-full" onClick={() => go('levels')}>ВЕРНУТЬСЯ</button>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div style={S.page} className="anim-in">
        <div style={S.finishCard} className="glass-card">
          <div style={{ fontSize: 64, marginBottom: 20 }}>📚</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 10 }}>Время повторить!</h2>
          <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: 24 }}>
            Экзамен не пройден ({Math.round((score/exercises.length)*100)}%). <br/>
            Вы часто ошибались в этих темах. Давай повторим правила:
          </p>
          
          <div style={S.reviewList}>
            {reviewCategories.length > 0 ? reviewCategories.map(cat => {
              const ruleMap = {
                present_affirmative_3rd: { title: "He / She / It + глагол+s", rule: "В настоящем времени добавляй -s к глаголу, если говоришь о нем, ней или 'это'." },
                present_negative: { title: "I / You / We / They + don't", rule: "Для отрицания в настоящем времени используй вспомогательный глагол don't." },
                present_negative_3rd: { title: "He / She / It + doesn't", rule: "Используй doesn't для отрицания с He/She/It. Глагол при этом теряет окончание -s!" },
                present_question: { title: "Do ... ?", rule: "Вопрос в настоящем времени начинается с Do (для I/you/we/they)." },
                present_question_3rd: { title: "Does ... ?", rule: "Вопрос для He/She/It начинается с Does. Глагол остается в начальной форме (без -s)." },
                past_affirmative: { title: "Прошедшее время (+)", rule: "Используй 2-ю форму глагола (went, ate) или добавляй -ed (worked, played)." },
                past_negative: { title: "Didn't + глагол", rule: "В отрицании прошлого всегда 'didn't' + начальная форма глагола (никаких -ed!)." },
                past_question: { title: "Did ... ?", rule: "Вопрос о прошлом всегда начинается с Did. Глагол возвращается в начальную форму." },
                future_affirmative: { title: "Will + глагол", rule: "Для будущего времени просто ставь will перед действием." },
                future_negative: { title: "Won't + глагол", rule: "Won't — это сокращение от will not. Используй для планов, которые не сбудутся." },
                future_question: { title: "Will ... ?", rule: "Чтобы спросить о будущем, вынеси Will в самое начало предложения." }
              };
              const rule = ruleMap[cat] || { title: cat, rule: "Повтори эту конструкцию в уроках острова." };
              return (
                <div key={cat} style={S.reviewItem}>
                  <div style={S.reviewItemTitle}>{rule.title}</div>
                  <div style={S.reviewItemText}>{rule.rule}</div>
                </div>
              );
            }) : (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>Общая работа над ошибками</div>
            )}
          </div>

          <button className="btn-primary btn-full" style={{ marginTop: 24 }} onClick={() => {
            setStep('intro');
            setCurrentIdx(0);
            setScore(0);
            setMistakes({});
            setWrongCount(0);
          }}>
            ПОПРОБОВАТЬ СНОВА 🔄
          </button>
        </div>
      </div>
    );
  }


  return (
    <div style={{ ...S.page, height: '100dvh', overflow: 'hidden' }}>
      {/* Header with Progress */}
      <div style={S.lessonHeader}>
        <button style={S.closeBtn} onClick={() => go('levels')}>✕</button>
        <div style={S.progressWrapper}>
          <div style={S.levelInfo}>{initialLesson.title} • {currentIdx + 1}/{exercises.length}</div>
          <div style={S.barOuter}><div style={{ ...S.barInner, width: `${progress}%` }} /></div>
        </div>
      </div>

      <div style={S.content}>
        <div style={S.targetRu}>{currentEx?.ru}</div>
        
        {/* Formula hint */}
        {activeFormula && (
          <div style={S.smallHint}>{activeFormula}</div>
        )}

        {/* Selected Words */}
        <div style={{ ...S.selectedArea, borderColor: status === 'correct' ? 'var(--green)' : status === 'wrong' ? '#ff3366' : 'rgba(255,255,255,0.1)' }} className={status === 'wrong' ? 'shake' : ''}>
          {selected.map((w, i) => (
            <div 
              key={i} 
              style={{ ...S.wordChipFixed, cursor: status === 'idle' ? 'pointer' : 'default' }} 
              onClick={() => onRemoveWord(w, i)}
            >
              {w}
            </div>
          ))}
          {status === 'idle' && selected.length < (currentEx?.en.length || 0) && <div style={S.cursor} />}
        </div>

        <div style={S.removalHint}>
          {selected.length > 0 && status === 'idle' && "Нажми на слово, чтобы убрать его"}
        </div>

        <div style={S.chipsArea}>
          {shuffled.map((w, i) => (
            <button 
              key={`${i}-${w}`} 
              style={{ ...S.chip, outline: showHint === w ? '2px solid var(--accent)' : 'none' }} 
              onClick={() => onWordClick(w, i)}
              className="anim-pop"
            >
              {w}
            </button>
          ))}
        </div>

        {/* Action Button */}
        {selected.length === currentEx?.en.length && status === 'idle' && (
          <button style={S.checkBtn} onClick={handleCheck} className="anim-pop">
            ПРОВЕРИТЬ 🔍
          </button>
        )}
      </div>

      <div style={S.footer}>
        <button style={S.hintBtn} onClick={useHint}>💡 Подсказка (-5 XP)</button>
      </div>

      {/* Error feedback overlay */}
      {status === 'wrong' && errorFeedback && (
        <div style={S.errorOverlay} className="anim-pop">
          <div style={{ fontSize: 32, marginBottom: 12 }}>❌</div>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, color: '#fff' }}>ОШИБКА!</div>
          <div style={S.errorText}>{errorFeedback}</div>
          
          <div style={S.correctBlock}>
            <div style={S.correctLabel}>КАК НАДО БЫЛО:</div>
            <div style={S.correctWord}>{exercises[currentIdx]?.en.join(' ')}</div>
          </div>

          <button 
            style={S.dismissBtn}
            onClick={dismissError}
          >
            ПОНЯТНО 👌
          </button>
        </div>
      )}

      {status === 'correct' && <div style={S.correctFlash} />}
    </div>
  );
}

const S = {
  page: { minHeight: '100dvh', padding: '16px 16px 40px', maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', position: 'relative' },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 },
  back: { background: 'none', border: 'none', color: 'var(--text)', fontSize: 24, cursor: 'pointer' },
  headerTitle: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 },
  
  introCard: { padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 },
  introIcon: { fontSize: 40, marginBottom: 8 },
  introTitle: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, marginBottom: 6 },
  introText: { color: 'var(--text-dim)', lineHeight: 1.4, marginBottom: 16, fontSize: 13 },
  
  introDetailed: { width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  introBox: { background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '12px 16px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' },
  introBoxHeader: { fontSize: 11, fontWeight: 800, color: 'var(--accent)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  introBoxText: { fontSize: 14, color: 'var(--text)', lineHeight: 1.3 },

  formulaBox: { background: 'rgba(0,240,255,0.03)', borderRadius: 16, border: '1px dashed rgba(0,240,255,0.3)', padding: 16, width: '100%', marginBottom: 16 },
  formulaLabel: { fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 },
  formulaItem: { fontFamily: 'monospace', color: 'var(--accent)', fontSize: 13, fontWeight: 600 },
  tableBox: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' },
  tableItem: { background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: 'var(--text-dim)' },

  lessonHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40, paddingTop: 10 },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 24, cursor: 'pointer' },
  progressWrapper: { flex: 1 },
  levelInfo: { fontSize: 11, fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  barOuter: { height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 3, overflow: 'hidden' },
  barInner: { height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.3s ease' },

  content: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40, paddingBottom: 100 },
  targetRu: { fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 12, lineHeight: 1.3 },
  smallHint: { fontSize: 12, color: 'var(--accent)', opacity: 0.6, marginBottom: 40 },
  
  selectedArea: { width: '100%', minHeight: 120, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '2px solid rgba(255,255,255,0.1)', padding: 16, display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: 8, transition: '0.2s', position: 'relative' },
  wordChipFixed: { background: 'var(--accent)', color: '#000', fontWeight: 800, padding: '8px 16px', borderRadius: 12, fontSize: 16 },
  cursor: { width: 2, height: 24, background: 'var(--accent)', animation: 'blink 1s infinite', marginLeft: 4, marginTop: 6 },
  
  chipsArea: { width: '100%', marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  chip: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)', padding: '12px 20px', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
  
  footer: { padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.05)' },
  hintBtn: { background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' },

  correctFlash: { position: 'fixed', inset: 0, background: 'rgba(0,255,135,0.1)', pointerEvents: 'none', zIndex: 10, animation: 'fade-out 0.5s forwards' },
  
  finishCard: { padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statsRow: { display: 'flex', gap: 24, marginBottom: 40 },
  statItem: { textAlign: 'center' },
  statVal: { fontSize: 24, fontWeight: 900, color: 'var(--accent)' },
  statLbl: { fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase' },

  errorOverlay: { 
    position: 'absolute', 
    bottom: 120, 
    left: 20, 
    right: 20, 
    background: 'rgba(255, 51, 102, 0.95)', 
    backdropFilter: 'blur(10px)',
    padding: '16px 20px', 
    borderRadius: 20, 
    boxShadow: '0 10px 30px rgba(255, 51, 102, 0.3)',
    zIndex: 100,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 600, lineHeight: 1.4, marginBottom: 20 },
  correctBlock: {
    background: 'rgba(0,0,0,0.2)',
    padding: '12px 20px',
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
    border: '1px solid rgba(255,255,255,0.1)'
  },
  correctLabel: { fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: 4, letterSpacing: 1 },
  correctWord: { fontSize: 20, fontWeight: 900, color: '#fff' },
  dismissBtn: {
    background: '#fff',
    color: '#ff3366',
    border: 'none',
    padding: '12px 32px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 900,
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  checkBtn: {
    width: '100%',
    padding: '18px',
    borderRadius: 24,
    border: 'none',
    background: 'var(--accent-gradient)',
    color: '#000',
    fontSize: 20,
    fontWeight: 900,
    cursor: 'pointer',
    marginTop: 40,
    boxShadow: '0 8px 30px rgba(0,240,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  removalHint: {
    fontSize: 11,
    color: 'var(--text-dim)',
    marginTop: 8,
    opacity: 0.6,
    fontWeight: 600,
    textAlign: 'center',
    height: 14 // Stability: keep height even if empty
  },

  reviewList: { width: '100%', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' },
  reviewItem: { background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.05)' },
  reviewItemTitle: { fontSize: 14, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 },
  reviewItemText: { fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.4 },
};
