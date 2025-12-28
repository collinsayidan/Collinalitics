
import { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL } from '../config/seo';
import { fetchServices, fetchService } from '../api/services';

// A small helper in case some admin icon fields include stray text:
function normalizeIcon(icon) {
  if (!icon) return 'fa-solid fa-layer-group';
  // Keep only known FA classes (fa-, fas, far, fab, etc.)
  const parts = icon.split(' ').filter(p => p.startsWith('fa'));
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
  const description = 'Dashboards, automation, and advisory services to drive data-led growth.';
  const canonical = `${SITE_URL}/services`;

  if (loading) return (
    <>
      <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
      <div className="container">
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

  if (err) return (
    <>
      <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
      <div className="container">
        <div className="alert error">
          <strong>Error:</strong> {err}
          <div className="tips">
            Ensure Django is running (http://localhost:8000), /api/services/ returns JSON, and vite proxy is set.
          </div>
        </div>
      </div>
    </>
  );

  if (!services.length) return (
    <>
      <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
      <div className="container">
        <h1 className="page-title">Services</h1>
        <p>No services have been published yet. Add services in admin or load fixtures.</p>
      </div>
    </>
  );

  return (
    <>
      <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
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

function RelatedProjects({ projects }) {
  if (!projects || projects.length === 0) return null;
  return (
    <section className="container">
      <h2 className="section-title">Case studies</h2>
      <div className="grid projects">
        {projects.map(p => (
          <Link key={p.id} to={p.slug ? `/portfolio/${p.slug}` : '/portfolio'} className="card project">
            <div className="thumb" style={{backgroundImage: p.thumbnail_url ? `url(${p.thumbnail_url})` : undefined}} />
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

  if (err) return <div className="container alert error">Error: {err}</div>;
  if (!service) return <div className="container">Loading…</div>;

  const title = `${service.title} | Services | ${SITE_NAME}`;
  const description = service.excerpt || `Explore ${service.title} services by ${SITE_NAME}.`;
  const canonical = `${SITE_URL}/services/${service.slug}`;

  return (
    <>
      <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
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
              {service.features.map(f => <li key={f.id}><i className="fa-solid fa-check-circle"></i> {f.label}</li>)}
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
