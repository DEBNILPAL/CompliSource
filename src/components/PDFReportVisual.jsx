import { useEffect, useRef } from 'react'

export default function PDFReportVisual() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = 500 * dpr
    canvas.height = 350 * dpr
    canvas.style.width = '100%'
    canvas.style.height = 'auto'
    ctx.scale(dpr, dpr)

    const accentColor = '#00c49a'
    const primaryColor = '#0a2540'
    const cardBg = '#ffffff'

    function drawRoundRect(x, y, width, height, radius) {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }

    // Background
    ctx.fillStyle = '#f1f5f9'
    ctx.fillRect(0, 0, 500, 350)

    // PDF Document (main)
    ctx.fillStyle = cardBg
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 2
    drawRoundRect(100, 30, 300, 290, 8)
    ctx.fill()
    ctx.stroke()

    // PDF corner fold
    ctx.fillStyle = '#e2e8f0'
    ctx.beginPath()
    ctx.moveTo(380, 30)
    ctx.lineTo(380, 50)
    ctx.lineTo(400, 50)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    ctx.stroke()

    // Header with logo area
    ctx.fillStyle = accentColor
    ctx.fillRect(100, 30, 300, 50)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px system-ui'
    ctx.fillText('COMPLIANCE REPORT', 120, 60)

    // Logo placeholder
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    drawRoundRect(340, 40, 40, 30, 4)
    ctx.stroke()
    ctx.font = 'bold 10px system-ui'
    ctx.fillText('LOGO', 350, 60)

    // Report content
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 14px system-ui'
    ctx.fillText('Compliance Score Summary', 120, 110)

    // Score box
    ctx.fillStyle = accentColor
    ctx.globalAlpha = 0.1
    drawRoundRect(120, 125, 100, 60, 8)
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = accentColor
    ctx.font = 'bold 32px system-ui'
    ctx.fillText('87.5', 140, 165)

    ctx.font = '12px system-ui'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Overall Score', 130, 180)

    // Details section
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 12px system-ui'
    ctx.fillText('Analysis Details:', 250, 140)

    ctx.font = '11px system-ui'
    ctx.fillStyle = '#64748b'
    ctx.fillText('• Total Transactions: 1,234', 250, 160)
    ctx.fillText('• Violations Found: 6', 250, 175)
    ctx.fillText('• Modules Run: 2', 250, 190)

    // Table header
    ctx.fillStyle = '#f1f5f9'
    ctx.fillRect(120, 200, 260, 25)

    ctx.fillStyle = primaryColor
    ctx.font = 'bold 11px system-ui'
    ctx.fillText('Violation Type', 130, 215)
    ctx.fillText('Count', 280, 215)
    ctx.fillText('Severity', 330, 215)

    // Table rows
    const violations = [
      { type: 'GST Mismatch', count: '3', severity: 'High', color: '#ef4444' },
      { type: 'Cash Limit', count: '1', severity: 'Medium', color: '#f59e0b' },
      { type: 'Missing Data', count: '2', severity: 'Low', color: '#3b82f6' }
    ]

    let yPos = 240
    violations.forEach((v, i) => {
      if (i % 2 === 1) {
        ctx.fillStyle = '#f9fafb'
        ctx.fillRect(120, yPos - 15, 260, 20)
      }

      ctx.fillStyle = '#64748b'
      ctx.font = '10px system-ui'
      ctx.fillText(v.type, 130, yPos)
      ctx.fillText(v.count, 290, yPos)

      // Severity badge
      ctx.fillStyle = v.color
      ctx.globalAlpha = 0.2
      drawRoundRect(330, yPos - 12, 40, 15, 4)
      ctx.fill()
      ctx.globalAlpha = 1

      ctx.fillStyle = v.color
      ctx.font = 'bold 9px system-ui'
      ctx.fillText(v.severity, 335, yPos)

      yPos += 25
    })

    // Footer
    ctx.fillStyle = '#f1f5f9'
    ctx.fillRect(100, 295, 300, 25)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '9px system-ui'
    ctx.fillText('Generated on: 2025-10-17 | Powered by CompliSource', 120, 310)

    // Download button (hovering)
    ctx.fillStyle = accentColor
    ctx.shadowColor = 'rgba(0, 196, 154, 0.3)'
    ctx.shadowBlur = 15
    drawRoundRect(420, 150, 60, 60, 12)
    ctx.fill()
    ctx.shadowBlur = 0

    // Download icon
    ctx.strokeStyle = '#ffffff'
    ctx.fillStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'

    // Arrow down
    ctx.beginPath()
    ctx.moveTo(450, 170)
    ctx.lineTo(450, 195)
    ctx.stroke()

    // Arrowhead
    ctx.beginPath()
    ctx.moveTo(450, 195)
    ctx.lineTo(445, 188)
    ctx.lineTo(455, 188)
    ctx.closePath()
    ctx.fill()

    // Tray
    ctx.beginPath()
    ctx.moveTo(440, 198)
    ctx.lineTo(440, 202)
    ctx.lineTo(460, 202)
    ctx.lineTo(460, 198)
    ctx.stroke()

    ctx.font = '9px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Download', 450, 225)

  }, [])

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}></canvas>
}
