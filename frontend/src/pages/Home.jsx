
import { Helmet } from 'react-helmet-async'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo'
import { Link } from 'react-router-dom'

export default function Home() {
  const title = `Data insights that move businesses | ${SITE_NAME}`
  const description = 'Empower your organization with actionable insights and drive growth through data-driven decision making.'
  const canonical = `${SITE_URL}/`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  }

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
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="hero gradient">
        <h1>Data insights that move businesses</h1>
        <p>{description}</p>
        <div className="cta-row">
          <Link className="btn primary" to="/portfolio">View Projects</Link>
          <Link className="btn outline" to="/contact">Start a project</Link>
        </div>
        <div className="service-cards">
          <article className="card"><h3>Dashboards</h3><p>Visualize key metrics to uncover trends and inform strategy.</p></article>
          <article className="card"><h3>Automation</h3><p>Streamline workflows and increase efficiency with data-driven processes.</p></article>
          <article className="card"><h3>Advisory</h3><p>Leverage expertise to solve complex business challenges.</p></article>
        </div>
      </section>
    </>
  )
}
