
// frontend/src/pages/Services.jsx
import { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL } from '../config/seo';
import { fetchServicesPage, fetchService, fetchRelatedServices } from '../api/services';

/* ----------------------- helpers ----------------------- */

// Sanitize icon class from admin
function normalizeIcon(icon) {
  if (!icon) return 'fa-solid fa-layer-group';
  const parts = String(icon).trim().split(/\s+/).filter(p => p.startsWith('fa'));
  return parts.length ? parts.join(' ') : 'fa-solid fa-layer-group';
}

// Money formatting (default GBP)
function money(amount, currency = 'GBP', locale = 'en-GB') {
  if (typeof amount !== 'number') return null;
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
    return `${sym}${amount}`;
  }
}

// Build string like "£500–£1,200 / project" or "From £500 / hour"
function formatPriceRange({ price_min, price_max, price_currency, price_unit }) {
  const c = price_currency || 'GBP';
  const min = typeof price_min === 'number' ? money(price_min, c) : null;
  const max = typeof price_max === 'number' ? money(price_max, c) : null;
  const unit = price_unit ? ` / ${price_unit}` : '';
  if (min && max) return `${min}–${max}${unit}`;
  if (min) return `From ${min}${unit}`;
  if (max) return `Up to ${max}${unit}`;
  return null;
}

