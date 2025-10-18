import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const POSTS = {
  'introducing-complisource': {
    title: 'Introducing CompliSource',
    date: '2025-08-01',
    body: `Compliance should be simple and trustworthy. CompliSource brings automated checks, human-readable reports,
    and cryptographic proofs to help businesses stay audit-ready at all times.`
  },
  'gst-compliance-checklist': {
    title: 'GST Compliance Checklist',
    date: '2025-09-10',
    body: `Use this checklist to reduce risk: validate GSTIN formats, verify HSN/SAC codes, ensure TDS deductions,
    flag cash transactions over limits, and detect duplicates.`
  },
  'anchoring-reports-on-chain': {
    title: 'Anchoring Reports On-Chain',
    date: '2025-10-01',
    body: `Anchoring report summaries on a blockchain builds trust among stakeholders. Our approach creates a proof hash
    of your analysis and publishes it to an affordable chain, enabling independent verification.`
  },
}

export default function BlogArticlePage() {
  const { slug } = useParams()
  const post = POSTS[slug] || { title: 'Article', date: new Date().toISOString(), body: 'Content coming soon.' }
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '900px' }}>
            <h1 className="page-title">{post.title}</h1>
            <p className="page-sub">{new Date(post.date).toLocaleDateString()}</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="card" style={{ padding: 16 }}>
              <p style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{post.body}</p>
            </div>
            <div style={{ marginTop: 16 }}>
              <Link className="btn btn-outline" to="/blog">← Back to Blog</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
