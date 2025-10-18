import Header from '../components/Header'
import Footer from '../components/Footer'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '900px' }}>
            <h1 className="page-title">Terms of Service</h1>
            <p className="page-sub">Please read these terms carefully.</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="card" style={{ padding: 16 }}>
              <h3>Use of Service</h3>
              <p style={{ lineHeight: 1.8 }}>By using CompliSource you agree to comply with applicable laws and these terms.</p>
              <h3 style={{ marginTop: 16 }}>Acceptable Use</h3>
              <p style={{ lineHeight: 1.8 }}>Do not upload unlawful content or attempt to disrupt the service.</p>
              <h3 style={{ marginTop: 16 }}>Changes</h3>
              <p style={{ lineHeight: 1.8 }}>We may update these terms and will post updates here.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
