
// frontend/src/pages/PortfolioDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchProject } from '../api/projects';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section style={{ marginTop: 18 }}>
      <h2 className="section-title">{title}</h2>
      <div className="detail-content">{children}</div>
    </section>
  );
}

// Helpers to sanitize and render lists
function sanitizeChip(text) {
  if (!text) return '';
  return String(text).replace(/^[\-\s]+/, '').trim();
}
function splitLinesToList(text) {
  if (!text) return null;
  const items = String(text)
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.replace(/^[\-\•\u2022]\s*/, '')); // strip leading -, •, bullets
  if (!items.length) return null;
  return (
    <ul className="kv" style={{ listStyle: 'disc', paddingLeft: 20 }}>
      {items.map((line, i) => <li key={i}>{line}</li>)}
    </ul>
  );
}

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
  const ogImage = project.hero_image_url || project.thumbnail_url || DEFAULT_OG_IMAGE;

  const hasOverview =
    project.client_name || project.industry || project.location;
  const hasTimeline =
    project.start_date || project.end_date || project.status;

  // Sanitize chips
  const tags = Array.isArray(project.tags_list) ? project.tags_list.map(sanitizeChip).filter(Boolean) : [];
  const tools = Array.isArray(project.tools_list) ? project.tools_list.map(sanitizeChip).filter(Boolean) : [];

  return (
    <>
      {/* DEBUG banner - remove later */}
      <div style={{ background: '#102a43', color: '#cde9ff', padding: 10, border: '1px solid #274868', marginBottom: 10 }}>
        <strong>DEBUG:</strong> PortfolioDetail route matched.
        <span style={{ marginLeft: 8 }}>Slug:</span>
        <code style={{ marginLeft: 6 }}>{slug}</code>
      </div>

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
        {/* Header */}
        <div className="detail-header">
          <div className="icon-bubble lg">
            <i className="fa-solid fa-briefcase" aria-hidden="true"></i>
          </div>
          <div>
            <h1 className="detail-title">{project.title}</h1>
            {project.summary && <p className="detail-excerpt">{project.summary}</p>}
            {tags.length > 0 && (
              <div className="chip-row mt-16">
                {tags.map((t, i) => <span className="chip" key={i}>{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Hero image */}
        {(project.hero_image_url || project.thumbnail_url) && (
          <div
            className="thumb"
            style={{
              backgroundImage: `url(${project.hero_image_url || project.thumbnail_url})`,
              height: 240, marginTop: 14
            }}
          />
        )}

        {/* Overview */}
        {hasOverview && (
          <Section title="Overview">
            <ul className="kv">
              {project.client_name && <li><strong>Client:</strong> {project.client_name}</li>}
              {project.industry && <li><strong>Industry:</strong> {project.industry}</li>}
              {project.location && <li><strong>Location:</strong> {project.location}</li>}
            </ul>
          </Section>
        )}

        {/* Timeline & Status */}
        {hasTimeline && (
          <Section title="Timeline">
            <ul className="kv">
              {project.start_date && <li><strong>Start:</strong> {project.start_date}</li>}
              {project.end_date && <li><strong>End:</strong> {project.end_date}</li>}
              {project.status && <li><strong>Status:</strong> {project.status}</li>}
            </ul>
          </Section>
        )}

        {/* Narrative sections as bullet lists */}
        {splitLinesToList(project.goals) && (
          <Section title="Goals">
            {splitLinesToList(project.goals)}
          </Section>
        )}
        {splitLinesToList(project.approach) && (
          <Section title="Approach">
            {splitLinesToList(project.approach)}
          </Section>
        )}
        {splitLinesToList(project.outcomes) && (
          <Section title="Outcomes">
            {splitLinesToList(project.outcomes)}
          </Section>
        )}
        {splitLinesToList(project.metrics) && (
          <Section title="Key metrics">
            {splitLinesToList(project.metrics)}
          </Section>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <Section title="Tools & technologies">
            <div className="chip-row">
              {tools.map((x, i) => <span className="chip" key={i}>{x}</span>)}
            </div>
          </Section>
        )}

        {/* Gallery */}
        {Array.isArray(project.gallery) && project.gallery.length > 0 && (
          <Section title="Gallery">
            <div className="gallery-grid">
              {project.gallery.map((url, i) => (
                <div className="gallery-item" key={i} style={{ backgroundImage: `url(${url})` }} />
              ))}
            </div>
          </Section>
        )}

        {/* CTAs */}
        <div className="cta-row" style={{ marginTop: 18 }}>
          <Link className="btn primary" to="/contact">Discuss a similar project</Link>
          <Link className="btn primary" to="/portfolio" style={{ marginLeft: 8 }}>Back to portfolio</Link>
        </div>
      </article>
    </>
  );
}
