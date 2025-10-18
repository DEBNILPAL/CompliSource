import { useState } from 'react'

export default function WhatsAppBotDemo() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'नमस्ते! 👋 I am CompliSource WhatsApp Bot. Send me your invoice and I will check compliance instantly!',
      time: '10:30 AM'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const botResponses = {
    'hello': 'Hello! How can I help you with compliance today? 😊',
    'hi': 'Hi there! Ready to check your invoices? 📄',
    'help': `I can help you with:
    
1️⃣ Check invoice compliance (send photo)
2️⃣ GST verification
3️⃣ Get compliance score
4️⃣ Download reports
5️⃣ Ask compliance questions

What would you like to do?`,
    'score': 'Your current compliance score is 87.5% ✅\n\nYou have 3 violations to fix. Type "violations" to see details.',
    'violations': `Found 3 violations:\n
1. Missing GST on INV-1234 (₹50,000)
2. Cash transaction exceeds limit (₹2,50,000)
3. Wrong GST rate on INV-5678 (28% should be 18%)

Type "fix" to get solutions.`,
    'fix': `Solutions for your violations:

1️⃣ For Missing GST:
- Add 18% GST to invoice
- File revised return
- Pay ₹9,000 GST

2️⃣ For Cash Limit:
- Use banking channel
- Split into smaller transactions
- Keep proper documentation

3️⃣ For Wrong GST Rate:
- Issue credit note
- Reissue with correct rate
- File amendment`,
    'report': 'Generating your compliance report... 📊\n\n✅ Done! Download here: complisource.com/report/abc123\n\nThe report includes:\n✓ Compliance score\n✓ All violations\n✓ Blockchain proof\n✓ Recommendations',
    'gst': 'GST rates in India:\n\n5% - Essential goods\n12% - Standard goods\n18% - Most goods & services\n28% - Luxury items\n\nWhat would you like to know more about?',
    'मेरा स्कोर': 'आपका अनुपालन स्कोर 87.5% है ✅\n\n3 उल्लंघन ठीक करने हैं। विवरण के लिए "उल्लंघन" टाइप करें।',
    'hindi': 'हाँ, मैं हिंदी में बात कर सकता हूँ! 🇮🇳\n\nमैं आपकी कैसे मदद कर सकता हूँ?'
  }

  const addMessage = (type, text) => {
    const newMessage = {
      type,
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    // Add user message
    addMessage('user', inputText)
    const userInput = inputText.toLowerCase().trim()
    setInputText('')

    // Simulate typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      
      // Find matching response
      let response = botResponses[userInput]
      
      if (!response) {
        // Check for partial matches
        if (userInput.includes('score') || userInput.includes('स्कोर')) {
          response = botResponses['score']
        } else if (userInput.includes('violation') || userInput.includes('उल्लंघन')) {
          response = botResponses['violations']
        } else if (userInput.includes('gst')) {
          response = botResponses['gst']
        } else if (userInput.includes('report') || userInput.includes('रिपोर्ट')) {
          response = botResponses['report']
        } else if (userInput.includes('help') || userInput.includes('मदद')) {
          response = botResponses['help']
        } else if (userInput.includes('हिंदी') || userInput.includes('hindi')) {
          response = botResponses['hindi']
        } else {
          response = `I understand you're asking about "${inputText}". Let me help you with that!\n\nFor detailed information, type "help" or ask me specific questions about:\n• Compliance score\n• GST rules\n• Violations\n• Reports`
        }
      }
      
      addMessage('bot', response)
    }, 1500)
  }

  const handleQuickAction = (action) => {
    setInputText(action)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleFileUpload = () => {
    addMessage('user', '📎 invoice_jan_2025.jpg')
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      addMessage('bot', `✅ Invoice scanned successfully!\n\n📄 Invoice Details:
• Number: INV-2025-001
• Date: 15 Jan 2025
• Amount: ₹45,000
• GST: ₹8,100 (18%)
• Party: ABC Traders
• GSTIN: 29ABCDE1234F1Z5 ✓ Valid

🎯 Compliance Status: PASS ✅
No violations found!

Would you like to:
1. Add to dashboard
2. Download report
3. Check another invoice`)
    }, 2000)
  }

  return (
    <div className="whatsapp-bot-demo">
      <div className="whatsapp-header">
        <div className="header-left">
          <div className="bot-avatar">🤖</div>
          <div className="bot-info">
            <h4>CompliSource Bot</h4>
            <span className="status">Online</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn">📞</button>
          <button className="icon-btn">⋮</button>
        </div>
      </div>

      <div className="chat-background">
        <div className="messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <div className="message-bubble">
                <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <button className="quick-btn" onClick={() => handleQuickAction('score')}>
          📊 My Score
        </button>
        <button className="quick-btn" onClick={() => handleQuickAction('violations')}>
          ⚠️ Violations
        </button>
        <button className="quick-btn" onClick={() => handleQuickAction('report')}>
          📄 Report
        </button>
        <button className="quick-btn" onClick={() => handleQuickAction('help')}>
          ❓ Help
        </button>
      </div>

      <div className="chat-input-container">
        <button className="attach-btn" onClick={handleFileUpload}>
          📎
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message or send invoice..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="send-btn" onClick={handleSendMessage}>
          {inputText.trim() ? '📤' : '🎤'}
        </button>
      </div>

      <div className="whatsapp-features">
        <div className="feature-tag">
          <span>🌍</span>
          <small>500M+ Users</small>
        </div>
        <div className="feature-tag">
          <span>🇮🇳</span>
          <small>Hindi/English</small>
        </div>
        <div className="feature-tag">
          <span>📸</span>
          <small>Photo Support</small>
        </div>
        <div className="feature-tag">
          <span>🎤</span>
          <small>Voice Messages</small>
        </div>
      </div>
    </div>
  )
}
