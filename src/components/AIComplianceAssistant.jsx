import { useState } from 'react'

export default function AIComplianceAssistant({ violations = [] }) {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  // Simulated AI responses (in production, this would call OpenAI API or local LLM)
  const getAIResponse = async (userQuery) => {
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const lowerQuery = userQuery.toLowerCase()
    
    // Rule-based AI responses for demo (replace with actual LLM in production)
    let aiResponse = ''
    
    if (lowerQuery.includes('score') || lowerQuery.includes('compliance')) {
      aiResponse = `Based on the analysis, your current compliance score reflects the overall health of your transactions. A score of 87.5% indicates good compliance with ${violations.length} violations detected. I recommend addressing the high-priority violations first to improve your score.`
    } else if (lowerQuery.includes('gst') || lowerQuery.includes('tax')) {
      const gstViolations = violations.filter(v => v.type?.includes('GST'))
      aiResponse = `I found ${gstViolations.length} GST-related issues. These occur when the tax rate applied doesn't match the prescribed rate for the goods/services category. To fix: Review each transaction, verify the correct GST rate from the HSN/SAC code, and update the invoice accordingly.`
    } else if (lowerQuery.includes('cash')) {
      aiResponse = `Cash transaction limits are regulatory requirements to prevent money laundering. In India, the limit is ₹2,00,000 per day. Any violation requires splitting large transactions or using alternative payment methods like bank transfers or digital payments.`
    } else if (lowerQuery.includes('fix') || lowerQuery.includes('solve')) {
      aiResponse = `Here's how to resolve your violations:\n\n1. **GST Mismatches**: Update tax rates to match HSN/SAC codes\n2. **Cash Limits**: Split transactions or use digital payments\n3. **Missing Data**: Add required fields like invoice numbers and dates\n\nWould you like me to suggest specific fixes for each violation?`
    } else if (lowerQuery.includes('explain') || lowerQuery.includes('what is')) {
      aiResponse = `Compliance violations occur when transactions don't meet regulatory requirements. Each violation has a severity level:\n\n• **High**: Immediate attention needed (legal/financial risk)\n• **Medium**: Should be fixed soon (audit risk)\n• **Low**: Minor issues (best practice)\n\nYour violations are categorized and prioritized automatically.`
    } else if (lowerQuery.includes('report') || lowerQuery.includes('pdf')) {
      aiResponse = `I can generate a comprehensive compliance report with:\n• Executive summary of your score\n• Detailed violation breakdown\n• Recommended actions\n• Historical trends\n• Blockchain proof verification\n\nThe report is audit-ready and can be shared with regulators or management.`
    } else {
      aiResponse = `I'm your AI Compliance Assistant! I can help you:\n\n• Understand your compliance score\n• Explain violations in simple terms\n• Suggest fixes for issues\n• Generate reports\n• Answer regulatory questions\n\nTry asking: "How do I fix GST violations?" or "Explain my compliance score"`
    }
    
    setResponse(aiResponse)
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      getAIResponse(query)
    }
  }

  const quickQuestions = [
    "What's my compliance score?",
    "How do I fix GST violations?",
    "Explain cash limit rules",
    "Generate a compliance report"
  ]

  return (
    <div className="ai-assistant-card">
      <div className="ai-assistant-header">
        <h3>🤖 AI Compliance Assistant</h3>
        <p>Ask me anything about your compliance data</p>
      </div>

      <form onSubmit={handleSubmit} className="ai-input-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me about compliance..."
          className="ai-input"
          disabled={loading}
        />
        <button type="submit" className="btn btn-accent" disabled={loading}>
          {loading ? '🔄 Thinking...' : '📤 Ask'}
        </button>
      </form>

      <div className="quick-questions">
        <p className="quick-label">Quick questions:</p>
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(q)
              getAIResponse(q)
            }}
            className="quick-question-btn"
            disabled={loading}
          >
            {q}
          </button>
        ))}
      </div>

      {response && (
        <div className="ai-response">
          <div className="response-header">
            <span className="ai-icon">💡</span>
            <strong>AI Response:</strong>
          </div>
          <p className="response-text">{response}</p>
        </div>
      )}

      {loading && (
        <div className="ai-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Analyzing your compliance data...</p>
        </div>
      )}
    </div>
  )
}
