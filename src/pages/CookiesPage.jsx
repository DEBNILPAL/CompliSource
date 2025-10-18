import Header from '../components/Header'
import Footer from '../components/Footer'

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '900px' }}>
            <h1 className="page-title">Cookie Policy</h1>
            <p className="page-sub">How and why we use cookies.</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="card" style={{ padding: 16 }}>
              <h3>Types of Cookies</h3>
              <ul>
                <li>Essential: enable core functionality like login sessions</li>
                <li>Analytics: help us understand usage (aggregated)</li>
              </ul>
              <h3 style={{ marginTop: 16 }}>Your Choices</h3>
              <p style={{ lineHeight: 1.8 }}>You can control cookies in your browser settings.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
