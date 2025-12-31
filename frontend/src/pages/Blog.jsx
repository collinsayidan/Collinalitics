
// frontend/src/pages/Blog.jsx
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

// simple date formatter for ISO-like strings
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
}

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
      tag: 'Data Cleaning',
    },
    {
      slug: 'analytics-that-drive-decisions',
      title: 'Analytics That Drive Decisions (Not Just Charts)',
      excerpt:
        'Move from static dashboards to actionable analytics with clear, measurable outcomes.',
      date: '2025-12-10',
      tag: 'Analytics',
    },
    {
      slug: 'automation-pipelines',
      title: 'Building Light Automation Pipelines with Python + SQL',
      excerpt:
        'Automate routine reporting tasks and reduce manual work with small, robust pipelines.',
      date: '2025-12-05',
      tag: 'Automation',
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

      {/* HERO */}
      <section className="py-6 md:py-10">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6 md:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
              <span className="size-2 rounded-full bg-brand-500" /> Collinalitics Blog
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-black text-white tracking-tight">
              Practical insights &amp; playbooks
            </h1>
            <p className="mt-3 text-slate-300 md:text-lg">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="btn btn-primary px-4 py-2">Request a topic</Link>
              <Link to="/portfolio" className="btn btn-outline px-4 py-2">See portfolio</Link>
            </div>
          </div>
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {placeholders.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-brand-500/40 hover:bg-brand-500/5 transition flex flex-col"
            >
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white group-hover:text-brand-500">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <small className="block text-slate-400 mt-1">{formatDate(post.date)}</small>
                </div>

                {/* Optional tag chip */}
                {post.tag && (
                  <span className="shrink-0 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-slate-300">
                    {post.tag}
                  </span>
                )}
              </header>

              <p className="mt-3 text-sm text-slate-300 flex-1">{post.excerpt}</p>

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

        {/* Empty state if you remove placeholders later */}
        {placeholders.length === 0 && (
          <div className="mt-6 rounded-md border border-white/10 bg-white/5 p-4 text-slate-300">
            No articles yet. Come back soon!
          </div>
        )}
      </section>
    </>
  );
}
