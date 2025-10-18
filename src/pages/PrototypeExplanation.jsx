import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'

export default function PrototypeExplanation() {
  return (
    <>
      <Header activePage="prototype" />
      <BackBar />

      <main>
        <section className="section hero-min">
          <div className="container">
            <h1 className="page-title">Prototype Explanation</h1>
            <p className="page-sub">Architecture, repositories, contracts, and developer workflows for this prototype.</p>
          </div>
        </section>

        <section className="section light">
          <div className="container">
            <div className="cards two">
              <div className="card" style={{ padding: '20px' }}>
                <h3>Repository</h3>
                <p style={{ marginTop: '8px' }}>Source code for frontend (React + Vite), backend (FastAPI), and blockchain (Hardhat + Solidity).</p>
                <div style={{ marginTop: '12px' }}>
                  <a className="btn btn-accent" href="https://github.com/" target="_blank" rel="noopener">Open GitHub</a>
                </div>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <h3>Architecture</h3>
                <p style={{ marginTop: '8px' }}>Frontend: React 18, Vite, React Router. Backend: FastAPI, CSV processing, JWT. Blockchain: Solidity (CompliRegistry), Hardhat, Web3.</p>
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-accent" onClick={() => window.open('/prototype', '_self')}>View Prototype</button>
                </div>
              </div>
            </div>
            <div style={{height:'16px'}}></div>
            <div className="cards two">
              <div className="card" style={{ padding: '20px' }}>
                <h3>Smart Contracts</h3>
                <ul className="list">
                  <li>Contract: CompliRegistry.sol</li>
                  <li>Function: anchor(proofHash) → id</li>
                  <li>Events: ProofAnchored(submitter, hash, id)</li>
                </ul>
                <p style={{marginTop:'8px'}}>
                  Contract path: <code>blockchain/contracts/CompliRegistry.sol</code>
                </p>
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-accent" onClick={() => window.open('/blockchain', '_self')}>View Contracts</button>
                </div>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <h3>Local Blockchain Setup</h3>
                <pre className="code"><code>{`cd blockchain
npm install
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost`}</code></pre>
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-accent" onClick={() => window.open('/setup', '_self')}>Setup Guide</button>
                </div>
              </div>
            </div>
            <div style={{height:'16px'}}></div>
            <div className="cards two">
              <div className="card" style={{ padding: '20px' }}>
                <h3>Backend Integration</h3>
                <p>Backend anchors a SHA-256 proof to the registry if environment variables are set.</p>
                <pre className="code"><code>{`setx ETH_RPC_URL http://127.0.0.1:8545
setx PRIVATE_KEY <hardhat_account_private_key>
setx REGISTRY_ADDRESS <deployed_contract_address>
setx CHAIN_ID 31337`}</code></pre>
                <p style={{marginTop:'8px'}}>Module: <code>backend/blockchain.py</code></p>
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-accent" onClick={() => window.open('/backend', '_self')}>View Backend</button>
                </div>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <h3>Frontend Usage</h3>
                <p>Run a compliance check from the Dashboard and download a blockchain-anchored proof report.</p>
                <ul className="list">
                  <li>Upload CSV</li>
                  <li>Select Country & Blockchain</li>
                  <li>Run Engine → Anchors proof on-chain</li>
                </ul>
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-accent" onClick={() => window.open('/frontend', '_self')}>View Frontend</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
