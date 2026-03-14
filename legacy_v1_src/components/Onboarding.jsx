import { useState } from 'react';

export default function Onboarding({ store }) {
  const [step, setStep] = useState(0);

  const complete = () => {
    store.update({ onboardingDone: true });
  };

  const next = () => {
    if (step < slides.length - 1) setStep(s => s + 1);
    else complete();
  };

  const s = slides[step];

  return (
    <div style={S.page} className="anim-in">
      <div style={S.card} className="glass-card">
        <div style={S.icon}>{s.icon}</div>
        <h1 style={S.title}>{s.title}</h1>
        <p style={S.desc}>{s.desc}</p>

        <div style={S.dots}>
          {slides.map((_, i) => (
            <div key={i} style={{ ...S.dot, background: i === step ? 'var(--accent)' : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>

        <button style={S.btn} onClick={next}>
          {step === slides.length - 1 ? 'Погнали! 🚀' : 'Дальше'}
        </button>
      </div>
    </div>
  );
}

const slides = [
  {
    icon: '👋',
    title: 'Добро пожаловать!',
    desc: 'Твоя цель — заговорить на английском свободно. Мы отказались от скучной зубрежки слов в пользу Языковых Островов 🏝️'
  },
  {
    icon: '🏝️',
    title: 'Языковые Острова',
    desc: 'Остров — это мини-словарь для ситуаций. Именно благодаря этому методу полиглоты осваивают языки за считанные месяцы, уча готовые фразы вместо отдельных слов.'
  },
  {
    icon: '🧠',
    title: 'Как это работает',
    desc: 'Учи карточки 🃏, сдавай тесты ⚡ и открывай новые острова. Система сама подбросит фразы из старых тем для идеального запоминания 🔄'
  }
];

const S = {
  page: { minHeight: '100vh', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' },
  card: { padding: '40px 24px', textAlign: 'center', maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 },
  icon: { fontSize: 64, filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.4))', marginBottom: 10 },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))' },
  desc: { fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.5, fontWeight: 600, maxWidth: 320, minHeight: 70 },
  dots: { display: 'flex', gap: 8, marginTop: 10, marginBottom: 20 },
  dot: { width: 10, height: 10, borderRadius: 5, transition: 'background 0.3s' },
  btn: { width: '100%', padding: 18, background: 'var(--accent-gradient)', color: 'white', borderRadius: 'var(--radius-pill)', fontSize: 16, fontWeight: 800, boxShadow: '0 8px 24px rgba(0, 85, 255, 0.4)', letterSpacing: 0.5 },
};
