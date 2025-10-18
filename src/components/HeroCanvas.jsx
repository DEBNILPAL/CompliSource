import { useEffect, useRef } from 'react'

export default function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width, height, dpr
    let animationFrameId

    const nodes = Array.from({ length: 36 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
    }))

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    function step() {
      ctx.clearRect(0, 0, width, height)
      
      // background soft gradient
      const g = ctx.createLinearGradient(0, 0, width, height)
      g.addColorStop(0, 'rgba(0,196,154,0.10)')
      g.addColorStop(1, 'rgba(10,37,64,0.06)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      // move nodes
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > 1) n.vx *= -1
        if (n.y < 0 || n.y > 1) n.vy *= -1
      }

      // draw links
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = (a.x - b.x) * width
          const dy = (a.y - b.y) * height
          const dist2 = dx * dx + dy * dy
          if (dist2 < 140 * 140) {
            const alpha = 1 - dist2 / (140 * 140)
            ctx.strokeStyle = `rgba(0,196,154,${0.22 * alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x * width, a.y * height)
            ctx.lineTo(b.x * width, b.y * height)
            ctx.stroke()
          }
        }
      }

      // draw nodes
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(0,196,154,0.9)'
        ctx.beginPath()
        ctx.arc(n.x * width, n.y * height, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(step)
    }

    step()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} id="heroCanvas" className="hero-canvas" aria-hidden="true" />
}
