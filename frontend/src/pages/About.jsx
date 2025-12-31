
// frontend/src/pages/About.jsx
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

// Optional: simple social links component (icons via Font Awesome)
function SocialLinks({ links = {} }) {
  const items = [
    { key: 'linkedin', icon: 'fa-brands fa-linkedin', label: 'LinkedIn' },
    { key: 'github',   icon: 'fa-brands fa-github',   label: 'GitHub' },
    { key: 'x',        icon: 'fa-brands fa-x-twitter',label: 'X' },
    { key: 'web',      icon: 'fa-solid fa-globe',     label: 'Website' },
  ].filter(i => links[i.key]);

  if (items.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2 text-slate-300">
      {items.map(i => (
        <a
          key={i.key}
          href={links[i.key]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:border-brand-500/40 hover:bg-brand-500/5 transition text-xs"
        >
          <i className={i.icon} aria-hidden="true" />
          <span>{i.label}</span>
        </a>
      ))}
    </div>
  );
}

export default function About() {
  const title = `About | ${SITE_NAME}`;
  const description =
    'Collinalitics helps organizations turn raw data into clear, actionable insights—through analytics, automation, and modern data engineering.';
  const canonical = `${SITE_URL}/about`;

  // Content blocks
  const whatWeDo = [
    { icon: 'fa-solid fa-broom', title: 'Data cleaning & automation', blurb: 'Python, SQL, Excel workflows that remove manual effort and reduce error.' },
    { icon: 'fa-solid fa-chart-line', title: 'Analytics dashboards', blurb: 'Tableau, Power BI, and bespoke web dashboards that drive decisions.' },
    { icon: 'fa-solid fa-diagram-project', title: 'APIs & integrations', blurb: 'Django REST + Postgres backends that connect tools and teams.' },
    { icon: 'fa-solid fa-window-restore', title: 'Lightweight web apps', blurb: 'Purpose-built apps that surface insights in everyday operations.' },
  ];

  const approach = [
    { title: 'Start simple', text: 'Deliver a small win in week one to prove value and set direction.' },
    { title: 'Automate the boring', text: 'Remove repetitive work so analysts can focus on impact.' },
    { title: 'Ship value fast', text: 'Iterate with clear milestones and feedback loops.' },
    { title: 'Own the result', text: 'Align on outcomes and measure success with transparent metrics.' },
  ];

  const tools = ['Python','Pandas','SQL','Django REST','Postgres','React','Vite','Tableau','Power BI'];

  // TEAM — replace with real people/photos
  const team = [
    {
      name: 'Collins Ayidan',
      role: 'Founder & Data Engineer',
      bio: 'Leads data platforms, automation pipelines, and analytics delivery with a focus on speed and clarity.',
      photo: '/images/team/collins.jpg', // place an image under frontend/public/images/team/
      links: {
        linkedin: 'https://www.linkedin.com/',
        github:   'https://github.com/collinsayidan',
        web:      'https://collinalitics.com',
      },
    },
    {
      name: 'Analyst (You?)',
      role: 'Analytics & BI',
      bio: 'Turns messy data into decision-ready insights and dashboards that stakeholders love.',
      photo: '/images/team/analyst.jpg',
      links: {},
    },
    {
      name: 'Engineer (You?)',
      role: 'Software & Integrations',
      bio: 'Builds reliable APIs and integrations that connect the data dots across systems.',
      photo: '/images/team/engineer.jpg',
      links: {},
    },
  ];

  // CLIENT LOGOS — replace svg/png paths with real client marks
  const clients = [
    { name: 'Client A', logo: '/images/clients/client-a.svg' },
    { name: 'Client B', logo: '/images/clients/client-b.svg' },
    { name: 'Client C', logo: '/images/clients/client-c.svg' },
    { name: 'Client D', logo: '/images/clients/client-d.svg' },
    { name: 'Client E', logo: '/images/clients/client-e.svg' },
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

      {/* CLIENT LOGOS */}
      <section className="mt-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {clients.map(c => (
              <div key={c.name} className="opacity-80 hover:opacity-100 transition">
                <img
                  src={c.logo}
                  alt={`${c.name} logo`}
                  className="h-8 md:h-10 object-contain"
                  loading="lazy"
                />
              </div>
            ))}
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

      {/* TEAM */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Team</h2>
        <p className="mt-1 text-slate-300">Small, focused, and outcome‑driven.</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map(member => (
            <div key={member.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {/* Use <img> from /public/images/team/... or fallback icon */}
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={`${member.name} avatar`}
                      className="size-14 rounded-xl object-cover border border-white/10"
                      loading="lazy"
                    />
                  ) : (
                    <div className="size-14 rounded-xl grid place-items-center bg-white/10 text-white">
                      <i className="fa-solid fa-user" aria-hidden="true"></i>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white">{member.name}</div>
                  <div className="text-sm text-slate-400">{member.role}</div>
                  <SocialLinks links={member.links} />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MINI TIMELINE / VALUES */}
      <section className="mt-10">
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
