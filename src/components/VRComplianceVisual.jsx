import { useEffect, useRef } from 'react'

export default function VRComplianceVisual() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = 600 * dpr
    canvas.height = 400 * dpr
    canvas.style.width = '600px'
    canvas.style.height = '400px'
    ctx.scale(dpr, dpr)

    let animationId
    let time = 0

    // Colors
    const bgColor = '#0a1628'
    const gridColor = 'rgba(0, 196, 154, 0.2)'
    const nodeColor = '#00c49a'
    const glowColor = 'rgba(0, 196, 154, 0.5)'
    const textColor = '#ffffff'
    const accentColor = '#60a5fa'

    // 3D Perspective helpers
    function project3D(x, y, z, centerX, centerY, distance = 300) {
      const scale = distance / (distance + z)
      return {
        x: centerX + x * scale,
        y: centerY + y * scale,
        scale: scale
      }
    }

    // Draw 3D grid
    function drawGrid(rotation) {
      ctx.save()
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1

      const centerX = 300
      const centerY = 200
      const gridSize = 150
      const gridLines = 8

      // Horizontal grid lines
      for (let i = -gridLines; i <= gridLines; i++) {
        const y = i * (gridSize / gridLines)
        const points = []
        
        for (let j = -gridLines; j <= gridLines; j++) {
          const x = j * (gridSize / gridLines)
          const rotatedX = x * Math.cos(rotation) - y * Math.sin(rotation)
          const rotatedY = x * Math.sin(rotation) + y * Math.cos(rotation)
          const z = -50
          
          const projected = project3D(rotatedX, z, rotatedY, centerX, centerY)
          points.push(projected)
        }
        
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let k = 1; k < points.length; k++) {
          ctx.lineTo(points[k].x, points[k].y)
        }
        ctx.stroke()
      }

      // Vertical grid lines
      for (let i = -gridLines; i <= gridLines; i++) {
        const x = i * (gridSize / gridLines)
        const points = []
        
        for (let j = -gridLines; j <= gridLines; j++) {
          const y = j * (gridSize / gridLines)
          const rotatedX = x * Math.cos(rotation) - y * Math.sin(rotation)
          const rotatedY = x * Math.sin(rotation) + y * Math.cos(rotation)
          const z = -50
          
          const projected = project3D(rotatedX, z, rotatedY, centerX, centerY)
          points.push(projected)
        }
        
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let k = 1; k < points.length; k++) {
          ctx.lineTo(points[k].x, points[k].y)
        }
        ctx.stroke()
      }

      ctx.restore()
    }

    // Draw 3D compliance nodes
    function draw3DNodes(rotation, time) {
      const centerX = 300
      const centerY = 200

      const nodes = [
        { x: 0, y: 0, z: 0, label: 'Compliance\nEngine', size: 50, color: nodeColor },
        { x: -120, y: 60, z: 40, label: 'GST\nAnalysis', size: 35, color: accentColor },
        { x: 120, y: 60, z: 40, label: 'Cash\nLimits', size: 35, color: accentColor },
        { x: -80, y: -60, z: -30, label: 'Tax\nRates', size: 35, color: accentColor },
        { x: 80, y: -60, z: -30, label: 'Blockchain\nProof', size: 35, color: nodeColor },
        { x: 0, y: -100, z: 60, label: 'AI\nAssistant', size: 30, color: '#8b5cf6' },
        { x: -150, y: 0, z: -60, label: 'Multi-\nCountry', size: 30, color: '#f59e0b' },
        { x: 150, y: 0, z: -60, label: 'Reports', size: 30, color: '#ec4899' }
      ]

      // Sort nodes by z-depth for proper rendering
      const rotatedNodes = nodes.map(node => {
        const rotatedX = node.x * Math.cos(rotation) - node.z * Math.sin(rotation)
        const rotatedZ = node.x * Math.sin(rotation) + node.z * Math.cos(rotation)
        const projected = project3D(rotatedX, node.y, rotatedZ, centerX, centerY)
        return { ...node, projected, rotatedZ }
      }).sort((a, b) => a.rotatedZ - b.rotatedZ)

      // Draw connections
      ctx.save()
      ctx.strokeStyle = 'rgba(0, 196, 154, 0.3)'
      ctx.lineWidth = 2

      rotatedNodes.forEach((node, i) => {
        if (i === 0) return // Skip center node connections here
        const center = rotatedNodes.find(n => n.label === 'Compliance\nEngine')
        
        ctx.beginPath()
        ctx.moveTo(center.projected.x, center.projected.y)
        ctx.lineTo(node.projected.x, node.projected.y)
        ctx.stroke()
      })
      ctx.restore()

      // Draw nodes
      rotatedNodes.forEach(node => {
        const { x, y, scale } = node.projected
        const size = node.size * scale
        const pulse = 1 + Math.sin(time * 2 + node.x) * 0.1

        // Glow effect
        ctx.save()
        ctx.shadowColor = node.color
        ctx.shadowBlur = 20 * scale * pulse
        ctx.fillStyle = node.color
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.arc(x, y, size * 1.5 * pulse, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Main sphere with gradient
        const gradient = ctx.createRadialGradient(
          x - size * 0.3, y - size * 0.3, 0,
          x, y, size
        )
        gradient.addColorStop(0, node.color)
        gradient.addColorStop(0.7, node.color)
        gradient.addColorStop(1, '#0a1628')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.beginPath()
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.3, 0, Math.PI * 2)
        ctx.fill()

        // Label
        if (scale > 0.5) {
          ctx.save()
          ctx.fillStyle = textColor
          ctx.font = `bold ${Math.max(10, 11 * scale)}px system-ui`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.globalAlpha = scale

          const lines = node.label.split('\n')
          lines.forEach((line, idx) => {
            ctx.fillText(line, x, y + size + 15 + idx * 12 * scale)
          })
          ctx.restore()
        }
      })
    }

    // Draw VR headset icon
    function drawVRHeadset(x, y, size) {
      ctx.save()
      ctx.translate(x, y)

      // Headset body
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(-size, -size * 0.6, size * 2, size * 1.2, size * 0.3)
      ctx.fill()

      // Lenses
      ctx.fillStyle = '#60a5fa'
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.arc(-size * 0.5, 0, size * 0.4, 0, Math.PI * 2)
      ctx.arc(size * 0.5, 0, size * 0.4, 0, Math.PI * 2)
      ctx.fill()

      // Glow
      ctx.globalAlpha = 0.3
      ctx.shadowColor = '#60a5fa'
      ctx.shadowBlur = 15
      ctx.fillStyle = '#60a5fa'
      ctx.beginPath()
      ctx.arc(-size * 0.5, 0, size * 0.5, 0, Math.PI * 2)
      ctx.arc(size * 0.5, 0, size * 0.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // Draw AI brain icon
    function drawAIBrain(x, y, size, pulse) {
      ctx.save()
      ctx.translate(x, y)

      // Neural network nodes
      const nodes = [
        { x: 0, y: -size * 0.7 },
        { x: -size * 0.6, y: 0 },
        { x: size * 0.6, y: 0 },
        { x: -size * 0.4, y: size * 0.7 },
        { x: size * 0.4, y: size * 0.7 }
      ]

      // Connections
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)'
      ctx.lineWidth = 2
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i < j) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })
      })

      // Nodes
      nodes.forEach((node, i) => {
        const nodePulse = 1 + Math.sin(pulse * 3 + i) * 0.2
        ctx.fillStyle = '#8b5cf6'
        ctx.shadowColor = '#8b5cf6'
        ctx.shadowBlur = 10 * nodePulse
        ctx.beginPath()
        ctx.arc(node.x, node.y, size * 0.15 * nodePulse, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.restore()
    }

    // Main animation loop
    function animate() {
      time += 0.01

      // Clear canvas with dark background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, 600, 400)

      // Draw rotating grid
      const rotation = time * 0.5

      drawGrid(rotation)

      // Draw 3D compliance nodes
      draw3DNodes(rotation, time)

      // Draw title
      ctx.save()
      ctx.fillStyle = textColor
      ctx.font = 'bold 24px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('🥽 AI/VR Compliance Visualization', 300, 35)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '13px system-ui'
      ctx.fillText('Immersive 3D Compliance Data Analysis', 300, 58)
      ctx.restore()

      // Draw VR and AI icons
      const pulse = time
      drawVRHeadset(50, 380, 15)
      drawAIBrain(550, 380, 18, pulse)

      // Draw feature tags
      ctx.save()
      ctx.font = 'bold 11px system-ui'
      ctx.textAlign = 'center'
      
      const tags = [
        { text: '360° View', x: 80, color: '#00c49a' },
        { text: 'Real-time AI', x: 180, color: '#8b5cf6' },
        { text: 'Spatial Analysis', x: 300, color: '#60a5fa' },
        { text: 'VR Ready', x: 420, color: '#f59e0b' },
        { text: 'Interactive', x: 520, color: '#ec4899' }
      ]

      tags.forEach(tag => {
        const tagPulse = 1 + Math.sin(time * 2 + tag.x * 0.01) * 0.1
        ctx.fillStyle = tag.color
        ctx.globalAlpha = 0.2
        ctx.fillRect(tag.x - 40, 365, 80, 18)
        
        ctx.globalAlpha = tagPulse
        ctx.fillStyle = tag.color
        ctx.fillText(tag.text, tag.x, 377)
      })

      ctx.restore()

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="vr-compliance-visual">
      <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}></canvas>
    </div>
  )
}
