import { useEffect, useRef } from 'react'

export default function ParticleNetwork({ showBigDoc }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width, height, dpr
    let animationFrameId

    // Particle configuration
    const particles = []
    const particleCount = 1500 // Huge number for dramatic burst
    let burstPhase = 'initial' // 'initial', 'burst', 'zoom', 'cleanup', 'ambient'
    let phaseStartTime = 0

    class Particle {
      constructor(index) {
        this.active = false
        this.index = index
        this.isPersistent = index < 150 // First 150 particles will remain - considerable amount
      }

      burst() {
        // Space travel effect - particles start from far away and rush toward viewer
        const centerX = width / 2
        const centerY = height / 2
        
        // Random position far from center in X/Y
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 400 + 200
        
        this.x = centerX + Math.cos(angle) * distance
        this.y = centerY + Math.sin(angle) * distance
        this.z = -2500 - Math.random() * 1500 // Start very far away
        
        // Calculate direction from position (will project outward on screen)
        const dx = this.x - centerX
        const dy = this.y - centerY
        
        // Velocity toward viewer (forward in Z) - fast space travel
        this.baseVx = dx * 0.001 // Minimal lateral movement
        this.baseVy = dy * 0.001
        this.baseVz = 25 + Math.random() * 15 // Fast forward motion through space
        
        this.vx = this.baseVx
        this.vy = this.baseVy
        this.vz = this.baseVz
        
        this.baseRadius = Math.random() * 2 + 1
        this.opacity = 1
        this.active = true
        this.lifetime = 0
      }

      initStarfield() {
        // Initialize particle for starfield effect
        const centerX = width / 2
        const centerY = height / 2
        
        // Random position far from center in X/Y
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 300 + 100
        
        this.x = centerX + Math.cos(angle) * distance
        this.y = centerY + Math.sin(angle) * distance
        this.z = -2000 - Math.random() * 1000 // Start far away
        
        // Calculate direction from position toward center (will project outward on screen)
        const dx = this.x - centerX
        const dy = this.y - centerY
        
        // Very slow velocity toward viewer (forward in Z)
        this.vx = dx * 0.0005 // Minimal lateral movement
        this.vy = dy * 0.0005
        this.vz = 1.5 // Very slow forward motion
        
        this.baseRadius = Math.random() * 1 + 0.5
        this.opacity = 0.8
        this.active = true
      }

      update() {
        if (!this.active) return
        
        this.lifetime++
        
        // Phase-based behavior
        const timeSinceBurst = Date.now() - phaseStartTime
        
        if (burstPhase === 'burst') {
          // Space travel phase - all particles rushing forward
          // Transition to ambient after 1.5 seconds
          if (timeSinceBurst > 1500) {
            burstPhase = 'ambient'
            // Non-persistent particles fade and disappear
            if (!this.isPersistent) {
              // Start fading
            } else {
              // Persistent particles slow down for ambient phase
              this.initStarfield()
            }
          }
          
          // When particle reaches front, respawn at back (continuous effect)
          if (this.z > -10) {
            // Random position far from center in X/Y
            const centerX = width / 2
            const centerY = height / 2
            const angle = Math.random() * Math.PI * 2
            const distance = Math.random() * 400 + 200
            
            this.x = centerX + Math.cos(angle) * distance
            this.y = centerY + Math.sin(angle) * distance
            this.z = -2500 - Math.random() * 1500
            
            const dx = this.x - centerX
            const dy = this.y - centerY
            this.vx = dx * 0.001
            this.vy = dy * 0.001
          }
        } else if (burstPhase === 'ambient') {
          // Most particles disappear, only persistent ones remain
          if (!this.isPersistent) {
            this.opacity -= 0.03
            if (this.opacity <= 0) {
              this.active = false
              return
            }
          }
          
          // Persistent particles in slow starfield effect
          if (this.isPersistent) {
            // When particle reaches front, respawn at back
            if (this.z > -10) {
              this.initStarfield()
            }
          }
        }
        
        // Move particles
        this.x += this.vx
        this.y += this.vy
        this.z += this.vz
        
        // 3D to 2D projection with perspective
        if (this.z < -1) {
          const scale = 1000 / (-this.z)
          this.screenX = width / 2 + (this.x - width / 2) * scale
          this.screenY = height / 2 + (this.y - height / 2) * scale
          
          // Size based on depth (closer = bigger)
          this.radius = this.baseRadius * Math.abs(scale) * 2
        } else {
          // Simple 2D when close - used in ambient mode
          this.screenX = this.x
          this.screenY = this.y
          this.radius = this.baseRadius * 2
          
          // Wrap around screen edges to keep particles in view (2D mode)
          if (this.x < -50) this.x = width + 50
          if (this.x > width + 50) this.x = -50
          if (this.y < -50) this.y = height + 50
          if (this.y > height + 50) this.y = -50
        }
        
        // Deactivate if way off screen
        if (this.screenX < -500 || this.screenX > width + 500 ||
            this.screenY < -500 || this.screenY > height + 500) {
          if (!this.isPersistent) {
            this.active = false
          }
        }
      }

      draw() {
        if (!this.active) return
        
        ctx.beginPath()
        ctx.arc(this.screenX, this.screenY, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 196, 154, ${this.opacity * 0.9})`
        ctx.fill()
      }
    }

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.scale(dpr, dpr)
      
      // Reinitialize particles on resize
      init()
    }

    function init() {
      particles.length = 0
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(i))
      }
    }

    function animate() {
      // Clear canvas completely (no trail)
      ctx.clearRect(0, 0, width, height)
      
      // Reset shadow
      ctx.shadowBlur = 0

      // Update and draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    init()
    animate()

    // Listen for burst trigger
    const handleBurst = () => {
      burstPhase = 'burst'
      phaseStartTime = Date.now()
      particles.forEach(particle => particle.burst())
    }
    
    canvas.addEventListener('triggerBurst', handleBurst)
    window.addEventListener('resize', resize)

    return () => {
      canvas.removeEventListener('triggerBurst', handleBurst)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Trigger burst when showBigDoc becomes true
  useEffect(() => {
    if (showBigDoc && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      // Get all particles and trigger burst
      setTimeout(() => {
        // Access particles from the other useEffect through canvas data attribute
        const event = new CustomEvent('triggerBurst')
        canvas.dispatchEvent(event)
      }, 500) // Small delay to show big doc first
    }
  }, [showBigDoc])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  )
}
