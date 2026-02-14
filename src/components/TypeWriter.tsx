import { useState, useEffect, useRef } from 'react'

interface TypeWriterProps {
  text: string
  delay?: number
  startDelay?: number
  onComplete?: () => void
  className?: string
  style?: React.CSSProperties
  showCursor?: boolean
  isActive?: boolean
}

const TypeWriter = ({
  text,
  delay = 50,
  startDelay = 0,
  onComplete,
  className = '',
  style = {},
  showCursor = true,
  isActive = true
}: TypeWriterProps) => {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const hasStartedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    // Only start if active and hasn't started yet
    if (!isActive || hasStartedRef.current) return

    hasStartedRef.current = true
    let timeout: ReturnType<typeof setTimeout>
    let charIndex = 0

    const typeChar = () => {
      if (charIndex < text.length) {
        const currentChar = text[charIndex]
        setDisplayText(text.substring(0, charIndex + 1))
        charIndex++

        // Variable delay for realistic typing
        let nextDelay = delay

        // Longer pause after punctuation
        if (['.', '!', '?'].includes(currentChar)) {
          nextDelay = delay * 6
        } else if ([',', ';', ':'].includes(currentChar)) {
          nextDelay = delay * 3
        } else if (currentChar === ' ') {
          nextDelay = delay * 1.2
        } else {
          // Random variation for natural feel
          nextDelay = delay + (Math.random() * delay * 0.4)
        }

        timeout = setTimeout(typeChar, nextDelay)
      } else {
        setIsComplete(true)
        onCompleteRef.current?.()
      }
    }

    timeout = setTimeout(typeChar, startDelay)

    return () => clearTimeout(timeout)
  }, [isActive, text, delay, startDelay])

  // If not active yet, show nothing
  if (!isActive && !hasStartedRef.current) {
    return null
  }

  return (
    <span className={className} style={style}>
      {displayText}
      {showCursor && !isComplete && (
        <span className="typewriter-cursor">|</span>
      )}
    </span>
  )
}

export default TypeWriter
