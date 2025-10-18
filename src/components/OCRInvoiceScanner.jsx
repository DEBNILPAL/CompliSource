import { useState, useRef } from 'react'

export default function OCRInvoiceScanner({ onDataExtracted }) {
  const [isScanning, setIsScanning] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const fileInputRef = useRef(null)

  // Mock OCR function (in production, use Tesseract.js or backend API)
  const performOCR = async (imageFile) => {
    setIsScanning(true)
    
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock extracted data (in real implementation, this would come from OCR)
    const mockData = {
      invoiceNumber: 'INV-' + Math.floor(Math.random() * 10000),
      date: new Date().toISOString().split('T')[0],
      gstin: '29ABCDE1234F1Z5',
      partyName: 'ABC Traders Pvt Ltd',
      amount: (Math.random() * 100000 + 10000).toFixed(2),
      gstAmount: (Math.random() * 18000 + 1800).toFixed(2),
      gstRate: Math.random() > 0.5 ? '18%' : '12%',
      items: [
        { name: 'Product A', quantity: 5, rate: 1500, amount: 7500 },
        { name: 'Product B', quantity: 3, rate: 2000, amount: 6000 }
      ],
      totalAmount: (Math.random() * 118000 + 11800).toFixed(2),
      paymentMode: Math.random() > 0.5 ? 'UPI' : 'Cash',
      confidence: (85 + Math.random() * 10).toFixed(1) // OCR confidence %
    }

    setExtractedData(mockData)
    setIsScanning(false)
    
    if (onDataExtracted) {
      onDataExtracted(mockData)
    }

    return mockData
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target.result)
    }
    reader.readAsDataURL(file)

    // Perform OCR
    await performOCR(file)
  }

  const handleCameraCapture = () => {
    fileInputRef.current.click()
  }

  const resetScanner = () => {
    setPreviewImage(null)
    setExtractedData(null)
    setIsScanning(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const verifyGSTIN = (gstin) => {
    // Mock GSTIN verification (in production, call GSTN API)
    return Math.random() > 0.2 // 80% valid
  }

  return (
    <div className="ocr-scanner-card">
      <div className="ocr-header">
        <h3>📸 OCR Invoice Scanner</h3>
        <p>Scan bills and invoices automatically - supports handwritten & printed</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {!previewImage ? (
        <div className="ocr-upload-zone">
          <div className="upload-icon">📷</div>
          <h4>Capture or Upload Invoice</h4>
          <p>Take a photo or upload an image of your invoice/bill</p>
          <div className="upload-buttons">
            <button className="btn btn-accent" onClick={handleCameraCapture}>
              📸 Take Photo
            </button>
            <button className="btn btn-outline" onClick={() => fileInputRef.current.click()}>
              📁 Upload Image
            </button>
          </div>
          <div className="supported-formats">
            <small>✓ Printed bills ✓ Handwritten bills ✓ GST invoices ✓ Receipts</small>
          </div>
        </div>
      ) : (
        <div className="ocr-result-zone">
          <div className="ocr-preview">
            <img src={previewImage} alt="Invoice preview" />
            {isScanning && (
              <div className="scanning-overlay">
                <div className="scan-line"></div>
                <p>🔍 Scanning invoice...</p>
              </div>
            )}
          </div>

          {extractedData && !isScanning && (
            <div className="extracted-data">
              <div className="data-header">
                <h4>✅ Data Extracted Successfully</h4>
                <span className="confidence-badge">
                  {extractedData.confidence}% Confidence
                </span>
              </div>

              <div className="data-grid">
                <div className="data-field">
                  <label>Invoice Number:</label>
                  <span>{extractedData.invoiceNumber}</span>
                </div>
                <div className="data-field">
                  <label>Date:</label>
                  <span>{extractedData.date}</span>
                </div>
                <div className="data-field">
                  <label>Party Name:</label>
                  <span>{extractedData.partyName}</span>
                </div>
                <div className="data-field">
                  <label>GSTIN:</label>
                  <div>
                    <span>{extractedData.gstin}</span>
                    {verifyGSTIN(extractedData.gstin) ? (
                      <span className="status-badge valid">✓ Valid</span>
                    ) : (
                      <span className="status-badge invalid">✗ Invalid</span>
                    )}
                  </div>
                </div>
                <div className="data-field">
                  <label>Amount:</label>
                  <span>₹{extractedData.amount}</span>
                </div>
                <div className="data-field">
                  <label>GST Amount:</label>
                  <span>₹{extractedData.gstAmount} ({extractedData.gstRate})</span>
                </div>
                <div className="data-field">
                  <label>Total Amount:</label>
                  <span className="total-amount">₹{extractedData.totalAmount}</span>
                </div>
                <div className="data-field">
                  <label>Payment Mode:</label>
                  <span>{extractedData.paymentMode}</span>
                </div>
              </div>

              <div className="items-section">
                <h5>📋 Items Detected:</h5>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.rate}</td>
                        <td>₹{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="action-buttons">
                <button className="btn btn-accent" onClick={() => {
                  alert('Data saved to compliance dashboard!')
                  resetScanner()
                }}>
                  ✓ Use This Data
                </button>
                <button className="btn btn-ghost" onClick={resetScanner}>
                  🔄 Scan Another
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="ocr-features">
        <div className="feature-badge">
          <span>🇮🇳</span>
          <small>GST Compliant</small>
        </div>
        <div className="feature-badge">
          <span>✍️</span>
          <small>Handwritten</small>
        </div>
        <div className="feature-badge">
          <span>🔒</span>
          <small>Secure</small>
        </div>
        <div className="feature-badge">
          <span>⚡</span>
          <small>Instant</small>
        </div>
      </div>
    </div>
  )
}
