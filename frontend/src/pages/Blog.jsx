
// frontend/src/pages/Blog.jsx
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

export default function Blog() {
  const title = `Blog | ${SITE_NAME}`;
  const description =
    'Articles on data analytics, automation, dashboards, and practical workflows for growing businesses.';
  const canonical = `${SITE_URL}/blog`;

  // Temporary placeholders until backend posts go live
  const placeholders = [
    {
      slug: 'data-cleaning-blueprints',
      title: 'Data Cleaning Blueprints for Business Teams',
      excerpt:
        'A simple, repeatable approach to transforming messy spreadsheets into reliable datasets.',
      date: '2025-12-15',
    },
    {
      slug: 'analytics-that-drive-decisions',
      title: 'Analytics That Drive Decisions (Not Just Charts)',
      excerpt:
        'Move from static dashboards to actionable analytics with clear, measurable outcomes.',
      date: '2025-12-10',
    },
    {
      slug: 'automation-pipelines',
      title: 'Building Light Automation Pipelines with Python + SQL',
      excerpt:
        'Automate routine reporting tasks and reduce manual work with small, robust pipelines.',
      date: '2025-12-05',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={description} />

        {/* Open Graph / Twitter */}
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

        {/* BlogPage JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: SITE_NAME,
            url: canonical,
            description,
          })}
        </script>
      </Helmet>

      <section className="container">
        <header className="page-header" style={{ marginBottom: 18 }}>
          <h1 className="page-title">Blog</h1>
          <p className="lead">
            Practical articles on data insights, automation, dashboards, and workflows that help
            teams move faster and make better decisions.
          </p>
        </header>

        {/* Placeholder post list */}
        <div className="list">
          {placeholders.map((post) => (
            <article key={post.slug} className="list-item card">
              <header>
                <h2 className="card-title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <small className="muted">{post.date}</small>
              </header>
              <p className="card-excerpt">{post.excerpt}</p>
              <div className="card-cta">
                <Link className="btn link" to={`/blog/${post.slug}`}>
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-row" style={{ marginTop: 24 }}>
          <Link className="btn primary" to="/contact">Request a topic</Link>
          <Link className="btn primary" to="/portfolio" style={{ marginLeft: 10 }}>
            See portfolio
          </Link>
        </div>
      </section>
    </>
  );
}
