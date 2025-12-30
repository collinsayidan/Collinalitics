
// frontend/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Optional: basic CSS reset to ensure visibility (can be removed later)
// import './styles.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  // If index.html is not loading correctly, this will throw an explicit error
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootEl).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
