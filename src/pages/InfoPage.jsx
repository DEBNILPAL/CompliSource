import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PAGES = {
  pricing: {
    title: 'Pricing',
    body: 'Our pricing is simple and transparent. Contact sales for tailored plans.'
  },
  careers: {
    title: 'Careers',
    body: 'We are not hiring at the moment. Check back soon.'
  },
  blog: {
    title: 'Blog',
    body: 'Insights on compliance, finance, and engineering. Coming soon.'
  },
  status: {
    title: 'System Status',
    body: 'All systems operational.'
  },
  docs: {
    title: 'Documentation',
    body: 'Getting started, guides, and best practices. Full docs coming soon.'
  },
  api: {
    title: 'API Reference',
    body: 'REST endpoints and schemas. Swagger/OpenAPI will be published here.'
  },
  support: {
    title: 'Support',
    body: 'Reach out via our help desk or email. Typical response within 24-48 hours.'
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'We value your privacy. We do not sell personal data. Full policy coming soon.'
  },
  terms: {
    title: 'Terms of Service',
    body: 'Use of this service constitutes acceptance of our terms. Full terms coming soon.'
  },
  cookies: {
    title: 'Cookie Policy',
    body: 'We use essential cookies for session and analytics. Full policy coming soon.'
  },
}

export default function InfoPage() {
  const { slug } = useParams()
  const page = PAGES[slug] || { title: 'Page', body: 'Content coming soon.' }
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '820px' }}>
            <h1 className="page-title">{page.title}</h1>
            <p className="page-sub">{slug}</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '820px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <p style={{ lineHeight: 1.7 }}>{page.body}</p>
            </div>
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-outline" to="/">← Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
