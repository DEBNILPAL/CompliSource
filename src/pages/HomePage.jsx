import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroCanvas from '../components/HeroCanvas'
import TypingEffect from '../components/TypingEffect'

export default function HomePage() {
  return (
    <>
      <Header activePage="" />

      {/* Hero */}
      <section className="hero">
        <HeroCanvas />
        <div className="container hero-content">
          <h1 className="hero-title">
            <TypingEffect />
          </h1>
          <p className="hero-sub">
            CompliSource is an open-source RegTech engine that simplifies GST, TDS, and statutory compliance for SMEs,
            powered by a community of experts and secured by the blockchain.
          </p>
          
          <div className="hero-visual" aria-hidden="true" role="img" title="Abstract verification network"></div>
        </div>
      </section>

      {/* Problem */}
      <section className="section light" id="problem">
        <div className="container">
          <h2 className="section-title">Compliance is Complex. The Cost of Failure is High.</h2>
          <div className="cards four">
            <article className="card icon-card">
              <div className="icon i-time"></div>
              <h3>Time-Consuming</h3>
              <p>Manual compliance checks drain teams and delay growth initiatives.</p>
            </article>
            <article className="card icon-card">
              <div className="icon i-cash"></div>
              <h3>Expensive</h3>
              <p>Outsourcing and tool fragmentation increase total cost of compliance.</p>
            </article>
            <article className="card icon-card">
              <div className="icon i-alert"></div>
              <h3>Penalty Risk</h3>
              <p>Missed filings and errors lead to fines, interest, and reputational damage.</p>
            </article>
            <article className="card icon-card">
              <div className="icon i-typing"></div>
              <h3>Manual Errors</h3>
              <p>Spreadsheet workflows are brittle and error-prone.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="section" id="solution">
        <div className="container">
          <h2 className="section-title">Open-Source Compliance, Made Simple.</h2>
          <div className="cards three">
            <article className="card feature">
              <div className="icon i-gear"></div>
              <h3>Automated Rule Engine</h3>
              <p>Run your transaction data against community-vetted modules to instantly flag violations.</p>
            </article>
            <article className="card feature">
              <div className="icon i-chain"></div>
              <h3>Blockchain Transparency</h3>
              <p>Each check is anchored on-chain, creating an immutable, verifiable audit trail.</p>
            </article>
            <article className="card feature">
              <div className="icon i-users"></div>
              <h3>Community-Powered</h3>
              <p>Leverage rules contributed by CAs, lawyers, and developers worldwide.</p>
            </article>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section light" id="how-it-works">
        <div className="container">
          <h2 className="section-title">Compliance in 3 Simple Steps.</h2>
          <ol className="timeline">
            <li>
              <div className="timeline-number">1</div>
              <div>
                <h3>Upload Data</h3>
                <p>Securely upload CSVs or connect your accounting software via API.</p>
              </div>
            </li>
            <li>
              <div className="timeline-number">2</div>
              <div>
                <h3>Run Engine</h3>
                <p>Analyze transactions against modules such as GST validation and cash limits.</p>
              </div>
            </li>
            <li>
              <div className="timeline-number">3</div>
              <div>
                <h3>Get Results</h3>
                <p>Instant dashboard with a clear compliance score and detailed violations.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Features overview */}
      <section className="section" id="features">
        <div className="container">
          <h2 className="section-title">Key Capabilities</h2>
          <div className="cards six">
            <article className="card icon-card">
              <div className="icon i-dashboard"></div>
              <h3>Compliance Dashboard</h3>
              <p>Monitor scores, trends, and flagged entries in one place.</p>
            </article>
            <article className="card icon-card">
              <div className="icon i-modules"></div>
              <h3>Dynamic Module Loader</h3>
              <p>Add or update rules without downtime.</p>
            </article>
            <article className="card icon-card">
              <div className="icon i-score"></div>
              <h3>Compliance Scoring</h3>
              <p>Clear 0–100 score for fast decision-making.</p>
            </article>
            <article className="card icon-card">
              <div className="icon i-verify"></div>
              <h3>On-Chain Verification</h3>
              <p>Trust but verify: cryptographic proofs for each run.</p>
            </article>
            <article className="card icon-card">
              <div className="icon i-audit"></div>
              <h3>Secure Audit Trail</h3>
              <p>Tamper-evident logs with role-based access.</p>
            </article>
            <article className="card icon-card">
              <div className="icon i-pdf"></div>
              <h3>PDF Reporting</h3>
              <p>One-click summaries for auditors and management.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section cta" id="demo">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Built for SMEs, Auditors, and Developers</h2>
            <p>Streamline GST/TDS checks, reduce manual errors, and create verifiable on-chain proofs — all in a simple, open platform.</p>
          </div>
          <div>
            <Link className="btn btn-accent btn-lg" to="/login">Login</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
