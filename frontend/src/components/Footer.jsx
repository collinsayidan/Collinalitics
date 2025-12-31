
// frontend/src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  const isProd = import.meta.env.MODE === 'production';
  const apiBase = isProd ? import.meta.env.VITE_API_BASE_URL : '/api';

  return (
    <footer style={{
      marginTop: 24,
      padding: '8px 12px',
      borderTop: '1px solid #eee',
      fontSize: 12,
      color: '#555',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>© {new Date().getFullYear()} Collinalitics</span>

      {/* Debug widget (remove when you’re done) */}
      <span style={{ opacity: 0.7 }}>
        ENV: <code>{isProd ? 'production' : 'development'}</code>{' '}
        | API: <code>{apiBase}</code>
      </span>
    </footer>
  );
}