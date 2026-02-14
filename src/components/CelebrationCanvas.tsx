import { useEffect, useRef, useCallback } from 'react'

interface CelebrationCanvasProps {
  trigger: boolean
}

const CelebrationCanvas = ({ trigger }: CelebrationCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const fireworksRef = useRef<Firework[]>([])
  const animationIdRef = useRef<number | null>(null)

  const celebrationColors = [
    '#ff1493', '#ff69b4', '#ffb6c1', '#ffc0cb', '#ff85a2',
    '#ffffff', '#fff0f5', '#db7093', '#c71585', '#ff6b9d'
  ]

  class Particle {
    x: number
    y: number
    color: string
    size: number
    speedX: number
    speedY: number
    gravity: number
    rotation: number
    rotationSpeed: number
    opacity: number
    shape: number

    constructor(x: number, y: number, color: string) {
      this.x = x
      this.y = y
      this.color = color
      this.size = Math.random() * 8 + 4
      this.speedX = (Math.random() - 0.5) * 15
      this.speedY = Math.random() * -20 - 5
      this.gravity = 0.4
      this.rotation = Math.random() * 360
      this.rotationSpeed = (Math.random() - 0.5) * 15
      this.opacity = 1
      this.shape = Math.floor(Math.random() * 4)
    }

    update() {
      this.speedY += this.gravity
      this.x += this.speedX
      this.y += this.speedY
      this.rotation += this.rotationSpeed
      this.opacity -= 0.008
      this.speedX *= 0.99
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.rotation * Math.PI / 180)
      ctx.globalAlpha = Math.max(0, this.opacity)
      ctx.fillStyle = this.color
      ctx.shadowBlur = 10
      ctx.shadowColor = this.color

      if (this.shape === 0) {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
      } else if (this.shape === 1) {
        ctx.beginPath()
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (this.shape === 2) {
        this.drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4)
      } else {
        this.drawHeart(ctx, 0, 0, this.size)
      }

      ctx.restore()
    }

    drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
      let rot = Math.PI / 2 * 3
      const step = Math.PI / spikes
      ctx.beginPath()
      ctx.moveTo(cx, cy - outerRadius)
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius)
        rot += step
        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius)
        rot += step
      }
      ctx.lineTo(cx, cy - outerRadius)
      ctx.closePath()
      ctx.fill()
    }

    drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      ctx.beginPath()
      ctx.moveTo(x, y + size / 4)
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4)
      ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.7, x, y + size)
      ctx.bezierCurveTo(x, y + size * 0.7, x + size / 2, y + size / 2, x + size / 2, y + size / 4)
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4)
      ctx.fill()
    }
  }

  class Firework {
    x: number
    y: number
    targetY: number
    speedY: number
    color: string
    trail: { x: number; y: number }[]
    canvasHeight: number

    constructor(x: number, targetY: number, canvasHeight: number, colors: string[]) {
      this.x = x
      this.y = canvasHeight
      this.targetY = targetY
      this.speedY = -Math.random() * 8 - 12
      this.color = colors[Math.floor(Math.random() * colors.length)]
      this.trail = []
      this.canvasHeight = canvasHeight
    }

    update(particles: Particle[]): boolean {
      this.trail.push({ x: this.x, y: this.y })
      if (this.trail.length > 10) this.trail.shift()

      this.y += this.speedY
      this.speedY += 0.2

      if (this.speedY >= 0 || this.y <= this.targetY) {
        this.explode(particles)
        return false
      }
      return true
    }

    explode(particles: Particle[]) {
      const particleCount = 80
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2
        const speed = Math.random() * 8 + 4
        const p = new Particle(this.x, this.y, this.color)
        p.speedX = Math.cos(angle) * speed
        p.speedY = Math.sin(angle) * speed
        p.gravity = 0.15
        particles.push(p)
      }
      createHeartBurst(this.x, this.y)
    }

    draw(ctx: CanvasRenderingContext2D) {
      this.trail.forEach((point, index) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = index / this.trail.length * 0.5
        ctx.fill()
      })

      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.shadowBlur = 20
      ctx.shadowColor = this.color
      ctx.fill()
    }
  }

  const createHeartBurst = (x: number, y: number) => {
    const heartsEmoji = ['💖', '💗', '💓', '💕', '💘', '💝', '❤️', '💞']
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('div')
      heart.className = 'heart-burst'
      heart.innerHTML = heartsEmoji[Math.floor(Math.random() * heartsEmoji.length)]
      heart.style.left = x + 'px'
      heart.style.top = y + 'px'
      heart.style.animationDelay = (i * 0.05) + 's'

      const angle = (i / 12) * Math.PI * 2
      const distance = Math.random() * 100 + 50
      heart.style.setProperty('--tx', Math.cos(angle) * distance + 'px')
      heart.style.setProperty('--ty', Math.sin(angle) * distance + 'px')

      document.body.appendChild(heart)
      setTimeout(() => heart.remove(), 2000)
    }
  }

  const createLoveText = () => {
    const texts = ['I LOVE YOU!', '💖', 'FOREVER', '💕', 'MY LOVE', '❤️', 'HAPPY VALENTINE!', '💘']
    const text = document.createElement('div')
    text.className = 'love-text-float'
    text.innerHTML = texts[Math.floor(Math.random() * texts.length)]
    text.style.left = Math.random() * (window.innerWidth - 200) + 'px'
    text.style.top = Math.random() * (window.innerHeight / 2) + window.innerHeight / 4 + 'px'
    document.body.appendChild(text)
    setTimeout(() => text.remove(), 3000)
  }

  const createScreenFlash = () => {
    const flash = document.createElement('div')
    flash.className = 'screen-flash'
    document.body.appendChild(flash)
    setTimeout(() => flash.remove(), 600)
  }

  const createBigHeart = () => {
    const heart = document.createElement('div')
    heart.className = 'big-heart-explosion'
    heart.innerHTML = '💖'
    document.body.appendChild(heart)
    setTimeout(() => heart.remove(), 1500)
  }

  const createSparkleRain = () => {
    const sparkles = ['✨', '⭐', '💫', '🌟', '✧', '★']
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div')
        sparkle.className = 'sparkle-rain'
        sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)]
        sparkle.style.left = Math.random() * 100 + '%'
        sparkle.style.top = '-20px'
        sparkle.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem'
        sparkle.style.animationDuration = (Math.random() * 2 + 2) + 's'
        document.body.appendChild(sparkle)
        setTimeout(() => sparkle.remove(), 4000)
      }, i * 100)
    }
  }

  const launchCelebration = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    createScreenFlash()
    createBigHeart()
    createSparkleRain()

    const particles = particlesRef.current
    const fireworks = fireworksRef.current

    // Initial burst
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    for (let i = 0; i < 150; i++) {
      const color = celebrationColors[Math.floor(Math.random() * celebrationColors.length)]
      particles.push(new Particle(centerX, centerY, color))
    }

    // Launch fireworks
    const launchFireworks = () => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1
          const y = Math.random() * canvas.height * 0.4 + canvas.height * 0.1
          fireworks.push(new Firework(x, y, canvas.height, celebrationColors))
        }, i * 200)
      }
    }

    launchFireworks()
    setTimeout(launchFireworks, 800)
    setTimeout(launchFireworks, 1600)
    setTimeout(launchFireworks, 2400)

    // Love texts
    for (let i = 0; i < 8; i++) {
      setTimeout(createLoveText, i * 400 + 500)
    }

    // More sparkle rain
    setTimeout(createSparkleRain, 1500)
    setTimeout(createSparkleRain, 3000)

    // Side cannons
    setTimeout(() => {
      for (let i = 0; i < 50; i++) {
        const color = celebrationColors[Math.floor(Math.random() * celebrationColors.length)]
        const pLeft = new Particle(0, canvas.height, color)
        pLeft.speedX = Math.random() * 15 + 5
        pLeft.speedY = Math.random() * -20 - 10
        particles.push(pLeft)

        const pRight = new Particle(canvas.width, canvas.height, color)
        pRight.speedX = -(Math.random() * 15 + 5)
        pRight.speedY = Math.random() * -20 - 10
        particles.push(pRight)
      }
    }, 300)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(p => {
        p.update()
        p.draw(ctx)
        return p.opacity > 0 && p.y < canvas.height + 100
      })

      fireworksRef.current = fireworksRef.current.filter(f => {
        const alive = f.update(particlesRef.current)
        if (alive) f.draw(ctx)
        return alive
      })

      if (particlesRef.current.length > 0 || fireworksRef.current.length > 0) {
        animationIdRef.current = requestAnimationFrame(animate)
      }
    }

    animate()
  }, [celebrationColors])

  useEffect(() => {
    if (trigger) {
      launchCelebration()
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [trigger, launchCelebration])

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <canvas ref={canvasRef} id="celebrationCanvas" />
}

export default CelebrationCanvas
