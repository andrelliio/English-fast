import { useState, useEffect } from 'react';
import { useStorage } from './hooks/useStorage';
import Auth from './components/Auth';
import Home from './components/Home';
import Levels from './components/Levels';
import Cards from './components/Cards';
import Quiz from './components/Quiz';
import Review from './components/Review';
import LevelExam from './components/LevelExam';
import PlacementTest from './components/PlacementTest';
import Onboarding from './components/Onboarding';

export default function App() {
  const store = useStorage();
  const [screen, setScreen] = useState('home');
  const [level, setLevel] = useState(0);

  useEffect(() => { if (store.isLoggedIn) store.checkStreak(); }, [store.isLoggedIn]);

  // 1. Show onboarding first if not done
  if (!store.data.onboardingDone) {
    return <Onboarding store={store} />;
  }

  // 2. Then show auth/registration if not logged in
  if (!store.isLoggedIn) {
    return <Auth onRegister={store.register} />;
  }

  // After registration, if placement not done, offer it
  if (!store.data.placementDone && screen === 'home') {
    // Show home normally — placement test is offered as a button on Home
  }

  const go = (s, lvl) => { setScreen(s); if (lvl !== undefined) setLevel(lvl); };

  const props = { store, go, level };
  switch (screen) {
    case 'levels': return <Levels {...props} />;
    case 'cards': return <Cards {...props} />;
    case 'quiz': return <Quiz {...props} />;
    case 'review': return <Review {...props} />;
    case 'levelExam': return <LevelExam {...props} />;
    case 'placement': return <PlacementTest {...props} />;
    default: return <Home {...props} />;
  }
}
