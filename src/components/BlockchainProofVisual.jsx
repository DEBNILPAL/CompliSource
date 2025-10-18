import { useEffect, useRef } from 'react'

export default function BlockchainProofVisual() {
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

    // Background with subtle blockchain pattern
    ctx.fillStyle = '#0a2540'
    ctx.fillRect(0, 0, 500, 350)

    // Grid pattern
    ctx.strokeStyle = 'rgba(0, 196, 154, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i < 500; i += 30) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 350)
      ctx.stroke()
    }
    for (let i = 0; i < 350; i += 30) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(500, i)
      ctx.stroke()
    }

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px system-ui'
    ctx.fillText('Blockchain Proof System', 20, 35)

    // Compliance Data Block
    ctx.fillStyle = cardBg
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    drawRoundRect(30, 60, 200, 120, 12)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = primaryColor
    ctx.font = 'bold 14px system-ui'
    ctx.fillText('Compliance Data', 45, 85)

    ctx.font = '11px system-ui'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Score: 87.5', 45, 105)
    ctx.fillText('Violations: 6', 45, 125)
    ctx.fillText('Timestamp: 10:45 AM', 45, 145)
    ctx.fillText('Modules: GST, Cash', 45, 165)

    // Hash generation arrow
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(230, 120)
    ctx.lineTo(270, 120)
    ctx.stroke()

    // Arrowhead
    ctx.beginPath()
    ctx.moveTo(270, 120)
    ctx.lineTo(260, 115)
    ctx.lineTo(260, 125)
    ctx.closePath()
    ctx.fillStyle = accentColor
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px system-ui'
    ctx.fillText('SHA-256', 235, 110)

    // Hash Block
    ctx.fillStyle = cardBg
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    drawRoundRect(270, 60, 200, 120, 12)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = primaryColor
    ctx.font = 'bold 14px system-ui'
    ctx.fillText('Cryptographic Hash', 285, 85)

    ctx.font = '9px monospace'
    ctx.fillStyle = accentColor
    const hash = '0x7a9f3b2c8e...'
    ctx.fillText(hash, 285, 105)
    ctx.fillText('d4f6a1c9e7b...', 285, 120)
    ctx.fillText('8e2d5f3a9c1...', 285, 135)

    ctx.font = '10px system-ui'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Immutable proof', 285, 160)
    ctx.fillText('of compliance run', 285, 173)

    // Blockchain arrow
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(370, 180)
    ctx.lineTo(370, 210)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(370, 210)
    ctx.lineTo(365, 200)
    ctx.lineTo(375, 200)
    ctx.closePath()
    ctx.fillStyle = accentColor
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px system-ui'
    ctx.fillText('Anchor', 385, 195)

    // Smart Contract Block
    ctx.fillStyle = cardBg
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 3
    drawRoundRect(150, 220, 200, 110, 12)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = primaryColor
    ctx.font = 'bold 16px system-ui'
    ctx.fillText('⛓️ CompliRegistry.sol', 165, 245)

    ctx.font = '11px system-ui'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Smart Contract on Blockchain', 165, 265)

    // Transaction details
    ctx.font = '10px monospace'
    ctx.fillStyle = accentColor
    ctx.fillText('Tx: 0xf3a9c...', 165, 285)
    ctx.fillText('Block: #1,234,567', 165, 300)
    ctx.fillText('Status: ✓ Confirmed', 165, 315)

    // Chain link icon
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(30, 280, 15, 0, Math.PI * 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(60, 280, 15, 0, Math.PI * 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(35, 270)
    ctx.lineTo(55, 290)
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px system-ui'
    ctx.fillText('Immutable', 85, 275)
    ctx.fillText('Tamper-proof', 85, 290)

  }, [])

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}></canvas>
}
