import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  window.onerror = function (msg) {
    if (typeof msg === 'string' && (msg === 'Script error.' || msg.includes('Script error'))) {
      return true;
    }
    return false;
  };

  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.' || event.message?.includes('Script error')) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && (event.reason.message === 'Script error.' || String(event.reason).includes('Script error'))) {
      event.preventDefault();
    }
  });
}

const container = document.getElementById('root')!;

const appElement = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, appElement);
} else {
  createRoot(container).render(appElement);
}



