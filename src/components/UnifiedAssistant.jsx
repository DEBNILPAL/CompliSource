import { useEffect, useRef, useState } from 'react'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

export default function UnifiedAssistant({ violations = [], score = null }) {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState([]) // {role: 'user'|'assistant', content: string, ts: string}

  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)

  // Init browser SpeechRecognition if supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = false
      rec.lang = 'en-US'

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript
        setInput(text)
        handleSubmit(text)
      }
      rec.onerror = () => setIsListening(false)
      rec.onend = () => setIsListening(false)
      recognitionRef.current = rec
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
      if (synthRef.current) synthRef.current.cancel()
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isSpeaking) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text) => {
    if (!synthRef.current) return
    try {
      synthRef.current.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 1.0
      u.pitch = 1.0
      u.volume = 1.0
      u.lang = 'en-US'
      u.onstart = () => setIsSpeaking(true)
      u.onend = () => setIsSpeaking(false)
      u.onerror = () => setIsSpeaking(false)
      synthRef.current.speak(u)
    } catch (_) {}
  }

  // Simple intent router: decides between finance/gst vs general/RAGish
  const routeIntent = (q) => {
    const t = q.toLowerCase()
    const financeKeywords = [
      'gst','tax','tds','invoice','hsn','sac','turnover','gstr','itc','input tax credit','cash limit','compliance score'
    ]
    const isFinance = financeKeywords.some(k => t.includes(k))
    return isFinance ? 'finance' : 'rag'
  }

  // Finance/GST answer using analyzed score if available (keeps parity with dashboard)
  const financeAnswer = (q) => {
    const t = q.toLowerCase()
    if (t.includes('score') || t.includes('compliance')) {
      const s = Number.isFinite(score) ? Number(score) : Math.max(0, 100 - violations.length * 5)
      return `Your current compliance score is ${s}%. ${
        s >= 90 ? 'Excellent compliance.' : s >= 70 ? 'Good, but review violations.' : 'Needs improvement. Address the listed violations.'
      }`
    }
    if (t.includes('gst') || t.includes('tax')) {
      const gstIssues = violations.filter(v => (v.type||'').toLowerCase().includes('gst'))
      return `GST overview: common issues include incorrect rates, invalid GSTIN formats, and wrong HSN/SAC. I see ${gstIssues.length} GST-related issues in your data. Validate HSN/SAC and update invoices.`
    }
    if (t.includes('cash')) {
      return 'Cash transaction limit reference: in India, transactions above ₹2,00,000 in cash are restricted. Prefer banking channels for large amounts.'
    }
    if (t.includes('fix') || t.includes('resolve') || t.includes('solve')) {
      return `Resolution steps: 1) Correct GST rates via HSN/SAC. 2) Ensure TDS where applicable. 3) Keep cash below threshold or use digital payments. 4) Fix dates/duplicate invoices.`
    }
    return 'I can help with GST rules, TDS, cash limits, invoices, and your compliance score. Ask something specific or say "generate report" after analysis.'
  }

  // General/RAG-like placeholder answer
  const ragAnswer = (q) => {
    const t = q.toLowerCase()
    if (t.includes('blockchain')) {
      return 'Compliance records can be anchored to blockchains like Polygon or Ethereum to provide tamper-evident proofs.'
    }
    if (t.includes('report') || t.includes('pdf') || t.includes('download')) {
      return 'You can generate a compliance PDF report from the dashboard after running the engine.'
    }
    if (t.includes('help') || t.includes('how')) {
      return 'Try asking: what is my compliance score, how to fix GST issues, or explain cash limit rules.'
    }
    if (t.includes('hello') || t.includes('hi') || t.includes('hey')) {
      return "Hello! I'm your unified AI assistant for compliance and finance. How can I help?"
    }
    return `I understand you're asking about "${q}". I can answer compliance, GST/finance, and general platform questions.`
  }

  const answer = (q) => {
    const intent = routeIntent(q)
    return intent === 'finance' ? financeAnswer(q) : ragAnswer(q)
  }

  const handleSubmit = async (maybeText) => {
    const text = typeof maybeText === 'string' ? maybeText : input
    if (!text.trim()) return

    const ts = new Date().toLocaleTimeString()
    const ts2 = new Date().toLocaleTimeString()
    setMessages(prev => [...prev, { role: 'user', content: text, ts }, { role: 'assistant', content: '', ts: ts2 }])
    setInput('')

    let finalText = ''
    try {
      const token = localStorage.getItem('cs_token')
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: text, violations, score })
      })
      if (!res.ok || !res.body) throw new Error('chat_failed')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        finalText += chunk
        setMessages(prev => {
          const copy = [...prev]
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === 'assistant') { copy[i] = { ...copy[i], content: finalText }; break }
          }
          return copy
        })
      }
    } catch (_) {
      finalText = answer(text)
      setMessages(prev => {
        const copy = [...prev]
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === 'assistant') { copy[i] = { ...copy[i], content: finalText }; break }
        }
        return copy
      })
    }
    if (finalText) speak(finalText)
  }

  const clearChat = () => {
    setMessages([])
    setInput('')
    if (synthRef.current) synthRef.current.cancel()
  }

  const quick = [
    "What's my compliance score?",
    'Explain GST rules',
    'How to fix violations?',
    'Tell me about blockchain proof'
  ]

  return (
    <div className="ai-assistant-card">
      <div className="ai-assistant-header">
        <h3>🧠 Unified AI Assistant</h3>
        <p>Text and voice assistant for RAG/general and Finance/GST queries</p>
      </div>

      <div className="voice-controls" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className={`voice-btn ${isListening ? 'listening' : ''}`} onClick={isListening ? stopListening : startListening} disabled={isSpeaking}>
          {isListening ? '🎤 Listening…' : '🎤 Start Voice'}
        </button>
        {isSpeaking && (
          <button className="voice-btn stop-speaking" onClick={() => { if (synthRef.current) synthRef.current.cancel(); setIsSpeaking(false) }}>🔇 Stop Speaking</button>
        )}
        {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
          <div className="voice-warning">⚠️ Voice recognition not supported in this browser.</div>
        )}
      </div>

      <div className="ai-input-form" style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about compliance, GST, or the platform…"
          className="ai-input"
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
        />
        <button className="btn btn-accent" onClick={() => handleSubmit()}>📤 Ask</button>
        <button className="btn btn-outline" onClick={clearChat}>🧹 Clear</button>
      </div>

      <div className="quick-questions" style={{ marginTop: 8 }}>
        <p className="quick-label">Quick questions:</p>
        {quick.map((q, i) => (
          <button key={i} className="quick-question-btn" onClick={() => handleSubmit(q)}>{q}</button>
        ))}
      </div>

      {messages.length > 0 && (
        <div className="conversation-history" style={{ marginTop: 12 }}>
          <div className="history-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <div className="message-icon">{m.role === 'user' ? '👤' : '🤖'}</div>
                <div className="message-content">
                  <div className="message-text">{m.content}</div>
                  <div className="message-time">{m.ts}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
