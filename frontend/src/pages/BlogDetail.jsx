
// frontend/src/pages/BlogDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPost } from '../api/blog';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

// Format ISO-ish date to "15 Dec 2025"
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso || '';
  }
}

// Render plain text content (fallback when content_html is not provided)
function RenderPlain({ text = '' }) {
  if (!text) return null;
  // Split paragraphs by blank line
  const paras = String(text).split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  return (
    <div className="prose prose-invert max-w-none">
      {paras.map((p, i) => (
        <p key={i} className="text-slate-200 leading-relaxed">{p}</p>
      ))}
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPost(null); setErr(null); setLoading(true);
    (async () => {
      try {
        const data = await fetchPost(slug);
        if (!data) throw new Error('Post not found');
        setPost(data);
      } catch (e) {
        setErr(e?.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <section>
        <div className="h-8 w-2/3 rounded bg-white/10 animate-pulse" />
        <div className="mt-2 h-4 w-48 rounded bg-white/10 animate-pulse" />
        <div className="mt-4 h-56 rounded-xl bg-white/10 animate-pulse" />
        <div className="mt-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-white/10 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
        <strong>Error:</strong> {err}
        <div className="mt-1 text-xs text-red-300">
          If your blog API isn’t wired yet, add endpoints like
          <code className="mx-1">/api/blog/posts/</code> and
          <code className="mx-1">/api/blog/posts/&lt;slug&gt;/</code>, then see <code>src/api/blog.js</code>.
        </div>
        <div className="mt-3">
          <Link to="/blog" className="text-brand-500 font-semibold hover:underline underline-offset-4">← Back to blog</Link>
        </div>
      </section>
    );
  }

  const pageTitle = `${post.title} | Blog | ${SITE_NAME}`;
  const canonical = `${SITE_URL}/blog/${post.slug || ''}`;
  const ogImage = post.hero_image_url || post.cover_image_url || DEFAULT_OG_IMAGE;

  const tagList =
    Array.isArray(post.tags_list) ? post.tags_list :
    Array.isArray(post.tags) ? post.tags : [];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={post.excerpt || post.summary || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={post.excerpt || post.summary || post.title} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={post.excerpt || post.summary || post.title} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400">
        <Link to="/blog" className="hover:text-slate-200">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mt-3">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{post.title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          {post.author && <span>By <span className="text-slate-200">{post.author}</span></span>}
          {post.date && <span>• {formatDate(post.date)}</span>}
          {post.reading_time && <span>• {post.reading_time} min read</span>}
        </div>

        {tagList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tagList.map((t, i) => (
              <span key={i} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Hero image */}
      {(post.hero_image_url || post.cover_image_url) && (
        <div
          className="mt-5 h-56 md:h-72 rounded-xl border border-white/10 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.hero_image_url || post.cover_image_url})` }}
          aria-label="Article image"
        />
      )}

      {/* Article body */}
      <article className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-7">
        {/* If backend provides HTML, render it. Ensure you sanitize on the backend. */}
        {post.content_html ? (
          <div
            className="prose prose-invert max-w-none prose-img:rounded-lg prose-pre:bg-slate-900 prose-code:text-brand-50"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        ) : (
          <RenderPlain text={post.content || post.body || ''} />
        )}
      </article>

      {/* Bottom CTAs */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn btn-primary px-4 py-2" to="/contact">Start a project</Link>
        <Link className="btn btn-outline px-4 py-2" to="/blog">Back to blog</Link>
      </div>
    </>
  );
}
