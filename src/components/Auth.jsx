import { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendEmailVerification
} from 'firebase/auth';

export default function Auth() {
  const [method, setMethod] = useState('phone'); // 'phone' or 'email'
  const [isLogin, setIsLogin] = useState(true);
  
  // Email states
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  
  // Phone states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (method === 'phone' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  }, [method]);

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

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmResult(confirmation);
    } catch (error) {
      setErr('Ошибка при отправке SMS: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await confirmResult.confirm(otp);
    } catch (error) {
      setErr('Неверный код');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.wrap} className="anim-in">
      <div id="recaptcha-container"></div>
      <div style={S.card} className="glass-card anim-up">
        <div style={S.fire}>🔥</div>
        <h1 style={S.title}>VocabFlame</h1>
        
        <div style={S.tabs}>
          <button style={method === 'phone' ? S.tabActive : S.tab} onClick={() => { setMethod('phone'); setErr(''); }}>Телефон</button>
          <button style={method === 'email' ? S.tabActive : S.tab} onClick={() => { setMethod('email'); setErr(''); }}>Почта</button>
        </div>

        {method === 'email' ? (
          <form onSubmit={handleEmailAuth} style={{ width: '100%' }}>
            {err && <div style={S.err}>{err}</div>}
            <input style={S.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input style={S.input} type="password" placeholder="Пароль" value={pass} onChange={e => setPass(e.target.value)} required />
            <button className="btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Секунду...' : isLogin ? 'Войти 🚀' : 'Регистрация ✨'}
            </button>
            <p style={S.toggle} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
            </p>
          </form>
        ) : !confirmResult ? (
          <form onSubmit={handlePhoneSubmit} style={{ width: '100%' }}>
            {err && <div style={S.err}>{err}</div>}
            <input style={S.input} type="tel" placeholder="+79991234567" value={phone} onChange={e => setPhone(e.target.value)} required />
            <button className="btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Отправляем...' : 'Получить код 📩'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} style={{ width: '100%' }}>
            {err && <div style={S.err}>{err}</div>}
            <input style={S.input} placeholder="Код из SMS" value={otp} onChange={e => setOtp(e.target.value)} required />
            <button className="btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? 'Проверяем...' : 'Подтвердить ✅'}
            </button>
            <p style={S.toggle} onClick={() => setConfirmResult(null)}>Изменить номер</p>
          </form>
        )}
      </div>
    </div>
  );
}

const S = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1, position: 'relative' },
  card: { padding: '48px 32px', maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  fire: { fontSize: 64, animation: 'fireGlow 2s ease-in-out infinite', display: 'inline-block', marginBottom: 10, filter: 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.4))' },
  title: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 24, letterSpacing: 1, textTransform: 'uppercase' },
  tabs: { display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 24, width: '100%' },
  tab: { flex: 1, padding: '10px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', borderRadius: 10, fontSize: 14, fontWeight: 600, transition: '0.2s' },
  tabActive: { flex: 1, padding: '10px', background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: 10, fontSize: 14, fontWeight: 700, boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)' },
  input: { width: '100%', padding: '16px 20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 16, marginBottom: 16, transition: 'all 0.2s', backdropFilter: 'blur(10px)', fontWeight: 600 },
  err: { color: 'var(--red)', fontSize: 14, marginBottom: 12, fontWeight: 700, textAlign: 'center' },
  toggle: { color: 'var(--text-dim)', fontSize: 13, marginTop: 16, cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' },
};
