import { useState } from 'react';
import { auth } from '../utils/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';

export default function Auth({ store }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Email states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        // 1. Update Firebase Profile
        await updateProfile(cred.user, { displayName: name });
        // 2. Explicitly update store so the name shows up everywhere immediately
        if (store) store.update({ username: name });
        // 3. Send verification
        await sendEmailVerification(cred.user);
        setMsg('Письмо для подтверждения отправлено! Проверь почту 📧');
      }
    } catch (error) {
      setErr(error.message.includes('auth/user-not-found') ? 'Пользователь не найден' : 
             error.message.includes('auth/wrong-password') ? 'Неверный пароль' : 
             error.message.includes('auth/email-already-in-use') ? 'Email уже занят' : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.wrap} className="anim-in">
      <div style={S.card} className="glass-card anim-up">
        <div style={S.fire}>🗣️</div>
        <h1 style={S.title}>Говорю свободно</h1>
        
        <form onSubmit={handleEmailAuth} style={{ width: '100%' }}>
          {err && <div style={S.err}>{err}</div>}
          {msg && <div style={S.msg}>{msg}</div>}
          {!isLogin && <input style={S.input} placeholder="Как тебя зовут?" value={name} onChange={e => setName(e.target.value)} required />}
          <input style={S.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={S.input} type="password" placeholder="Пароль" value={pass} onChange={e => setPass(e.target.value)} required />
          <button className="btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Секунду...' : isLogin ? 'Войти 🚀' : 'Регистрация ✨'}
          </button>
          <p style={S.toggle} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
          </p>
        </form>
      </div>
    </div>
  );
}

const S = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1, position: 'relative' },
  card: { padding: '48px 32px', maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  fire: { fontSize: 64, animation: 'fireGlow 2s ease-in-out infinite', display: 'inline-block', marginBottom: 10, filter: 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.4))' },
  title: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 24, letterSpacing: 1, textTransform: 'uppercase' },
  input: { width: '100%', padding: '16px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 16, marginBottom: 16, transition: 'all 0.2s', backdropFilter: 'blur(10px)', fontWeight: 600 },
  err: { color: 'var(--red)', fontSize: 14, marginBottom: 12, fontWeight: 700, textAlign: 'center' },
  msg: { color: 'var(--yellow)', fontSize: 14, marginBottom: 12, fontWeight: 700, textAlign: 'center', background: 'rgba(255, 191, 0, 0.1)', padding: '10px', borderRadius: 10 },
  toggle: { color: 'var(--text-dim)', fontSize: 13, marginTop: 16, cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' },
};
