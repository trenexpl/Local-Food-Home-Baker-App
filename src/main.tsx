// Ensure window.fetch has a setter to prevent errors in browser sandbox / polyfills
if (typeof window !== 'undefined') {
  try {
    const origFetch = window.fetch;
    let customFetch = origFetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get: () => customFetch || origFetch,
      set: (fn) => {
        customFetch = fn;
      },
    });
  } catch {
    // Ignore if not configurable
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './context/AppContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);

