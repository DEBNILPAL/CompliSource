import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackBar from '../components/BackBar'

export default function HelpPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  // Load conversation history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('helpChatMessages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Initialize with a welcome message
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        text: 'Hello! I\'m your AI assistant for CompliSource. Ask me anything about compliance, blockchain, or using the platform.',
        timestamp: new Date().toISOString()
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('helpChatMessages', JSON.stringify(messages))
  }, [messages])

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simulate RAG-based AI response (in a real app, this would query a vector DB and LLM)
  const getAIResponse = (userQuestion) => {
    // Simple keyword-based responses for demo (RAG simulation)
    const lowerQuestion = userQuestion.toLowerCase()

    if (lowerQuestion.includes('csv') || lowerQuestion.includes('upload')) {
      return 'For CSV uploads, ensure your file has columns: txn_id, date, amount, type, party, gstin, notes. Use UTF-8 encoding and valid dates. Example: txn_id,date,amount,type,party,gstin,notes\\nTXN001,2025-08-15,50000,GST,Alpha Traders,27ABCDE1234F1Z5,Invoice #A-101'
    } else if (lowerQuestion.includes('blockchain') || lowerQuestion.includes('proof')) {
      return 'Blockchain proofs are anchored on-chain for immutability. We use CompliRegistry.sol on Ethereum/Sepolia. Each run generates a SHA-256 hash stored tamper-proof. Verify via Etherscan explorer links in reports.'
    } else if (lowerQuestion.includes('dashboard') || lowerQuestion.includes('login')) {
      return 'Access the dashboard after logging in. Upload CSVs, select country/blockchain, run engine, and download PDF reports. Login persists your session.'
    } else if (lowerQuestion.includes('violation') || lowerQuestion.includes('error')) {
      return 'Common violations: cash limits (>₹2L), missing TDS (>₹50K GST), invalid GSTIN. AI assistant in dashboard provides suggestions. Check user guide for CSV format.'
    } else {
      return 'I can help with CSV formats, blockchain proofs, dashboard usage, violations, and platform features. For technical issues, email support@complisource.com or check the prototype explanation.'
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = getAIResponse(input)
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleClear = () => {
    setMessages([])
    localStorage.removeItem('helpChatMessages')
  }

  const handleDownload = () => {
    const chatText = messages.map(msg =>
      `${msg.type === 'user' ? 'You' : 'AI'}: ${msg.text} (${new Date(msg.timestamp).toLocaleString()})`
    ).join('\n\n')

    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'help_chat_report.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Header activePage="help" />
      <BackBar />
      <main>
        <section className="section hero-min">
          <div className="container">
            <h1 className="page-title">AI Help Desk</h1>
            <p className="page-sub">Intelligent support powered by RAG for personalized assistance.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="card" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3>Chat with AI Assistant</h3>
                <div>
                  <button className="btn btn-outline" onClick={handleClear} style={{ marginRight: '8px' }}>
                    Clear Chat
                  </button>
                  <button className="btn btn-accent" onClick={handleDownload}>
                    Download Report
                  </button>
                </div>
              </div>

              <div style={{
                height: '400px',
                overflowY: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                backgroundColor: '#f9fafb'
              }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{
                    marginBottom: '12px',
                    textAlign: msg.type === 'user' ? 'right' : 'left'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      maxWidth: '70%',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: msg.type === 'user' ? '#007bff' : '#e9ecef',
                      color: msg.type === 'user' ? 'white' : 'black'
                    }}>
                      <p style={{ margin: 0 }}>{msg.text}</p>
                      <small style={{ opacity: 0.7 }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: '#e9ecef'
                    }}>
                      <p style={{ margin: 0 }}>AI is typing...</p>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about compliance, blockchain, or platform usage..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #d7e0ea',
                    borderRadius: '8px'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="btn btn-accent" onClick={handleSend} disabled={!input.trim() || isLoading}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
