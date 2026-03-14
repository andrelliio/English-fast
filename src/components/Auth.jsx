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
        await updateProfile(cred.user, { displayName: name });
        if (store) store.update({ username: name });
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
      <div style={S.card} className="glass-card">
        <div style={S.logo}>🔥</div>
        <h1 style={S.title}>VocabFlame</h1>
        <p style={S.subtitle}>{isLogin ? 'С возвращением!' : 'Начни свой путь сегодня'}</p>
        
        <form onSubmit={handleEmailAuth} style={{ width: '100%' }}>
          {err && <div style={S.err}>{err}</div>}
          {msg && <div style={S.msg}>{msg}</div>}
          
          {!isLogin && (
            <div style={S.field}>
              <label style={S.label}>Имя</label>
              <input style={S.input} placeholder="Как тебя зовут?" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          
          <div style={S.field}>
            <label style={S.label}>Электронная почта</label>
            <input style={S.input} type="email" placeholder="example@mail.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <div style={S.field}>
            <label style={S.label}>Пароль</label>
            <input style={S.input} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} required />
          </div>

          <button className="btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Секунду...' : isLogin ? 'Войти' : 'Создать аккаунт'}
          </button>
          
          <p style={S.toggle} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Еще нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </p>
        </form>
      </div>
    </div>
  );
}

const S = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-gray)', padding: 20 },
  card: { padding: '48px 32px', maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
  logo: { fontSize: 64, marginBottom: 16, filter: 'drop-shadow(0 10px 20px rgba(106, 90, 224, 0.2))' },
  title: { fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 8, color: 'var(--brand-purple)' },
  subtitle: { fontSize: 16, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 32 },
  field: { width: '100%', marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 8, marginLeft: 4 },
  input: { width: '100%', padding: '16px', background: 'var(--brand-gray)', border: '1px solid var(--brand-gray-dark)', borderRadius: 16, fontSize: 16, fontWeight: 700, color: 'var(--text)' },
  err: { color: 'var(--red)', fontSize: 14, marginBottom: 16, fontWeight: 700, textAlign: 'center' },
  msg: { color: 'var(--green)', fontSize: 14, marginBottom: 16, fontWeight: 700, textAlign: 'center' },
  toggle: { color: 'var(--brand-purple)', fontSize: 14, marginTop: 20, cursor: 'pointer', fontWeight: 800, textAlign: 'center', width: '100%' },
};
