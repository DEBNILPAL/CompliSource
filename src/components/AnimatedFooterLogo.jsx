import { useEffect, useRef, useState } from 'react'

export default function AnimatedFooterLogo() {
  const canvasRef = useRef(null)
  const logoImgRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const animationRef = useRef(null)
  const documentsRef = useRef([])
  const phaseRef = useRef('gathering')
  const frameCountRef = useRef(0)

  // Load logo image
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      logoImgRef.current = img
      setLogoLoaded(true)
    }
    img.src = '/assets/img/logo.svg'
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset animation each time it becomes visible
          setIsVisible(true)
          phaseRef.current = 'gathering'
          frameCountRef.current = 0
          documentsRef.current = []
        } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.2 }
    )

    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || !canvasRef.current || !logoLoaded) return

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

    // Helper function to get text outline positions
    const getTextOutline = (text, fontSize, startX) => {
      const positions = []
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = 400
      tempCanvas.height = 100
      
      tempCtx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
      tempCtx.fillStyle = 'white'
      tempCtx.textAlign = 'left'
      tempCtx.textBaseline = 'middle'
      tempCtx.fillText(text, 20, 50)
      
      const imageData = tempCtx.getImageData(0, 0, 400, 100)
      
      // Get edge pixels only for outline effect
      for (let y = 0; y < 100; y += 3) {
        for (let x = 0; x < 400; x += 3) {
          const index = (y * 400 + x) * 4
          if (imageData.data[index + 3] > 200) {
            // Check if this is an edge pixel
            const neighbors = [
              imageData.data[((y-1) * 400 + x) * 4 + 3] || 0,
              imageData.data[((y+1) * 400 + x) * 4 + 3] || 0,
              imageData.data[(y * 400 + (x-1)) * 4 + 3] || 0,
              imageData.data[(y * 400 + (x+1)) * 4 + 3] || 0
            ]
            
            if (neighbors.some(n => n < 100)) {
              positions.push({ x: startX + x - 20, y: y - 50 })
            }
          }
        }
      }
      
      return positions
    }

    // Get outline positions
    const textPositions = getTextOutline('CompliSource', 36, -120)
    
    // Document particle class
    class DocumentParticle {
      constructor(index, total, targetPos) {
        const centerX = canvas.width / (2 * dpr)
        const centerY = canvas.height / (2 * dpr)
        
        // Start from random positions around the edges
        const angle = Math.random() * Math.PI * 2
        const distance = 250 + Math.random() * 100
        
        this.startX = centerX + Math.cos(angle) * distance
        this.startY = centerY + Math.sin(angle) * distance
        
        // Target position
        this.targetX = centerX + targetPos.x
        this.targetY = centerY + targetPos.y
        
        this.x = this.startX
        this.y = this.startY
        
        // Document properties
        this.width = 3 + Math.random() * 2
        this.height = 4 + Math.random() * 3
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.2
        
        // Animation properties
        this.progress = 0
        this.delay = Math.random() * 20
        this.speed = 0.018 + Math.random() * 0.008
        this.opacity = 0
        
        // Color variation
        const colors = [
          'rgba(0, 196, 154, 0.8)',
          'rgba(0, 220, 180, 0.7)',
          'rgba(255, 255, 255, 0.9)'
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update(frameCount) {
        if (frameCount < this.delay) return

        // Gathering phase - documents move toward target
        if (phaseRef.current === 'gathering') {
          this.progress = Math.min(this.progress + this.speed, 1)
          
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - this.progress, 3)
          
          this.x = this.startX + (this.targetX - this.startX) * eased
          this.y = this.startY + (this.targetY - this.startY) * eased
          this.opacity = Math.min(this.progress * 2, 1)
          this.rotation += this.rotationSpeed * (1 - this.progress * 0.5)
        }
        
        // Complete phase - lock in position with very subtle movement
        else if (phaseRef.current === 'complete') {
          this.rotation *= 0.95
          const time = frameCount * 0.01
          this.x = this.targetX + Math.sin(time + this.delay) * 0.2
          this.y = this.targetY + Math.cos(time * 0.8 + this.delay) * 0.2
        }
      }

      draw(ctx) {
        if (this.opacity <= 0) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.globalAlpha = this.opacity

        // Draw document shape
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)
        ctx.fill()

        // Document corner fold
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.beginPath()
        ctx.moveTo(this.width / 2 - 2, -this.height / 2)
        ctx.lineTo(this.width / 2, -this.height / 2 + 2)
        ctx.lineTo(this.width / 2, -this.height / 2)
        ctx.closePath()
        ctx.fill()

        // Document lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = 0.3
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath()
          ctx.moveTo(-this.width / 2 + 1, i * 2)
          ctx.lineTo(this.width / 2 - 1, i * 2)
          ctx.stroke()
        }

        ctx.restore()
      }
    }

    // Sample positions to avoid too many particles
    const sampleRate = 3
    const sampledPositions = textPositions.filter((_, i) => i % sampleRate === 0)
    
    // Initialize documents
    documentsRef.current = sampledPositions.map((targetPos, i) => 
      new DocumentParticle(i, sampledPositions.length, targetPos)
    )

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      frameCountRef.current++
      const frameCount = frameCountRef.current

      // Phase transition
      if (phaseRef.current === 'gathering' && frameCount > 80) {
        phaseRef.current = 'complete'
      }

      // Update and draw all documents
      documentsRef.current.forEach(doc => {
        doc.update(frameCount)
        doc.draw(ctx)
      })

      // Draw logo and text on top once particles have mostly gathered
      if (frameCount > 50) {
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const opacity = Math.min((frameCount - 50) / 30, 1)

        ctx.save()
        ctx.globalAlpha = opacity

        // Draw the actual logo image
        if (logoImgRef.current) {
          const logoSize = 50
          ctx.drawImage(
            logoImgRef.current,
            centerX - 220,
            centerY - logoSize / 2,
            logoSize,
            logoSize
          )
        }
        
        // Draw "CompliSource" text - clean and bold
        ctx.font = 'bold 38px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        
        // Text shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
        ctx.shadowBlur = 8
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 2
        
        ctx.fillText('CompliSource', centerX - 150, centerY)
        
        ctx.restore()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, logoLoaded])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  )
}
