import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'

export default function DevelopersPage() {
  return (
    <>
      <Header activePage="developers" />
      <BackBar />

      <main>
        <section className="section hero-min">
          <div className="container">
            <h1 className="page-title">Join the Community. Build the Future of RegTech.</h1>
            <p className="page-sub">Open-source, modular, and developer-first. Help SMEs automate compliance worldwide.</p>
          </div>
        </section>

        <section className="section light">
          <div className="container">
            <h2>How to Contribute</h2>
            <ol className="steps">
              <li>
                <h3>Fork the Repo</h3>
                <p>Start by visiting our GitHub repository and creating a fork to your account.</p>
                <p><a className="link-cta" href="https://github.com/" target="_blank" rel="noopener">Open GitHub →</a></p>
              </li>
              <li>
                <h3>Write a Module</h3>
                <p>Create a new Python module using a simple function pattern:</p>
                <pre className="code"><code>{`def module_name(transaction):
    # validate fields, apply thresholds
    # return a structured result
    return {"status": "violation", "reason": "GST mismatch"}`}</code></pre>
              </li>
              <li>
                <h3>Submit a Pull Request</h3>
                <p>Open a PR. The community of CAs, lawyers, and developers will review and merge changes.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>Tech Stack</h2>
            
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent)' }}>🎨 Frontend</h3>
              <div className="tech-logos">
                <span className="tag">React 18</span>
                <span className="tag">Vite</span>
                <span className="tag">React Router</span>
                <span className="tag">Canvas 2D API</span>
                <span className="tag">Web Speech API</span>
                <span className="tag">CSS3 Animations</span>
                <span className="tag">Progressive Web App</span>
                <span className="tag">Responsive Design</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent)' }}>⚙️ Backend</h3>
              <div className="tech-logos">
                <span className="tag">Python 3.11+</span>
                <span className="tag">FastAPI</span>
                <span className="tag">JWT Auth</span>
                <span className="tag">MongoDB</span>
                <span className="tag">Pandas</span>
                <span className="tag">CSV Processing</span>
                <span className="tag">RESTful APIs</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent)' }}>⛓️ Blockchain</h3>
              <div className="tech-logos">
                <span className="tag">Solidity</span>
                <span className="tag">Hardhat</span>
                <span className="tag">Ethereum</span>
                <span className="tag">Polygon</span>
                <span className="tag">BSC</span>
                <span className="tag">Arbitrum</span>
                <span className="tag">Optimism</span>
                <span className="tag">Avalanche</span>
                <span className="tag">Web3.js</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent)' }}>🤖 AI & Machine Learning</h3>
              <div className="tech-logos">
                <span className="tag">Voice Recognition</span>
                <span className="tag">Text-to-Speech</span>
                <span className="tag">NLP Processing</span>
                <span className="tag">OCR (Tesseract)</span>
                <span className="tag">ML Predictions</span>
                <span className="tag">AI Chatbot</span>
                <span className="tag">Neural Networks</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent)' }}>🌐 Localization & Regional Features</h3>
              <div className="tech-logos">
                <span className="tag">WhatsApp Bot API</span>
                <span className="tag">OCR Scanner</span>
                <span className="tag">GSTIN Verification</span>
                <span className="tag">Multi-language</span>
                <span className="tag">E-way Bill</span>
                <span className="tag">TDS/TCS</span>
                <span className="tag">Handwritten Bills</span>
                <span className="tag">UPI Integration</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent)' }}>🎨 Advanced Visualization</h3>
              <div className="tech-logos">
                <span className="tag">3D Graphics</span>
                <span className="tag">VR-Ready</span>
                <span className="tag">Canvas Animations</span>
                <span className="tag">Interactive Maps</span>
                <span className="tag">Real-time Charts</span>
                <span className="tag">WebGL</span>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent)' }}>🌍 Global Compliance</h3>
              <div className="tech-logos">
                <span className="tag">Multi-Country (7)</span>
                <span className="tag">Multi-Currency</span>
                <span className="tag">Tax Rules Engine</span>
                <span className="tag">GST/VAT</span>
                <span className="tag">Cash Limits</span>
                <span className="tag">PDF Reports</span>
                <span className="tag">i18n Support</span>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--accent)' }}>🛠️ DevOps & Tools</h3>
              <div className="tech-logos">
                <span className="tag">Git</span>
                <span className="tag">GitHub</span>
                <span className="tag">VS Code</span>
                <span className="tag">npm/pip</span>
                <span className="tag">REST APIs</span>
                <span className="tag">CORS</span>
                <span className="tag">Docker (Ready)</span>
                <span className="tag">CI/CD</span>
              </div>
            </div>

            <div style={{ marginTop: '48px', padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: 'white' }}>🏢 Enterprise-Ready Compliance Platform</h3>
              <p style={{ marginBottom: '16px', fontSize: '15px', lineHeight: '1.6' }}>
                Designed for professional use by finance teams, auditors, and advisors. Combines AI, blockchain, and modern workflows to automate compliance with audit-ready evidence.
              </p>
              <div className="tech-logos" style={{ marginTop: '16px' }}>
                <span className="tag" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>🔒 Audit-Ready</span>
                <span className="tag" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>💡 Modular</span>
                <span className="tag" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>🌍 Global</span>
                <span className="tag" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>📱 Mobile First</span>
                <span className="tag" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>🚀 Scalable</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section cta">
          <div className="container cta-inner">
            <h2>Ready to contribute?</h2>
            <a className="btn btn-accent btn-lg" href="https://github.com/" target="_blank" rel="noopener">Fork on GitHub</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
