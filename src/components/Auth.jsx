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
    <div style={S.wrap}>
      <div style={S.card} className="anim-up">
        <div style={S.fire}>🔥</div>
        <h1 style={S.title}>VocabFlame</h1>
        <p style={S.sub}>Учи английские слова с карточками, тестами и повторениями</p>
        <form onSubmit={submit}>
          {err && <div style={S.err}>{err}</div>}
          <input style={S.input} placeholder="Как тебя зовут?" value={name}
            onChange={e => { setName(e.target.value); setErr(''); }} maxLength={20} autoFocus
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--text-muted)'} />
          <button style={S.btn} type="submit">Начать 🚀</button>
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
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '44px 36px', maxWidth: 400, width: '100%', textAlign: 'center', border: '1px solid #ffffff08', boxShadow: '0 20px 60px #00000066' },
  fire: { fontSize: 56, animation: 'fireGlow 2s ease-in-out infinite', display: 'inline-block', marginBottom: 4 },
  title: { fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, background: 'linear-gradient(135deg, var(--accent), var(--yellow))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 },
  sub: { color: 'var(--text-dim)', fontSize: 14, marginBottom: 28, lineHeight: 1.5 },
  input: { width: '100%', padding: '13px 16px', background: 'var(--bg-elevated)', border: '2px solid var(--text-muted)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 16, marginBottom: 14, transition: 'border-color 0.2s' },
  btn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, var(--accent), #ff8c5a)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 16, fontWeight: 700, boxShadow: '0 4px 20px var(--accent-glow)' },
  err: { color: 'var(--red)', fontSize: 13, marginBottom: 10 },
  features: { display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' },
  feat: { fontSize: 12, color: 'var(--text-dim)', background: 'var(--bg-elevated)', padding: '5px 10px', borderRadius: 20 },
};
