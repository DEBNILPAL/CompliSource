import Header from '../components/Header'
import Footer from '../components/Footer'

export default function CareersPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '860px' }}>
            <h1 className="page-title">Careers</h1>
            <p className="page-sub">Build the future of compliant finance with us.</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '860px' }}>
            <div className="card" style={{ padding: 16 }}>
              <h3>Why CompliSource?</h3>
              <p style={{ lineHeight: 1.7 }}>
                We help businesses stay compliant with confidence. Our culture values ownership, curiosity, and impact.
              </p>
              <h3 style={{ marginTop: 16 }}>Open Roles</h3>
              <ul style={{ lineHeight: 1.9 }}>
                <li>Frontend Engineer (React)</li>
                <li>Backend Engineer (FastAPI)</li>
                <li>Data Analyst (Compliance)</li>
              </ul>
              <p style={{ marginTop: 12 }}>No perfect match? Email careers@complisource.example</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
