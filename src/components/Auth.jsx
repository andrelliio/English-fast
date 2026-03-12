import { useState } from 'react';

export default function Auth({ onRegister }) {
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const t = name.trim();
    if (t.length < 2) { setErr('Минимум 2 символа'); return; }
    onRegister(t);
  };

  return (
    <div style={S.wrap} className="anim-in">
      <div style={S.card} className="glass-card anim-up">
        <div style={S.fire}>🔥</div>
        <h1 style={S.title}>VocabFlame</h1>
        <p style={S.sub}>Учи английские фразы с карточками, тестами и повторениями</p>
        <form onSubmit={submit} style={{ width: '100%' }}>
          {err && <div style={S.err}>{err}</div>}
          <input style={S.input} placeholder="Как тебя зовут?" value={name}
            onChange={e => { setName(e.target.value); setErr(''); }} maxLength={20} autoFocus
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
          <button className="btn-primary btn-full" type="submit">Начать обучение 🚀</button>
        </form>
        <div style={S.features}>
          {['📚 Карточки', '✅ Тесты', '🔄 Повторение', '🔥 Стрик'].map(f =>
            <span key={f} style={S.feat}>{f}</span>
          )}
        </div>
      </div>
    </div>
  );
}

const S = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1, position: 'relative' },
  card: { padding: '48px 32px', maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  fire: { fontSize: 64, animation: 'fireGlow 2s ease-in-out infinite', display: 'inline-block', marginBottom: 10, filter: 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.4))' },
  title: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' },
  sub: { color: 'var(--text-dim)', fontSize: 15, marginBottom: 32, lineHeight: 1.5, fontWeight: 600 },
  input: { width: '100%', padding: '16px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 16, marginBottom: 16, transition: 'all 0.2s', backdropFilter: 'blur(10px)', fontWeight: 600 },
  err: { color: 'var(--red)', fontSize: 14, marginBottom: 12, fontWeight: 700 },
  features: { display: 'flex', gap: 10, marginTop: 32, justifyContent: 'center', flexWrap: 'wrap' },
  feat: { fontSize: 12, color: 'var(--text-dim)', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: 600 },
};
