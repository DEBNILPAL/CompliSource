import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'
import DashboardDemo from '../components/DashboardDemo'
import AIComplianceAssistant from '../components/AIComplianceAssistant'
import VoiceAIAssistant from '../components/VoiceAIAssistant'
import OCRInvoiceScanner from '../components/OCRInvoiceScanner'
import { countries, getCountryList, formatCurrency } from '../utils/countryConfig'
import { blockchains, getBlockchainList, anchorProofToChain, getExplorerLink } from '../utils/blockchainConfig'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function DashboardPage() {
  const [userName, setUserName] = useState('…')
  const [dashStatus, setDashStatus] = useState('')
  const [result, setResult] = useState('')
  const [file, setFile] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState('IN')
  const [selectedBlockchain, setSelectedBlockchain] = useState('polygon')
  const [violations, setViolations] = useState([])
  const [blockchainTx, setBlockchainTx] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [recordCount, setRecordCount] = useState(0)
  const [moduleStats, setModuleStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('cs_token')
    
    if (!token) {
      setDashStatus('Please login first.')
      setTimeout(() => navigate('/login'), 800)
      return
    }

    // Fetch user info
    fetch(`${API_BASE}/me`, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    })
      .then(res => {
        if (!res.ok) throw new Error('Auth expired')
        return res.json()
      })
      .then(data => {
        setUserName(data.email)
      })
      .catch(err => {
        setDashStatus('Session expired. Redirecting to login...')
        localStorage.removeItem('cs_token')
        setTimeout(() => navigate('/login'), 900)
      })
  }, [navigate])

  // Load persisted analysis report (if any) so it survives refresh/navigation
  useEffect(() => {
    try {
      const savedHtml = localStorage.getItem('cs_report_html')
      const savedViolations = localStorage.getItem('cs_report_violations')
      const savedAnalysis = localStorage.getItem('cs_report_analysisData')
      const savedRc = localStorage.getItem('cs_report_recordCount')
      const savedStats = localStorage.getItem('cs_report_moduleStats')
      if (savedHtml) setResult(savedHtml)
      if (savedViolations) setViolations(JSON.parse(savedViolations))
      if (savedAnalysis) setAnalysisData(JSON.parse(savedAnalysis))
      if (savedRc) setRecordCount(parseInt(savedRc, 10) || 0)
      if (savedStats) setModuleStats(JSON.parse(savedStats))
    } catch (e) {
      console.warn('Failed to restore saved report', e)
    }
  }, [])

  const handleGenerateVerifiedReport = async () => {
    if (!analysisData) return
    try {
      const token = localStorage.getItem('cs_token')
      const summary = {
        timestamp: new Date().toISOString(),
        user: userName,
        country: countries[selectedCountry].name,
        score: analysisData.score,
        record_count: recordCount,
        module_stats: moduleStats,
        violations: violations,
      }
      const enc = new TextEncoder()
      const digest = await window.crypto.subtle.digest('SHA-256', enc.encode(JSON.stringify(summary)))
      const hashHex = Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('')
      const res = await fetch(`${API_BASE}/engine/anchor`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof_hash: hashHex })
      })
      const body = await res.json().catch(()=>({}))
      const txHash = body?.tx_hash || null
      const chain = blockchains[selectedBlockchain]
      const explorerUrl = txHash ? getExplorerLink(selectedBlockchain, txHash) : ''
      const qr = explorerUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(explorerUrl)}` : ''
      const imgs = buildChartsImages(recordCount, moduleStats || {}, analysisData.score)
      const generatedAt = new Date().toLocaleString()
      const html = `
        <h2>Blockchain-Verified Compliance Report</h2>
        <div class="card">
          <div><strong>User:</strong> ${userName}</div>
          <div><strong>Country:</strong> ${countries[selectedCountry].name}</div>
          <div><strong>Blockchain:</strong> ${chain.name}</div>
          <div><strong>Overall Score:</strong> ${analysisData.score}%</div>
          <div><strong>Records:</strong> ${recordCount}</div>
          <div><strong>Generated At:</strong> ${generatedAt}</div>
        </div>
        <div class="card"><h3>Charts</h3>
          <div><strong>Compliance Breakdown</strong><br/><img src="${imgs.pie}"/></div>
          <div style="height:12px"></div>
          <div><strong>Module Scores</strong><br/><img src="${imgs.bar}"/></div>
          <div style="height:12px"></div>
          <div><strong>Radar</strong><br/><img src="${imgs.radar}"/></div>
          <div style="height:12px"></div>
          <div><strong>Timeline</strong><br/><img src="${imgs.timeline}"/></div>
        </div>
        <div class="card"><h3>Violations (${violations.length})</h3><pre style="white-space:pre-wrap">${violations.length? JSON.stringify(violations, null, 2): 'None'}</pre></div>
        <div class="card">
          <h3>Blockchain Verification</h3>
          <div><strong>Summary Hash (SHA-256):</strong> <code>${hashHex}</code></div>
          ${txHash ? `<div><strong>Transaction:</strong> <a href="${explorerUrl}" target="_blank">${txHash}</a></div>` : '<div>No on-chain anchoring (backend not configured).</div>'}
          ${qr ? `<div style="margin-top:8px"><img alt="QR" src="${qr}"/></div>` : ''}
        </div>
      `
      openPrintableReport('Blockchain Verified Report', html)
    } catch (e) {
      console.error('Generate verified report failed', e)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleClearAnalysis = () => {
    setResult('')
    setViolations([])
    setBlockchainTx(null)
    setFile(null)
    setAnalysisData(null)
    setRecordCount(0)
    setModuleStats(null)
    // Reset file input
    const fileInput = document.getElementById('uploadCsv')
    if (fileInput) fileInput.value = ''
    // Clear persisted report
    localStorage.removeItem('cs_report_html')
    localStorage.removeItem('cs_report_violations')
    localStorage.removeItem('cs_report_analysisData')
    localStorage.removeItem('cs_report_recordCount')
    localStorage.removeItem('cs_report_moduleStats')
    localStorage.removeItem('cs_report_generatedAt')
  }

  const buildChartsImages = (rc, ms, score) => {
    const W = 360, H = 220
    const make = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c }
    const imgs = {}
    const gstInvalid = ms?.gst_invalid_count || 0
    const tdsMissing = ms?.tds_missing_count || 0
    const cashExceeded = ms?.cash_limit_exceeded_count || 0
    const cashStruct = ms?.cash_structuring_suspected_count || 0
    const dateErrors = ms?.date_errors_count || 0
    const duplicates = ms?.duplicates_count || 0
    const nonCompliant = gstInvalid + tdsMissing + cashExceeded + cashStruct + dateErrors + duplicates
    const compliant = Math.max(0, rc - nonCompliant)

    // Pie chart: compliant vs non-compliant
    {
      const c = make(), ctx = c.getContext('2d');
      const total = Math.max(1, compliant + nonCompliant)
      const a1 = (compliant / total) * Math.PI * 2
      ctx.translate(W/2, H/2); ctx.clearRect(-W/2, -H/2, W, H)
      ctx.beginPath(); ctx.moveTo(0,0); ctx.fillStyle = '#00c49a'; ctx.arc(0,0,80, -Math.PI/2, -Math.PI/2 + a1); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(0,0); ctx.fillStyle = '#ef4444'; ctx.arc(0,0,80, -Math.PI/2 + a1, -Math.PI/2 + Math.PI*2); ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#0a2540'; ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'center'; ctx.fillText('Compliance', 0, 100)
      imgs.pie = c.toDataURL('image/png')
    }

    // Bar chart: module scores (valid ratios)
    {
      const c = make(), ctx = c.getContext('2d');
      const bars = [
        {name:'GST', v: rc>0? (1 - (gstInvalid/rc))*100 : 100},
        {name:'TDS', v: rc>0? (1 - (tdsMissing/rc))*100 : 100},
        {name:'Cash', v: rc>0? (1 - (cashExceeded/rc))*100 : 100},
        {name:'Dates/Dups', v: rc>0? (1 - ((dateErrors+duplicates)/rc))*100 : 100},
      ]
      const bw = 60, gap = 30, base = H-30
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#f8fafc'; ctx.fillRect(0,0,W,H)
      bars.forEach((b,i)=>{
        const h = Math.max(1, Math.round((b.v/100)*(H-60)))
        const x = 30 + i*(bw+gap)
        ctx.fillStyle = '#e5e7eb'; ctx.fillRect(x, base-(H-60), bw, (H-60))
        ctx.fillStyle = '#00c49a'; ctx.fillRect(x, base-h, bw, h)
        ctx.fillStyle = '#0a2540'; ctx.font='12px system-ui'; ctx.textAlign='center'; ctx.fillText(b.name, x+bw/2, base+14)
      })
      imgs.bar = c.toDataURL('image/png')
    }

    // Radar chart: use score + module levels
    {
      const c = make(), ctx = c.getContext('2d');
      ctx.clearRect(0,0,W,H); ctx.translate(W/2, H/2)
      const axes = [
        {name:'Overall', v: score},
        {name:'GST', v: rc>0? (1 - (gstInvalid/rc))*100 : 100},
        {name:'TDS', v: rc>0? (1 - (tdsMissing/rc))*100 : 100},
        {name:'Cash', v: rc>0? (1 - (cashExceeded/rc))*100 : 100},
        {name:'Dates/Dups', v: rc>0? (1 - ((dateErrors+duplicates)/rc))*100 : 100},
      ]
      const R = 80, N = axes.length
      ctx.strokeStyle = '#e5e7eb'
      for (let r=20;r<=R;r+=20){ ctx.beginPath(); for(let i=0;i<N;i++){ const a=(i/N)*Math.PI*2- Math.PI/2; const x=Math.cos(a)*r, y=Math.sin(a)*r; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)} ctx.closePath(); ctx.stroke() }
      ctx.beginPath(); axes.forEach((ax,i)=>{ const a=(i/N)*Math.PI*2- Math.PI/2; const rr=(ax.v/100)*R; const x=Math.cos(a)*rr, y=Math.sin(a)*rr; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y) }); ctx.closePath(); ctx.fillStyle='rgba(0,196,154,0.3)'; ctx.strokeStyle='#00c49a'; ctx.fill(); ctx.stroke()
      imgs.radar = c.toDataURL('image/png')
    }

    // Timeline chart: placeholder from current score history (single point rendered as line)
    {
      const c = make(), ctx = c.getContext('2d');
      ctx.clearRect(0,0,W,H)
      const vals = [score-10, score-5, score, Math.max(0, score-2), Math.min(100, score+3)]
      ctx.strokeStyle = '#e5e7eb'; ctx.beginPath(); ctx.moveTo(20,H-30); ctx.lineTo(W-10,H-30); ctx.stroke()
      ctx.strokeStyle = '#3b82f6'; ctx.beginPath(); vals.forEach((v, i)=>{ const x=20+i*((W-40)/(vals.length-1)); const y=(H-40) - (v/100)*(H-60); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y) }); ctx.stroke()
      imgs.timeline = c.toDataURL('image/png')
    }
    return imgs
  }

  const openPrintableReport = (title, html) => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.open()
    w.document.write(`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            :root { --ink:#0a2540; --muted:#64748b; --accent:#00c49a; }
            body { font-family: system-ui, Segoe UI, Arial; margin: 0; color: var(--ink); background: #fff; }
            .topbar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #e5e7eb; }
            .topbar .left { display: flex; gap: 8px; align-items: center; }
            .title { font-weight: 700; }
            .btn { appearance: none; border: 1px solid #e5e7eb; background: #fff; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: 600; }
            .btn:hover { background: #f3f4f6; }
            .btn-accent { background: linear-gradient(135deg, #00c49a, #00a87d); color: #fff; border: none; }
            .container { max-width: 940px; margin: 0 auto; padding: 24px; }
            .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 12px 0; }
            h1,h2,h3 { margin: 6px 0; }
            small { color: var(--muted); }
            @media print { .topbar { display: none !important; } .container { padding: 0 12px; } a { color: inherit; text-decoration: none; } }
          </style>
        </head>
        <body>
          <div class="topbar">
            <div class="left">
              <button class="btn" onclick="window.close()">← Back</button>
              <span class="title">${title}</span>
            </div>
            <div class="right">
              <button class="btn" onclick="window.print()">🖨️ Print</button>
            </div>
          </div>
          <div class="container">${html}</div>
        </body>
      </html>`)
    w.document.close()
    setTimeout(()=>{ try { w.focus(); w.print(); } catch(_) {} }, 400)
  }

  const handleDownloadPDF = () => {
    if (!analysisData) return
    const rc = recordCount
    const ms = moduleStats || {}
    const imgs = buildChartsImages(rc, ms, analysisData.score)
    const chain = blockchains[selectedBlockchain]
    const generatedAt = new Date().toLocaleString()
    const html = `
      <h2>Compliance Analysis Report</h2>
      <div class="card">
        <div><strong>User:</strong> ${userName}</div>
        <div><strong>Country:</strong> ${countries[selectedCountry].name}</div>
        <div><strong>Blockchain:</strong> ${chain.name}</div>
        <div><strong>Overall Score:</strong> ${analysisData.score}%</div>
        <div><strong>Records:</strong> ${rc}</div>
        <div><strong>Generated At:</strong> ${generatedAt}</div>
      </div>
      <div class="card"><h3>Charts</h3>
        <div><strong>Compliance Breakdown</strong><br/><img src="${imgs.pie}"/></div>
        <div style="height:12px"></div>
        <div><strong>Module Scores</strong><br/><img src="${imgs.bar}"/></div>
        <div style="height:12px"></div>
        <div><strong>Radar</strong><br/><img src="${imgs.radar}"/></div>
        <div style="height:12px"></div>
        <div><strong>Timeline</strong><br/><img src="${imgs.timeline}"/></div>
      </div>
      <div class="card"><h3>Violations (${violations.length})</h3><pre style="white-space:pre-wrap">${violations.length? JSON.stringify(violations, null, 2): 'None'}</pre></div>
      <div class="card"><h3>Proof</h3><div>Hash: <code>${analysisData.proof_hash}</code></div></div>
    `
    openPrintableReport('Compliance Report', html)
  }

  const handleRunEngine = async () => {
    if (!file) {
      setResult('Please choose a CSV file first.')
      return
    }

    const token = localStorage.getItem('cs_token')
    const formData = new FormData()
    formData.append('file', file)
    
    const country = countries[selectedCountry]
    setResult(`<div>Running ${country.flag} ${country.name} compliance engine... ⏳</div>`) 
    
    try {
      const res = await fetch(`${API_BASE}/engine/run`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || 'Engine run failed')
      }
      
      const data = await res.json()
      setViolations(data.violations || [])
      setAnalysisData({ score: data.score, proof_hash: data.proof_hash })
      setRecordCount(data.record_count || 0)
      setModuleStats(data.module_stats || null)
      const rc = data.record_count || 0
      const ms = data.module_stats || {}
      const gstInvalid = ms.gst_invalid_count || 0
      const tdsMissing = ms.tds_missing_count || 0
      const cashExceeded = ms.cash_limit_exceeded_count || 0
      const cashStruct = ms.cash_structuring_suspected_count || 0
      const dateErrors = ms.date_errors_count || 0
      const duplicates = ms.duplicates_count || 0
      const nonCompliant = gstInvalid + tdsMissing + cashExceeded + cashStruct + dateErrors + duplicates
      const compliantPct = rc > 0 ? Math.max(0, Math.min(100, Math.round(((rc - nonCompliant) / rc) * 100))) : data.score
      const gstValidPct = rc > 0 ? Math.max(0, Math.min(100, Math.round(((rc - gstInvalid) / rc) * 100))) : 100

      let txResult
      const chain = blockchains[selectedBlockchain]
      if (data.tx_hash) {
        // Real blockchain transaction from backend
        txResult = {
          success: true,
          txHash: data.tx_hash,
          blockchain: chain.name,
          explorerUrl: getExplorerLink(selectedBlockchain, data.tx_hash),
          gasUsed: null, // Backend doesn't return gas details yet
          cost: null,
          confirmationTime: chain.confirmationTime,
          blockNumber: null
        }
      } else {
        // Fallback to client-side mock if backend not configured
        setResult(prev => `${prev}<br/>📦 Anchoring proof to ${chain.icon} ${chain.name}...`)
        txResult = await anchorProofToChain(selectedBlockchain, data.proof_hash)
      }
      setBlockchainTx(txResult)
      
      const generatedAt = new Date().toLocaleString()
      const htmlStr = `
        <div class="card" style="padding:16px">
          <h3>✅ Compliance Analysis Report</h3>
          
          <div style="margin: 16px 0; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #00c49a;">
            <div><strong>Country:</strong> ${country.flag} ${country.name}</div>
            <div><strong>Tax System:</strong> ${country.taxName}</div>
            <div><strong>Overall Compliance Score:</strong> <span style="color: #00c49a; font-size: 1.5em; font-weight: bold;">${data.score}%</span></div>
            <div><strong>Records Processed:</strong> ${rc}</div>
            <div><strong>Total Violations:</strong> ${data.violations.length}</div>
            <div><strong>Generated At:</strong> ${generatedAt}</div>
          </div>

          <h4 style="margin-top: 8px;">Module-wise Compliance</h4>
          <div class="modules" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
            <div class="mod card" style="padding:12px;">
              <div><strong>GST Format Check</strong></div>
              <div style="height:8px; background:#eef2ff; border-radius:6px; margin:8px 0;">
                <div style="width:${gstValidPct}%; height:8px; background:#00c49a; border-radius:6px;"></div>
              </div>
              <small>${gstValidPct}% valid • ${gstInvalid} invalid</small>
            </div>
            <div class="mod card" style="padding:12px;">
              <div><strong>TDS Deduction Check</strong></div>
              <div style="height:8px; background:#eef2ff; border-radius:6px; margin:8px 0;">
                <div style="width:${Math.max(0, Math.min(100, rc > 0 ? Math.round(((rc - tdsMissing) / rc) * 100) : 100))}%; height:8px; background:#00c49a; border-radius:6px;"></div>
              </div>
              <small>${tdsMissing} entries missing deduction</small>
            </div>
            <div class="mod card" style="padding:12px;">
              <div><strong>Cash Transaction Limit</strong></div>
              <div style="height:8px; background:#eef2ff; border-radius:6px; margin:8px 0;">
                <div style="width:${Math.max(0, Math.min(100, 100 - Math.round((cashExceeded / Math.max(1, rc)) * 100)))}%; height:8px; background:#00c49a; border-radius:6px;"></div>
              </div>
              <small>${cashExceeded} above limit${cashStruct ? ' • ' + cashStruct + ' structuring suspected' : ''}</small>
            </div>
            <div class="mod card" style="padding:12px;">
              <div><strong>Dates & Duplicates</strong></div>
              <div style="height:8px; background:#eef2ff; border-radius:6px; margin:8px 0;">
                <div style="width:${Math.max(0, Math.min(100, 100 - Math.round(((dateErrors + duplicates) / Math.max(1, rc)) * 100)))}%; height:8px; background:#00c49a; border-radius:6px;"></div>
              </div>
              <small>${dateErrors} date issues • ${duplicates} duplicates</small>
            </div>
          </div>

          <h4 style="margin-top: 16px;">Violations</h4>
          ${data.violations.length === 0 ? '<div>No violations detected.</div>' : ''}

          <div style="margin: 16px 0; padding: 12px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <div><strong>Blockchain:</strong> ${chain.icon} ${chain.name}</div>
            <div><strong>Transaction Hash:</strong> <code style="font-size: 0.85em;">${txResult.txHash}</code></div>
            <div><strong>Gas Cost:</strong> ${txResult.cost != null ? formatCurrency(txResult.cost, selectedCountry) + ' (~$' + txResult.cost + ')' : 'N/A'}</div>
            <div><strong>Confirmation:</strong> ${txResult.confirmationTime || 'N/A'}</div>
            <div><strong>Block:</strong> ${txResult.blockNumber != null ? '#' + txResult.blockNumber : 'N/A'}</div>
            <div style="margin-top: 8px;">
              <a href="${txResult.explorerUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline;">
                View on ${chain.name} Explorer →
              </a>
            </div>
          </div>

          <div style="margin: 16px 0;">
            <strong>Cryptographic Proof:</strong><br/>
            <code style="font-size: 0.8em; word-break: break-all;">${data.proof_hash}</code>
          </div>
          
          <details style="margin-top:16px">
            <summary style="cursor: pointer; font-weight: bold;">📋 Show Violation Details (${data.violations.length})</summary>
            <pre class="code" style="white-space:pre-wrap; margin-top: 8px;">${JSON.stringify(data.violations, null, 2)}</pre>
          </details>
        </div>
      `
      setResult(htmlStr)
      // Persist the report so it survives refresh/navigation
      try {
        localStorage.setItem('cs_report_html', htmlStr)
        localStorage.setItem('cs_report_violations', JSON.stringify(data.violations || []))
        localStorage.setItem('cs_report_analysisData', JSON.stringify({ score: data.score, proof_hash: data.proof_hash }))
        localStorage.setItem('cs_report_recordCount', String(rc))
        localStorage.setItem('cs_report_moduleStats', JSON.stringify(ms))
        localStorage.setItem('cs_report_generatedAt', generatedAt)
      } catch (e) {
        console.warn('Failed to persist report', e)
      }
      
    } catch (err) {
      console.error('Run engine failed', err)
      const msg = err && err.message ? err.message : 'Failed to run'
      if (msg.includes('Failed to fetch')) {
        setResult(`<div style="color: #ef4444;">❌ Could not reach backend at ${API_BASE}. Make sure the API server is running.</div>`)
      } else if (msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('401')) {
        setResult(`<div style="color: #ef4444;">❌ Session expired. Please sign in again.</div>`)
      } else {
        setResult(`<div style="color: #ef4444;">❌ ${msg}</div>`)
      }
    }
  }

  return (
    <>
      <Header activePage="dashboard" />
      <BackBar />

      <main>
        <section className="section hero-min">
          <div className="container">
            <div className="dashboard-header">
              <div className="dashboard-title-section">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-sub">
                  Signed in as <strong id="userName">{userName}</strong>. <span id="dashStatus">{dashStatus}</span>
                </p>
              </div>
              <DashboardDemo />
            </div>
          </div>
        </section>

        <section className="section light">
          <div className="container">
            <div className="config-section">
              <h2>⚙️ Configuration</h2>
              <div className="config-grid">
                <div className="config-card">
                  <label>🌍 Select Country</label>
                  <select 
                    value={selectedCountry} 
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="country-select"
                  >
                    {getCountryList().map(country => (
                      <option key={country.code} value={country.code}>
                        {country.display}
                      </option>
                    ))}
                  </select>
                  <div className="config-info">
                    <small>Tax System: <strong>{countries[selectedCountry].taxName}</strong></small><br/>
                    <small>Cash Limit: <strong>{formatCurrency(countries[selectedCountry].cashLimit, selectedCountry)}</strong></small>
                  </div>
                </div>

                <div className="config-card">
                  <label>⛓️ Select Blockchain</label>
                  <select 
                    value={selectedBlockchain} 
                    onChange={(e) => setSelectedBlockchain(e.target.value)}
                    className="blockchain-select"
                  >
                    {getBlockchainList().map(chain => (
                      <option key={chain.key} value={chain.key}>
                        {chain.display}
                      </option>
                    ))}
                  </select>
                  <div className="config-info">
                    <small>Avg Cost: <strong>~${blockchains[selectedBlockchain].avgTxCost}</strong></small><br/>
                    <small>Speed: <strong>{blockchains[selectedBlockchain].confirmationTime}</strong></small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section light">
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>📸 Or Scan Invoice with Camera</h2>
            <OCRInvoiceScanner onDataExtracted={(data) => {
              console.log('OCR Data:', data)
              // You can auto-fill form with this data
            }} />
          </div>
        </section>

        <section className="section" id="dashboardRoot">
          <div className="container">
            <div className="cards two">
              <div className="card">
                <h3>1. Upload CSV</h3>
                <p>Upload your transactions as a CSV file.</p>
                <input id="uploadCsv" type="file" accept=".csv" onChange={handleFileChange} />
                {file && (
                  <div style={{ marginTop: '8px', color: '#00c49a', fontSize: '0.9em' }}>
                    ✓ Selected: {file.name}
                  </div>
                )}
              </div>
              <div className="card">
                <h3>2. Run Engine</h3>
                <p>Analyze with {countries[selectedCountry].flag} {countries[selectedCountry].name} rules and anchor to {blockchains[selectedBlockchain].icon} {blockchains[selectedBlockchain].name}.</p>
                <button className="btn btn-accent" id="runEngine" onClick={handleRunEngine} disabled={!file}>
                  Run Compliance Check
                </button>
              </div>
            </div>
            <div style={{ height: '16px' }}></div>
            <div id="result" dangerouslySetInnerHTML={{ __html: result }}></div>
            
            {/* Analysis Control Buttons */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              {(result || violations.length > 0) && (
                <button 
                  className="btn btn-outline" 
                  onClick={handleClearAnalysis} 
                  style={{ marginRight: '12px' }}
                >
                  🗑️ Clear Analysis
                </button>
              )}
              {violations.length > 0 && (
                <button 
                  className="btn btn-accent" 
                  onClick={handleDownloadPDF}
                  style={{ marginRight: '12px' }}
                >
                  📄 Download Report
                </button>
              )}
              {analysisData && (
                <button 
                  className="btn btn-accent" 
                  onClick={handleGenerateVerifiedReport}
                >
                  ⛓️ Generate Blockchain-Verified Report
                </button>
              )}
            </div>
            
            {violations.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <AIComplianceAssistant violations={violations} />
              </div>
            )}
            
            <VoiceAIAssistant violations={violations} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
