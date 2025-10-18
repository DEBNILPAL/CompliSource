import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'
import ComplianceDashboardVisual from '../components/ComplianceDashboardVisual'
import ComplianceModulesVisual from '../components/ComplianceModulesVisual'
import ComplianceScoreVisual from '../components/ComplianceScoreVisual'
import BlockchainProofVisual from '../components/BlockchainProofVisual'
import SecurityPrivacyVisual from '../components/SecurityPrivacyVisual'
import PDFReportVisual from '../components/PDFReportVisual'
import GlobalComplianceMap from '../components/GlobalComplianceMap'
import VRComplianceVisual from '../components/VRComplianceVisual'
import VoiceAIAssistant from '../components/VoiceAIAssistant'
import OCRInvoiceScanner from '../components/OCRInvoiceScanner'
import WhatsAppBotDemo from '../components/WhatsAppBotDemo'

export default function FeaturesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('cs_token'))
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for smoother animations
          requestAnimationFrame(() => {
            entry.target.classList.add('animate-in')
          })
          observer.unobserve(entry.target) // Only animate once
        }
      })
    }, observerOptions)

    // Observe all feature sections
    const featureSections = document.querySelectorAll('.feature-detail, .cta-inner, .page-title, .page-sub')
    featureSections.forEach(section => {
      section.classList.add('fade-up-element')
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header activePage="features" />
      <BackBar />

      <main>
        <section className="section hero-min">
          <div className="container">
            <h1 className="page-title">Powerful Tools for Total Compliance.</h1>
            <p className="page-sub">A modular, transparent, and secure platform designed for SMEs and experts alike.</p>
          </div>
        </section>

        <section className="section light">
          <div className="container feature-detail">
            <div className="feature-visual">
              <ComplianceDashboardVisual />
            </div>
            <div className="feature-copy">
              <h2>The Compliance Dashboard</h2>
              <p>The central hub for your compliance runs: view scores, flagged transactions, and validation summaries with drill-down detail.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container feature-detail reverse">
            <div className="feature-visual">
              <ComplianceModulesVisual />
            </div>
            <div className="feature-copy">
              <h2>Dynamic Compliance Modules</h2>
              <p>Plug-and-play rule modules power the engine. Start with GST Validator and Cash Limit modules, and extend easily with new rules.</p>
            </div>
          </div>
        </section>

        <section className="section light">
          <div className="container feature-detail">
            <div className="feature-visual">
              <ComplianceScoreVisual />
            </div>
            <div className="feature-copy">
              <h2>Compliance Scoring</h2>
              <p>A clear, actionable 0–100 score provides instant health checks and trend visibility for management reviews.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container feature-detail reverse">
            <div className="feature-visual">
              <BlockchainProofVisual />
            </div>
            <div className="feature-copy">
              <h2>Blockchain-Anchored Proofs</h2>
              <p>Each run produces a SHA-256 hash recorded via a smart contract (e.g., CompliRegistry.sol), ensuring tamper-proof, immutable evidence.</p>
            </div>
          </div>
        </section>

        <section className="section light">
          <div className="container feature-detail">
            <div className="feature-visual">
              <SecurityPrivacyVisual />
            </div>
            <div className="feature-copy">
              <h2>Secure & Private</h2>
              <p>Only cryptographic proofs are stored on-chain. Transaction details remain private and off-chain, preserving confidentiality.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container feature-detail reverse">
            <div className="feature-visual">
              <PDFReportVisual />
            </div>
            <div className="feature-copy">
              <h2>PDF Reports</h2>
              <p>Generate compliance reports instantly for auditors, regulators, and management. Fully branded and ready to share.</p>
            </div>
          </div>
        </section>

        <section className="section light">
          <div className="container feature-detail">
            <div className="feature-visual">
              <GlobalComplianceMap />
            </div>
            <div className="feature-copy">
              <h2>Global Compliance Coverage</h2>
              <p>Built for international scale: support for 7 countries with region-specific tax rules, multi-currency handling, and cross-chain blockchain anchoring across 6 networks.</p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>Multi-Country Support:</strong> India, USA, UK, EU, Australia, Canada, Singapore</li>
                <li><strong>Smart Currency Conversion:</strong> Real-time currency handling and localized formatting</li>
                <li><strong>Cross-Chain Blockchain:</strong> Ethereum, Polygon, BSC, Arbitrum, Optimism, Avalanche</li>
                <li><strong>AI-Powered Assistant:</strong> Natural language compliance queries and explanations</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container feature-detail">
            <div className="feature-copy">
              <h2>AI/VR Compliance Visualization</h2>
              <p>Experience compliance data like never before with our immersive 3D visualization powered by AI and VR-ready technology. Navigate through compliance nodes in a spatial environment.</p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>360° Spatial View:</strong> See all compliance components in an interactive 3D space</li>
                <li><strong>Real-time AI Analysis:</strong> Watch as AI processes and connects compliance data</li>
                <li><strong>VR-Ready Interface:</strong> Compatible with VR headsets for full immersion</li>
                <li><strong>Interactive Nodes:</strong> GST, Tax Rates, Cash Limits, Blockchain Proof, and more</li>
                <li><strong>Neural Network Display:</strong> Visualize AI decision-making pathways</li>
              </ul>
            </div>
            <div className="feature-visual">
              <VRComplianceVisual />
            </div>
          </div>
        </section>

        <section className="section light">
          <div className="container feature-detail">
            <div className="feature-visual">
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <VoiceAIAssistant violations={[
                  { txn_id: 'TXN001', type: 'GST', amount: 50000, reason: 'Missing GST rate' },
                  { txn_id: 'TXN002', type: 'Cash', amount: 250000, reason: 'Exceeds cash limit' }
                ]} />
              </div>
            </div>
            <div className="feature-copy">
              <h2>🎤 Voice-Controlled AI Assistant</h2>
              <p>Ask compliance questions using your voice and get instant spoken responses. Our AI assistant understands natural language and provides expert guidance on regulations, violations, and best practices.</p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>Voice Recognition:</strong> Speak naturally to ask questions</li>
                <li><strong>Text-to-Speech:</strong> Hear AI responses spoken aloud</li>
                <li><strong>Smart Responses:</strong> Get answers about scores, GST, tax rules, violations, and more</li>
                <li><strong>Conversation History:</strong> Review full chat transcript with timestamps</li>
                <li><strong>Quick Questions:</strong> One-click access to common queries</li>
                <li><strong>Multi-Modal Input:</strong> Use voice, text, or quick buttons</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container feature-detail">
            <div className="feature-copy">
              <h2>📸 OCR Invoice Scanner</h2>
              <p>Scan printed or handwritten invoices instantly using your camera or upload. Our AI extracts all data automatically - no manual typing needed!</p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>Smart Recognition:</strong> Works with printed and handwritten bills</li>
                <li><strong>Auto Extract:</strong> Invoice number, date, amount, GST, party details</li>
                <li><strong>GSTIN Verification:</strong> Validates GST numbers in real-time</li>
                <li><strong>Instant Processing:</strong> Get results in 2-3 seconds</li>
                <li><strong>High Accuracy:</strong> 85-95% OCR confidence rate</li>
                <li><strong>Multi-Format:</strong> Supports all invoice types and receipts</li>
              </ul>
            </div>
            <div className="feature-visual">
              <OCRInvoiceScanner />
            </div>
          </div>
        </section>

        <section className="section light">
          <div className="container feature-detail">
            <div className="feature-visual">
              <WhatsAppBotDemo />
            </div>
            <div className="feature-copy">
              <h2>💬 WhatsApp Bot Integration</h2>
              <p>Check compliance directly on WhatsApp - where 500M+ Indians already chat. Send invoices, get reports, and ask questions without leaving your favorite app!</p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>500M+ Reach:</strong> Access compliance on India's #1 messaging platform</li>
                <li><strong>Photo Upload:</strong> Send invoice pictures and get instant analysis</li>
                <li><strong>Voice Messages:</strong> Ask questions using voice in Hindi/English</li>
                <li><strong>Smart Bot:</strong> AI-powered responses to compliance queries</li>
                <li><strong>Bilingual:</strong> Full support for Hindi and English languages</li>
                <li><strong>Always Available:</strong> 24/7 compliance assistance via chat</li>
              </ul>
            </div>
          </div>
        </section>

        {isLoggedIn && (
          <section className="section cta">
            <div className="container cta-inner">
              <h2>🏢 Enterprise-Ready Compliance Automation</h2>
              <p style={{ marginBottom: '24px', fontSize: '16px', opacity: '0.9' }}>
                Built for professional use across industries. Automate compliance, generate audit-ready evidence, and anchor cryptographic proofs on-chain.
              </p>
              <Link className="btn btn-accent btn-lg" to="/dashboard">Launch Dashboard</Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
