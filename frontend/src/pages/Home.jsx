// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

const isProd = import.meta.env.MODE === 'production';
const API_BASE = isProd ? import.meta.env.VITE_API_BASE_URL : '/api';

// Fetch services for homepage
async function fetchServicesHome() {
  const url = `${API_BASE}/services/`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to load services (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];
}

// Icon sanitizer
function normalizeIcon(icon) {
  if (!icon) return 'fa-solid fa-layer-group';
  const parts = String(icon).trim().split(/\s+/).filter((p) => p.startsWith('fa'));
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
        const sorted = [...all].sort(
          (a, b) => a.order - b.order || a.title.localeCompare(b.title)
        );
        setItems(sorted.slice(0, 3));
      } catch (e) {
        console.error('Home services fetch error:', e);
        setErr(e?.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const title = `Data insights that move businesses | ${SITE_NAME}`;
  const description =
    'Empower your organization with actionable insights and drive growth through data-driven decision making.';
  const canonical = `${SITE_URL}/`;

  // Skeleton cards
  const cardsSkeleton = (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-xl app-border app-bg-secondary animate-pulse"
        />
      ))}
    </div>
  );

  // Loaded cards
  const cardsContent = (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((s) => (
        <Link
          to={`/services/${s.slug}`}
          key={s.id}
          className="group rounded-xl app-border app-bg-secondary p-4 hover:border-brand-500/40 hover:bg-brand-500/5 transition"
        >
          <div className="flex items-start gap-3">
            <div className="grid place-items-center size-11 rounded-lg app-bg text-[var(--app-text)]">
              <i className={normalizeIcon(s.icon)} aria-hidden="true"></i>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-[var(--app-text)] group-hover:text-brand-500">
                {s.title}
              </h3>
              <p className="mt-1 text-sm app-text-muted">{s.excerpt}</p>
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

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
          })}
        </script>
      </Helmet>

      {/* HERO */}
      <section className="py-6 md:py-10">
        <div className="rounded-2xl app-bg-secondary app-border p-6 md:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full app-bg app-border px-3 py-1 text-xs app-text-muted">
              <span className="size-2 rounded-full bg-brand-500" /> Collinalitics
            </span>

            <h1 className="mt-3 text-3xl md:text-5xl font-black text-[var(--app-text)] tracking-tight">
              Data insights that{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400">
                move businesses
              </span>
            </h1>

            <p className="mt-3 app-text-muted md:text-lg">{description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/portfolio" className="btn btn-primary btn-md">
                View Projects
              </Link>
              <Link to="/contact" className="btn btn-outline btn-md">
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TOP SERVICES */}
      <section className="mt-6">
        <h2 className="text-xl font-bold text-[var(--app-text)]">Top services</h2>

        {err ? (
          <div className="mt-3 rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-700">
            <strong>Error:</strong> {err}
            <div className="mt-1 text-xs text-red-600">
              In production, ensure <code>VITE_API_BASE_URL</code> is set correctly.
            </div>
          </div>
        ) : loading ? (
          cardsSkeleton
        ) : (
          cardsContent
        )}
      </section>
    </>
  );
}
