
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
    // include cookies if you later rely on CSRF/cookie-based auth
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
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

  // Skeletons while loading
  const cardsSkeleton = (
    <div className="grid">
      {[...Array(3)].map((_, i) => (
        <div className="card skeleton" key={i}>
          <div className="icon-skeleton" />
          <div className="lines">
            <div className="line" />
            <div className="line short" />
          </div>
        </div>
      ))}
    </div>
  );

  const cardsContent = (
    <div className="grid">
      {items.map(s => (
        <Link to={`/services/${s.slug}`} key={s.id} className="card">
          <div className="icon-bubble">
            <i className={normalizeIcon(s.icon)} aria-hidden="true"></i>
          </div>
          <div className="card-body">
            <h3 className="card-title">{s.title}</h3>
            <p className="card-excerpt">{s.excerpt}</p>
            <div className="card-cta">View details →</div>
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

      <section className="container">
        <h1 className="page-title">Data insights that move businesses</h1>
        <p>{description}</p>

        <div className="cta-row" style={{ margin: '12px 0 22px' }}>
          <Link className="btn primary" to="/portfolio">View Projects</Link>
          <Link className="btn primary" to="/contact" style={{ marginLeft: 8 }}>Start a project</Link>
        </div>

        <h2 className="section-title">Top services</h2>

        {err ? (
          <div className="alert error">
            <strong>Error:</strong> {err}
            <div className="tips">
              In production, ensure <code>VITE_API_BASE_URL</code> is set to <code>https://collinalitics-backend-cj2b.onrender.com/api</code> in Netlify,
              and redeploy with <em>Clear cache and deploy site</em>.
            </div>
          </div>
        ) : (loading ? cardsSkeleton : cardsContent)}
      </section>
    </>
  );
}
