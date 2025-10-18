import { useEffect, useRef, useState } from 'react'

export default function TeamBubbles() {
  const canvasRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const animationRef = useRef(null)
  const bubblesRef = useRef([])
  const frameCountRef = useRef(0)

  const teamMembers = ['Debnil', 'Shan', 'Mayukh', 'Soumyabrata']

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    updateSize()

    class Bubble {
      constructor(index, name) {
        const rect = canvas.getBoundingClientRect()
        this.name = name
        this.index = index
        
        // Position bubbles in corners to avoid center text
        const isLeft = index % 2 === 0
        const isTop = index < 2
        
        // Start position - from edges of canvas
        if (isLeft) {
          this.startX = -100
          this.targetX = 100 + Math.random() * 40
        } else {
          this.startX = rect.width + 100
          this.targetX = rect.width - 100 - Math.random() * 40
        }
        
        if (isTop) {
          this.startY = -100
          this.targetY = 120 + Math.random() * 40
        } else {
          this.startY = rect.height + 100
          this.targetY = rect.height - 120 - Math.random() * 40
        }
        
        this.x = this.startX
        this.y = this.startY
        
        // Bubble properties
        this.radius = 0
        this.maxRadius = 45
        this.progress = 0
        this.delay = index * 25
        
        // Phase tracking
        this.phase = 'rising'
        this.textOpacity = 0
        this.waveAngle = 0
        this.waveSpeed = 0.08 + Math.random() * 0.04
        this.bounceOffset = 0
        
        // Smooth floating offsets
        this.floatPhase = Math.random() * Math.PI * 2
        
        // Cute pastel colors
        const colors = [
          'rgba(255, 182, 193, 0.9)',   // Light pink
          'rgba(173, 216, 230, 0.9)',   // Light blue
          'rgba(255, 218, 185, 0.9)',   // Peach
          'rgba(221, 160, 221, 0.9)'    // Plum
        ]
        this.color = colors[index % colors.length]
        this.accentColor = colors[index % colors.length].replace('0.9', '1')
      }

      update(frameCount) {
        if (frameCount < this.delay) return

        const localFrame = frameCount - this.delay

        // Rising phase - bubble grows and moves up
        if (this.phase === 'rising') {
          this.progress = Math.min(this.progress + 0.015, 1)
          
          // Smooth ease-out cubic for natural movement
          const eased = 1 - Math.pow(1 - this.progress, 3)
          
          // Move both horizontally and vertically
          this.x = this.startX + (this.targetX - this.startX) * eased
          this.y = this.startY + (this.targetY - this.startY) * eased
          this.radius = this.maxRadius * eased
          
          // Gentle sine wave wobble
          const wobbleX = Math.sin(localFrame * 0.06 + this.floatPhase) * 8 * (1 - eased)
          const wobbleY = Math.cos(localFrame * 0.05 + this.floatPhase) * 5 * (1 - eased)
          this.x += wobbleX
          this.y += wobbleY
          
          if (this.progress >= 1 && localFrame > 60) {
            this.phase = 'popping'
            this.progress = 0
          }
        }
        
        // Popping phase - bubble bursts with sparkles
        else if (this.phase === 'popping') {
          this.progress += 0.15
          this.radius = this.maxRadius * (1 + this.progress * 0.6)
          
          if (this.progress >= 1) {
            this.phase = 'text'
            this.progress = 0
          }
        }
        
        // Text phase - name appears with bounce
        else if (this.phase === 'text') {
          this.textOpacity = Math.min(this.textOpacity + 0.1, 1)
          // Smooth bounce using sine
          this.bounceOffset = Math.sin(this.textOpacity * Math.PI) * 15
          
          if (this.textOpacity >= 1) {
            this.phase = 'waving'
          }
        }
        
        // Waving phase - hand waves enthusiastically
        else if (this.phase === 'waving') {
          this.waveAngle = Math.sin(localFrame * this.waveSpeed) * 0.45
          
          // Very gentle, smooth floating
          const driftY = Math.sin(localFrame * 0.025 + this.floatPhase) * 4
          const driftX = Math.cos(localFrame * 0.03 + this.floatPhase) * 6
          this.bounceOffset = Math.sin(localFrame * 0.035 + this.floatPhase) * 5
          this.y = this.targetY + driftY
          this.x = this.targetX + driftX
        }
      }

      draw(ctx) {
        ctx.save()

        // Draw bubble (rising and popping phases)
        if (this.phase === 'rising' || this.phase === 'popping') {
          const alpha = this.phase === 'popping' ? 1 - this.progress : 1
          
          // Subtle outer glow
          ctx.globalAlpha = alpha * 0.25
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius + 6, 0, Math.PI * 2)
          const glowGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius + 6
          )
          glowGradient.addColorStop(0, this.accentColor)
          glowGradient.addColorStop(1, 'transparent')
          ctx.fillStyle = glowGradient
          ctx.fill()
          
          // Main bubble with smooth gradient
          ctx.globalAlpha = alpha
          const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
            this.x, this.y, this.radius
          )
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
          gradient.addColorStop(0.3, this.color)
          gradient.addColorStop(1, this.color.replace('0.9', '0.65'))
          
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
          
          // Primary highlight
          ctx.globalAlpha = alpha * 0.85
          ctx.beginPath()
          ctx.arc(this.x - this.radius * 0.35, this.y - this.radius * 0.35, this.radius * 0.28, 0, Math.PI * 2)
          const highlightGradient = ctx.createRadialGradient(
            this.x - this.radius * 0.35, this.y - this.radius * 0.35, 0,
            this.x - this.radius * 0.35, this.y - this.radius * 0.35, this.radius * 0.28
          )
          highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
          highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)')
          ctx.fillStyle = highlightGradient
          ctx.fill()
          
          // Secondary smaller highlight
          ctx.globalAlpha = alpha * 0.6
          ctx.beginPath()
          ctx.arc(this.x + this.radius * 0.2, this.y - this.radius * 0.5, this.radius * 0.15, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.fill()
          
          // Soft border
          ctx.globalAlpha = alpha * 0.5
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.stroke()
          
          // Popping sparkles with smooth fade
          if (this.phase === 'popping') {
            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI * 2 * i) / 8
              const dist = this.radius * (1 + this.progress * 0.5)
              const sparkleX = this.x + Math.cos(angle) * dist
              const sparkleY = this.y + Math.sin(angle) * dist
              
              ctx.globalAlpha = (1 - this.progress) * 0.9
              
              // Star-shaped sparkle
              ctx.fillStyle = '#ffffff'
              ctx.beginPath()
              ctx.arc(sparkleX, sparkleY, 4 * (1 - this.progress * 0.5), 0, Math.PI * 2)
              ctx.fill()
              
              // Outer glow on sparkle
              ctx.globalAlpha = (1 - this.progress) * 0.4
              ctx.beginPath()
              ctx.arc(sparkleX, sparkleY, 6 * (1 - this.progress * 0.5), 0, Math.PI * 2)
              const sparkleGlow = ctx.createRadialGradient(sparkleX, sparkleY, 0, sparkleX, sparkleY, 6)
              sparkleGlow.addColorStop(0, '#ffffff')
              sparkleGlow.addColorStop(1, 'transparent')
              ctx.fillStyle = sparkleGlow
              ctx.fill()
            }
          }
        }

        // Draw text and waving hand
        if (this.phase === 'text' || this.phase === 'waving') {
          const yPos = this.y - this.bounceOffset
          
          ctx.globalAlpha = this.textOpacity
          
          // Smooth background bubble for name
          ctx.fillStyle = 'rgba(255, 255, 255, 0.96)'
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
          ctx.shadowBlur = 12
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 4
          
          const padding = 16
          ctx.font = 'bold 20px Inter, system-ui, sans-serif'
          const textWidth = ctx.measureText(this.name).width
          
          ctx.beginPath()
          ctx.roundRect(
            this.x - textWidth / 2 - padding,
            yPos - 13,
            textWidth + padding * 2,
            36,
            18
          )
          ctx.fill()
          
          // Name text with smooth gradient - NO SHADOW
          ctx.shadowBlur = 0
          ctx.shadowColor = 'transparent'
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
          
          const textGradient = ctx.createLinearGradient(
            this.x - textWidth / 2, 0,
            this.x + textWidth / 2, 0
          )
          textGradient.addColorStop(0, '#ff6b9d')
          textGradient.addColorStop(0.5, '#c084fc')
          textGradient.addColorStop(1, '#60a5fa')
          
          ctx.fillStyle = textGradient
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(this.name, this.x, yPos + 5)
          
          // Smooth waving hand emoji - NO SHADOW
          if (this.phase === 'waving') {
            ctx.save()
            ctx.shadowBlur = 0
            ctx.shadowColor = 'transparent'
            ctx.translate(this.x + textWidth / 2 + 32, yPos - 3)
            ctx.rotate(this.waveAngle)
            ctx.font = '34px Arial'
            ctx.fillText('👋', 0, 0)
            ctx.restore()
            
            // Subtle sparkles with smooth appearance
            const sparkleAlpha = Math.abs(Math.sin(this.waveAngle * 3))
            if (sparkleAlpha > 0.6) {
              ctx.font = '14px Arial'
              ctx.globalAlpha = this.textOpacity * sparkleAlpha * 0.8
              ctx.fillText('✨', this.x + textWidth / 2 + 22, yPos - 22)
              ctx.fillText('✨', this.x + textWidth / 2 + 48, yPos - 12)
            }
          }
        }

        ctx.restore()
      }
    }

    // Initialize bubbles
    bubblesRef.current = teamMembers.map((name, i) => new Bubble(i, name))

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      frameCountRef.current++

      // Update and draw all bubbles
      bubblesRef.current.forEach(bubble => {
        bubble.update(frameCountRef.current)
        bubble.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  )
}
