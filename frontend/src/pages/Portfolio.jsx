// frontend/src/pages/Portfolio.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchProjects } from '../api/projects';
import { SITE_NAME, SITE_URL } from '../config/seo';

function uniqueSorted(arr) {
  return Array.from(new Set(arr.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

function FilterBar({
  tags,
  industries,
  statuses,
  tag,
  industry,
  status,
  onTagToggle,
  onIndustryChange,
  onStatusChange,
  onClear,
}) {
  return (
    <div className="mt-4 rounded-2xl app-border app-bg-secondary p-4">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Tags */}
        <div>
          <div className="text-xs app-text-muted mb-1">Tags</div>
          <div className="flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <span className="app-text-muted text-sm">No tags found</span>
            ) : (
              tags.map((t) => {
                const active = tag && t.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={t}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs border transition ${
                      active
                        ? 'border-brand-500 bg-brand-500/10 text-brand-500'
                        : 'app-border app-bg text-[var(--app-text)] hover:border-brand-500/40 hover:bg-brand-500/5'
                    }`}
                    onClick={() => onTagToggle(t)}
                  >
                    {t}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Industry */}
        <div>
          <div className="text-xs app-text-muted mb-1">Industry</div>
          <select
            className="w-full rounded-md app-border app-bg text-[var(--app-text)] px-3 py-2 focus:outline-none focus:border-brand-500"
            value={industry}
            onChange={(e) => onIndustryChange(e.target.value)}
          >
            <option value="">All industries</option>
            {industries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <div className="text-xs app-text-muted mb-1">Status</div>
          <select
            className="w-full rounded-md app-border app-bg text-[var(--app-text)] px-3 py-2 focus:outline-none focus:border-brand-500"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <button type="button" className="btn btn-outline btn-sm" onClick={onClear}>
          Clear filters
        </button>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get('tag') || '';
  const industry = searchParams.get('industry') || '';
  const status = searchParams.get('status') || '';

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (e) {
        console.error('Portfolio fetch error:', e);
        setErr(e?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const facets = useMemo(() => {
    const tagSet = new Set();
    const industrySet = new Set();
    const statusSet = new Set();

    projects.forEach((p) => {
      (p.tags_list || []).forEach((t) => tagSet.add(t));
      if (p.industry) industrySet.add(p.industry);
      if (p.status) statusSet.add(p.status);
    });

    return {
      tags: uniqueSorted([...tagSet]),
      industries: uniqueSorted([...industrySet]),
      statuses: uniqueSorted([...statusSet]),
    };
  }, [projects]);

  const filtered = useMemo(() => {
    const t = tag.trim().toLowerCase();
    const ind = industry.trim().toLowerCase();
    const sts = status.trim().toLowerCase();

    return projects.filter((p) => {
      const tagsOk =
        !t || (p.tags_list || []).some((x) => (x || '').toLowerCase() === t);
      const industryOk = !ind || (p.industry || '').toLowerCase() === ind;
      const statusOk = !sts || (p.status || '').toLowerCase() === sts;
      return tagsOk && industryOk && statusOk;
    });
  }, [projects, tag, industry, status]);

  const setParams = (next) => setSearchParams(next, { replace: true });

  const handleTagToggle = (t) => {
    if (!t) return;
    const current = tag || '';
    const next = current.toLowerCase() === t.toLowerCase() ? '' : t;
    setParams({
      ...(industry ? { industry } : {}),
      ...(status ? { status } : {}),
      ...(next ? { tag: next } : {}),
    });
  };

  const handleIndustryChange = (val) => {
    setParams({
      ...(tag ? { tag } : {}),
      ...(status ? { status } : {}),
      ...(val ? { industry: val } : {}),
    });
  };

  const handleStatusChange = (val) => {
    setParams({
      ...(tag ? { tag } : {}),
      ...(industry ? { industry } : {}),
      ...(val ? { status: val } : {}),
    });
  };

  const handleClear = () => setParams({});

  const title = `Portfolio | ${SITE_NAME}`;
  const canonical = `${SITE_URL}/portfolio`;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonical} />
        </Helmet>

        <section>
          <h1 className="text-2xl font-black text-[var(--app-text)]">Portfolio</h1>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl app-border app-bg-secondary p-4"
              >
                <div className="h-40 rounded-lg app-bg animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-2/3 rounded app-bg animate-pulse" />
                  <div className="h-3 w-1/2 rounded app-bg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  if (err) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonical} />
        </Helmet>

        <section>
          <h1 className="text-2xl font-black text-[var(--app-text)]">Portfolio</h1>

          <div className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-700">
            <strong>Error:</strong> {err}
            <div className="mt-1 text-xs text-red-600">
              Ensure Django is running at <code>http://localhost:8000</code>.
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
      </Helmet>

      <section>
        <h1 className="text-2xl font-black text-[var(--app-text)]">Portfolio</h1>

        <FilterBar
          tags={facets.tags}
          industries={facets.industries}
          statuses={facets.statuses}
          tag={tag}
          industry={industry}
          status={status}
          onTagToggle={handleTagToggle}
          onIndustryChange={handleIndustryChange}
          onStatusChange={handleStatusChange}
          onClear={handleClear}
        />

        <p className="mt-2 text-sm app-text-muted">
          Showing{' '}
          <strong className="text-[var(--app-text)]">{filtered.length}</strong> of{' '}
          {projects.length} case {projects.length === 1 ? 'study' : 'studies'}
          {tag && (
            <>
              {' '}
              · tag: <code className="text-[var(--app-text)]">{tag}</code>
            </>
          )}
          {industry && (
            <>
              {' '}
              · industry:{' '}
              <code className="text-[var(--app-text)]">{industry}</code>
            </>
          )}
          {status && (
            <>
              {' '}
              · status:{' '}
              <code className="text-[var(--app-text)]">{status}</code>
            </>
          )}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/portfolio/${p.slug}`}
              className="group rounded-2xl app-border app-bg-secondary p-4 hover:border-brand-500/40 hover:bg-brand-500/5 transition block"
            >
              {p.thumbnail_url && (
                <div
                  className="h-40 rounded-lg bg-cover bg-center mb-3 app-border"
                  style={{ backgroundImage: `url(${p.thumbnail_url})` }}
                />
              )}

              <h3 className="font-bold text-[var(--app-text)] group-hover:text-brand-500">
                {p.title}
              </h3>

              {p.summary && (
                <p className="mt-1 text-sm app-text-muted">{p.summary}</p>
              )}

              <div className="mt-2 text-brand-500 font-semibold">
                View case study →
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-md app-border app-bg-secondary p-4 app-text-muted">
            No projects match your filters.
            <button
              type="button"
              className="ml-2 btn btn-outline btn-sm"
              onClick={handleClear}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
