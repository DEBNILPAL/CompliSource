import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const POSTS = [
  { slug: 'introducing-complisource', title: 'Introducing CompliSource', excerpt: 'Why compliance needs to be simple, verifiable, and automated.', date: '2025-08-01' },
  { slug: 'gst-compliance-checklist', title: 'GST Compliance Checklist', excerpt: 'A practical checklist to reduce GST-related risks.', date: '2025-09-10' },
  { slug: 'anchoring-reports-on-chain', title: 'Anchoring Reports On-Chain', excerpt: 'How blockchain proofs improve trust in audits.', date: '2025-10-01' },
]

export default function BlogListPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '900px' }}>
            <h1 className="page-title">Blog</h1>
            <p className="page-sub">Insights on compliance, finance, and engineering.</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="cards one">
              {POSTS.map(p => (
                <div key={p.slug} className="card" style={{ padding: 16, marginBottom: 12 }}>
                  <div style={{ color: '#64748b', fontSize: 12 }}>{new Date(p.date).toLocaleDateString()}</div>
                  <h3 style={{ margin: '6px 0' }}>
                    <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p>{p.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
