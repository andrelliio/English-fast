import { useState, useEffect } from 'react';
import allWords, { categoryRanges, LEVELS, WORDS_PER_LEVEL, getSimilarWords } from '../data/words';

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

export default function PlacementTest({ store, go }) {
  const [phase, setPhase] = useState('intro'); // intro, testing, result
  const [qs, setQs] = useState([]);
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [ok, setOk] = useState(0);
  const [bad, setBad] = useState(0);
  const [blockOk, setBlockOk] = useState(0);
  const [blockTotal, setBlockTotal] = useState(0);
  const [currentCatIdx, setCurrentCatIdx] = useState(0);
  const [determinedLevel, setDeterminedLevel] = useState(-1);

  const startTest = () => {
    // Build questions: 1 word from every other category (~19 questions)
    const questions = [];
    for (let ci = 0; ci < categoryRanges.length; ci += 2) {
      const cat = categoryRanges[ci];
      const catWords = [];
      for (let i = cat.start; i < cat.start + cat.count && i < allWords.length; i++) {
        catWords.push({ ...allWords[i], globalIdx: i, catIdx: ci });
      }
      // Pick 1 random from this category
      const picked = shuffle(catWords).slice(0, 1);
      for (const word of picked) {
        const wrongs = getSimilarWords(word.globalIdx, 4, word.ru);
        questions.push({
          word,
          options: shuffle([...wrongs, word.ru]),
          answer: word.ru,
          catIdx: ci,
        });
      }
    }
    setQs(questions);
    setCur(0);
    setSel(null);
    setOk(0);
    setBad(0);
    setBlockOk(0);
    setBlockTotal(0);
    setCurrentCatIdx(0);
    setPhase('testing');
  };

  const skip = () => {
    store.update({ placementDone: true });
    go('home');
  };

  if (phase === 'intro') {
    return (
      <div style={S.page}>
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 56 }}>🎯</div>
          <div style={S.doneTitle}>Определим твой уровень</div>
          <div style={S.dim}>Быстрый тест из ~20 слов разной сложности.</div>
          <div style={S.dim}>Как только станет сложно — мы определим твой уровень.</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, width: '100%', maxWidth: 320 }}>
            <button style={S.btnGhost} onClick={skip}>Пропустить</button>
            <button style={S.btnPrimary} onClick={startTest}>Начать тест 🚀</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const lvlName = determinedLevel >= 0 ? `Уровень ${determinedLevel + 1}` : 'Начальный';

    return (
      <div style={S.page}>
        <div style={S.center} className="anim-up">
          <div style={{ fontSize: 56 }}>🎉</div>
          <div style={S.doneTitle}>Уровень определён!</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>
            {determinedLevel >= 0 ? `Все уровни до ${determinedLevel + 1} открыты` : 'Начинаем с самого начала'}
          </div>
          <div style={S.dim}>✅ {ok} правильно  ❌ {bad} неправильно</div>
          {determinedLevel >= 0 && (
            <div style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 4 }}>
              Все пройденные слова добавлены в повторение
            </div>
          )}
          <button style={{ ...S.btnPrimary, marginTop: 16, width: '100%', maxWidth: 320 }} onClick={() => go('home')}>
            Начать обучение 🚀
          </button>
        </div>
      </div>
    );
  }

  // Testing phase
  if (!qs.length) return null;

  // Check if we've finished all questions
  if (cur >= qs.length) {
    // Passed everything — unlock all
    const maxLevel = Math.floor((allWords.length - 1) / WORDS_PER_LEVEL);
    store.unlockUpToWithWords(maxLevel, WORDS_PER_LEVEL);
    setDeterminedLevel(maxLevel);
    setPhase('result');
    return null;
  }

  const q = qs[cur];
  const answered = sel !== null;

  const pick = (opt) => {
    if (answered) return;
    setSel(opt);
    const correct = opt === q.answer;
    if (correct) { setOk(o => o + 1); setBlockOk(b => b + 1); }
    else { setBad(b => b + 1); }
    setBlockTotal(bt => bt + 1);
  };

  const BLOCK_SIZE = 3; // Check every 3 questions

  const next = () => {
    const nextIdx = cur + 1;
    const newBlockTotal = blockTotal; // already incremented in pick

    // Check block accuracy every BLOCK_SIZE questions
    if (newBlockTotal >= BLOCK_SIZE) {
      const blockAcc = newBlockTotal > 0 ? blockOk / newBlockTotal : 0;

      if (blockAcc < 0.7) {
        // Failed this block — determine level based on current category
        const failedCatIdx = q.catIdx;
        const prevCatIdx = failedCatIdx >= 2 ? failedCatIdx - 2 : (failedCatIdx > 0 ? failedCatIdx - 1 : -1);
        const prevCat = prevCatIdx >= 0 ? categoryRanges[prevCatIdx] : null;
        const determinedWordIdx = prevCat ? prevCat.start + prevCat.count - 1 : -1;
        const detLevel = determinedWordIdx >= 0 ? Math.floor(determinedWordIdx / WORDS_PER_LEVEL) : -1;

        if (detLevel >= 0) {
          store.unlockUpToWithWords(detLevel, WORDS_PER_LEVEL);
        } else {
          store.update({ placementDone: true });
        }

        setDeterminedLevel(detLevel);
        setCurrentCatIdx(failedCatIdx);
        setPhase('result');
        return;
      }

      // Passed this block — reset block counters
      setBlockOk(0);
      setBlockTotal(0);
    }

    if (nextIdx >= qs.length) {
      // Passed everything
      const maxLevel = Math.floor((allWords.length - 1) / WORDS_PER_LEVEL);
      store.unlockUpToWithWords(maxLevel, WORDS_PER_LEVEL);
      setDeterminedLevel(maxLevel);
      setPhase('result');
    } else {
      setCur(nextIdx);
      setSel(null);
    }
  };

  const catName = categoryRanges[q.catIdx]?.name || '';
  const totalQs = qs.length;
  const pct = ((cur + 1) / totalQs) * 100;

  return (
    <div style={S.page} className="anim-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingTop: 8 }}>
        <button style={S.backBtn} onClick={() => { store.update({ placementDone: true }); go('home'); }}>←</button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, flex: 1 }}>🎯 Тест на уровень</div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 600 }}>{cur + 1}/{totalQs}</div>
      </div>

      <div style={S.bar}><div style={{ ...S.barIn, width: `${pct}%` }} /></div>

      <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
        {catName}
      </div>

      <div style={S.score}>
        <span style={{ color: 'var(--green)' }}>✅ {ok}</span>
        <span style={{ color: 'var(--red)' }}>❌ {bad}</span>
      </div>

      <div style={S.questionBox} key={cur} className="glass-card anim-pop">
        <div style={S.enWord}>{q.word.en}</div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 14 }}>Выбери правильный перевод</div>

      <div style={S.opts}>
        {q.options.map((opt, i) => {
          let style = { ...S.opt };
          if (answered) {
            if (opt === q.answer) style = { ...style, ...S.optOk };
            else if (opt === sel) style = { ...style, ...S.optBad };
            else style = { ...style, opacity: 0.35 };
          }
          return (
            <button key={i} style={style} onClick={() => pick(opt)}
              className={answered && opt === sel && opt !== q.answer ? 'anim-shake' : ''}
              onMouseEnter={e => { if (!answered) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; } }}
              onMouseLeave={e => { if (!answered) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; } }}>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <button style={{ ...S.btnPrimary, marginTop: 14, width: '100%' }} onClick={next} className="anim-in">
          Далее →
        </button>
      )}
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' },
  backBtn: { color: 'var(--text-dim)', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  bar: { height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', marginBottom: 14, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' },
  barIn: { height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, var(--blue), var(--accent))', transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)', boxShadow: '0 0 10px rgba(0, 240, 255, 0.6)' },
  score: { display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 20, fontSize: 16, fontWeight: 800 },
  questionBox: { padding: '32px 20px', textAlign: 'center', marginBottom: 16, border: '1px solid rgba(0, 240, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 },
  enWord: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
  opts: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
  opt: { padding: '16px 20px', borderRadius: 'var(--radius)', fontSize: 16, fontWeight: 700, background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', backdropFilter: 'blur(10px)' },
  optOk: { background: 'rgba(0, 255, 135, 0.15)', border: '1px solid var(--green)', color: 'var(--green)', boxShadow: '0 0 15px rgba(0, 255, 135, 0.2)' },
  optBad: { background: 'rgba(255, 51, 102, 0.15)', border: '1px solid var(--red)', color: 'var(--red)', boxShadow: '0 0 15px rgba(255, 51, 102, 0.2)' },
  btnPrimary: { flex: 1, padding: 18, background: 'var(--accent-gradient)', color: 'white', borderRadius: 'var(--radius-pill)', fontSize: 16, fontWeight: 800, boxShadow: '0 8px 24px rgba(0, 85, 255, 0.4)', letterSpacing: 0.5 },
  btnGhost: { flex: 1, padding: 18, background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text)', borderRadius: 'var(--radius-pill)', fontSize: 16, fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' },
  center: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 },
  doneTitle: { fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' },
  dim: { color: 'var(--text-dim)', fontSize: 15, fontWeight: 600 },
};
