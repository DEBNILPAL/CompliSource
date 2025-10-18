import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ParticleNetwork from '../components/ParticleNetwork'
import '../assets/css/landing-new.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const [showContent, setShowContent] = useState(false)
  const [showBigDoc, setShowBigDoc] = useState(false)

  useEffect(() => {
    // Show big document after 2 seconds
    const docTimer = setTimeout(() => {
      setShowBigDoc(true)
    }, 2000)
    
    // Show main content right after burst (2s + 1s for doc animation)
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 3000)
    
    return () => {
      clearTimeout(docTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  return (
    <div className="landing-page-wrapper">
      {/* Particle Network Background */}
      <ParticleNetwork showBigDoc={showBigDoc} />
      
      {/* Document Splash Animation - First 2 seconds */}
      <div className={`document-splash ${showBigDoc ? 'fade-out' : ''}`}>
        <div className="doc-icon">📄</div>
        <div className="doc-icon delay-1">📋</div>
        <div className="doc-icon delay-2">📃</div>
        <div className="doc-icon delay-3">📑</div>
        <div className="doc-icon delay-4">🗂️</div>
      </div>

      {/* Big Document that bursts - Shows at 2 seconds */}
      {showBigDoc && !showContent && (
        <div className="big-document">
          📄
        </div>
      )}

      {/* Main Content */}
      <div className={`landing-main ${showContent ? 'show' : ''}`}>
        <div className="landing-container">
          <h1 className="landing-main-title">
            Welcome to <span className="brand-highlight">CompliSource</span>
          </h1>
          <p className="landing-main-subtitle">
            Get Your Compliance Authenticated Within Seconds
          </p>

          <div className="landing-actions">
            <button 
              className="btn btn-accent btn-lg"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
            <button 
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>

          <div className="landing-actions" style={{ marginTop: '16px', gap: '8px' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/features')}>Features</button>
            <button className="btn btn-ghost" onClick={() => navigate('/prototype')}>Prototype Explanation</button>
            <button className="btn btn-ghost" onClick={() => navigate('/about')}>About</button>
          </div>

          {/* Landing inline sections */}
          <div style={{ marginTop: '32px' }}>
            <div className="cards three">
              <div className="card" style={{ padding: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3>Features</h3>
                  <p style={{ marginTop: '8px' }}>AI-driven compliance checks, OCR, voice assistant, and blockchain proof anchoring.</p>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-accent" onClick={() => navigate('/features')}>Explore Features</button>
                </div>
              </div>
              <div className="card" style={{ padding: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3>Prototype Explanation</h3>
                  <p style={{ marginTop: '8px' }}>Architecture, repositories, contracts, and developer workflows.</p>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-accent" onClick={() => navigate('/prototype')}>View Prototype</button>
                </div>
              </div>
              <div className="card" style={{ padding: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3>About</h3>
                  <p style={{ marginTop: '8px' }}>Regulatory frameworks, target audience, and working principles of the platform.</p>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-accent" onClick={() => navigate('/about')}>Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
