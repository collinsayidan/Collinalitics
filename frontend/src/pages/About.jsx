
// frontend/src/pages/About.jsx
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

export default function About() {
  const title = `About | ${SITE_NAME}`;
  const description =
    'Collinalitics helps organizations turn raw data into clear, actionable insights—through analytics, automation, and modern data engineering.';
  const canonical = `${SITE_URL}/about`;

  const whatWeDo = [
    { icon: 'fa-solid fa-broom', title: 'Data cleaning & automation', blurb: 'Python, SQL, Excel workflows that remove manual effort and reduce error.' },
    { icon: 'fa-solid fa-chart-line', title: 'Analytics dashboards', blurb: 'Tableau, Power BI, and custom web dashboards that drive decisions.' },
    { icon: 'fa-solid fa-diagram-project', title: 'APIs & integrations', blurb: 'Django REST + Postgres backends that connect tools and teams.' },
    { icon: 'fa-solid fa-window-restore', title: 'Lightweight web apps', blurb: 'Purpose-built apps that surface insights in everyday operations.' },
  ];

  const approach = [
    { title: 'Start simple', text: 'Deliver a small win in week one to prove value and set direction.' },
    { title: 'Automate the boring', text: 'Remove repetitive work so analysts can focus on impact.' },
    { title: 'Ship value fast', text: 'Iterate with clear milestones and feedback loops.' },
    { title: 'Own the result', text: 'Align on outcomes and measure success with transparent metrics.' },
  ];

  const tools = [
    'Python','Pandas','SQL','Django REST','Postgres','React','Vite','Tableau','Power BI'
  ];

  const moments = [
    { label: 'Vision', text: 'Help teams move faster with trustworthy data and practical automation.' },
    { label: 'Method', text: 'Tiny, focused increments shipped quickly—then scale what works.' },
    { label: 'Promise', text: 'Clarity first: fewer dashboards, more decisions.' },
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

        {/* Organization JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            description,
          })}
        </script>
      </Helmet>

      {/* HERO */}
      <section className="py-6 md:py-10">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-6 md:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
              <span className="size-2 rounded-full bg-brand-500" /> About {SITE_NAME}
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-black text-white tracking-tight">
              Clarity, speed, and impact — through data
            </h1>
            <p className="mt-3 text-slate-300 md:text-lg">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/portfolio" className="btn btn-primary px-4 py-2">See portfolio</Link>
              <Link to="/contact" className="btn btn-outline px-4 py-2">Start a project</Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="mt-6">
        <h2 className="text-xl font-bold text-white">What we do</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whatWeDo.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="grid place-items-center size-12 rounded-lg bg-white/10 text-white">
                <i className={item.icon} aria-hidden="true"></i>
              </div>
              <h3 className="mt-3 font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{item.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APPROACH */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Our approach</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {approach.map((a) => (
            <div key={a.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-bold text-white">{a.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">Tools & technologies</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {tools.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* MINI TIMELINE / VALUES */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-white">How we think</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {moments.map((m) => (
            <div key={m.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-400">{m.label}</div>
              <p className="mt-1 text-slate-200">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">Ready to move faster with your data?</h3>
            <p className="text-slate-300">Tell us about your goals—we’ll respond with next steps and timelines.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/contact" className="btn btn-primary px-4 py-2">Start a project</Link>
            <Link to="/portfolio" className="btn btn-outline px-4 py-2">See case studies</Link>
          </div>
        </div>
      </section>
    </>
  );
}
