/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Offline Field Operations Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[ResQNet AI] Offline PWA Service Worker Registered:', registration.scope);
      })
      .catch((err) => {
        console.warn('[ResQNet AI] Service Worker registration skipped:', err);
      });
  });
}

