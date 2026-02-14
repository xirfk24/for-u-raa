import { useEffect, useRef } from 'react'

const FloatingHearts = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const hearts = ['❤', '💕', '💖', '💗', '💓', '💝', '♥', '🌹', '💐', '🥀', '💘', '💞']
    const petals = ['🌸', '🌺', '🌷', '💮', '🏵️']

    // Create initial hearts
    for (let i = 0; i < 25; i++) {
      createHeart(container, hearts)
    }

    // Create initial petals
    for (let i = 0; i < 15; i++) {
      createPetal(container, petals)
    }

    // Add more hearts and petals periodically
    const interval = setInterval(() => {
      if (container.querySelectorAll('.heart').length < 35) {
        const heart = createHeart(container, hearts)
        setTimeout(() => heart.remove(), 20000)
      }

      if (container.querySelectorAll('.petal').length < 20) {
        const petal = createPetal(container, petals)
        setTimeout(() => petal.remove(), 16000)
      }
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const createHeart = (container: HTMLDivElement, hearts: string[]) => {
    const heart = document.createElement('div')
    heart.className = 'heart'
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)]
    heart.style.left = Math.random() * 100 + '%'
    heart.style.animationDuration = (Math.random() * 10 + 10) + 's'
    heart.style.animationDelay = Math.random() * 15 + 's'
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px'
    container.appendChild(heart)
    return heart
  }

  const createPetal = (container: HTMLDivElement, petals: string[]) => {
    const petal = document.createElement('div')
    petal.className = 'petal'
    petal.innerHTML = petals[Math.floor(Math.random() * petals.length)]
    petal.style.left = Math.random() * 100 + '%'
    petal.style.animationDuration = (Math.random() * 8 + 8) + 's'
    petal.style.animationDelay = Math.random() * 10 + 's'
    petal.style.fontSize = (Math.random() * 15 + 12) + 'px'
    container.appendChild(petal)
    return petal
  }

  return (
    <>
      <div ref={containerRef} className="hearts-container" />
    </>
  )
}

export default FloatingHearts
