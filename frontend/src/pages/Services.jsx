
import { useEffect, useState } from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../config/seo'
import { fetchServices, fetchService } from '../api/services'

function ServiceList() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices().then(setServices).finally(() => setLoading(false))
  }, [])

  const title = `Services | ${SITE_NAME}`
  const description = 'Dashboards, automation, and advisory services to drive data-led growth.'
  const canonical = `${SITE_URL}/services`

  if (loading) return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      </Helmet>
      <p>Loading services…</p>
    </>
  )

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      </Helmet>

      <div className="services-grid">
        {services.map(s => (
          <Link to={`/services/${s.slug}`} key={s.id} className="service-card">
            <h3>{s.title}</h3>
            <p>{s.excerpt}</p>
          </Link>
        ))}
      </div>
    </>
  )
}

function RelatedProjects({ projects }) {
  if (!projects || projects.length === 0) return null
  return (
    <section className="related-projects">
      <h2>Case studies</h2>
      <div className="project-grid">
        {projects.map(p => (
          <Link key={p.id} to={p.slug ? `/portfolio/${p.slug}` : '/portfolio'} className="project-card">
            <div className="thumb" style={{backgroundImage: p.thumbnail_url ? `url(${p.thumbnail_url})` : undefined}} />
            <h3>{p.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

function ServiceDetail() {
  const { slug } = useParams()
  const [service, setService] = useState(null)

  useEffect(() => {
    setService(null)
    fetchService(slug).then(setService)
  }, [slug])

  if (!service) return <p>Loading…</p>

  const title = `${service.title} | Services | ${SITE_NAME}`
  const description = service.excerpt || `Explore ${service.title} services by ${SITE_NAME}.`
  const canonical = `${SITE_URL}/services/${service.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    url: canonical
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={description} />
        <meta property="og:type" content="article" />
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

      <article className="service-detail">
        <h1>{service.title}</h1>
        <p className="excerpt">{service.excerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: service.description }} />
        <ul className="features">
          {service.features?.map(f => <li key={f.id}>{f.label}</li>)}
        </ul>
        <div className="cta-row">
          <Link className="btn primary" to="/contact">Request this service</Link>
        </div>
        <RelatedProjects projects={service.projects} />
      </article>
    </>
  )
}

export default function Services() {
  return (
    <section className="services">
      <Routes>
        <Route path="/" element={<ServiceList />} />
        <Route path=":slug" element={<ServiceDetail />} />
      </Routes>
    </section>
  )
}
