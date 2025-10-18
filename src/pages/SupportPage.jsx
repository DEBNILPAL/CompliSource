import Header from '../components/Header'
import Footer from '../components/Footer'

const FAQ = [
  { q: 'How do I upload my data?', a: 'Go to Dashboard → Upload CSV → Run Engine.' },
  { q: 'Why do I need to sign up?', a: 'To secure your data and personalize your reports.' },
  { q: 'What is the blockchain proof?', a: 'A cryptographic hash of your analysis anchored on-chain for verification.' },
]

export default function SupportPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section hero-min">
          <div className="container" style={{ maxWidth: '900px' }}>
            <h1 className="page-title">Support</h1>
            <p className="page-sub">FAQs and contact.</p>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="card" style={{ padding: 16 }}>
              <h3>FAQs</h3>
              <ul style={{ lineHeight: 1.9 }}>
                {FAQ.map((f, i) => (
                  <li key={i}>
                    <strong>{f.q}</strong>
                    <div>{f.a}</div>
                  </li>
                ))}
              </ul>
              <h3 style={{ marginTop: 16 }}>Contact</h3>
              <p>Email: support@complisource.example</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
