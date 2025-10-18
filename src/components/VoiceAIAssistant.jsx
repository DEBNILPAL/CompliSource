import { useState, useEffect, useRef } from 'react'

export default function VoiceAIAssistant({ violations = [] }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript
        setTranscript(speechResult)
        handleVoiceQuery(speechResult)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [violations])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setTranscript('')
      setResponse('')
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
    if (synthRef.current) {
      synthRef.current.cancel() // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.lang = 'en-US'

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const getAIResponse = (query) => {
    const lowerQuery = query.toLowerCase()

    // Compliance score query
    if (lowerQuery.includes('score') || lowerQuery.includes('rating')) {
      const score = Math.max(0, 100 - violations.length * 5)
      return `Your current compliance score is ${score}%. ${
        score >= 90 ? 'Excellent! Your transactions are highly compliant.' :
        score >= 70 ? 'Good, but there are some violations to address.' :
        'Your compliance needs improvement. Please review the violations.'
      }`
    }

    // GST/Tax queries
    if (lowerQuery.includes('gst') || lowerQuery.includes('tax')) {
      return `GST compliance requires proper tax rates on all transactions. In India, GST rates are 5%, 12%, 18%, or 28% depending on the category. Make sure all transactions have correct tax rates applied.`
    }

    // Cash limit queries
    if (lowerQuery.includes('cash') || lowerQuery.includes('limit')) {
      return `Cash transaction limits vary by country. In India, cash transactions above 2 lakh rupees (approximately $2,400 USD) are not allowed. Large cash transactions must use banking channels.`
    }

    // Fix violations
    if (lowerQuery.includes('fix') || lowerQuery.includes('solve') || lowerQuery.includes('resolve')) {
      if (violations.length === 0) {
        return 'Great news! You have no violations to fix. Your compliance is up to date.'
      }
      return `To fix your ${violations.length} violation${violations.length > 1 ? 's' : ''}, review each flagged transaction, apply correct tax rates, ensure cash limits are respected, and verify all regulatory requirements are met. You can download a detailed PDF report for step-by-step guidance.`
    }

    // Explanation queries
    if (lowerQuery.includes('explain') || lowerQuery.includes('what is') || lowerQuery.includes('tell me')) {
      return `CompliSource is an AI-powered compliance platform that automatically checks your transactions against tax regulations, cash limits, and other rules. It uses blockchain technology to create tamper-proof compliance records and provides AI assistance for quick answers.`
    }

    // Report queries
    if (lowerQuery.includes('report') || lowerQuery.includes('pdf') || lowerQuery.includes('download')) {
      return `You can download a comprehensive PDF compliance report that includes your score, all violations, blockchain verification, and detailed analysis. Just click the Download PDF button after running the compliance engine.`
    }

    // Blockchain queries
    if (lowerQuery.includes('blockchain') || lowerQuery.includes('crypto') || lowerQuery.includes('proof')) {
      return `Your compliance data is anchored to the blockchain for immutable proof. We support 6 blockchains: Ethereum, Polygon, BSC, Arbitrum, Optimism, and Avalanche. This creates a cryptographic proof that your compliance records cannot be tampered with.`
    }

    // Multi-country queries
    if (lowerQuery.includes('country') || lowerQuery.includes('countries') || lowerQuery.includes('international')) {
      return `We support 7 countries: India, USA, UK, EU, Australia, Canada, and Singapore. Each has specific tax rules, currency handling, and regulatory requirements. You can select your country from the configuration panel.`
    }

    // VR/Visualization queries
    if (lowerQuery.includes('vr') || lowerQuery.includes('visual') || lowerQuery.includes('3d')) {
      return `Our VR compliance visualization lets you explore your compliance data in an immersive 3D environment. You can see connections between different compliance components like GST analysis, cash limits, tax rates, and blockchain proofs in a spatial interface.`
    }

    // Help queries
    if (lowerQuery.includes('help') || lowerQuery.includes('how')) {
      return `I can help you with compliance questions. Try asking about: your compliance score, GST or tax rules, cash limits, how to fix violations, blockchain verification, multi-country support, or generating reports. Just speak naturally and I'll assist you!`
    }

    // Greeting
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return `Hello! I'm your voice-controlled AI compliance assistant. I can answer questions about your compliance score, violations, tax rules, and more. What would you like to know?`
    }

    // Default response
    return `I understand you're asking about "${query}". I can help with compliance scores, GST rules, cash limits, violations, blockchain verification, and reports. Could you rephrase your question or ask something specific about compliance?`
  }

  const handleVoiceQuery = (query) => {
    const aiResponse = getAIResponse(query)
    setResponse(aiResponse)
    speak(aiResponse)
    
    setConversationHistory(prev => [...prev, {
      type: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString()
    }, {
      type: 'ai',
      text: aiResponse,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const handleTextQuery = () => {
    if (transcript.trim()) {
      handleVoiceQuery(transcript)
    }
  }

  const clearHistory = () => {
    setConversationHistory([])
    setTranscript('')
    setResponse('')
  }

  const quickQuestions = [
    "What's my compliance score?",
    "Explain GST rules",
    "How to fix violations?",
    "Tell me about blockchain proof"
  ]

  return (
    <div className="voice-ai-assistant">
      <div className="voice-ai-header">
        <h3>🎤 Voice-Controlled AI Assistant</h3>
        <p>Ask compliance questions using your voice or text</p>
      </div>

      <div className="voice-controls">
        <button
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking}
        >
          {isListening ? (
            <>
              <span className="pulse-ring"></span>
              <span className="mic-icon">🎤</span>
              <span>Listening...</span>
            </>
          ) : (
            <>
              <span className="mic-icon">🎤</span>
              <span>Start Voice Input</span>
            </>
          )}
        </button>

        {isSpeaking && (
          <button className="voice-btn stop-speaking" onClick={stopSpeaking}>
            <span>🔇</span>
            <span>Stop Speaking</span>
          </button>
        )}
      </div>

      {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
        <div className="voice-warning">
          ⚠️ Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
        </div>
      )}

      <div className="voice-input-section">
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            className="voice-text-input"
            placeholder="Or type your question here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextQuery()}
            style={{
              paddingRight: '50px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              padding: '12px 50px 12px 16px',
              fontSize: '14px',
              width: '100%',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <button
            className="send-icon-btn"
            onClick={handleTextQuery}
            disabled={!transcript.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: transcript.trim() ? '#3b82f6' : '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: transcript.trim() ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
              fontSize: '14px',
              color: transcript.trim() ? 'white' : '#9ca3af'
            }}
            onMouseEnter={(e) => {
              if (transcript.trim()) e.target.style.backgroundColor = '#2563eb'
            }}
            onMouseLeave={(e) => {
              if (transcript.trim()) e.target.style.backgroundColor = '#3b82f6'
            }}
          >
            ➤
          </button>
        </div>
      </div>

      <div className="quick-questions">
        <p className="quick-label">Quick Questions:</p>
        <div className="quick-btns">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              className="quick-question-btn"
              onClick={() => {
                setTranscript(q)
                handleVoiceQuery(q)
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {conversationHistory.length > 0 && (
        <div className="conversation-history">
          <div className="history-header">
            <h4>Conversation</h4>
            <button className="clear-btn" onClick={clearHistory}>Clear</button>
          </div>
          <div className="history-messages">
            {conversationHistory.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-icon">
                  {msg.type === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSpeaking && (
        <div className="speaking-indicator">
          <div className="sound-wave">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>AI is speaking...</p>
        </div>
      )}
    </div>
  )
}
