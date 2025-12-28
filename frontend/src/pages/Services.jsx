
import { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL } from '../config/seo';
import { fetchServices, fetchService } from '../api/services';

// Helper: sanitize icon class values coming from admin
function normalizeIcon(icon) {
  if (!icon) return 'fa-solid fa-layer-group';
  // Keep only classes that start with "fa"
  const parts = String(icon)
    .trim()
    .split(/\s+/)
    .filter(p => p.startsWith('fa'));
  return parts.length ? parts.join(' ') : 'fa-solid fa-layer-group';
}

function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchServices(); // returns array (mapped from data.results)
        setServices(data);
      } catch (e) {
        setErr(e?.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const title = `Services | ${SITE_NAME}`;
  const canonical = `${SITE_URL}/services`;

  // --- Loading skeletons (LIST) ---
  if (loading) return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="container">
        <h1 className="page-title">Services</h1>
        <div className="grid">
          {[...Array(6)].map((_, i) => (
            <div className="card skeleton" key={i}>
              <div className="icon-skeleton" />
              <div className="lines">
                <div className="line" />
                <div className="line short" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // --- Error state ---
  if (err) return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="container">
        <div className="alert error">
          <strong>Error:</strong> {err}
          <div className="tips">
            Ensure Django is running (http://localhost:8000), <code>/api/services/</code> returns JSON,
            and the Vite proxy is set to forward <code>/api</code> to <code>http://127.0.0.1:8000</code>.
          </div>
        </div>
      </div>
    </>
  );

  // --- Empty state ---
  if (!services.length) return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="container">
        <h1 className="page-title">Services</h1>
        <p>No services have been published yet. Add services in admin or load fixtures.</p>
      </div>
    </>
  );

  // --- Success state (LIST) ---
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="container">
        <h1 className="page-title">Services</h1>
        <div className="grid">
          {services.map(s => (
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
      </div>
    </>
  );
}

// Related projects (case studies) on the detail page
function RelatedProjects({ projects }) {
  if (!projects || projects.length === 0) return null;
  return (
    <section className="container">
      <h2 className="section-title">Case studies</h2>
      <div className="grid projects">
        {projects.map(p => (
          <Link
            key={p.id}
            to={p.slug ? `/portfolio/${p.slug}` : '/portfolio'}
            className="card project"
          >
            <div
              className="thumb"
              style={{ backgroundImage: p.thumbnail_url ? `url(${p.thumbnail_url})` : undefined }}
            />
            <div className="card-body">
              <h3 className="card-title">{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setService(null);
    setErr(null);
    (async () => {
      try {
        const data = await fetchService(slug);
        setService(data);
      } catch (e) {
        setErr(e?.message || 'Failed to load service');
      }
    })();
  }, [slug]);

  // --- Error state (DETAIL) ---
  if (err) return <div className="container alert error">Error: {err}</div>;

  // --- Loading skeletons (DETAIL) ---
  if (!service) return (
    <div className="container">
      {/* Header skeleton */}
      <div className="detail-header skeleton" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="icon-skeleton" style={{ width: 58, height: 58 }} />
        <div style={{ flex: 1, display: 'grid', gap: '8px' }}>
          <div className="block lg" />
          <div className="block md" />
        </div>
      </div>

      {/* Body skeleton */}
      <div className="detail-content skeleton" style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
        <div className="block" />
        <div className="block md" />
        <div className="block sm" />
        <div className="block md" />
        <div className="block" />
      </div>

      {/* Features skeleton */}
      <section className="feature-list skeleton" style={{ marginTop: '20px' }}>
        <div className="block md" style={{ marginBottom: '10px' }} />
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '8px' }}>
          <li><div className="block sm" style={{ width: '60%' }} /></li>
          <li><div className="block sm" style={{ width: '50%' }} /></li>
          <li><div className="block sm" style={{ width: '70%' }} /></li>
        </ul>
      </section>

      {/* CTA skeleton */}
      <div className="cta-row skeleton" style={{ marginTop: '16px' }}>
        <div className="block" style={{ width: 180, height: 40, borderRadius: 10 }} />
      </div>
    </div>
  );

  // --- Success state (DETAIL) ---
  const title = `${service.title} | Services | ${SITE_NAME}`;
  const description = service.excerpt || `Explore ${service.title} services by ${SITE_NAME}.`;
  const canonical = `${SITE_URL}/services/${service.slug}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
      </Helmet>

      <article className="container detail">
        <div className="detail-header">
          <div className="icon-bubble lg">
            <i className={normalizeIcon(service.icon)} aria-hidden="true"></i>
          </div>
          <div>
            <h1 className="detail-title">{service.title}</h1>
            <p className="detail-excerpt">{description}</p>
          </div>
        </div>

        <div className="detail-content" dangerouslySetInnerHTML={{ __html: service.description }} />

        {service.features?.length > 0 && (
          <section className="feature-list">
            <h2 className="section-title">What’s included</h2>
            <ul>
              {service.features.map(f => (
                <li key={f.id}>
                  <i className="fa-solid fa-check-circle"></i> {f.label}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="cta-row">
          <Link className="btn primary" to="/contact">Request this service</Link>
        </div>

        <RelatedProjects projects={service.projects} />
      </article>
    </>
  );
}

export default function Services() {
  return (
    <section className="services">
      <Routes>
        <Route path="/" element={<ServiceList />} />
        <Route path=":slug" element={<ServiceDetail />} />
      </Routes>
    </section>
  );
}
