import { useEffect, useRef } from 'react'

export default function DashboardDemo() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = 450 * dpr
    canvas.height = 300 * dpr
    canvas.style.width = '450px'
    canvas.style.height = '300px'
    ctx.scale(dpr, dpr)

    let startTime = Date.now()

    const bgColor = '#f8fafc'
    const cardBg = '#ffffff'
    const primaryColor = '#0a2540'
    const accentColor = '#00c49a'
    const mutedColor = '#64748b'

    const phases = {
      IDLE: { start: 0, end: 500 },
      SHOW_COUNTRY_DROPDOWN: { start: 500, end: 2000 },
      SELECT_COUNTRY: { start: 2000, end: 2500 },
      SHOW_BLOCKCHAIN_DROPDOWN: { start: 2500, end: 4000 },
      SELECT_BLOCKCHAIN: { start: 4000, end: 4500 },
      SELECT_FILE: { start: 4500, end: 5500 },
      RUN_ENGINE: { start: 5500, end: 7000 },
      SHOW_SCORE: { start: 7000, end: 8500 },
      FINAL_MESSAGE: { start: 8500, end: 9500 },
      FADE_OUT: { start: 9500, end: 10000 }
    }

    const DURATION = 10000

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    function getPhaseProgress(time, phase) {
      if (time < phase.start) return 0
      if (time > phase.end) return 1
      return (time - phase.start) / (phase.end - phase.start)
    }

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

    function drawDashboard(opacity, countrySelected, blockchainSelected, showCountryDropdown, showBlockchainDropdown, fileSelected, showScore, scoreProgress) {
      ctx.save()
      ctx.globalAlpha = opacity

      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, 450, 300)

      ctx.fillStyle = primaryColor
      ctx.font = 'bold 20px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Compliance Dashboard', 225, 32)

      ctx.fillStyle = mutedColor
      ctx.font = '10px system-ui'
      const currentStep = countrySelected === 0 ? '1' : blockchainSelected === 0 ? '2' : fileSelected === 0 ? '3' : showScore === 0 ? '4' : '5'
      ctx.fillText(`Step ${currentStep} of 5`, 225, 48)

      const configY = 65

      // Country Selector
      ctx.fillStyle = cardBg
      ctx.strokeStyle = countrySelected > 0 ? accentColor : '#cbd5e1'
      ctx.lineWidth = countrySelected > 0 || showCountryDropdown > 0 ? 3 : 2
      if (showCountryDropdown > 0 || countrySelected > 0) {
        ctx.shadowColor = 'rgba(0, 196, 154, 0.25)'
        ctx.shadowBlur = 10
      }
      drawRoundRect(40, configY, 180, 34, 7)
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.fillStyle = countrySelected > 0 ? accentColor : mutedColor
      ctx.font = countrySelected > 0 ? 'bold 13px system-ui' : '12px system-ui'
      ctx.textAlign = 'left'
      ctx.fillText(countrySelected > 0 ? '🇮🇳 India' : '🌍 Select Country', 54, configY + 22)
      
      ctx.fillStyle = mutedColor
      ctx.font = '11px system-ui'
      ctx.fillText('▼', 200, configY + 22)

      if (showCountryDropdown > 0) {
        ctx.globalAlpha = opacity * Math.min(showCountryDropdown * 2, 1)
        ctx.fillStyle = cardBg
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 2
        ctx.shadowColor = 'rgba(0,0,0,0.2)'
        ctx.shadowBlur = 20
        drawRoundRect(40, configY + 38, 180, 122, 7)
        ctx.fill()
        ctx.stroke()
        ctx.shadowBlur = 0

        const countries = ['🇮🇳 India', '🇺🇸 USA', '🇬🇧 UK', '🇪🇺 EU', '🇦🇺 Australia', '🇨🇦 Canada', '🇸🇬 Singapore']
        
        countries.forEach((country, idx) => {
          const itemY = configY + 47 + idx * 16
          
          if (idx === 0 && countrySelected > 0.2) {
            ctx.fillStyle = '#dcfce7'
            drawRoundRect(46, itemY, 168, 15, 4)
            ctx.fill()
          }
          
          ctx.fillStyle = idx === 0 && countrySelected > 0.2 ? accentColor : primaryColor
          ctx.font = idx === 0 && countrySelected > 0.2 ? 'bold 11px system-ui' : '10px system-ui'
          ctx.textAlign = 'left'
          ctx.fillText(country, 54, itemY + 11)
        })
        ctx.globalAlpha = opacity
      }

      // Blockchain Selector
      ctx.fillStyle = cardBg
      ctx.strokeStyle = blockchainSelected > 0 ? accentColor : '#cbd5e1'
      ctx.lineWidth = blockchainSelected > 0 || showBlockchainDropdown > 0 ? 3 : 2
      if (showBlockchainDropdown > 0 || blockchainSelected > 0) {
        ctx.shadowColor = 'rgba(0, 196, 154, 0.25)'
        ctx.shadowBlur = 10
      }
      drawRoundRect(230, configY, 180, 34, 7)
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.fillStyle = blockchainSelected > 0 ? accentColor : mutedColor
      ctx.font = blockchainSelected > 0 ? 'bold 13px system-ui' : '12px system-ui'
      ctx.textAlign = 'left'
      ctx.fillText(blockchainSelected > 0 ? '⬡ Polygon' : '⛓️ Select Blockchain', 244, configY + 22)
      
      ctx.fillStyle = mutedColor
      ctx.font = '11px system-ui'
      ctx.fillText('▼', 390, configY + 22)

      if (showBlockchainDropdown > 0) {
        ctx.globalAlpha = opacity * Math.min(showBlockchainDropdown * 2, 1)
        ctx.fillStyle = cardBg
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 2
        ctx.shadowColor = 'rgba(0,0,0,0.2)'
        ctx.shadowBlur = 20
        drawRoundRect(230, configY + 38, 180, 122, 7)
        ctx.fill()
        ctx.stroke()
        ctx.shadowBlur = 0

        const blockchains = ['⬡ Polygon', '◆ Ethereum', '🔶 BSC', '🔷 Arbitrum', '🔴 Optimism', '🔺 Avalanche', '🌐 Solana']
        
        blockchains.forEach((chain, idx) => {
          const itemY = configY + 47 + idx * 16
          
          if (idx === 0 && blockchainSelected > 0.2) {
            ctx.fillStyle = '#dcfce7'
            drawRoundRect(236, itemY, 168, 15, 4)
            ctx.fill()
          }
          
          ctx.fillStyle = idx === 0 && blockchainSelected > 0.2 ? accentColor : primaryColor
          ctx.font = idx === 0 && blockchainSelected > 0.2 ? 'bold 11px system-ui' : '10px system-ui'
          ctx.textAlign = 'left'
          ctx.fillText(chain, 244, itemY + 11)
        })
        ctx.globalAlpha = opacity
      }

      // CSV Upload
      const uploadY = 195
      ctx.fillStyle = cardBg
      ctx.strokeStyle = fileSelected > 0 ? accentColor : '#e2e8f0'
      ctx.lineWidth = fileSelected > 0 ? 3 : 2
      if (fileSelected > 0) {
        ctx.shadowColor = 'rgba(0, 196, 154, 0.25)'
        ctx.shadowBlur = 10
      }
      drawRoundRect(40, uploadY, 180, 52, 8)
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.fillStyle = primaryColor
      ctx.font = 'bold 13px system-ui'
      ctx.textAlign = 'left'
      ctx.fillText('📁 Take CSV File', 54, uploadY + 20)

      if (fileSelected > 0) {
        ctx.fillStyle = accentColor
        ctx.font = 'bold 11px system-ui'
        ctx.fillText('✓ transactions.csv', 54, uploadY + 38)
      } else {
        ctx.fillStyle = mutedColor
        ctx.font = '10px system-ui'
        ctx.fillText('Upload transaction data', 54, uploadY + 38)
      }

      // Run Engine
      ctx.fillStyle = cardBg
      ctx.strokeStyle = showScore > 0 && showScore < 1 ? accentColor : '#e2e8f0'
      ctx.lineWidth = showScore > 0 && showScore < 1 ? 3 : 2
      if (showScore > 0 && showScore < 1) {
        ctx.shadowColor = 'rgba(0, 196, 154, 0.25)'
        ctx.shadowBlur = 10
      }
      drawRoundRect(230, uploadY, 180, 52, 8)
      ctx.fill()
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.fillStyle = primaryColor
      ctx.font = 'bold 13px system-ui'
      ctx.textAlign = 'left'
      ctx.fillText('⚙️ Run Engine', 244, uploadY + 20)

      if (showScore > 0 && showScore < 1) {
        ctx.fillStyle = accentColor
        ctx.font = '11px system-ui'
        ctx.fillText('Processing...', 244, uploadY + 38)
        
        const barWidth = 150 * showScore
        ctx.fillStyle = '#e0f2fe'
        drawRoundRect(244, uploadY + 43, 150, 4, 2)
        ctx.fill()
        ctx.fillStyle = accentColor
        drawRoundRect(244, uploadY + 43, barWidth, 4, 2)
        ctx.fill()
      } else if (showScore >= 1) {
        ctx.fillStyle = accentColor
        ctx.font = 'bold 11px system-ui'
        ctx.fillText('✓ Complete', 244, uploadY + 38)
      } else {
        ctx.fillStyle = mutedColor
        ctx.font = '10px system-ui'
        ctx.fillText('Analyze compliance', 244, uploadY + 38)
      }

      // Compliance Score
      if (scoreProgress > 0) {
        const scoreY = 260
        const scoreOpacity = easeInOutCubic(scoreProgress)
        
        ctx.save()
        ctx.globalAlpha = opacity * scoreOpacity
        
        ctx.fillStyle = cardBg
        ctx.strokeStyle = accentColor
        ctx.lineWidth = 4
        ctx.shadowColor = 'rgba(0, 196, 154, 0.4)'
        ctx.shadowBlur = 20
        drawRoundRect(100, scoreY, 250, 50, 10)
        ctx.fill()
        ctx.stroke()
        ctx.shadowBlur = 0

        ctx.fillStyle = primaryColor
        ctx.font = 'bold 14px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('✅ Compliance Score', 225, scoreY + 20)

        ctx.fillStyle = accentColor
        ctx.font = 'bold 24px system-ui'
        ctx.fillText('87.5%', 225, scoreY + 42)

        ctx.restore()
      }

      ctx.restore()
    }

    function drawFinalMessage(progress) {
      const scale = 0.8 + easeInOutCubic(progress) * 0.2
      const opacity = easeInOutCubic(progress)
      
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.translate(225, 150)
      ctx.scale(scale, scale)
      
      ctx.fillStyle = 'rgba(0, 196, 154, 0.95)'
      ctx.fillRect(-225, -150, 450, 300)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 26px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('That Simple!', 0, -20)
      
      ctx.font = 'bold 20px system-ui'
      ctx.fillText('✨ Five Easy Steps ✨', 0, 10)

      ctx.font = '13px system-ui'
      ctx.fillText('🌍 Multi-Country • 🤖 AI • ⛓️ Cross-Chain', 0, 35)

      ctx.restore()
    }

    function animate() {
      const elapsed = (Date.now() - startTime) % DURATION
      
      ctx.clearRect(0, 0, 450, 300)

      const showCountryDropdownProgress = getPhaseProgress(elapsed, phases.SHOW_COUNTRY_DROPDOWN)
      const selectCountryProgress = getPhaseProgress(elapsed, phases.SELECT_COUNTRY)
      const showBlockchainDropdownProgress = getPhaseProgress(elapsed, phases.SHOW_BLOCKCHAIN_DROPDOWN)
      const selectBlockchainProgress = getPhaseProgress(elapsed, phases.SELECT_BLOCKCHAIN)
      const selectFileProgress = getPhaseProgress(elapsed, phases.SELECT_FILE)
      const runEngineProgress = getPhaseProgress(elapsed, phases.RUN_ENGINE)
      const showScoreProgress = getPhaseProgress(elapsed, phases.SHOW_SCORE)
      const finalMessageProgress = getPhaseProgress(elapsed, phases.FINAL_MESSAGE)
      const fadeOutProgress = getPhaseProgress(elapsed, phases.FADE_OUT)

      let opacity = 1
      if (fadeOutProgress > 0) {
        opacity = 1 - fadeOutProgress
      }

      const showCountryDropdown = showCountryDropdownProgress
      const countrySelected = selectCountryProgress
      const showBlockchainDropdown = showBlockchainDropdownProgress
      const blockchainSelected = selectBlockchainProgress
      const fileSelected = selectFileProgress
      const showScore = runEngineProgress
      const scoreProgress = showScoreProgress

      drawDashboard(opacity, countrySelected, blockchainSelected, 
                    showCountryDropdown, showBlockchainDropdown, 
                    fileSelected, showScore, scoreProgress)

      if (finalMessageProgress > 0 && fadeOutProgress === 0) {
        drawFinalMessage(finalMessageProgress)
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {}
  }, [])

  return (
    <div className="dashboard-demo">
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
