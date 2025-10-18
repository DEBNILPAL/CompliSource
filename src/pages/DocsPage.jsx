import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'

const SECTIONS = [
  { id: 'getting-started', title: 'Getting Started', body: 'Install the app, configure VITE_API_BASE, and create your first account.' },
  { id: 'uploading-data', title: 'Uploading Data', body: 'Upload CSV files via the Dashboard. Supported columns: date, amount, gstin, hsn, tds, etc.' },
  { id: 'compliance-engine', title: 'Compliance Engine', body: 'The engine validates GSTIN formats, TDS presence, cash limits, date errors, and duplicates.' },
  { id: 'blockchain-proof', title: 'Blockchain Proof', body: 'We anchor a summary hash on-chain for verifiable audit trails.' },
]

export default function DocsPage() {
  const [active, setActive] = useState(SECTIONS[0].id)
  const current = SECTIONS.find(s => s.id === active) || SECTIONS[0]
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '1100px' }}>
            <h1 className="page-title">Documentation</h1>
            <p className="page-sub">Guides and best practices.</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '1100px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
            <aside className="card" style={{ padding: 12, position: 'sticky', top: 16, height: 'fit-content' }}>
              {SECTIONS.map(s => (
                <div key={s.id}>
                  <button className="btn btn-ghost" style={{ width: '100%', textAlign: 'left', marginBottom: 6, fontWeight: active===s.id?700:500 }} onClick={()=>setActive(s.id)}>
                    {s.title}
                  </button>
                </div>
              ))}
            </aside>
            <article className="card" style={{ padding: 16 }}>
              <h2>{current.title}</h2>
              <p style={{ lineHeight: 1.8 }}>{current.body}</p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
