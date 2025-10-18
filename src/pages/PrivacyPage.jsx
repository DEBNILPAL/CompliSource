import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '900px' }}>
            <h1 className="page-title">Privacy Policy</h1>
            <p className="page-sub">Your privacy matters.</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="card" style={{ padding: 16 }}>
              <h3>Overview</h3>
              <p style={{ lineHeight: 1.8 }}>We collect only what is necessary to operate the service and improve your experience.</p>
              <h3 style={{ marginTop: 16 }}>Data</h3>
              <ul>
                <li>Account info: email, username</li>
                <li>Uploaded CSVs for analysis</li>
                <li>Usage analytics (aggregated)</li>
              </ul>
              <h3 style={{ marginTop: 16 }}>Choices</h3>
              <p style={{ lineHeight: 1.8 }}>You can request export or deletion of your account data by contacting support.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
