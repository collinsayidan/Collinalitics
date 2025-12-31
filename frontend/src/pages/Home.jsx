
// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

// Decide the API base depending on environment.
// In production (Netlify), it reads VITE_API_BASE_URL (e.g., https://.../api).
// In local dev, it uses Vite proxy at /api.
const isProd = import.meta.env.MODE === 'production';
const API_BASE = isProd
  ? import.meta.env.VITE_API_BASE_URL   // e.g., https://collinalitics-backend-cj2b.onrender.com/api
  : '/api';                             // dev proxy to localhost:8000

// Helper to fetch services (supports paginated or flat DRF responses)
async function fetchServicesHome() {
  const url = `${API_BASE}/services/`;  // resolves to /api/services/ in dev and https://.../api/services/ in prod
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to load services (${res.status}): ${text || res.statusText}`);
  }
  const data = await res.json();

  // If paginated, use data.results; if array, use data; else empty
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
      ? data.results
      : [];

  return items;
}

// Reuse icon sanitizer from Services page
function normalizeIcon(icon) {
  if (!icon) return 'fa-solid fa-layer-group';
  const parts = String(icon).trim().split(/\s+/).filter(p => p.startsWith('fa'));
  return parts.length ? parts.join(' ') : 'fa-solid fa-layer-group';
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchServicesHome();
        // Sort by 'order' (lowest first), then title
        const sorted = [...all].sort(
          (a, b) => (a.order - b.order) || a.title.localeCompare(b.title)
        );
        setItems(sorted.slice(0, 3)); // top 3
      } catch (e) {
        console.error('Home services fetch error:', e);
        setErr(e?.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const title = `Data insights that move businesses | ${SITE_NAME}`;
  const description = 'Empower your organization with actionable insights and drive growth through data-driven decision making.';
  const canonical = `${SITE_URL}/`;

  // Skeletons while loading (Tailwind)
  const cardsSkeleton = (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-28 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
      ))}
    </div>
  );

  const cardsContent = (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(s => (
        <Link
          to={`/services/${s.slug}`}
          key={s.id}
          className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:border-brand-500/40 hover:bg-brand-500/5 transition"
        >
          <div className="flex items-start gap-3">
            <div className="grid place-items-center size-11 rounded-lg bg-white/10 text-white">
              <i className={normalizeIcon(s.icon)} aria-hidden="true"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white group-hover:text-brand-500">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{s.excerpt}</p>
              <div className="mt-2 text-brand-500 font-semibold">View details →</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={description} />
        {/* Open Graph / Twitter */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        {/* Organization JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL
          })}
        </script>
      </Helmet>

      {/* HERO */}
      <section className="py-6 md:py-10">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6 md:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
              <span className="size-2 rounded-full bg-brand-500" /> Collinalitics
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-black text-white tracking-tight">
              Data insights that <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400">move businesses</span>
            </h1>
            <p className="mt-3 text-slate-300 md:text-lg">{description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/portfolio" className="btn btn-primary px-4 py-2">View Projects</Link>
              <Link to="/contact" className="btn btn-outline px-4 py-2">Start a project</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top services */}
      <section className="mt-6">
        <h2 className="text-xl font-bold text-white">Top services</h2>

        {err ? (
          <div className="mt-3 rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-200">
            <strong className="font-semibold">Error:</strong> {err}
            <div className="mt-1 text-xs text-red-300">
              In production, ensure <code>VITE_API_BASE_URL</code> is set to <code>https://collinalitics-backend-cj2b.onrender.com/api</code> in Netlify,
              and redeploy with <em>Clear cache and deploy site</em>.
            </div>
          </div>
        ) : (loading ? cardsSkeleton : cardsContent)}
      </section>
    </>
  );
}
