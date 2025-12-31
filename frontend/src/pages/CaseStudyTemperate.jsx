
// frontend/src/pages/CaseStudyTemplate.jsx
import { Helmet } from 'react-helmet-async';
import CaseStudy from '../components/CaseStudy';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo';

export default function CaseStudyTemplate() {
  const project = {
    title: 'Sales Analytics Modernization',
    slug: 'sales-analytics-modernization',
    summary: 'From static reports to weekly insights that changed how leadership prioritizes action.',
    client_name: 'Acme Retail',
    industry: 'Retail',
    location: 'Glasgow, UK',
    start_date: '2025-06-01',
    end_date: '2025-09-15',
    status: 'Completed',
    tags_list: ['Analytics', 'Automation', 'Dashboards'],
    tools_list: ['Python', 'Pandas', 'SQL', 'Tableau', 'Postgres'],
    goals: `• Replace manual Excel with automated weekly refresh\n• Centralize metrics & definitions\n• Enable self-serve deep dives`,
    approach: `• Ingest + clean in Python/Pandas\n• Model in SQL + Postgres\n• Publish dashboards in Tableau\n• Track adoption + feedback`,
    outcomes: `• –63% report prep time\n• +22% on-time decisions\n• New cross-team sync rituals`,
    metrics: `• 12 data sources integrated\n• 42 KPIs standardized\n• 7 stakeholder groups onboarded`,
    hero_image_url: '/images/case-study/hero-sales.jpg',
    thumbnail_url: '/images/case-study/thumb-sales.jpg',
    gallery: [
      '/images/case-study/gallery-1.jpg',
      '/images/case-study/gallery-2.jpg',
      '/images/case-study/gallery-3.jpg',
    ],
  };

  const title = `Case Study Template | ${SITE_NAME}`;
  const canonical = `${SITE_URL}/case-study-template`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content="Reusable case study layout for Collinalitics portfolio." />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      </Helmet>

      <section>
        <CaseStudy project={project} />
      </section>
    </>
  );
}
