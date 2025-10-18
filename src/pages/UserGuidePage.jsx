import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'

export default function UserGuidePage() {
  return (
    <>
      <Header activePage="guide" />
      <BackBar />
      <main>
        <section className="section hero-min">
          <div className="container">
            <h1 className="page-title">User Guide</h1>
            <p className="page-sub">How to use the platform effectively.</p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="cards two">
              <div className="card" style={{ padding: '20px' }}>
                <h3>Getting Started</h3>
                <ol className="list">
                  <li>Prepare your transactions CSV.</li>
                  <li>Go to Dashboard and upload the file.</li>
                  <li>Select country and blockchain, then run the engine.</li>
                </ol>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <h3>Interpreting Results</h3>
                <ul className="list">
                  <li>Check violations and AI suggestions.</li>
                  <li>Download the PDF proof report.</li>
                  <li>Verify on-chain transaction via explorer link.</li>
                </ul>
              </div>
            </div>
            <div style={{ height: '16px' }}></div>
            <div className="card" style={{ padding: '20px' }}>
              <h3>CSV Format Requirements</h3>
              <p style={{ marginTop: '8px' }}>Provide a UTF-8 encoded CSV with a header row. The following columns are recommended:</p>
              <ul className="list" style={{ marginTop: '8px' }}>
                <li><strong>txn_id</strong> (string) – Unique transaction identifier</li>
                <li><strong>date</strong> (YYYY-MM-DD) – Transaction date</li>
                <li><strong>amount</strong> (number) – Transaction amount</li>
                <li><strong>type</strong> (string) – e.g., GST, Cash, Expense, Income</li>
                <li><strong>party</strong> (string, optional) – Counterparty name</li>
                <li><strong>gstin</strong> (string, optional) – GST number when applicable</li>
                <li><strong>notes</strong> (string, optional) – Free-form description</li>
              </ul>
              <p style={{ marginTop: '8px' }}><strong>Notes:</strong> Extra columns are allowed and safely ignored. Amounts should be positive numbers. Dates should be valid and within the analysis period.</p>
              <div style={{ marginTop: '12px' }}>
                <pre className="code" style={{ whiteSpace: 'pre-wrap' }}>
{`txn_id,date,amount,type,party,gstin,notes
TXN001,2025-08-15,50000,GST,Alpha Traders,27ABCDE1234F1Z5,Invoice #A-101
TXN002,2025-08-16,250000,Cash,Beta Stores,,Cash purchase
TXN003,2025-08-20,12000,Expense,Gamma Services,,Office supplies`}
                </pre>
              </div>
              <p style={{ marginTop: '8px' }}>Minimum required columns: <code>txn_id</code>, <code>date</code>, <code>amount</code>. Adding <code>type</code> and <code>gstin</code> improves rule accuracy.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
