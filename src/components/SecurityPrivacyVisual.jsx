import { useEffect, useRef } from 'react'

export default function SecurityPrivacyVisual() {
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
    const grad = ctx.createRadialGradient(250, 175, 50, 250, 175, 300)
    grad.addColorStop(0, '#ecfdf5')
    grad.addColorStop(1, '#f8fafc')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 500, 350)

    // Large shield in center
    ctx.fillStyle = accentColor
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 4

    // Shield shape
    ctx.beginPath()
    ctx.moveTo(250, 60)
    ctx.lineTo(320, 90)
    ctx.lineTo(320, 150)
    ctx.quadraticCurveTo(320, 200, 250, 230)
    ctx.quadraticCurveTo(180, 200, 180, 150)
    ctx.lineTo(180, 90)
    ctx.closePath()
    
    ctx.globalAlpha = 0.1
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.stroke()

    // Lock icon in shield
    ctx.fillStyle = accentColor
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 5

    // Lock body
    drawRoundRect(235, 145, 30, 35, 4)
    ctx.stroke()

    // Lock shackle
    ctx.beginPath()
    ctx.arc(250, 145, 15, Math.PI, 0, true)
    ctx.stroke()

    // Keyhole
    ctx.fillStyle = primaryColor
    ctx.beginPath()
    ctx.arc(250, 157, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(248, 157, 4, 8)

    // Title
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 20px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Security & Privacy', 250, 35)

    // Left side - What stays private
    ctx.fillStyle = cardBg
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2
    drawRoundRect(20, 250, 220, 80, 10)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = primaryColor
    ctx.font = 'bold 14px system-ui'
    ctx.textAlign = 'left'
    ctx.fillText('🔒 Stays Off-Chain', 35, 275)

    ctx.fillStyle = '#64748b'
    ctx.font = '11px system-ui'
    ctx.fillText('• Transaction details', 35, 295)
    ctx.fillText('• Customer data', 35, 310)
    ctx.fillText('• Business records', 35, 325)

    // Right side - What goes on-chain
    ctx.fillStyle = cardBg
    drawRoundRect(260, 250, 220, 80, 10)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = accentColor
    ctx.font = 'bold 14px system-ui'
    ctx.fillText('⛓️ On-Chain', 275, 275)

    ctx.fillStyle = '#64748b'
    ctx.font = '11px system-ui'
    ctx.fillText('• Cryptographic hash only', 275, 295)
    ctx.fillText('• Timestamp', 275, 310)
    ctx.fillText('• Immutable proof', 275, 325)

    // Security badges around shield
    const badges = [
      { x: 100, y: 100, text: 'AES-256', icon: '🔐' },
      { x: 400, y: 100, text: 'Zero-Trust', icon: '🛡️' },
      { x: 100, y: 200, text: 'GDPR', icon: '✓' },
      { x: 400, y: 200, text: 'SOC 2', icon: '✓' }
    ]

    badges.forEach(badge => {
      ctx.fillStyle = cardBg
      ctx.strokeStyle = accentColor
      ctx.lineWidth = 2
      
      drawRoundRect(badge.x - 35, badge.y - 15, 70, 30, 8)
      ctx.fill()
      ctx.stroke()

      ctx.font = '14px system-ui'
      ctx.fillText(badge.icon, badge.x - 25, badge.y + 5)

      ctx.fillStyle = primaryColor
      ctx.font = 'bold 10px system-ui'
      ctx.fillText(badge.text, badge.x - 5, badge.y + 5)
    })

  }, [])

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}></canvas>
}
