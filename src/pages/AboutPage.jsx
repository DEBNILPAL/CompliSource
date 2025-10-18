import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'
import TeamBubbles from '../components/TeamBubbles'

export default function AboutPage() {
  return (
    <>
      <Header activePage="about" />
      <BackBar />
      <main>
        <section className="section light">
          <div className="container narrow">
            <h2>Regulatory Framework (Illustrative)</h2>
            <ul className="list">
              <li><strong>RBI Guidelines (India):</strong> KYC/AML, cash transaction limits, reporting thresholds (as applicable to financial entities and cash-handling guidelines).</li>
              <li><strong>KYC/AML:</strong> Customer due diligence, transaction monitoring, record-keeping, and suspicious activity indicators.</li>
              <li><strong>GST/Indirect Tax:</strong> GSTIN format validation, invoice requirements, reconciliation checks, threshold tracking.</li>
              <li><strong>Data Protection:</strong> Minimal data retention, encryption in transit/at rest, privacy by design; on-chain only stores cryptographic proofs.</li>
              <li><strong>Auditability:</strong> Immutable proof records and reproducible scoring for periodic reviews.</li>
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="container narrow">
            <h2>Target Audience</h2>
            <ul className="list">
              <li>SMEs and mid-market companies seeking automated compliance checks.</li>
              <li>Chartered Accountants and audit firms needing repeatable, evidence-backed reviews.</li>
              <li>Fintechs and ERPs integrating compliance scoring and proof anchoring.</li>
              <li>Enterprises with multi-entity, multi-jurisdiction compliance operations.</li>
            </ul>
          </div>
        </section>

        <section className="section light">
          <div className="container narrow">
            <h2>Working Principle</h2>
            <ol className="list">
              <li>Ingest transactional data (e.g., CSV).</li>
              <li>Apply jurisdiction-specific rules via modular engines.</li>
              <li>Produce a deterministic score with violation details.</li>
              <li>Anchor a SHA-256 proof on-chain for tamper-evidence.</li>
              <li>Generate PDF output and explorer link for verification.</li>
            </ol>
          </div>
        </section>

        <section className="section cta">
          <div className="container cta-inner">
            <div className="card" style={{ padding: '20px' }}>
              <h2>Learn more</h2>
              <p style={{ marginTop: '8px' }}>Dive deeper into our prototype and architecture.</p>
              <div style={{ marginTop: '12px' }}>
                <Link className="btn btn-accent" to="/prototype">Prototype Explanation</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
