import { useState, useEffect } from 'react';
import { useStorage } from './hooks/useStorage';
import Auth from './components/Auth';
import Home from './components/Home';
import Levels from './components/Levels';
import Cards from './components/Cards';
import Quiz from './components/Quiz';
import Review from './components/Review';
import LevelExam from './components/LevelExam';
import Onboarding from './components/Onboarding';
import Settings from './components/Settings';
import GrammarTrainer from './components/GrammarTrainer';
import { auth } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const store = useStorage();
  const { 
    user, data, initialized, setUser, update, 
    isLoggedIn, isLoaded, isAuthUnknown
  } = store;

  const [screen, setScreen] = useState('home');
  const [level, setLevel] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Auth listener - only run once
  useEffect(() => {
    console.log("App: Setting up auth listener...");
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("App: Auth state changed ->", u ? `User: ${u.email}` : "No user");
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [setUser]);

  // 2. Sync Firebase name with local DB
  useEffect(() => {
    try {
      if (user && data?.username !== undefined) {
        const firebaseName = user.displayName;
        const currentName = data.username;
        
        const fallback = user.email || user.phoneNumber || 'User';
        const finalName = firebaseName || currentName || fallback;

        if (currentName !== finalName) {
          update({ username: finalName });
        }
      }
    } catch (err) {
      console.error("Sync effect error:", err);
    }
  }, [user, data?.username, update]);

  // 3. Apply theme to body
  useEffect(() => {
    const theme = data?.currentTheme || 'default';
    const body = document.body;
    body.className = body.className.replace(/\btheme-\S+/g, '');
    if (theme !== 'default') {
      body.classList.add(`theme-${theme}`);
    }
  }, [data?.currentTheme]);

  // Wait for critical initialization
  if (loading || !initialized || isAuthUnknown) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontWeight: 600 }}>
        Загрузка...
      </div>
    );
  }

  // Wait for initial data load from Firestore if user exists
  if (user && !isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontWeight: 600 }}>
        Синхронизация...
      </div>
    );
  }

  // 1. Show onboarding first if not done
  if (!data?.onboardingDone) {
    return <Onboarding store={store} />;
  }

  // 2. Then show auth/registration if not logged in
  if (!isLoggedIn) {
    return <Auth store={store} />;
  }

  const go = (s, lvl) => { setScreen(s); if (lvl !== undefined) setLevel(lvl); };

  const props = { store, go, level };
  switch (screen) {
    case 'levels': return <Levels {...props} />;
    case 'cards': return <Cards {...props} />;
    case 'quiz': return <Quiz {...props} />;
    case 'review': return <Review {...props} />;
    case 'levelExam': return <LevelExam {...props} />;
    case 'settings': return <Settings {...props} />;
    case 'grammarTrainer': return <GrammarTrainer {...props} />;
    default: return <Home {...props} />;
  }
}
