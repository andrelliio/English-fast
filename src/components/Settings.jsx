import { useState } from 'react';
import { updateProfile } from 'firebase/auth';

export default function Settings({ store, go }) {
  const { data, update, logout, user } = store;
  const [name, setName] = useState(data.username || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMsg('');
    try {
      if (user) {
        await updateProfile(user, { displayName: name });
      }
      update({ username: name });
      setMsg('Настройки сохранены! ✨');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg('Ошибка при сохранении ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page} className="anim-in">
      <div style={S.header}>
        <button style={S.back} onClick={() => go('home')}>← Назад</button>
        <h1 style={S.title}>Настройки</h1>
      </div>

      <div className="glass-card" style={S.card}>
        <div style={S.label}>ВАШ ПРОФИЛЬ</div>
        
        <div style={S.field}>
          <label style={S.fLabel}>Имя отображения</label>
          <input 
            style={S.input} 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Как тебя зовут?"
          />
        </div>

        {msg && <div style={S.msg}>{msg}</div>}

        <button 
          className="btn-primary btn-full" 
          onClick={handleSave} 
          disabled={loading || !name.trim() || name === data.username}
        >
          {loading ? 'Сохраняем...' : 'Сохранить изменения'}
        </button>
      </div>

      <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
        <button 
          style={S.logoutBtn} 
          onClick={() => { if (confirm('Выйти из аккаунта?')) logout(); }}
        >
          Выйти из аккаунта ⏻
        </button>
        <div style={S.version}>VocabFlame v1.0.0</div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', padding: 20, maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' },
  header: { display: 'flex', alignItems: 'center', marginBottom: 32, paddingTop: 8 },
  back: { background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, fontSize: 16, cursor: 'pointer', padding: 0, marginRight: 20 },
  title: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, margin: 0 },
  
  card: { padding: 24, marginBottom: 24 },
  label: { fontSize: 12, color: 'var(--accent)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 20, textTransform: 'uppercase' },
  
  field: { marginBottom: 24 },
  fLabel: { display: 'block', fontSize: 13, color: 'var(--text-dim)', fontWeight: 700, marginBottom: 8, marginLeft: 4 },
  input: { width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 600 },
  
  msg: { textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 20, background: 'rgba(0,184,148,0.1)', padding: '10px', borderRadius: 10 },
  
  logoutBtn: { width: '100%', padding: '16px', background: 'rgba(255, 60, 60, 0.1)', border: '1px solid rgba(255, 60, 60, 0.2)', borderRadius: 12, color: '#ff4d4d', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 16, transition: '0.2s' },
  version: { textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }
};
