
// frontend/src/components/CaseStudy.jsx
import { Link } from 'react-router-dom';

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

export default function CaseStudy({ project }) {
  if (!project) return null;

  const tags  = Array.isArray(project.tags_list)  ? project.tags_list.map(sanitizeChip).filter(Boolean) : [];
  const tools = Array.isArray(project.tools_list) ? project.tools_list.map(sanitizeChip).filter(Boolean) : [];

  const goals    = splitLines(project.goals);
  const approach = splitLines(project.approach);
  const outcomes = splitLines(project.outcomes);
  const metrics  = splitLines(project.metrics);
  const gallery  = Array.isArray(project.gallery) ? project.gallery : [];

  const hasOverview = project.client_name || project.industry || project.location;
  const hasTimeline = project.start_date || project.end_date || project.status;

  const ogImage = project.hero_image_url || project.thumbnail_url;

  return (
    <>
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
      {ogImage && (
        <div
          className="mt-4 h-56 md:h-64 rounded-xl border border-white/10 bg-cover bg-center"
          style={{ backgroundImage: `url(${ogImage})` }}
          aria-label="Project image"
        />
      )}

      {/* Overview & Timeline */}
      {(hasOverview || hasTimeline) && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {hasOverview && (
            <section>
              <h2 className="text-lg font-bold text-white">Overview</h2>
              <ul className="mt-2 space-y-1">
                {project.client_name && <li><strong className="text-white">Client:</strong> <span className="text-slate-300">{project.client_name}</span></li>}
                {project.industry    && <li><strong className="text-white">Industry:</strong> <span className="text-slate-300">{project.industry}</span></li>}
                {project.location    && <li><strong className="text-white">Location:</strong> <span className="text-slate-300">{project.location}</span></li>}
              </ul>
            </section>
          )}

          {hasTimeline && (
            <section>
              <h2 className="text-lg font-bold text-white">Timeline</h2>
              <ul className="mt-2 space-y-1">
                {project.start_date && <li><strong className="text-white">Start:</strong>   <span className="text-slate-300">{project.start_date}</span></li>}
                {project.end_date   && <li><strong className="text-white">End:</strong>     <span className="text-slate-300">{project.end_date}</span></li>}
                {project.status     && <li><strong className="text-white">Status:</strong>  <span className="text-slate-300">{project.status}</span></li>}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* Narrative sections */}
      {goals.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-bold text-white">Goals</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300">
            {goals.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </section>
      )}
      {approach.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-bold text-white">Approach</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300">
            {approach.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </section>
      )}
      {outcomes.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-bold text-white">Outcomes</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300">
            {outcomes.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </section>
      )}
      {metrics.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-bold text-white">Key metrics</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300">
            {metrics.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </section>
      )}

      {/* Tools */}
      {tools.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-bold text-white">Tools & technologies</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {tools.map((x, i) => (
              <span key={i} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
                {x}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-bold text-white">Gallery</h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gallery.map((url, i) => (
              <div
                key={i}
                className="h-40 rounded-lg border border-white/10 bg-cover bg-center"
                style={{ backgroundImage: `url(${url})` }}
                aria-label={`Gallery image ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* CTAs */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn btn-primary px-4 py-2" to="/contact">Discuss a similar project</Link>
        <Link className="btn btn-outline px-4 py-2" to="/portfolio">Back to portfolio</Link>
      </div>
    </>
  );
}
