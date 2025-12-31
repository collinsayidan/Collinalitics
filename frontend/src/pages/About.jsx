// frontend/src/pages/About.jsx
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

// Social links component
function SocialLinks({ links = {} }) {
  const items = [
    { key: 'linkedin', icon: 'fa-brands fa-linkedin', label: 'LinkedIn' },
    { key: 'github', icon: 'fa-brands fa-github', label: 'GitHub' },
    { key: 'x', icon: 'fa-brands fa-x-twitter', label: 'X' },
    { key: 'web', icon: 'fa-solid fa-globe', label: 'Website' },
  ].filter(i => links[i.key]);

  if (items.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2 app-text-muted">
      {items.map(i => (
        <a
          key={i.key}
          href={links[i.key]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md app-border app-bg hover:border-brand-500/40 hover:bg-brand-500/5 transition text-xs"
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

  const team = [
    {
      name: 'Collins Ayidan',
      role: 'Founder & Data Engineer',
      bio: 'Leads data platforms, automation pipelines, and analytics delivery with a focus on speed and clarity.',
      photo: '/images/team/collins.jpg',
      links: {
        linkedin: 'https://www.linkedin.com/',
        github: 'https://github.com/collinsayidan',
        web: 'https://collinalitics.com',
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
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            description,
          })}
        </script>
      </Helmet>

      {/* HERO */}
      <section className="py-6 md:py-10">
        <div className="rounded-2xl app-bg-secondary app-border p-6 md:p-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full app-bg app-border px-3 py-1 text-xs app-text-muted">
              <span className="size-2 rounded-full bg-brand-500" /> About {SITE_NAME}
            </span>

            <h1 className="mt-3 text-3xl md:text-5xl font-black text-[var(--app-text)] tracking-tight">
              Clarity, speed, and impact — through data
            </h1>

            <p className="mt-3 app-text-muted md:text-lg">{description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/portfolio" className="btn btn-primary btn-md">See portfolio</Link>
              <Link to="/contact" className="btn btn-outline btn-md">Start a project</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS */}
      <section className="mt-4">
        <div className="rounded-2xl app-border app-bg-secondary p-4">
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
      <section className="mt-8">
        <h2 className="text-xl font-bold text-[var(--app-text)]">What we do</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whatWeDo.map(w => (
            <div key={w.title} className="rounded-xl app-border app-bg-secondary p-4">
              <div className="text-brand-500 text-xl mb-2">
                <i className={w.icon} />
              </div>
              <h3 className="font-bold text-[var(--app-text)]">{w.title}</h3>
              <p className="mt-1 text-sm app-text-muted">{w.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APPROACH */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-[var(--app-text)]">Our approach</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {approach.map(a => (
            <div key={a.title} className="rounded-xl app-border app-bg-secondary p-4">
              <h3 className="font-bold text-[var(--app-text)]">{a.title}</h3>
              <p className="mt-1 text-sm app-text-muted">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-[var(--app-text)]">Tools we use</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {tools.map(t => (
            <span
              key={t}
              className="px-3 py-1 rounded-full app-border app-bg text-sm app-text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-[var(--app-text)]">Team</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map(person => (
            <div key={person.name} className="rounded-xl app-border app-bg-secondary p-4">
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-40 object-cover rounded-lg app-border"
              />

              <h3 className="mt-3 font-bold text-[var(--app-text)]">{person.name}</h3>
              <p className="text-sm text-brand-500">{person.role}</p>
              <p className="mt-1 text-sm app-text-muted">{person.bio}</p>

              <SocialLinks links={person.links} />
            </div>
          ))}
        </div>
      </section>

      {/* MOMENTS */}
      <section className="mt-10 mb-16">
        <h2 className="text-xl font-bold text-[var(--app-text)]">What drives us</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {moments.map(m => (
            <div key={m.label} className="rounded-xl app-border app-bg-secondary p-4">
              <h3 className="font-bold text-[var(--app-text)]">{m.label}</h3>
              <p className="mt-1 text-sm app-text-muted">{m.text}</p>
            </div>
          ))}
        </div>

      </section>
      {/* CTA */}
      <section className="mt-10">
        <div className="rounded-2xl app-border app-bg-secondary p-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[var(--app-text)]">
              Ready to move faster with your data?
            </h3>
            <p className="app-text-muted">
              Tell us about your goals—we’ll respond with next steps and timelines.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/contact" className="btn btn-primary btn-md">
              Start a project
            </Link>
            <Link to="/portfolio" className="btn btn-outline btn-md">
              See case studies
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
