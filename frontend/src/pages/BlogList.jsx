
// frontend/src/pages/BlogList.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPostsPage } from '../api/blog';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

// Format ISO-ish date to "15 Dec 2025"
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso || '';
  }
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const maxButtons = 5; // window size
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

export default function BlogList() {
  const title = `Blog | ${SITE_NAME}`;
  const description =
    'Articles on data analytics, automation, dashboards, and practical workflows for growing businesses.';
  const canonical = `${SITE_URL}/blog`;

  // URL params: page, q (search), tag (optional)
  const [sp, setSp] = useSearchParams();
  const pageParam = parseInt(sp.get('page') || '1', 10) || 1;
  const qParam = sp.get('q') || '';
  const tagParam = sp.get('tag') || '';

  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Fetch whenever page/q/tag change
  useEffect(() => {
    (async () => {
      setLoading(true); setErr(null);
      try {
        const { list, count, page, totalPages } = await fetchPostsPage({
          page: pageParam,
          ...(qParam ? { q: qParam } : {}),
          ...(tagParam ? { tag: tagParam } : {}),
        });
        setPosts(list);
        setCount(count);
        setPage(page);
        setTotalPages(totalPages);
      } catch (e) {
        console.error('Blog list fetch error:', e);
        setErr(e?.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParam, qParam, tagParam]);

  // Handlers keep URL in sync
  const setParams = (next) => setSp(next, { replace: true });
  const handleSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = String(form.get('q') || '').trim();
    setParams({
      ...(q ? { q } : {}),
      ...(tagParam ? { tag: tagParam } : {}),
      page: '1', // reset page on new search
    });
  };
  const handleTag = (t) => {
    const next = (tagParam.toLowerCase() === t.toLowerCase()) ? '' : t;
    setParams({
      ...(qParam ? { q: qParam } : {}),
      ...(next ? { tag: next } : {}),
      page: '1',
    });
  };
  const handlePageChange = (p) => {
    setParams({
      ...(qParam ? { q: qParam } : {}),
      ...(tagParam ? { tag: tagParam } : {}),
      page: String(p),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Placeholder tag suggestions (replace with real facet tags if API supports)
  const suggestedTags = useMemo(() => {
    const pool = new Set();
    posts.forEach(p => (Array.isArray(p.tags_list) ? p.tags_list : []).forEach(t => pool.add(t)));
    return Array.from(pool).slice(0, 8);
  }, [posts]);

  // SKELETON
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonical} />
          <meta name="description" content={description} />
          <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        </Helmet>

        <section className="py-6 md:py-10">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6 md:p-10">
            <div className="h-7 w-48 rounded bg-white/10 animate-pulse" />
            <div className="mt-2 h-8 w-2/3 rounded bg-white/10 animate-pulse" />
            <div className="mt-3 h-4 w-3/4 rounded bg-white/10 animate-pulse" />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="h-16 w-40 rounded bg-white/10 animate-pulse" />
                <div className="mt-3 h-4 w-2/3 rounded bg-white/10 animate-pulse" />
                <div className="mt-2 h-4 w-1/2 rounded bg-white/10 animate-pulse" />
                <div className="mt-4 h-8 w-28 rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  // ERROR
  if (err) {
    return (
      <>
        <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
        <section>
          <h1 className="text-2xl font-black text-white">Blog</h1>
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
            <strong>Error:</strong> {err}
            <div className="mt-1 text-xs text-red-300">
              Check your blog API endpoints and CORS/CSRF settings, then retry.
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>

     
    {/* HERO */}
    <section className="py-6 md:py-10">
    <div className="rounded-2xl app-bg-secondary app-border p-6 md:p-10">
        <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full app-bg app-border px-3 py-1 text-xs app-text-muted">
            <span className="size-2 rounded-full bg-brand-500" /> Collinalitics Blog
        </span>

        <h1 className="mt-3 text-3xl md:text-5xl font-black text-[var(--app-text)] tracking-tight">
            Practical insights &amp; playbooks
        </h1>

        <p className="mt-3 app-text-muted md:text-lg">
            {description}
        </p>

        {/* Search + Suggested tags */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-wrap gap-3">
            <input
            name="q"
            defaultValue={qParam}
            placeholder="Search articles..."
            className="flex-1 min-w-[220px] rounded-md app-border app-bg text-[var(--app-text)] px-3 py-2 focus:outline-none focus:border-brand-500"
            />

            <button type="submit" className="btn btn-primary px-4 py-2">
            Search
            </button>

            {suggestedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {suggestedTags.map((t) => {
                const active = tagParam && t.toLowerCase() === tagParam.toLowerCase();
                return (
                    <button
                    key={t}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs border transition
                        ${
                        active
                            ? 'border-brand-500 bg-brand-500/10 text-brand-500'
                            : 'app-border app-bg app-text-muted hover:border-brand-500/40 hover:bg-brand-500/5'
                        }`}
                    onClick={() => handleTag(t)}
                    title={`Filter by tag: ${t}`}
                    >
                    {t}
                    </button>

                    );
                  })}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* META */}
      <p className="text-sm text-slate-400">
        Showing <strong className="text-slate-200">{posts.length}</strong> of {count} article{count === 1 ? '' : 's'} · page {page} / {totalPages}
        {qParam && <> · query: <code className="text-slate-300">{qParam}</code></>}
        {tagParam && <> · tag: <code className="text-slate-300">{tagParam}</code></>}
      </p>

      {/* GRID */}
      <section className="mt-4">
        {posts.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-white/5 p-4 text-slate-300">
            No articles match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <article
                key={post.slug || post.id}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-brand-500/40 hover:bg-brand-500/5 transition flex flex-col"
              >
                <header className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-white group-hover:text-brand-500">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.date && <small className="block text-slate-400 mt-1">{formatDate(post.date)}</small>}
                  </div>

                  {/* Optional tag chip */}
                  {Array.isArray(post.tags_list) && post.tags_list[0] && (
                    <span className="shrink-0 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-slate-300">
                      {post.tags_list[0]}
                    </span>
                  )}
                </header>

                <p className="mt-3 text-sm text-slate-300 flex-1">{post.excerpt || post.summary}</p>

                <div className="mt-4">
                  <Link
                    className="text-brand-500 font-semibold hover:underline underline-offset-4"
                    to={`/blog/${post.slug}`}
                  >
                    Read article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </section>
    </>
  );
}
