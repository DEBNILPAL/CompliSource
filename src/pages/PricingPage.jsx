import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '900px' }}>
            <h1 className="page-title">Pricing</h1>
            <p className="page-sub">Simple, transparent plans for teams of all sizes.</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '1000px' }}>
            <div className="cards three">
              <div className="card" style={{ padding: 16 }}>
                <h3>Starter</h3>
                <p>Best for individual founders.</p>
                <ul>
                  <li>Up to 1,000 records/month</li>
                  <li>Manual imports</li>
                  <li>Email support</li>
                </ul>
                <div style={{ marginTop: 12 }}><strong>$0</strong>/mo</div>
              </div>
              <div className="card" style={{ padding: 16, borderColor: '#00c49a' }}>
                <h3>Team</h3>
                <p>For growing businesses.</p>
                <ul>
                  <li>Up to 100k records/month</li>
                  <li>Automated imports & reports</li>
                  <li>Priority support</li>
                </ul>
                <div style={{ marginTop: 12 }}><strong>$99</strong>/mo</div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <h3>Enterprise</h3>
                <p>Advanced security & SSO.</p>
                <ul>
                  <li>Unlimited records</li>
                  <li>Private deployments</li>
                  <li>Dedicated CSM</li>
                </ul>
                <div style={{ marginTop: 12 }}>Contact sales</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
