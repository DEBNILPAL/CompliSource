import { useEffect, useRef } from 'react'

export default function GlobalComplianceMap() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = 600 * dpr
    canvas.height = 350 * dpr
    canvas.style.width = '100%'
    canvas.style.height = 'auto'
    ctx.scale(dpr, dpr)

    const accentColor = '#00c49a'
    const primaryColor = '#0a2540'

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 350)
    grad.addColorStop(0, '#0a2540')
    grad.addColorStop(1, '#1e3a5f')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 600, 350)

    // Draw world map (simplified)
    const countries = [
      { name: 'India', flag: '🇮🇳', x: 420, y: 180, color: accentColor },
      { name: 'USA', flag: '🇺🇸', x: 150, y: 140, color: accentColor },
      { name: 'UK', flag: '🇬🇧', x: 290, y: 110, color: accentColor },
      { name: 'EU', flag: '🇪🇺', x: 310, y: 130, color: accentColor },
      { name: 'Australia', flag: '🇦🇺', x: 500, y: 270, color: accentColor },
      { name: 'Canada', flag: '🇨🇦', x: 130, y: 100, color: accentColor },
      { name: 'Singapore', flag: '🇸🇬', x: 460, y: 200, color: accentColor }
    ]

    // Draw connections (pulsing lines)
    const centerX = 300
    const centerY = 175

    // Center hub
    ctx.fillStyle = accentColor
    ctx.shadowColor = accentColor
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('HUB', centerX, centerY + 4)

    // Draw connections
    countries.forEach(country => {
      ctx.strokeStyle = accentColor
      ctx.globalAlpha = 0.3
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(country.x, country.y)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.globalAlpha = 1
    })

    // Draw country nodes
    countries.forEach(country => {
      // Glow effect
      ctx.fillStyle = country.color
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.arc(country.x, country.y, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // Node circle
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(country.x, country.y, 12, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = country.color
      ctx.lineWidth = 3
      ctx.stroke()

      // Flag
      ctx.font = '16px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText(country.flag, country.x, country.y + 5)

      // Country name
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px system-ui'
      ctx.fillText(country.name, country.x, country.y + 28)
    })

    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Global Compliance Coverage', 300, 35)

    ctx.font = '14px system-ui'
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('7 Countries • Multi-Currency • Region-Specific Rules', 300, 55)

  }, [])

  return <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}></canvas>
}
