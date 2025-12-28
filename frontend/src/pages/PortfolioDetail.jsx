
// frontend/src/pages/PortfolioDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchProject } from '../api/projects';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

export default function PortfolioDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setProject(null);
    setErr(null);
    (async () => {
      try {
        const data = await fetchProject(slug);
        setProject(data);
      } catch (e) {
        setErr(e?.message || 'Failed to load project');
      }
    })();
  }, [slug]);

  if (err) {
    return (
      <section className="container">
        <div className="alert error">
          <strong>Error:</strong> {err}
        </div>
      </section>
    );
  }

  // Skeleton while loading
  if (!project) {
    return (
      <section className="container">
        <div className="detail-header skeleton row-gap-14">
          <div className="icon-skeleton icon-skeleton-lg" aria-hidden="true" />
          <div className="stack-8 flex-1">
            <div className="block lg" />
            <div className="block md" />
          </div>
        </div>
        <div className="detail-content skeleton stack-10 mt-16">
          <div className="block" />
          <div className="block md" />
          <div className="block sm" />
          <div className="block md" />
          <div className="block" />
        </div>
      </section>
    );
  }

  const title = `${project.title} | Portfolio | ${SITE_NAME}`;
  const canonical = `${SITE_URL}/portfolio/${project.slug || ''}`;
  const ogImage = project.thumbnail_url || DEFAULT_OG_IMAGE;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={project.summary || project.title} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={project.summary || project.title} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={project.summary || project.title} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <article className="container detail">
        <div className="detail-header">
          <div className="icon-bubble lg">
            <i className="fa-solid fa-briefcase" aria-hidden="true"></i>
          </div>
          <div>
            <h1 className="detail-title">{project.title}</h1>
            {project.summary && <p className="detail-excerpt">{project.summary}</p>}
          </div>
        </div>

        {/* Optional hero image */}
        {project.thumbnail_url && (
          <div
            className="thumb"
            style={{
              backgroundImage: `url(${project.thumbnail_url})`,
              height: 220,
              marginTop: 12
            }}
          />
        )}

        {/* Body content (if you add rich fields later) */}
        <div className="detail-content" style={{ marginTop: 16 }}>
          <p>
            This is a placeholder detail view. You can extend the Project model with richer fields
            (e.g., goals, outcomes, tech stack, gallery) and render them here.
          </p>
        </div>

        <div className="cta-row" style={{ marginTop: 12 }}>
          <Link className="btn primary" to="/contact">Discuss a similar project</Link>
          <Link className="btn primary" to="/portfolio" style={{ marginLeft: 8 }}>Back to portfolio</Link>
        </div>
      </article>
    </>
  );
}
