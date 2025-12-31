// frontend/src/pages/Blog.jsx
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

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
  <div className="rounded-2xl app-bg-secondary app-border p-6 md:p-10">
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 rounded-full app-bg app-border px-3 py-1 text-xs app-text-muted">
        <span className="size-2 rounded-full bg-brand-500" /> Collinalitics Blog
      </span>

      <h1 className="mt-3 text-3xl md:text-5xl font-black text-[var(--app-text)] tracking-tight">
        Practical insights &amp; playbooks
      </h1>

      <p className="mt-3 app-text-muted md:text-lg">{description}</p>

      {/* Search + Suggested tags */}
      <form onSubmit={handleSearch} className="mt-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={qParam}
          placeholder="Search articles..."
          className="flex-1 min-w-[220px] rounded-md app-border app-bg text-[var(--app-text)] px-3 py-2 focus:outline-none focus:border-brand-500"
        />

        <button type="submit" className="btn btn-primary btn-md">
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
          {/* POSTS GRID */}
    <section className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-2xl app-border app-bg-secondary p-5 hover:border-brand-500/40 hover:bg-brand-500/5 transition flex flex-col"
          >
            <header className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[var(--app-text)] group-hover:text-brand-500">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <small className="block app-text-muted mt-1">
                  {formatDate(post.date)}
                </small>
              </div>

              {post.tag && (
                <span className="shrink-0 rounded-full app-bg app-border px-2.5 py-1 text-[11px] app-text-muted">
                  {post.tag}
                </span>
              )}
            </header>

            <p className="mt-3 text-sm app-text-muted flex-1">{post.excerpt}</p>

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

      {posts.length === 0 && (
        <div className="mt-6 rounded-md app-border app-bg-secondary p-4 app-text-muted">
          No articles found.
        </div>
      )}
    </section>
    </>
  );
}
