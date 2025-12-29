
// frontend/src/pages/Portfolio.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchProjects } from '../api/projects';
import { SITE_NAME, SITE_URL } from '../config/seo';

function uniqueSorted(arr) {
  return Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function FilterBar({
  tags, industries, statuses,
  tag, industry, status,
  onTagToggle, onIndustryChange, onStatusChange, onClear
}) {
  return (
    <div className="filters">
      <div className="filters-row">
        <div className="filters-group">
          <div className="filters-label">Tags</div>
          <div className="chip-row">
            {tags.map(t => (
              <button
                key={t}
                type="button"
                className={`chip ${tag && t.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
                onClick={() => onTagToggle(t)}
                title={`Filter by tag: ${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="filters-group">
          <div className="filters-label">Industry</div>
          <select
            className="select"
            value={industry}
            onChange={e => onIndustryChange(e.target.value)}
          >
            <option value="">All industries</option>
            {industries.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="filters-group">
          <div className="filters-label">Status</div>
          <select
            className="select"
            value={status}
            onChange={e => onStatusChange(e.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters-row">
        <button type="button" className="btn outline" onClick={onClear}>
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

  // URL <-> state bindings
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get('tag') || '';
  const industry = searchParams.get('industry') || '';
  const status = searchParams.get('status') || '';

  // Fetch all projects once
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (e) {
        setErr(e?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build facet choices from the data
  const facets = useMemo(() => {
    const tagSet = new Set();
    const industrySet = new Set();
    const statusSet = new Set();

    projects.forEach(p => {
      // tags_list is provided by your ProjectSerializer
      (p.tags_list || []).forEach(t => tagSet.add(t));
      if (p.industry) industrySet.add(p.industry);
      if (p.status) statusSet.add(p.status);
    });

    return {
      tags: uniqueSorted([...tagSet]),
      industries: uniqueSorted([...industrySet]),
      statuses: uniqueSorted([...statusSet]),
    };
  }, [projects]);

  // Apply filters (client‑side)
  const filtered = useMemo(() => {
    const t = tag.trim().toLowerCase();
    const ind = industry.trim().toLowerCase();
    const sts = status.trim().toLowerCase();

    return projects.filter(p => {
      const tagsOk = !t || (p.tags_list || []).some(x => (x || '').toLowerCase() === t);
      const industryOk = !ind || (p.industry || '').toLowerCase() === ind;
      const statusOk = !sts || (p.status || '').toLowerCase() === sts;
      return tagsOk && industryOk && statusOk;
    });
  }, [projects, tag, industry, status]);

  // Handlers update URL params (keeps filters shareable/bookmarkable)
  const setParams = (next) => setSearchParams(next, { replace: true });

  const handleTagToggle = (t) => {
    if (!t) return;
    const current = tag || '';
    const next = (current.toLowerCase() === t.toLowerCase()) ? '' : t;
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

  // Loading skeletons
  if (loading) {
    return (
      <>
        <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
        <section className="container">
          <h1 className="page-title">Portfolio</h1>
          <div className="grid">
            {[...Array(6)].map((_, i) => (
              <div className="card skeleton" key={i}>
                <div className="projects thumb" />
                <div className="lines">
                  <div className="line" />
                  <div className="line short" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  // Error state
  if (err) {
    return (
      <>
        <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
        <section className="container">
          <h1 className="page-title">Portfolio</h1>
          <div className="alert error">
            <strong>Error:</strong> {err}
            <div className="tips">
              Ensure Django is running at http://localhost:8000 and the Vite proxy forwards <code>/api</code> to it.
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>

      <section className="container">
        <h1 className="page-title">Portfolio</h1>

        {/* Filters */}
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

        {/* Result count */}
        <p style={{ color: 'var(--muted)', margin: '-4px 0 12px' }}>
          Showing <strong>{filtered.length}</strong> of {projects.length} case {projects.length === 1 ? 'study' : 'studies'}
          {tag ? <> · tag: <code>{tag}</code></> : null}
          {industry ? <> · industry: <code>{industry}</code></> : null}
          {status ? <> · status: <code>{status}</code></> : null}
        </p>

        {/* Empty state */}
        {!filtered.length && (
          <div className="alert error">
            <strong>No results.</strong> Try clearing or changing filters.
          </div>
        )}

        {/* Cards */}
        <div className="grid">
          {filtered.map(p => (
            <Link
              to={p.slug ? `/portfolio/${p.slug}` : '/portfolio'}
              key={p.id}
              className="card project"
            >
              <div
                className="thumb"
                style={{ backgroundImage: p.thumbnail_url ? `url(${p.thumbnail_url})` : undefined }}
              />
              <div className="card-body">
                <h3 className="card-title">{p.title}</h3>
                {p.summary && <p className="card-excerpt">{p.summary}</p>}
                <div className="card-cta">View case study →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
