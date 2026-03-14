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

  const ACH = {
    first_10_words: { n: 'Первые 10 слов', i: '🎓' },
    wizard_50: { n: 'Магистр 50', i: '🪄' },
    streak_7: { n: 'Неделя в огне', i: '🔥' },
    level_10: { n: 'Исследователь', i: '🗺️' },
    hundred_correct: { n: 'Снайпер (100+)', i: '🎯' },
  };

  return (
    <div style={S.page} className="anim-in">
      <div className="app-header">
        <button className="back-btn-round" onClick={() => go('home')}>✕</button>
        <div className="header-title">Профиль</div>
      </div>

      <div style={S.content}>
        <div className="glass-card" style={S.card}>
          <div style={S.label}>ЛИЧНЫЕ ДАННЫЕ</div>
          
          <div style={S.field}>
            <label style={S.fLabel}>Твое имя</label>
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

        <div className="glass-card" style={S.card}>
          <div style={S.label}>ДОСТИЖЕНИЯ ({data.achievements?.length || 0})</div>
          <div style={S.achGrid}>
            {Object.entries(ACH).map(([id, info]) => {
              const earned = data.achievements?.some(a => a.id === id);
              return (
                <div key={id} style={{ ...S.achItem, filter: earned ? 'none' : 'grayscale(1)' }}>
                  <div style={S.achIcon}>{info.i}</div>
                  <div style={S.achName}>{info.n}</div>
                  {!earned && <div style={{ fontSize: 9, opacity: 0.5 }}>В процессе</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 'auto', padding: 20 }}>
          <button style={S.logoutBtn} onClick={logout}>Выйти из аккаунта</button>
          <div style={S.version}>VocabFlame v2.0.0</div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--brand-gray)', display: 'flex', flexDirection: 'column' },
  content: { padding: 20, flex: 1, display: 'flex', flexDirection: 'column' },
  card: { padding: 24, marginBottom: 20 },
  label: { fontSize: 13, color: 'var(--brand-purple)', fontWeight: 800, letterSpacing: 1, marginBottom: 20, textTransform: 'uppercase' },
  field: { marginBottom: 20 },
  fLabel: { display: 'block', fontSize: 13, color: 'var(--text-dim)', fontWeight: 700, marginBottom: 8 },
  input: { width: '100%', padding: '16px', background: 'var(--brand-gray)', border: '1px solid var(--brand-gray-dark)', borderRadius: 16, fontSize: 16, fontWeight: 700, color: 'var(--text)' },
  msg: { textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 20 },
  achGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  achItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  achIcon: { fontSize: 32, marginBottom: 8 },
  achName: { fontSize: 10, fontWeight: 800, color: 'var(--text-dim)' },
  logoutBtn: { width: '100%', padding: '16px', background: 'none', border: '2px solid var(--brand-gray-dark)', borderRadius: 16, color: 'var(--red)', fontWeight: 800, cursor: 'pointer', marginBottom: 12 },
  version: { textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }
};
