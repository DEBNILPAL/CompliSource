import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LandingCanvas from '../components/LandingCanvas'
import '../assets/css/landing.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    console.log('LandingPage mounted')
    const timer = setTimeout(() => {
      setShowInstructions(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="landing-page">
      <LandingCanvas />
      
      <div className="landing-overlay">
        <div className="landing-content">
          <h1 className="landing-title">
            Welcome to <span className="highlight">CompliSource</span>
          </h1>
          <p className="landing-subtitle">
            Get Your Compliance Authenticated Within Seconds
          </p>
          
          {showInstructions && (
            <div className="instructions fade-in">
              <p className="instruction-text">
                <span className="instruction-icon">�</span>
                Move mouse LEFT to reject documents (show ✗)
              </p>
              <p className="instruction-text">
                <span className="instruction-icon">👉</span>
                Move mouse RIGHT to approve documents (show ✓)
              </p>
              <p className="instruction-text">
                <span className="instruction-icon">🌟</span>
                Watch the floating documents respond in real-time!
              </p>
            </div>
          )}
          
          <button 
            className="skip-btn"
            onClick={() => navigate('/home')}
          >
            Skip to Dashboard →
          </button>
        </div>
      </div>
    </div>
  )
}
