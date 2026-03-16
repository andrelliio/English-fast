import { useState, useEffect, useMemo, useRef } from 'react';
import { GRAMMAR_ISLANDS, GRAMMAR_DICTIONARY } from '../data/words';
import confetti from 'canvas-confetti';
import { tts } from '../utils/tts';

// Using centralized dictionary from words.js

export default function GrammarTrainer({ store, go, level }) {
  // 'level' prop here is overloaded to pass { islandId, lessonId }
  const { islandId, lessonId } = level || {};
  const island = GRAMMAR_ISLANDS.find(i => i.id === islandId);
  const initialLesson = island?.lessons.find(l => l.id === lessonId);

  const [step, setStep] = useState('intro'); // intro, training, discovery, mix_summary, exam_result, finished
  const [currentIdx, setCurrentIdx] = useState(0); // Index in sessionQueue
  const [sessionQueue, setSessionQueue] = useState([]); // [{ type: 'card', data: verbObj } | { type: 'ex', data: exObj }]
  const [exercises, setExercises] = useState([]); // Kept for back-compat/exams
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
  const [showRuleHint, setShowRuleHint] = useState(false);
  const [showVerbRef, setShowVerbRef] = useState(false);
  const [translationTooltip, setTranslationTooltip] = useState(null); // { word, translation }
  const tooltipTimer = useRef(null);

  const totalSteps = sessionQueue.length;
  const progress = totalSteps > 0 ? (currentIdx / totalSteps) * 100 : 0;
  const currentItem = sessionQueue[currentIdx];
  const currentEx = currentItem?.type === 'ex' ? currentItem.data : null;

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

  // Find the original lesson for the current exercise to show the correct hint/rule
  const activeRuleLesson = useMemo(() => {
    if (!island || !currentEx) return null;
    // If we're in a regular lesson, use it directly (don't search)
    if (!initialLesson.isMix && !initialLesson.isExam && !initialLesson.isSuper) {
      return initialLesson;
    }
    // For Exams/Mix: find the lesson that contains this EXACT exercise
    return island.lessons.find(l => 
      !l.isMix && !l.isExam && 
      l.exercises?.some(e => e.ru === currentEx.ru)
    ) || initialLesson;
  }, [island, currentEx, initialLesson]);

  const parseVerbTable = (tableStr) => {
    if (!tableStr) return [];
    return tableStr.split(', ').map(pair => {
      const parts = pair.split('→');
      const from = parts[0] || "";
      const to = parts[1] || "";
      const fromLower = from.toLowerCase();
      const toLower = to.toLowerCase();
      
      // Match by verbBase (new system) or by any word in the exercise (fallback)
      const isActive = currentEx?.verbBase 
        ? currentEx.verbBase === fromLower
        : currentEx?.en.some(w => w.toLowerCase() === toLower || w.toLowerCase() === fromLower);

      return {
        from, to,
        fromRu: GRAMMAR_DICTIONARY[fromLower] || "",
        toRu: GRAMMAR_DICTIONARY[toLower] || "",
        isActive
      };
    });
  };

  // Initialize sessionQueue
  useEffect(() => {
    if (!initialLesson) return;
    
    if (initialLesson.isSuper) {
      const allSource = GRAMMAR_ISLANDS.flatMap(i => i.lessons.filter(l => !l.isMix && !l.isExam).flatMap(l => l.exercises));
      const list = [...allSource].sort(() => Math.random() - 0.5).slice(0, initialLesson.count);
      setSessionQueue(list.map(ex => ({ type: 'ex', data: ex })));
    } else if (initialLesson.isMix || initialLesson.isExam) {
      let allSource = [];
      if (initialLesson.sources) {
        allSource = island.lessons.filter(l => initialLesson.sources.includes(l.id)).flatMap(l => l.exercises);
      } else {
        allSource = island.lessons.filter(l => !l.isMix && !l.isExam).flatMap(l => l.exercises);
      }
      const list = [...allSource].sort(() => Math.random() - 0.5).slice(0, initialLesson.count);
      setSessionQueue(list.map(ex => ({ type: 'ex', data: ex })));
    } else if (island.id === 'irreg_verbs') {
      // INTERLEAVED FLOW for Irregular Verbs
      const queue = [];
      const verbsInLesson = parseVerbTable(initialLesson.table);
      
      verbsInLesson.forEach(v => {
        // 1. Add Card
        queue.push({ type: 'card', data: v });
        // 2. Add Exercises for this specific verb
        const verbEx = initialLesson.exercises.filter(ex => ex.verbBase === v.from.toLowerCase());
        verbEx.forEach(ex => queue.push({ type: 'ex', data: ex }));
      });
      
      setSessionQueue(queue);
    } else {
      // Regular Lesson
      setSessionQueue(initialLesson.exercises.map(ex => ({ type: 'ex', data: ex })));
    }
  }, [initialLesson, island]);

  // Load current stage (Discovery or Practice)
  useEffect(() => {
    if (sessionQueue.length > 0 && currentIdx < sessionQueue.length) {
      const item = sessionQueue[currentIdx];
      
      if (item.type === 'card') {
        setStep('discovery');
      } else {
        setStep('training');
        const ex = item.data;
        const correctWords = [...ex.en].map(w => w.toLowerCase().replace(/[?!.,]$/g, ''));
        const trapsCount = (initialLesson.isExam || initialLesson.isSuper) ? 7 : 4;
        const traps = getDistractors(ex, trapsCount, correctWords);
        
        setSelected([]);
        setShuffled([...correctWords, ...traps]
          .sort(() => Math.random() - 0.5)
          .map((text, i) => ({ text, id: i, hidden: false }))
        );
        setStatus('idle');
        setShowHint(false);
      }
    }
  }, [currentIdx, sessionQueue, initialLesson]);

  function getDistractors(ex, count, correctWords) {
    const category = ex.category || "";
    const priorityPool = new Set();
    const generalPool = new Set();
    const lowers = correctWords.map(w => w.toLowerCase());
    
    // 0. Sibling Context Traps (Add words from other exercises in the same lesson)
    if (initialLesson?.exercises) {
      const otherEx = initialLesson.exercises.filter(e => e.ru !== ex.ru);
      otherEx.forEach(e => {
        e.en.forEach(word => {
          const w = word.toLowerCase().replace(/[?!.,]$/g, '');
          if (!lowers.includes(w) && w.length > 3) generalPool.add(w);
        });
      });
    }

    // 1. Critical Counter-Traps (Priority)
    lowers.forEach(w => {
      if (w === "don't") priorityPool.add("doesn't");
      if (w === "doesn't") priorityPool.add("don't");
      if (w === "do") priorityPool.add("does");
      if (w === "does") priorityPool.add("do");
      if (w === "am") { priorityPool.add("is"); priorityPool.add("are"); }
      if (w === "is") { priorityPool.add("are"); priorityPool.add("am"); }
      if (w === "are") { priorityPool.add("is"); priorityPool.add("am"); }
      if (w === "was") priorityPool.add("were");
      if (w === "were") priorityPool.add("was");
      if (w === "did") priorityPool.add("do");
      if (w === "will") priorityPool.add("won't");
      if (w === "won't") priorityPool.add("will");
      
      // Pronoun swaps
      if (['he', 'she', 'it'].includes(w)) priorityPool.add("they");
      if (['they', 'we', 'i'].includes(w)) priorityPool.add("he");
    });

    // 1.5. Verb Base Traps (Specific requested challenge)
    if (ex.verbBase) {
      priorityPool.add(ex.verbBase);
      priorityPool.add(ex.verbBase + 's');
      priorityPool.add(ex.verbBase + 'ing');
    }

    // 2. Core grammar traps (General)
    if (category.includes('present')) {
      ['do', 'does', 'don\'t', 'doesn\'t', 'is', 'am', 'are'].forEach(w => generalPool.add(w));
    }
    if (category.includes('past')) {
      ['did', 'do', 'didn\'t', 'don\'t', 'was', 'were'].forEach(w => generalPool.add(w));
    }
    if (category.includes('future')) {
      ['will', 'won\'t', 'do', 'does', 'did'].forEach(w => generalPool.add(w));
    }
    
    // Pronoun traps
    if (lowers.some(w => ['i', 'you', 'we', 'they', 'he', 'she', 'it'].includes(w))) {
      ['i', 'you', 'we', 'they', 'he', 'she', 'it'].forEach(w => generalPool.add(w));
    }

    // 3. Verb form traps
    lowers.forEach(w => {
      const clean = w.replace(/[?!.,]$/g, ''); 
      if (clean.length <= 3) return;

      if (clean.endsWith('s') && !['does', 'this', 'news', 'english', 'is', 'has'].includes(clean)) {
        generalPool.add(clean.slice(0, -1));
      } else {
        const blacklist = [
          'they', 'this', 'does', 'news', 'english', 'russian', 'music', 
          'tennis', 'football', 'pizza', 'coffee', 'tea', 'milk', 'water', 
          'home', 'school', 'gym', 'work', 'together', 'here', 'there', 
          'it', 'i', 'you', 'we', 'them', 'us', 'me', 'him', 'her', 'is', 'has', 'was'
        ];
        if (!blacklist.includes(clean)) {
          generalPool.add(clean + 's');
        }
      }
      
      if (clean.endsWith('ed')) generalPool.add(clean.slice(0, -2));
      
      // Irregular Verb Mapping (Common ones)
      const irregulars = {
        'saw': ['see', 'watch', 'look'],
        'went': ['go', 'goes'],
        'bought': ['buy', 'buys'],
        'met': ['meet', 'meets'],
        'came': ['come', 'comes'],
        'had': ['have', 'has'],
        'ate': ['eat', 'eats'],
        'drank': ['drink', 'drinks'],
        'read': ['reading'],
        'told': ['tell', 'tells'],
        'said': ['say', 'says'],
        'found': ['find', 'finds'],
        'knew': ['know', 'knows'],
        'thought': ['think', 'thinks'],
        'took': ['take', 'takes'],
        'gave': ['give', 'gives'],
        'made': ['make', 'makes'],
        'got': ['get', 'gets']
      };
      if (irregulars[clean]) {
        irregulars[clean].forEach(trap => priorityPool.add(trap));
      }

      // Add "ing" form as a general trap for any verb
      if (clean.length > 3 && !['this', 'that', 'with', 'from'].includes(clean)) {
        generalPool.add(clean + 'ing');
      }
    });

    // Final filtering and assembly
    const finalPriority = [...priorityPool].filter(w => !lowers.includes(w));
    const finalGeneral = [...generalPool].filter(w => !lowers.includes(w) && !priorityPool.has(w));

    // Combine: priority first, then general pool
    const result = [
      ...finalPriority.sort(() => Math.random() - 0.5),
      ...finalGeneral.sort(() => Math.random() - 0.5)
    ];
    
    return result.slice(0, count);
  }

  const onWordClick = (word, idx) => {
    if (status !== 'idle') return;

    // Show translation briefly on first click/selection
    const translation = GRAMMAR_DICTIONARY[word.toLowerCase()] || "???";
    setTranslationTooltip({ word, translation });
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setTranslationTooltip(null), 2000);

    // Mark as hidden in shuffled pool
    setShuffled(prev => prev.map((item, i) => i === idx ? { ...item, hidden: true } : item));
    
    // Add to selected with original index for restoration
    setSelected(prev => [...prev, { text: word, originalIdx: idx }]);
  };

  const onRemoveWord = (item, idx) => {
    if (status !== 'idle') return;
    
    // Restore in shuffled pool
    setShuffled(prev => prev.map((s, i) => i === item.originalIdx ? { ...s, hidden: false } : s));
    
    // Remove from selected
    setSelected(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCheck = () => {
    if (status !== 'idle') return;
    handleValidate(selected);
  };

  const handleValidate = (finalSelected) => {
    const ex = currentEx;
    if (!ex) return;
    
    const userSentence = finalSelected.map(sh => sh.text.toLowerCase().trim()).join(' ');
    // Strip terminal punctuation from target for comparison since we removed it from choices
    const targetSentence = ex.en.map(w => w.toLowerCase().replace(/[?!.,]$/g, '').trim()).join(' ');

    if (userSentence === targetSentence) {
      setStatus('correct');
      setScore(s => s + 1);
      setTimeout(() => {
        if (currentIdx + 1 < sessionQueue.length) {
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
        past_affirmative: "Нужна прошедшая форма глагола (окончание -ed или специальная форма, как saw).",
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
    // Just reset the hidden states in shuffled and clear selection
    setShuffled(prev => prev.map(item => ({ ...item, hidden: false })));
    setSelected([]);
  };

  const useHint = () => {
    if (status !== 'idle') return;
    if ((store.data?.coins || 0) < 5) {
      alert("Недостаточно монет! 💰");
      return;
    }
    
    store.update(prev => ({ ...prev, coins: (prev.coins || 0) - 5 }));
    setShowRuleHint(true);
  };

  const finishLesson = () => {
    const exerciseCount = sessionQueue.filter(i => i.type === 'ex').length || 1;
    const finalScore = score / exerciseCount;
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
            <div style={S.introVerbTable}>
              <div style={S.verbTableHeader}>Как меняются слова:</div>
              {parseVerbTable(initialLesson.table).map((row, i) => (
                <div key={i} style={S.verbRow}>
                  <div style={S.verbCell}>
                    <span style={S.verbBase}>{row.from}</span>
                    <span style={S.verbRu}>{row.fromRu}</span>
                  </div>
                  <div style={S.verbArrow}>→</div>
                  <div style={S.verbCell}>
                    <span style={S.verbTransformed}>{row.to}</span>
                    <span style={S.verbRu}>{row.toRu}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="btn-primary btn-full" style={{ marginTop: 24 }} onClick={() => setStep('training')}>
            ПОЕХАЛИ! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (step === 'discovery') {
    const verb = currentItem.data;
    return (
      <div style={S.page} className="anim-in">
        <div style={S.lessonHeader}>
          <button style={S.closeBtn} onClick={() => go('levels')}>✕</button>
          <div style={S.progressWrapper}>
            <div style={S.levelInfo}>{initialLesson.title} • {currentIdx + 1}/{totalSteps}</div>
            <div style={S.barOuter}><div style={{ ...S.barInner, width: `${progress}%` }} /></div>
          </div>
        </div>

        <div style={S.content}>
          <div style={S.discoveryCard} className="glass-card">
            <div style={S.discoveryLabel}>НОВОЕ СЛОВО:</div>
            
            <div style={S.discoveryMain}>
              <div style={S.verbCellLarge}>
                <span style={S.verbBaseLarge}>{verb.from}</span>
                <span style={S.verbRuLarge}>{verb.fromRu}</span>
              </div>
              <div style={S.verbArrowLarge}>→</div>
              <div style={S.verbCellLarge}>
                <span style={S.verbTransformedLarge}>{verb.to}</span>
                <span style={S.verbRuLarge}>{verb.toRu}</span>
              </div>
              
              <button 
                className="anim-pop" 
                style={S.audioDiscoveryBtn} 
                onClick={(e) => { e.stopPropagation(); tts.speak(verb.to); }}
              >
                🔊
              </button>
            </div>

            <div style={S.discoveryHint}>
              Запомни эту форму! Сейчас будет пара упражнений на закрепление.
            </div>

            <button className="btn-primary btn-full" onClick={() => {
               if (currentIdx + 1 < sessionQueue.length) {
                 setCurrentIdx(i => i + 1);
               } else {
                 finishLesson();
               }
            }}>
              Я ЗАПОМНИЛ 👍
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'finished') {
    const exerciseCount = sessionQueue.filter(i => i.type === 'ex').length || 1;
    return (
      <div style={{ ...S.page, justifyContent: 'center' }} className="anim-in">
        <div style={S.finishCard} className="glass-card">
          <div style={{ fontSize: 64, marginBottom: 20 }}>🏆</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 10 }}>Остров завершен!</h2>
          <div style={S.statsRow}>
            <div style={S.statItem}><div style={S.statVal}>+50</div><div style={S.statLbl}>XP</div></div>
            <div style={S.statItem}><div style={S.statVal}>+25</div><div style={S.statLbl}>💰</div></div>
            <div style={S.statItem}><div style={S.statVal}>{Math.round((score/exerciseCount)*100)}%</div><div style={S.statLbl}>Точность</div></div>
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
          <div style={S.levelInfo}>{initialLesson.title} • {currentIdx + 1}/{totalSteps}</div>
          <div style={S.barOuter}><div style={{ ...S.barInner, width: `${progress}%` }} /></div>
        </div>
      </div>

      <div style={S.content}>
        <div style={S.targetRu}>{currentEx?.ru}</div>
        
        {/* Lexical hint for phrasal verbs/tricky parts */}
        {currentEx?.lexicalHint && (
          <div style={S.lexicalHint} className="anim-pop">
            <span style={{ opacity: 0.6 }}>💡 Подсказка:</span> {currentEx.lexicalHint}
          </div>
        )}
        
        
        {/* Formula hint */}
        {activeFormula && (
          <div style={S.smallHint}>{activeFormula}</div>
        )}

        {/* Selected Words */}
        <div style={{ ...S.selectedArea, borderColor: status === 'correct' ? 'var(--green)' : status === 'wrong' ? '#ff3366' : 'rgba(255,255,255,0.1)' }} className={status === 'wrong' ? 'shake' : ''}>
          {selected.map((item, i) => (
            <div 
              key={i} 
              style={{ ...S.wordChipFixed, cursor: status === 'idle' ? 'pointer' : 'default' }} 
              onClick={() => onRemoveWord(item, i)}
            >
              {item.text}
            </div>
          ))}
          {status === 'idle' && selected.length < (currentEx?.en.length || 0) && <div style={S.cursor} />}
        </div>

        <div style={S.removalHint}>
          {selected.length > 0 && status === 'idle' && "Нажми на слово, чтобы убрать его"}
        </div>

        <div style={S.chipsArea}>
          {shuffled.map((item, i) => (
            <button 
              key={`${i}-${item.text}`} 
              style={{ 
                ...S.chip, 
                outline: showHint === item.text ? '2px solid var(--accent)' : 'none',
                visibility: item.hidden ? 'hidden' : 'visible',
                pointerEvents: item.hidden ? 'none' : 'auto'
              }} 
              onClick={() => onWordClick(item.text, i)}
            >
              {item.text}
            </button>
          ))}
          {translationTooltip && (
            <div style={S.tooltipOverlay} className="anim-pop">
              <span style={S.tooltipWord}>{translationTooltip.word}</span>
              <span style={S.tooltipArrow}>=</span>
              <span style={S.tooltipTrans}>{translationTooltip.translation}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {selected.length > 0 && status === 'idle' && (
          <button style={S.checkBtn} onClick={handleCheck} className="anim-pop">
            ПРОВЕРИТЬ 🔍
          </button>
        )}
      </div>

      <div style={S.footer}>
        <button style={S.hintBtn} onClick={useHint}>💡 Подсказка (-5 💰)</button>
      </div>

      {showRuleHint && activeRuleLesson && (
        <div style={S.hintOverlayBackdrop} onClick={() => setShowRuleHint(false)}>
          <div style={S.hintOverlay} className="anim-pop" onClick={e => e.stopPropagation()}>
            <div style={S.hintOverlayHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>💡</span>
                <div style={{ fontWeight: 800, letterSpacing: 1 }}>ПРАВИЛО</div>
              </div>
              <button style={S.hintClose} onClick={() => setShowRuleHint(false)}>✕</button>
            </div>
            
            <div style={S.hintOverlayScrollArea}>
              <div style={S.hintOverlayText}>{activeRuleLesson.explanation}</div>
              
              {activeRuleLesson.table && (
                <div style={S.hintTableContainer}>
                  <div style={S.hintTableLabel}>Глаголы этого урока:</div>
                  <div style={S.miniVerbTable}>
                    {parseVerbTable(activeRuleLesson.table).map((row, i) => (
                      <div key={i} style={{ 
                        ...S.verbRow, 
                        background: row.isActive ? 'rgba(0,240,255,0.12)' : 'transparent',
                        borderLeft: row.isActive ? '4px solid var(--accent)' : '4px solid transparent',
                        padding: '10px 14px',
                        borderRadius: row.isActive ? 8 : 0,
                        margin: '2px 0'
                      }}>
                        <div style={S.verbCell}>
                          <span style={{ ...S.verbBase, color: row.isActive ? '#fff' : 'var(--text-dim)' }}>{row.from}</span>
                          <span style={S.verbRu}>{row.fromRu}</span>
                        </div>
                        <div style={{ ...S.verbArrow, opacity: row.isActive ? 1 : 0.4 }}>→</div>
                        <div style={S.verbCell}>
                          <span style={{ ...S.verbTransformed, color: row.isActive ? 'var(--accent)' : 'rgba(255,255,255,0.4)' }}>{row.to}</span>
                          <span style={S.verbRu}>{row.toRu}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeRuleLesson.formulas && (
                <div style={{ marginTop: 20 }}>
                  <div style={S.hintTableLabel}>Конструкция:</div>
                  {activeRuleLesson.formulas.map((f, i) => (
                    <div key={i} style={S.hintFormula}>{f}</div>
                  ))}
                </div>
              )}
            </div>

            <button style={S.hintProceed} onClick={() => setShowRuleHint(false)}>ПОНЯТНО 👌</button>
          </div>
        </div>
      )}

      {/* Error feedback overlay */}
      {status === 'wrong' && errorFeedback && (
        <div style={S.errorOverlay} className="anim-pop">
          <div style={{ fontSize: 32, marginBottom: 12 }}>❌</div>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, color: '#fff' }}>ОШИБКА!</div>
          <div style={S.errorText}>{errorFeedback}</div>
          
          <div style={S.correctBlock}>
            <div style={S.correctLabel}>КАК НАДО БЫЛО:</div>
            <div style={S.correctWord}>
              {currentEx?.en.map(w => w.toLowerCase().replace(/[?!.,]$/g, '')).join(' ')}
            </div>
          </div>

          {activeRuleLesson?.table && (
            <button 
              style={{ ...S.dismissBtn, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', marginBottom: 10 }}
              onClick={() => setShowVerbRef(true)}
            >
              📚 СПРАВОЧНИК СЛОВ
            </button>
          )}

          <button 
            style={S.dismissBtn}
            onClick={dismissError}
          >
            ПОНЯТНО 👌
          </button>
        </div>
      )}

      {/* Verb Reference Modal (Contextual) */}
      {showVerbRef && activeRuleLesson?.table && (
        <div style={S.hintOverlay} className="anim-pop">
          <div style={S.hintOverlayHeader}>
            <span style={{ fontSize: 24 }}>📚</span>
            <div style={{ fontWeight: 800 }}>СПРАВОЧНИК СЛОВ</div>
            <button style={S.hintClose} onClick={() => setShowVerbRef(false)}>✕</button>
          </div>
          <div style={{ ...S.hintOverlayText, marginBottom: 20 }}>Слова и их формы в этом уроке:</div>
          
          <div style={{ ...S.miniVerbTable, background: 'rgba(0,0,0,0.3)', padding: 12 }}>
            {parseVerbTable(activeRuleLesson.table).map((row, i) => (
              <div key={i} style={{ ...S.verbRow, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8, marginBottom: 8 }}>
                <div style={S.verbCell}>
                  <span style={S.verbBase}>{row.from}</span>
                  <span style={S.verbRu}>{row.fromRu}</span>
                </div>
                <div style={S.verbArrow}>→</div>
                <div style={S.verbCell}>
                  <span style={S.verbTransformed}>{row.to}</span>
                  <span style={S.verbRu}>{row.toRu}</span>
                </div>
              </div>
            ))}
          </div>

          <button style={S.hintProceed} onClick={() => setShowVerbRef(false)}>ВЕРНУТЬСЯ ✅</button>
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
  
  lexicalHint: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(0,240,255,0.2)',
    borderRadius: 12,
    padding: '8px 14px',
    fontSize: 13,
    color: 'var(--accent)',
    marginTop: -8,
    marginBottom: 20,
    fontWeight: 700,
    display: 'inline-block',
    alignSelf: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  

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
  chip: { 
    background: 'rgba(255,255,255,0.05)', 
    border: '1px solid rgba(255,255,255,0.1)', 
    color: 'var(--text)', 
    padding: '12px 20px', 
    borderRadius: 16, 
    fontSize: 16, 
    fontWeight: 700, 
    cursor: 'pointer',
    transition: 'none', // Override global button transition
    transform: 'none'    // Prevent hover scale during state transition
  },
  
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
  dismissBtn: { background: 'white', color: 'black', border: 'none', padding: '16px 32px', borderRadius: 16, fontSize: 16, fontWeight: 900, cursor: 'pointer', width: '100%' },

  // Verb Mapping Styles
  introVerbTable: { background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, width: '100%', marginBottom: 16, textAlign: 'left' },
  verbTableHeader: { fontSize: 11, fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12, display: 'block' },
  verbRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  verbCell: { display: 'flex', flexDirection: 'column', flex: 1 },
  verbBase: { fontSize: 15, fontWeight: 700, color: 'var(--text)' },
  verbTransformed: { fontSize: 15, fontWeight: 900, color: 'var(--accent)' },
  verbRu: { fontSize: 11, color: 'var(--text-dim)', marginTop: 2 },
  verbArrow: { fontSize: 16, color: 'var(--text-dim)', fontWeight: 300 },
  miniVerbTable: { marginTop: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 },

  // Tooltip Styles
  tooltipOverlay: { position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: 'black', padding: '6px 12px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 900, boxShadow: '0 4px 15px rgba(0,240,255,0.4)', zIndex: 10, pointerEvents: 'none' },
  tooltipWord: { fontSize: 13, textDecoration: 'underline' },
  tooltipArrow: { fontSize: 12, opacity: 0.7 },
  tooltipTrans: { fontSize: 14 },
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

  hintOverlayBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(10px)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  hintOverlay: {
    width: '100%',
    maxWidth: 400,
    background: 'rgba(25, 25, 35, 1)',
    borderRadius: 32,
    border: '1px solid rgba(0,240,255,0.25)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90dvh',
    position: 'relative',
    overflow: 'hidden'
  },
  hintOverlayHeader: {
    padding: '24px 24px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  hintOverlayScrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  hintOverlayText: {
    fontSize: 15,
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 500
  },
  hintTableContainer: {
    background: 'rgba(0,0,0,0.25)',
    borderRadius: 20,
    padding: '16px 4px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  hintTableLabel: {
    fontSize: 10,
    fontWeight: 800,
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingLeft: 16,
    opacity: 0.8
  },
  hintFormula: {
    background: 'linear-gradient(90deg, rgba(0,240,255,0.12), transparent)',
    color: 'var(--accent)',
    padding: '10px 16px',
    borderRadius: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    borderLeft: '2px solid var(--accent)',
    marginBottom: 8
  },
  hintClose: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: 'var(--text-dim)',
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    cursor: 'pointer',
    transition: '0.2s'
  },
  hintProceed: {
    background: 'var(--accent-gradient)',
    color: '#000',
    border: 'none',
    padding: '20px',
    margin: '12px 24px 24px',
    borderRadius: 20,
    fontSize: 15,
    fontWeight: 900,
    boxShadow: '0 8px 30px rgba(0,240,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    cursor: 'pointer'
  },
  reviewList: { width: '100%', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' },
  reviewItem: { background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.05)' },
  reviewItemTitle: { fontSize: 14, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 },
  reviewItemText: { fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.4 },
  discoveryCard: {
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
    textAlign: 'center',
    maxWidth: 400,
    margin: '0 auto'
  },
  discoveryLabel: {
    fontSize: 12,
    fontWeight: 900,
    color: 'var(--accent)',
    letterSpacing: 2
  },
  discoveryMain: {
    display: 'flex',
    alignItems: 'center',
    gap: 20
  },
  verbCellLarge: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  verbBaseLarge: {
    fontSize: 28,
    fontWeight: 900,
    color: '#fff'
  },
  verbTransformedLarge: {
    fontSize: 28,
    fontWeight: 900,
    color: 'var(--accent)'
  },
  verbRuLarge: {
    fontSize: 14,
    color: 'var(--text-dim)'
  },
  verbArrowLarge: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.2)'
  },
  discoveryHint: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.5,
    marginBottom: 8
  },
  audioDiscoveryBtn: {
    background: 'rgba(0,240,255,0.1)',
    border: '1px solid rgba(0,240,255,0.3)',
    color: 'var(--accent)',
    width: 60,
    height: 60,
    borderRadius: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    cursor: 'pointer',
    marginLeft: 10,
    marginTop: -10,
    transition: 'all 0.2s',
    boxShadow: '0 4px 15px rgba(0,240,255,0.1)'
  },
  reviewSummary: { width: '100%', marginBottom: 24 }
};
