
// frontend/src/lib/apiBase.js

// Decide the API base depending on environment.
// In production (Netlify), read VITE_API_BASE_URL (e.g. https://.../api)
// In local dev, use Vite proxy at /api
export const isProd = import.meta.env.MODE === 'production';
export const API_BASE = isProd
  ? import.meta.env.VITE_API_BASE_URL     // set in Netlify env to: https://collinalitics-backend-cj2b.onrender.com/api
  : '/api';                               // dev proxy: forwarded to localhost:8000 by Vite
