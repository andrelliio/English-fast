import { useState, useEffect } from 'react';
import { useStorage } from './hooks/useStorage';
import Auth from './components/Auth';
import Home from './components/Home';
import Levels from './components/Levels';
import Cards from './components/Cards';
import Quiz from './components/Quiz';
import Review from './components/Review';

export default function App() {
  const store = useStorage();
  const [screen, setScreen] = useState('home');
  const [level, setLevel] = useState(0);

  useEffect(() => { if (store.isLoggedIn) store.checkStreak(); }, []);

  if (!store.isLoggedIn) return <Auth onRegister={store.register} />;

  const go = (s, lvl) => { setScreen(s); if (lvl !== undefined) setLevel(lvl); };

  const props = { store, go, level };
  switch (screen) {
    case 'levels': return <Levels {...props} />;
    case 'cards': return <Cards {...props} />;
    case 'quiz': return <Quiz {...props} />;
    case 'review': return <Review {...props} />;
    default: return <Home {...props} />;
  }
}
