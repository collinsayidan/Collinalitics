
// frontend/src/pages/PortfolioDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchProject } from '../api/projects';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="mt-2 text-slate-200">{children}</div>
    </section>
  );
}

// Helpers to sanitize chips and split narrative lines
function sanitizeChip(text) {
  if (!text) return '';
  return String(text).replace(/^[\-\s]+/, '').trim();
}
function splitLines(text) {
  if (!text) return [];
  return String(text)
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.replace(/^[\-\•\u2022]\s*/, ''));
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
        console.error('PortfolioDetail fetch error:', e);
        setErr(e?.message || 'Failed to load project');
      }
    })();
  }, [slug]);

  if (err) {
    return (
      <section className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
        <strong>Error:</strong> {err}
        <div className="mt-1 text-xs text-red-300">
          If you want direct slug detail routes, set <code>lookup_field = 'slug'</code> in your Django ViewSet.
        </div>
      </section>
    );
  }

  // Skeleton while loading
  if (!project) {
    return (
      <section>
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-lg bg-white/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-56 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-72 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
        </div>
      </section>
    );
  }

  const title = `${project.title} | Portfolio | ${SITE_NAME}`;
  const canonical = `${SITE_URL}/portfolio/${project.slug || ''}`;
  const ogImage = project.hero_image_url || project.thumbnail_url || DEFAULT_OG_IMAGE;

  const hasOverview = project.client_name || project.industry || project.location;
  const hasTimeline = project.start_date || project.end_date || project.status;

  const tags  = Array.isArray(project.tags_list)  ? project.tags_list.map(sanitizeChip).filter(Boolean) : [];
  const tools = Array.isArray(project.tools_list) ? project.tools_list.map(sanitizeChip).filter(Boolean) : [];

  const goals    = splitLines(project.goals);
  const approach = splitLines(project.approach);
  const outcomes = splitLines(project.outcomes);
  const metrics  = splitLines(project.metrics);

  const gallery  = Array.isArray(project.gallery) ? project.gallery : [];

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

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="grid place-items-center size-14 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-500 text-white">
          <i className="fa-solid fa-briefcase" aria-hidden="true"></i>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-black text-white">{project.title}</h1>
          {project.summary && (
            <p className="mt-1 text-slate-300">{project.summary}</p>
          )}

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <span key={i} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero image */}
      {(project.hero_image_url || project.thumbnail_url) && (
        <div
          className="mt-4 h-56 md:h-64 rounded-xl border border-white/10 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.hero_image_url || project.thumbnail_url})` }}
          aria-label="Project image"
        />
      )}

      {/* Overview & Timeline */}
      {(hasOverview || hasTimeline) && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {hasOverview && (
            <Section title="Overview">
              <ul className="space-y-1">
                {project.client_name && <li><strong className="text-white">Client:</strong> <span className="text-slate-300">{project.client_name}</span></li>}
                {project.industry &&    <li><strong className="text-white">Industry:</strong> <span className="text-slate-300">{project.industry}</span></li>}
                {project.location &&    <li><strong className="text-white">Location:</strong> <span className="text-slate-300">{project.location}</span></li>}
              </ul>
            </Section>
          )}

          {hasTimeline && (
            <Section title="Timeline">
              <ul className="space-y-1">
                {project.start_date && <li><strong className="text-white">Start:</strong>   <span className="text-slate-300">{project.start_date}</span></li>}
                {project.end_date   && <li><strong className="text-white">End:</strong>     <span className="text-slate-300">{project.end_date}</span></li>}
                {project.status     && <li><strong className="text-white">Status:</strong>  <span className="text-slate-300">{project.status}</span></li>}
              </ul>
            </Section>
          )}
        </div>
      )}

      {/* Narrative sections */}
      {goals.length > 0 && (
        <Section title="Goals">
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {goals.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </Section>
      )}
      {approach.length > 0 && (
        <Section title="Approach">
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {approach.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </Section>
      )}
      {outcomes.length > 0 && (
        <Section title="Outcomes">
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {outcomes.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </Section>
      )}
      {metrics.length > 0 && (
        <Section title="Key metrics">
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {metrics.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </Section>
      )}

      {/* Tools */}
      {tools.length > 0 && (
        <Section title="Tools & technologies">
          <div className="flex flex-wrap gap-2">
            {tools.map((x, i) => (
              <span key={i} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
                {x}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <Section title="Gallery">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gallery.map((url, i) => (
              <div
                key={i}
                className="h-40 rounded-lg border border-white/10 bg-cover bg-center"
                style={{ backgroundImage: `url(${url})` }}
                aria-label={`Gallery image ${i + 1}`}
              />
            ))}
          </div>
        </Section>
      )}

      {/* CTAs */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn btn-primary px-4 py-2" to="/contact">Discuss a similar project</Link>
        <Link className="btn btn-outline px-4 py-2" to="/portfolio">Back to portfolio</Link>
      </div>
    </>
  );
}
