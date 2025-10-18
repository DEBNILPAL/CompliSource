import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function LandingCanvas() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const documentsRef = useRef([])
  const mouseXRef = useRef(0)

  useEffect(() => {
    console.log('LandingCanvas mounted, containerRef:', containerRef.current)
    if (!containerRef.current) {
      console.error('Container ref is null!')
      return
    }

    try {
      console.log('Creating Three.js scene...')
      
      // Scene setup
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000814) // Dark space blue
      
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true })
      
      console.log('Three.js setup starting...')
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio for performance
      containerRef.current.appendChild(renderer.domElement)
      
      console.log('Renderer appended to DOM')

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    camera.position.z = 8

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00c49a, 1, 100)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)
    console.log('Lights added')

    // Create starfield - fast-moving particles (space effect)
    const starCount = 1500 // Reduced for performance
    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    const starVelocities = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 100
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100
      starPositions[i * 3 + 2] = (Math.random() * 100) - 50
      starVelocities[i] = Math.random() * 1.5 + 0.5
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    })

    const starField = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(starField)
    console.log('Stars added')

    // Create colored particles for extra effect
    const particleCount = 300 // Reduced for performance
    const particlesGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleVelocities = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 50
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 50
      particlePositions[i * 3 + 2] = (Math.random() * 50) - 25
      particleVelocities[i] = Math.random() * 2 + 1
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00c49a,
      size: 0.8,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    })

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particleSystem)
    console.log('Particles added')

    // Create floating documents
    const createDocument = (index) => {
      const docGroup = new THREE.Group()
      
      // Document paper
      const docGeometry = new THREE.PlaneGeometry(1.5, 2)
      const docMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        shininess: 30
      })
      
      const docMesh = new THREE.Mesh(docGeometry, docMaterial)
      docGroup.add(docMesh)

      // Add document lines (text effect)
      const linesGeometry = new THREE.BufferGeometry()
      const linePositions = []
      for (let i = 0; i < 8; i++) {
        const y = 0.7 - i * 0.18
        linePositions.push(-0.6, y, 0.01, 0.6, y, 0.01)
      }
      linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
      const linesMaterial = new THREE.LineBasicMaterial({ color: 0x333333, opacity: 0.4, transparent: true })
      const lines = new THREE.LineSegments(linesGeometry, linesMaterial)
      docGroup.add(lines)

      // Create checkmark (initially hidden)
      const checkGeometry = new THREE.BufferGeometry()
      const checkPositions = new Float32Array([
        -0.4, -0.1, 0.02,
        -0.15, -0.5, 0.02,
        -0.15, -0.5, 0.02,
        0.5, 0.5, 0.02
      ])
      checkGeometry.setAttribute('position', new THREE.BufferAttribute(checkPositions, 3))
      const checkMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00ff00, 
        linewidth: 4,
        transparent: true,
        opacity: 0
      })
      const checkmark = new THREE.LineSegments(checkGeometry, checkMaterial)
      docGroup.add(checkmark)
      docGroup.userData.checkmark = checkmark

      // Create cross (initially hidden)
      const crossGeometry = new THREE.BufferGeometry()
      const crossPositions = new Float32Array([
        -0.5, -0.5, 0.02,
        0.5, 0.5, 0.02,
        -0.5, 0.5, 0.02,
        0.5, -0.5, 0.02
      ])
      crossGeometry.setAttribute('position', new THREE.BufferAttribute(crossPositions, 3))
      const crossMaterial = new THREE.LineBasicMaterial({ 
        color: 0xff0000, 
        linewidth: 4,
        transparent: true,
        opacity: 0
      })
      const cross = new THREE.LineSegments(crossGeometry, crossMaterial)
      docGroup.add(cross)
      docGroup.userData.cross = cross

      // Position documents scattered in 3D space
      const angle = (index / 12) * Math.PI * 2
      const radius = 8
      docGroup.position.x = Math.cos(angle) * radius
      docGroup.position.y = (Math.random() - 0.5) * 10
      docGroup.position.z = Math.sin(angle) * radius - 10
      
      docGroup.userData = {
        index,
        originalY: docGroup.position.y,
        floatOffset: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01
      }

      scene.add(docGroup)
      return docGroup
    }

    // Create floating documents
    for (let i = 0; i < 12; i++) { // Reduced from 15 to 12
      documentsRef.current.push(createDocument(i))
    }
    console.log('Documents created:', documentsRef.current.length)

    // Mouse event handlers
    const onMouseMove = (event) => {
      // Normalize mouse X position (-1 to 1)
      mouseXRef.current = (event.clientX / window.innerWidth) * 2 - 1
    }

    window.addEventListener('mousemove', onMouseMove)

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Move stars backward (space effect)
      const starPositions = starField.geometry.attributes.position.array
      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3 + 2] += starVelocities[i]
        
        // Reset star if it goes too far forward
        if (starPositions[i * 3 + 2] > 50) {
          starPositions[i * 3 + 2] = -50
          starPositions[i * 3] = (Math.random() - 0.5) * 100
          starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100
        }
      }
      starField.geometry.attributes.position.needsUpdate = true

      // Move colored particles
      const particlePositions = particleSystem.geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3 + 2] += particleVelocities[i]
        
        if (particlePositions[i * 3 + 2] > 25) {
          particlePositions[i * 3 + 2] = -25
          particlePositions[i * 3] = (Math.random() - 0.5) * 50
          particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 50
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true

      // Update documents based on mouse position
      documentsRef.current.forEach((doc) => {
        const userData = doc.userData
        
        // Floating animation
        doc.position.y = userData.originalY + Math.sin(Date.now() * 0.001 + userData.floatOffset) * 0.8
        
        // Gentle rotation
        doc.rotation.y += userData.rotationSpeed
        doc.rotation.x = Math.sin(Date.now() * 0.0005 + userData.floatOffset) * 0.1
        
        // Mouse position determines tick or cross
        const mouseX = mouseXRef.current
        
        if (mouseX < -0.1) {
          // Mouse on left - show crosses (reject)
          userData.cross.material.opacity += (1 - userData.cross.material.opacity) * 0.1
          userData.checkmark.material.opacity += (0 - userData.checkmark.material.opacity) * 0.1
          doc.children[0].material.color.setHex(0xffcccc)
        } else if (mouseX > 0.1) {
          // Mouse on right - show checkmarks (approve)
          userData.checkmark.material.opacity += (1 - userData.checkmark.material.opacity) * 0.1
          userData.cross.material.opacity += (0 - userData.cross.material.opacity) * 0.1
          doc.children[0].material.color.setHex(0xccffcc)
        } else {
          // Mouse in center - neutral
          userData.checkmark.material.opacity += (0 - userData.checkmark.material.opacity) * 0.1
          userData.cross.material.opacity += (0 - userData.cross.material.opacity) * 0.1
          doc.children[0].material.color.setHex(0xffffff)
        }
      })

      renderer.render(scene, camera)
    }

    animate()
    console.log('Animation loop started')

    return () => {
      console.log('Cleaning up LandingCanvas')
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      
      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement)
        } catch (e) {
          console.error('Error removing renderer:', e)
        }
      }
      
      renderer.dispose()
      starField.geometry.dispose()
      starsMaterial.dispose()
      particleSystem.geometry.dispose()
      particlesMaterial.dispose()
      
      documentsRef.current.forEach(doc => {
        doc.children.forEach(child => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) child.material.dispose()
        })
      })
    }
    } catch (error) {
      console.error('Error in LandingCanvas setup:', error)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
    />
  )
}
