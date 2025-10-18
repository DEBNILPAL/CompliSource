import { useEffect, useRef } from 'react'

export default function ComplianceModulesVisual() {
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

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 350)
    grad.addColorStop(0, '#f8fafc')
    grad.addColorStop(1, '#e0f2f1')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 500, 350)

    // Title
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 20px system-ui'
    ctx.fillText('Compliance Modules', 20, 35)

    // Module Cards
    const modules = [
      { name: 'GST Validator', icon: '📊', status: 'Active', color: accentColor },
      { name: 'Cash Limit', icon: '💰', status: 'Active', color: accentColor },
      { name: 'TDS Checker', icon: '📑', status: 'Coming Soon', color: '#94a3b8' },
      { name: 'Invoice Match', icon: '🧾', status: 'Coming Soon', color: '#94a3b8' }
    ]

    let x = 30
    let y = 60
    modules.forEach((module, i) => {
      // Card
      ctx.fillStyle = cardBg
      ctx.strokeStyle = module.color
      ctx.lineWidth = 3
      drawRoundRect(x, y, 210, 110, 12)
      ctx.fill()
      ctx.stroke()

      // Icon
      ctx.font = '40px system-ui'
      ctx.fillText(module.icon, x + 20, y + 55)

      // Name
      ctx.fillStyle = primaryColor
      ctx.font = 'bold 16px system-ui'
      ctx.fillText(module.name, x + 80, y + 35)

      // Status badge
      ctx.fillStyle = module.color
      drawRoundRect(x + 80, y + 50, 110, 24, 6)
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(module.status, x + 135, y + 67)
      ctx.textAlign = 'left'

      // Description
      ctx.fillStyle = '#64748b'
      ctx.font = '11px system-ui'
      const desc = module.name === 'GST Validator' ? 'Validates GST rates & amounts' :
                   module.name === 'Cash Limit' ? 'Checks cash transaction limits' :
                   module.name === 'TDS Checker' ? 'TDS compliance validation' :
                   'Invoice matching & verification'
      ctx.fillText(desc, x + 20, y + 95)

      // Move to next position
      if (i % 2 === 0) {
        x = 260
      } else {
        x = 30
        y += 130
      }
    })

    // Connection lines (showing modularity)
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    
    // Central hub circle
    ctx.fillStyle = accentColor
    ctx.beginPath()
    ctx.arc(250, 300, 25, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Engine', 250, 305)

    // Lines to modules
    ctx.beginPath()
    ctx.moveTo(130, 170)
    ctx.lineTo(250, 280)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(365, 170)
    ctx.lineTo(250, 280)
    ctx.stroke()

  }, [])

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}></canvas>
}
