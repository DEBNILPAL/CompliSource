import { useEffect, useRef } from 'react'

export default function ComplianceScoreVisual() {
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
    const warningColor = '#f59e0b'
    const dangerColor = '#ef4444'

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, 350)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(1, '#f0fdf4')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 500, 350)

    // Circular Progress (Large Score Display)
    const centerX = 150
    const centerY = 175
    const radius = 100

    // Background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 20
    ctx.stroke()

    // Animation targets
    const targetScore = 87.5
    const trendScores = [72, 75, 78, 82, 85, 87.5]

    let start = null
    const duration = 1200 // ms

    const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius)
    gradient.addColorStop(0, accentColor)
    gradient.addColorStop(1, '#00d7b3')

    function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3) }

    function draw(progress){
      // Clear frame
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      // Background
      const grad2 = ctx.createLinearGradient(0, 0, 0, 350)
      grad2.addColorStop(0, '#ffffff')
      grad2.addColorStop(1, '#f0fdf4')
      ctx.fillStyle = grad2
      ctx.fillRect(0, 0, 500, 350)

      // Background circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 20
      ctx.stroke()

      const eased = easeOutCubic(progress)
      const currentScore = targetScore * eased
      const endAngle = -Math.PI / 2 + (currentScore / 100) * Math.PI * 2

      // Foreground score arc
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle)
      ctx.strokeStyle = gradient
      ctx.lineWidth = 20
      ctx.lineCap = 'round'
      ctx.stroke()

      // Score text
      ctx.fillStyle = primaryColor
      ctx.font = 'bold 52px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(currentScore.toFixed(1), centerX, centerY + 10)

    ctx.font = '16px system-ui'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Compliance Score', centerX, centerY + 35)

    // Trend Chart
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 18px system-ui'
    ctx.textAlign = 'left'
    ctx.fillText('Score Trend', 320, 40)

    // Chart area
    const chartX = 320
    const chartY = 60
    const chartWidth = 160
    const chartHeight = 120

    // Grid lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = chartY + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(chartX, y)
      ctx.lineTo(chartX + chartWidth, y)
      ctx.stroke()
    }

    // Score line (animate reveal)
    const visiblePoints = Math.max(2, Math.floor(eased * trendScores.length))
    ctx.beginPath()
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 3
    for (let i = 0; i < visiblePoints; i++) {
      const s = trendScores[i]
      const x = chartX + (chartWidth / (trendScores.length - 1)) * i
      const y = chartY + chartHeight - (s / 100) * chartHeight
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      // Data point
      ctx.fillStyle = accentColor
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.stroke()

    // Labels
    ctx.fillStyle = '#64748b'
    ctx.font = '10px system-ui'
    ctx.textAlign = 'center'
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    months.forEach((month, i) => {
      const x = chartX + (chartWidth / (months.length - 1)) * i
      ctx.fillText(month, x, chartY + chartHeight + 15)
    })

    // Status indicators
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 16px system-ui'
    ctx.textAlign = 'left'
    ctx.fillText('Status Breakdown', 320, 220)

    const statuses = [
      { label: 'Excellent', range: '90-100', color: accentColor, percent: 0 },
      { label: 'Good', range: '70-89', color: accentColor, percent: 87.5 },
      { label: 'Fair', range: '50-69', color: warningColor, percent: 0 },
      { label: 'Poor', range: '0-49', color: dangerColor, percent: 0 }
    ]

    let yPos = 245
    statuses.forEach(status => {
      // Dot indicator
      ctx.fillStyle = status.color
      ctx.beginPath()
      ctx.arc(330, yPos, 6, 0, Math.PI * 2)
      ctx.fill()

      // Text
      ctx.fillStyle = primaryColor
      ctx.font = 'bold 13px system-ui'
      ctx.fillText(status.label, 345, yPos + 5)

      ctx.font = '11px system-ui'
      ctx.fillStyle = '#64748b'
      ctx.fillText(status.range, 410, yPos + 5)

      // Current marker
      if (status.percent > 0) {
        ctx.fillStyle = accentColor
        ctx.font = 'bold 11px system-ui'
        ctx.fillText('← Current', 460, yPos + 5)
      }

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
