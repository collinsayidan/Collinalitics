
// frontend/src/pages/Portfolio.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchProjects } from '../api/projects';
import { SITE_NAME, SITE_URL } from '../config/seo';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

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

  const title = `Portfolio | ${SITE_NAME}`;
  const canonical = `${SITE_URL}/portfolio`;

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

  if (err) {
    return (
      <>
        <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
        <section className="container">
          <h1 className="page-title">Portfolio</h1>
          <div className="alert error">
            <strong>Error:</strong> {err}
            <div className="tips">
              Make sure Django is running (http://localhost:8000) and Vite proxy forwards <code>/api</code> to it.
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!projects.length) {
    return (
      <>
        <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
        <section className="container">
          <h1 className="page-title">Portfolio</h1>
          <p>No projects have been published yet. Add some in the admin.</p>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet><title>{title}</title><link rel="canonical" href={canonical} /></Helmet>
      <section className="container">
        <h1 className="page-title">Portfolio</h1>
        <div className="grid">
          {projects.map(p => (
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
