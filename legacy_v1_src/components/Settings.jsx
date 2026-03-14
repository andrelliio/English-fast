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

  const THEMES = {
    default: { n: 'Стандарт', i: '🌌', c: '#00F0FF', l: 1 },
    dark: { n: 'Тень', i: '🌑', c: '#BB86FC', l: 5 },
    steel: { n: 'Сталь', i: '💿', c: '#E0E0E0', l: 10 },
    emerald: { n: 'Изумруд', i: '🌿', c: '#00FF87', l: 15 },
    neon: { n: 'Неон', i: '⚡', c: '#FF00FF', l: 20 },
    sunset: { n: 'Закат', i: '🌅', c: '#FF4E50', l: 25 },
    ocean: { n: 'Океан', i: '🌊', c: '#00B4DB', l: 30 },
    gold: { n: 'Золото', i: '🏆', c: '#FFD700', l: 35 },
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

      {/* Theme Selection Section */}
      <div className="glass-card" style={S.card}>
        <div style={S.label}>ОФОРМЛЕНИЕ</div>
        <div style={S.themeGrid}>
          {Object.entries(THEMES).map(([id, info]) => {
            const unlocked = data.unlockedThemes?.includes(id);
            const active = data.currentTheme === id;
            return (
              <div 
                key={id} 
                style={{ 
                  ...S.themeItem, 
                  opacity: unlocked ? 1 : 0.3,
                  border: active ? `2px solid \${info.c}` : '2px solid transparent',
                  background: active ? 'rgba(255,255,255,0.05)' : 'none'
                }}
                onClick={() => unlocked && update({ currentTheme: id })}
              >
                <div style={{ ...S.themeIcon, color: info.c }}>{info.i}</div>
                <div style={S.themeName}>{info.n}</div>
                {!unlocked && <div style={S.lockTip}>Lvl {info.l}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="glass-card" style={S.card}>
        <div style={S.label}>ДОСТИЖЕНИЯ ({data.achievements?.length || 0})</div>
        <div style={S.achGrid}>
          {Object.entries(ACH).map(([id, info]) => {
            const earnedAt = data.achievements?.find(a => a.id === id)?.date;
            return (
              <div key={id} style={{ ...S.achItem, opacity: earnedAt ? 1 : 0.2, filter: earnedAt ? 'none' : 'grayscale(1)' }}>
                <div style={S.achIcon}>{info.i}</div>
                <div style={S.achName}>{info.n}</div>
                {earnedAt && <div style={S.achDate}>{earnedAt}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card" style={{ ...S.card, borderColor: 'rgba(255, 60, 60, 0.2)' }}>
        <div style={{ ...S.label, color: '#ff4d4d' }}>ОПАСНАЯ ЗОНА</div>
        <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 16 }}>Это удалит весь ваш прогресс, уровни и достижения. Это действие нельзя отменить.</p>
        <button 
          style={{ ...S.logoutBtn, marginBottom: 0, background: 'rgba(255, 60, 60, 0.2)', color: '#ff4d4d', borderColor: '#ff4d4d' }}
          onClick={() => { store.resetProgress(); go('home'); }}
        >
          Сбросить весь прогресс ⚠️
        </button>
      </div>

      <div style={{ marginTop: 'auto', paddingBottom: 20 }}>
        <button 
          style={S.logoutBtn} 
          onClick={() => { logout(); }}
        >
          Выйти из аккаунта ⏻
        </button>
        <div style={S.version}>Говорю свободно v1.0.5</div>
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
  
  achGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 },
  achItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: '0.3s' },
  achIcon: { fontSize: 32, marginBottom: 8, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' },
  achName: { fontSize: 10, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, textTransform: 'uppercase' },
  achDate: { fontSize: 8, color: 'var(--text-dim)', marginTop: 4 },

  logoutBtn: { width: '100%', padding: '16px', background: 'rgba(255, 60, 60, 0.1)', border: '1px solid rgba(255, 60, 60, 0.2)', borderRadius: 12, color: '#ff4d4d', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 16, transition: '0.2s' },
  version: { textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 },

  themeGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 },
  themeItem: { padding: '12px 8px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: '0.2s' },
  themeIcon: { fontSize: 24, marginBottom: 8 },
  themeName: { fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 },
  lockTip: { fontSize: 8, color: 'var(--yellow)', marginTop: 4, fontWeight: 900 }
};
