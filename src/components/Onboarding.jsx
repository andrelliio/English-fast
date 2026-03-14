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
            <div key={i} style={{ ...S.dot, background: i === step ? 'var(--brand-purple)' : 'var(--brand-gray-dark)' }} />
          ))}
        </div>

        <button className="btn-primary btn-full" onClick={next}>
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
  page: { minHeight: '100vh', background: 'var(--brand-gray)', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { padding: '48px 24px', textAlign: 'center', maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
  icon: { fontSize: 80, marginBottom: 24, filter: 'drop-shadow(0 10px 20px rgba(106, 90, 224, 0.2))' },
  title: { fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 16 },
  desc: { fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.6, fontWeight: 600, marginBottom: 32 },
  dots: { display: 'flex', gap: 10, marginBottom: 32 },
  dot: { width: 12, height: 12, borderRadius: 6, transition: 'background 0.3s' },
};
