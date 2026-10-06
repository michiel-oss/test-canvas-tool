import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from './Canvas';
import { LoginScreen } from './LoginScreen';
import { type Copy, defaultCopy, defaultTheme, type Theme } from './theme';
import './styles.css';

function usePersisted<T extends object>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function App() {
  const route = useHashRoute();
  const [theme, setTheme] = usePersisted<Theme>('login.theme', defaultTheme);
  const [copy, setCopy] = usePersisted<Copy>('login.copy', defaultCopy);

  if (route === '#/canvas') {
    return <Canvas theme={theme} copy={copy} setTheme={setTheme} setCopy={setCopy} />;
  }
  return (
    <div className="live">
      <LoginScreen theme={theme} copy={copy} />
      <a className="canvas-fab" href="#/canvas">
        Open canvas
      </a>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
