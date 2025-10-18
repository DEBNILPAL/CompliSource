import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function TestCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    console.log('TestCanvas mounted')
    if (!containerRef.current) {
      console.log('No container ref')
      return
    }

    console.log('Creating Three.js scene...')
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a1929)
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)
    console.log('Renderer added to DOM')

    // Add a simple cube
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00c49a })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    console.log('Cube added')

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()
    console.log('Animation started')

    return () => {
      console.log('Cleanup')
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
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
        background: '#0a1929'
      }}
    />
  )
}