/* --------------------- pagination UI -------------------- */

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;
  if (end > totalPages) { end = totalPages; start = Math.max(1, end - maxButtons + 1); }

  const pages = [];
  for (let p = start; p <= end; p += 1) pages.push(p);

  return (
    <nav className="mt-6 flex items-center justify-between">
      <button
        type="button"
        className="btn btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        ← Prev
      </button>

      <div className="flex items-center gap-2">
        {start > 1 && (
          <>
            <button
              type="button"
              className={`px-3 py-1 rounded-md border ${page === 1 ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-500/40 hover:bg-brand-500/5'}`}
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {start > 2 && <span className="text-slate-400">…</span>}
          </>
        )}

        {pages.map(p => (
          <button
            key={p}
            type="button"
            className={`px-3 py-1 rounded-md border ${page === p ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-500/40 hover:bg-brand-500/5'}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-slate-400">…</span>}
            <button
              type="button"
              className={`px-3 py-1 rounded-md border ${page === totalPages ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-white/10 bg-white/5 text-slate-300 hover:border-brand-500/40 hover:bg-brand-500/5'}`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="btn btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Next →
      </button>
    </nav>
  );
}

/* ---------------------- list (index) --------------------- */

function ServiceList() {
  const title = `Services | ${SITE_NAME}`;
  const canonical = `${SITE_URL}/services`;

  const [sp, setSp] = useSearchParams();
  const pageParam = parseInt(sp.get('page') || '1', 10) || 1;

  const [services, setServices] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr(null);
      try {
        const { list, count, page, totalPages } = await fetchServicesPage({ page: pageParam });
        setServices(list);
        setCount(count);
        setPage(page);
        setTotalPages(totalPages);
      } catch (e) {
        setErr(e?.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParam]);

  const onPageChange = (p) => {
    setSp({ page: String(p) }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading
  if (loading) {
    return (
      <>
        <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>

                  {/* HERO skeleton */}
          <section className="py-6 md:py-10">
            <div className="rounded-2xl app-bg-secondary app-border p-6 md:p-10">
              <div className="h-7 w-40 rounded app-bg animate-pulse" />
              <div className="mt-2 h-8 w-2/3 rounded app-bg animate-pulse" />
              <div className="mt-3 h-4 w-3/4 rounded app-bg animate-pulse" />
            </div>
          </section>

            {/* GRID skeleton */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl app-border app-bg-secondary p-4">
              <div className="h-10 w-10 rounded-lg app-bg animate-pulse" />
              <div className="mt-3 h-4 w-2/3 rounded app-bg animate-pulse" />
              <div className="mt-2 h-3 w-1/2 rounded app-bg animate-pulse" />
            </div>
          ))}
        </section>
      </>
    );
  }

  // Error
  if (err) {
    return (
      <>
        <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
        <section className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
          <strong>Error:</strong> {err}
          <div className="mt-1 text-xs text-red-300">
            Ensure Django is running (http://localhost:8000), <code>/api/services/</code> returns JSON,
            and your Vite dev proxy forwards <code>/api</code> to <code>http://127.0.0.1:8000</code>.
          </div>
        </section>
      </>
    );
  }

  // Empty
  if (!services.length) {
    return (
      <>
        <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-black text-white">Services</h1>
          <p className="mt-2 text-slate-300">No services have been published yet. Add services in admin or load fixtures.</p>
        </section>
      </>
    );
  }

  // Success
  return (
    <>
      <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>

      {/* HERO */}
      <section className="py-6 md:py-10">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6 md:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
              <span className="size-2 rounded-full bg-brand-500" /> Collinalitics
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-black text-white tracking-tight">Services</h1>
            <p className="mt-3 text-slate-300 md:text-lg">
              Practical analytics, automation, and data engineering—shipped fast with measurable outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* META */}
      <p className="text-sm text-slate-400">
        Showing <strong className="text-slate-200">{services.length}</strong> of {count} service{count === 1 ? '' : 's'} · page {page} / {totalPages}
      </p>

      {/* GRID */}
      <section className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => {
          const priceText = formatPriceRange({
            price_min: s.price_min,
            price_max: s.price_max,
            price_currency: s.price_currency,
            price_unit: s.price_unit,
          });
          const category = s.category || s.category_name || s.category_slug;

          return (
            <Link
              to={`/services/${s.slug}`}
              key={s.id}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-brand-500/40 hover:bg-brand-500/5 transition"
            >
              <div className="flex items-start gap-3">
                <div className="grid place-items-center size-11 rounded-lg bg-white/10 text-white">
                  <i className={normalizeIcon(s.icon)} aria-hidden="true"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white group-hover:text-brand-500 truncate">{s.title}</h3>
                  {category && (
                    <div className="mt-1 text-xs text-slate-400">{category}</div>
                  )}
                  {s.excerpt && <p className="mt-1 text-sm text-slate-300">{s.excerpt}</p>}
                  {priceText && (
                    <div className="mt-2 text-sm font-semibold text-brand-500">{priceText}</div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}

/* ---------------------- shared: related projects ---------------------- */

function RelatedProjects({ projects }) {
  if (!projects || !projects.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-white">Case studies</h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((p) => (
          <Link
            key={p.id}
            to={p.slug ? `/portfolio/${p.slug}` : '/portfolio'}
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-brand-500/40 hover:bg-brand-500/5 transition block"
          >
            {p.thumbnail_url && (
              <div
                className="h-40 rounded-lg bg-cover bg-center mb-3 border border-white/10"
                style={{ backgroundImage: `url(${p.thumbnail_url})` }}
              />
            )}
            <h3 className="font-bold text-white group-hover:text-brand-500">{p.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------------------------- detail --------------------------- */

function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setService(null); setRelatedServices([]); setErr(null);
    (async () => {
      try {
        const data = await fetchService(slug);
        if (!data) throw new Error('Service not found');
        setService(data);

        const category =
          data.category || data.category_name || data.category_slug || null;

        if (category) {
          const rel = await fetchRelatedServices({
            category,
            excludeSlug: data.slug,
            limit: 3,
          });
          setRelatedServices(rel);
        }
      } catch (e) {
        setErr(e?.message || 'Failed to load service');
      }
    })();
  }, [slug]);

  if (err) {
    return (
      <section className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
        <strong>Error:</strong> {err}
      </section>
    );
  }

  if (!service) {
    return (
      <section>
        {/* Header skeleton */}
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-lg bg-white/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-56 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-72 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
        {/* Body skeleton */}
        <div className="mt-6 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-white/10 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const pageTitle = `${service.title} | Services | ${SITE_NAME}`;
  const description = service.excerpt || `Explore ${service.title} services by ${SITE_NAME}.`;
  const canonical = `${SITE_URL}/services/${service.slug}`;

  const priceText = formatPriceRange({
    price_min: service.price_min,
    price_max: service.price_max,
    price_currency: service.price_currency,
    price_unit: service.price_unit,
  });

  const features = Array.isArray(service.features_list) ? service.features_list : [];
  const tools = Array.isArray(service.tools_list) ? service.tools_list : [];
  const category = service.category || service.category_name || service.category_slug || null;

  const relatedProjects = Array.isArray(service.related_projects)
    ? service.related_projects
    : (Array.isArray(service.projects) ? service.projects : []);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={description} />
      </Helmet>

      <article>
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="grid place-items-center size-14 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-500 text-white">
            <i className={normalizeIcon(service.icon)} aria-hidden="true"></i>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">{service.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              {category && <span className="text-slate-400">Category: <span className="text-slate-200">{category}</span></span>}
              {priceText && <span className="text-brand-500 font-semibold">{priceText}</span>}
            </div>
            {description && <p className="mt-1 text-slate-300">{description}</p>}
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-7">
          {service.description_html ? (
            <div
              className="prose prose-invert max-w-none prose-img:rounded-lg prose-pre:bg-slate-900 prose-code:text-brand-50"
              dangerouslySetInnerHTML={{ __html: service.description_html }}
            />
          ) : service.description ? (
            <div
              className="prose prose-invert max-w-none prose-img:rounded-lg prose-pre:bg-slate-900 prose-code:text-brand-50"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          ) : (
            <div className="text-slate-300">No description available.</div>
          )}
        </div>

        {/* Features */}
        {features.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold text-white">What’s included</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300">
              {features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </section>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold text-white">Tools & technologies</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {tools.map((x, i) => (
                <span key={i} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {x}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn btn-primary px-4 py-2" to="/contact">Start a project</Link>
          <Link className="btn btn-outline px-4 py-2" to="/services">Back to services</Link>
        </div>

        {/* Related services by category */}
        {category && relatedServices.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-white">Related services</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedServices.map((s) => {
                const pText = formatPriceRange({
                  price_min: s.price_min,
                  price_max: s.price_max,
                  price_currency: s.price_currency,
                  price_unit: s.price_unit,
                });
                return (
                  <Link
                    key={s.id}
                    to={`/services/${s.slug}`}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-brand-500/40 hover:bg-brand-500/5 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid place-items-center size-11 rounded-lg bg-white/10 text-white">
                        <i className={normalizeIcon(s.icon)} aria-hidden="true"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white group-hover:text-brand-500 truncate">{s.title}</h3>
                        {pText && <div className="mt-1 text-sm text-brand-500 font-semibold">{pText}</div>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Related case studies */}
        <RelatedProjects projects={relatedProjects} />
      </article>
    </>
  );
}

/* ------------------------- router ------------------------- */

export default function Services() {
  return (
    <Routes>
      <Route index element={<ServiceList />} />
      <Route path=":slug" element={<ServiceDetail />} />
    </Routes>
  );
}
