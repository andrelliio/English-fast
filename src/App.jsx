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
import { auth } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const store = useStorage();
  const [screen, setScreen] = useState('home');
  const [level, setLevel] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      store.setUser(user);
      setLoading(false);
      if (user) {
        const displayName = user.displayName || user.email || user.phoneNumber || 'User';
        if (store.data.username !== displayName) {
          store.update({ username: displayName });
        }
      }
    });
    return unsub;
  }, []);

  useEffect(() => { if (store.isLoggedIn) store.checkStreak(); }, [store.isLoggedIn]);

  if (loading) return null; // Or a spinner

  // 1. Show onboarding first if not done
  if (!store.data.onboardingDone) {
    return <Onboarding store={store} />;
  }

  // 2. Then show auth/registration if not logged in
  if (!store.isLoggedIn) {
    return <Auth onRegister={store.register} />;
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
    default: return <Home {...props} />;
  }
}
