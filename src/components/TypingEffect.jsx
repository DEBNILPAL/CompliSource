import { useEffect, useRef, useState } from 'react'

export default function TypingEffect() {
  const [displayText, setDisplayText] = useState('')
  const text = 'Automated Compliance, Unleash Growth.'
  const typeSpeed = 95
  const eraseSpeed = 55
  const endPause = 1600
  const startPause = 600

  useEffect(() => {
    let i = 0
    let mode = 'typing'
    let timeout

    function step() {
      if (mode === 'typing') {
        if (i < text.length) {
          i += 1
          setDisplayText(text.slice(0, i))
          timeout = setTimeout(step, typeSpeed)
        } else {
          timeout = setTimeout(() => {
            mode = 'erasing'
            step()
          }, endPause)
        }
      } else { // erasing
        if (i > 0) {
          i -= 1
          setDisplayText(text.slice(0, i))
          timeout = setTimeout(step, eraseSpeed)
        } else {
          timeout = setTimeout(() => {
            mode = 'typing'
            step()
          }, startPause)
        }
      }
    }

    timeout = setTimeout(step, startPause)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <span id="typeText" aria-live="polite">{displayText}</span>
      <span className="cursor" aria-hidden="true"></span>
    </>
  )
}
