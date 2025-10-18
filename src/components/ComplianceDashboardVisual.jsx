import { useEffect, useRef } from 'react'

export default function ComplianceDashboardVisual() {
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

    // Colors
    const bgColor = '#f8fafc'
    const cardBg = '#ffffff'
    const primaryColor = '#0a2540'
    const accentColor = '#00c49a'
    const warningColor = '#f59e0b'
    const dangerColor = '#ef4444'

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

    // Animation targets
    const targetScore = 87.5
    const violations = [
      { label: 'GST Mismatch', count: 3, color: dangerColor },
      { label: 'Cash Limit', count: 1, color: warningColor },
      { label: 'Missing Data', count: 2, color: dangerColor }
    ]
    const rows = [
      { date: '2025-10-17', score: 87.5, violations: 6, status: 'Complete' },
      { date: '2025-10-16', score: 92.3, violations: 2, status: 'Complete' }
    ]

    let start = null
    const duration = 1200 // ms

    function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3) }

    function draw(progress){
      const eased = easeOutCubic(progress)

      // Background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, 500, 350)

      // Header bar
      ctx.fillStyle = primaryColor
      ctx.fillRect(0, 0, 500, 50)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px system-ui'
      ctx.fillText('Compliance Dashboard', 20, 30)

      // Score Card (Large)
      ctx.fillStyle = cardBg
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 2
      drawRoundRect(20, 70, 200, 120, 12)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = primaryColor
      ctx.font = 'bold 14px system-ui'
      ctx.fillText('Overall Score', 30, 95)

      const currentScore = (targetScore * eased).toFixed(1)
      ctx.fillStyle = accentColor
      ctx.font = 'bold 48px system-ui'
      ctx.fillText(currentScore, 30, 145)

      ctx.fillStyle = primaryColor
      ctx.font = '12px system-ui'
      ctx.fillText('Last updated: Today', 30, 175)

      // Violations Card
      ctx.fillStyle = cardBg
      drawRoundRect(240, 70, 240, 120, 12)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = primaryColor
      ctx.font = 'bold 14px system-ui'
      ctx.fillText('Flagged Transactions', 250, 95)

      // Draw mini violation bars (animate width and count)
      let yPos = 115
      violations.forEach(v => {
        ctx.fillStyle = '#f1f5f9'
        drawRoundRect(250, yPos, 210, 18, 4)
        ctx.fill()

        const barWidth = ((v.count / 3) * 140) * eased
        ctx.fillStyle = v.color
        drawRoundRect(250, yPos, Math.max(4, barWidth), 18, 4)
        ctx.fill()

        ctx.fillStyle = primaryColor
        ctx.font = '11px system-ui'
        ctx.fillText(v.label, 255, yPos + 13)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 11px system-ui'
        const currentCount = Math.max(1, Math.round(v.count * eased))
        ctx.fillText(currentCount.toString(), 255 + Math.max(4, barWidth) - 15, yPos + 13)

        yPos += 25
      })

      // Recent Runs Table
      ctx.fillStyle = cardBg
      drawRoundRect(20, 210, 460, 120, 12)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = primaryColor
      ctx.font = 'bold 14px system-ui'
      ctx.fillText('Recent Compliance Runs', 30, 235)

      // Table headers
      ctx.fillStyle = '#f1f5f9'
      ctx.fillRect(30, 245, 440, 25)
      
      ctx.fillStyle = primaryColor
      ctx.font = 'bold 11px system-ui'
      ctx.fillText('Date', 40, 262)
      ctx.fillText('Score', 150, 262)
      ctx.fillText('Violations', 230, 262)
      ctx.fillText('Status', 350, 262)

      // Table rows (fade in)
      yPos = 285
      rows.forEach((row, i) => {
        const rowAlpha = Math.min(1, Math.max(0, (eased * 2) - i * 0.6))
        ctx.globalAlpha = rowAlpha
        if (i % 2 === 0) {
          ctx.fillStyle = '#f9fafb'
          ctx.fillRect(30, yPos - 15, 440, 25)
        }

        ctx.fillStyle = primaryColor
        ctx.font = '11px system-ui'
        ctx.fillText(row.date, 40, yPos)
        
        ctx.fillStyle = accentColor
        ctx.font = 'bold 11px system-ui'
        ctx.fillText(row.score.toFixed(1), 150, yPos)
        
        ctx.fillStyle = row.violations > 3 ? dangerColor : warningColor
        ctx.fillText(String(row.violations), 230, yPos)
        
        ctx.fillStyle = accentColor
        ctx.fillText('✓ ' + row.status, 350, yPos)
        ctx.globalAlpha = 1

        yPos += 25
      })
    }

    function step(timestamp){
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(1, elapsed / duration)
      draw(progress)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)

  }, [])

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}></canvas>
}
