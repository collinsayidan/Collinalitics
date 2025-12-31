// frontend/src/components/CaseStudy.jsx
import { Link } from 'react-router-dom';

export default function CaseStudy({ project }) {
  if (!project) return null;

  const {
    title,
    summary,
    client_name,
    industry,
    location,
    start_date,
    end_date,
    status,
    tags_list = [],
    tools_list = [],
    goals,
    approach,
    outcomes,
    metrics,
    hero_image_url,
    gallery = [],
  } = project;

  return (
    <article className="space-y-10">

      {/* HERO */}
      <div className="rounded-2xl overflow-hidden app-border app-bg-secondary">
        {hero_image_url && (
          <div
            className="h-64 md:h-96 bg-cover bg-center"
            style={{ backgroundImage: `url(${hero_image_url})` }}
          />
        )}

        <div className="p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-[var(--app-text)]">
            {title}
          </h1>

          {summary && (
            <p className="mt-3 md:text-lg app-text-muted">{summary}</p>
          )}

          {/* Tags */}
          {tags_list.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags_list.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full app-bg app-border px-3 py-1 text-xs app-text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* META */}
      <section className="rounded-2xl app-bg-secondary app-border p-6 md:p-8">
        <h2 className="text-lg font-bold text-[var(--app-text)]">Project details</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm app-text-muted">
          {client_name && <div><strong className="text-[var(--app-text)]">Client:</strong> {client_name}</div>}
          {industry && <div><strong className="text-[var(--app-text)]">Industry:</strong> {industry}</div>}
          {location && <div><strong className="text-[var(--app-text)]">Location:</strong> {location}</div>}
          {status && <div><strong className="text-[var(--app-text)]">Status:</strong> {status}</div>}
          {start_date && <div><strong className="text-[var(--app-text)]">Start:</strong> {start_date}</div>}
          {end_date && <div><strong className="text-[var(--app-text)]">End:</strong> {end_date}</div>}
        </div>

        {/* Tools */}
        {tools_list.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-[var(--app-text)]">Tools & technologies</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {tools_list.map((tool, i) => (
                <span
                  key={i}
                  className="rounded-full app-bg app-border px-3 py-1 text-xs app-text-muted"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* BODY SECTIONS */}
      {goals && (
        <section>
          <h2 className="text-lg font-bold text-[var(--app-text)]">Goals</h2>
          <pre className="whitespace-pre-wrap mt-2 app-text-muted">{goals}</pre>
        </section>
      )}

      {approach && (
        <section>
          <h2 className="text-lg font-bold text-[var(--app-text)]">Approach</h2>
          <pre className="whitespace-pre-wrap mt-2 app-text-muted">{approach}</pre>
        </section>
      )}

      {outcomes && (
        <section>
          <h2 className="text-lg font-bold text-[var(--app-text)]">Outcomes</h2>
          <pre className="whitespace-pre-wrap mt-2 app-text-muted">{outcomes}</pre>
        </section>
      )}

      {metrics && (
        <section>
          <h2 className="text-lg font-bold text-[var(--app-text)]">Key metrics</h2>
          <pre className="whitespace-pre-wrap mt-2 app-text-muted">{metrics}</pre>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[var(--app-text)]">Gallery</h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <div
                key={i}
                className="h-48 rounded-xl bg-cover bg-center app-border"
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/contact" className="btn btn-primary px-4 py-2">
          Start a project
        </Link>
        <Link to="/portfolio" className="btn btn-outline px-4 py-2">
          Back to portfolio
        </Link>
      </div>
    </article>
  );
}
