import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import FloatingHearts from '../components/FloatingHearts'
import '../styles/special.css'

const SpecialPage = () => {
  const heartCanvasRef = useRef<HTMLCanvasElement>(null)
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Background particles
    const bgCanvas = bgCanvasRef.current
    if (!bgCanvas) return

    const bgCtx = bgCanvas.getContext('2d')
    if (!bgCtx) return

    const resizeBgCanvas = () => {
      bgCanvas.width = window.innerWidth
      bgCanvas.height = window.innerHeight
    }
    resizeBgCanvas()
    window.addEventListener('resize', resizeBgCanvas)

    const bgParticles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number }[] = []
    for (let i = 0; i < 25; i++) {
      bgParticles.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    let bgAnimationId: number
    const animateBgParticles = () => {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)

      bgParticles.forEach(p => {
        p.y -= p.speedY
        p.x += p.speedX

        if (p.y < -10) {
          p.y = bgCanvas.height + 10
          p.x = Math.random() * bgCanvas.width
        }

        bgCtx.beginPath()
        bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        bgCtx.fillStyle = `rgba(255, 105, 180, ${p.opacity})`
        bgCtx.fill()
      })

      bgAnimationId = requestAnimationFrame(animateBgParticles)
    }
    animateBgParticles()

    return () => {
      window.removeEventListener('resize', resizeBgCanvas)
      cancelAnimationFrame(bgAnimationId)
    }
  }, [])

  useEffect(() => {
    // 3D Heart animatidunabaon
    const canvas = heartCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    interface HeartParticle {
      baseX: number
      baseY: number
      baseZ: number
      size: number
      brightness: number
      twinkleSpeed: number
      twinklePhase: number
      color: 'pink' | 'white' | 'glow'
    }

    const particles: HeartParticle[] = []
    let rotationAngle = 0
    let time = 0

    const heartX = (t: number, scale: number = 1) => scale * 16 * Math.pow(Math.sin(t), 3)
    const heartY = (t: number, scale: number = 1) => -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))

    // Initialize main heart particles (optimized count)
    for (let i = 0; i < 500; i++) {
      const t = (i / 500) * Math.PI * 2
      const scale = 11 // Bigger heart
      const spread = Math.random() * 8 - 4
      const depthSpread = Math.random() * 25 - 12.5

      particles.push({
        baseX: heartX(t, scale) + spread,
        baseY: heartY(t, scale) + spread,
        baseZ: depthSpread,
        size: Math.random() * 4 + 1.8,
        brightness: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.08 + 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.25 ? 'pink' : 'white'
      })
    }

    // Inner glow particles (makes heart look fuller)
    for (let i = 0; i < 120; i++) {
      const t = Math.random() * Math.PI * 2
      const scale = 7 + Math.random() * 3
      const innerSpread = Math.random() * 15 - 7.5

      particles.push({
        baseX: heartX(t, scale) + innerSpread,
        baseY: heartY(t, scale) + innerSpread,
        baseZ: (Math.random() - 0.5) * 20,
        size: Math.random() * 3 + 1.2,
        brightness: Math.random() * 0.4 + 0.6,
        twinkleSpeed: Math.random() * 0.1 + 0.05,
        twinklePhase: Math.random() * Math.PI * 2,
        color: 'pink'
      })
    }

    // Outer glow particles (soft edge effect)
    for (let i = 0; i < 80; i++) {
      const t = Math.random() * Math.PI * 2
      const scale = 11.5 + Math.random() * 2

      particles.push({
        baseX: heartX(t, scale),
        baseY: heartY(t, scale),
        baseZ: (Math.random() - 0.5) * 35,
        size: Math.random() * 2.5 + 1,
        brightness: Math.random() * 0.3 + 0.2,
        twinkleSpeed: Math.random() * 0.12 + 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        color: 'glow'
      })
    }

    // Pre-sort particles by baseZ for consistent depth rendering
    particles.sort((a, b) => a.baseZ - b.baseZ)

    // Precompute sin/cos for rotation
    const cosAngle = (angle: number) => Math.cos(angle)
    const sinAngle = (angle: number) => Math.sin(angle)

    let animationId: number
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      // Delta time for smooth animation regardless of frame rate
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      ctx.clearRect(0, 0, width, height)

      time += deltaTime
      rotationAngle += deltaTime * 0.9 // Smooth rotation speed

      // Heartbeat breathing effect
      const heartbeat = Math.sin(time * 2.5) * 0.015 + Math.sin(time * 5) * 0.008
      const breathe = 1 + heartbeat
      const cosR = cosAngle(rotationAngle)
      const sinR = sinAngle(rotationAngle)
      const tiltAngle = Math.sin(time * 0.5) * 0.15
      const cosT = cosAngle(tiltAngle)
      const sinT = sinAngle(tiltAngle)

      // Render all particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Rotate Y
        const bx = p.baseX * breathe
        const bz = p.baseZ
        const rx = bx * cosR - bz * sinR
        const rz = bx * sinR + bz * cosR

        // Rotate X (tilt)
        const by = p.baseY * breathe
        const ry = by * cosT - rz * sinT
        const finalZ = by * sinT + rz * cosT

        const perspective = 400 / (400 + finalZ)
        const screenX = centerX + rx * perspective
        const screenY = centerY + ry * perspective
        const size = p.size * perspective

        const twinkle = Math.sin(time * p.twinkleSpeed * 50 + p.twinklePhase) * 0.4 + 0.6
        const alpha = Math.min(1, p.brightness * twinkle * perspective * 1.5)

        let r: number, g: number, b: number
        if (p.color === 'white') {
          // Sparkling white with slight pink tint
          r = 255; g = 240 + (Math.sin(time * 3 + p.twinklePhase) * 15) | 0; b = 250
        } else if (p.color === 'glow') {
          // Soft magenta glow
          r = 255; g = 80 + (p.brightness * 60) | 0; b = 180
        } else {
          // Beautiful gradient pink based on depth
          const depthFactor = (finalZ + 20) / 40
          r = 255
          g = (80 + depthFactor * 80) | 0  // More vibrant pink
          b = (150 + depthFactor * 50) | 0
        }

        // Draw particle with soft glow
        ctx.beginPath()
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2)

        // Create gradient for each particle (aesthetic glow)
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size)
        gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
        gradient.addColorStop(0.6, `rgba(${r},${g},${b},${alpha * 0.6})`)
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    // Sparkle effect - gentle twinkling (optimized)
    const sparkleInterval = setInterval(() => {
      for (let i = 0; i < 4; i++) {
        const idx = Math.floor(Math.random() * particles.length)
        if (particles[idx]) {
          const originalBrightness = particles[idx].brightness
          particles[idx].brightness = 1
          setTimeout(() => {
            if (particles[idx]) {
              particles[idx].brightness = originalBrightness
            }
          }, 300)
        }
      }
    }, 150)

    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(sparkleInterval)
    }
  }, [])

  // Auto-play music when page loads
  useEffect(() => {
    const audio = document.getElementById('specialMusic') as HTMLAudioElement
    if (audio) {
      audio.play().catch(() => {
        // Browser blocked autoplay
      })
    }

    return () => {
      // Stop music when leaving page
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [])

  return (
    <div className="special-page">
      <canvas ref={bgCanvasRef} className="particles-bg" />
      <FloatingHearts />

      <div className="special-container">
        {/* Left Photo */}
        <div className="photo-section">
          <div className="photo-frame">
            <div className="photo-inner">
              <img src="/photos/gw.jpg" alt="Rifki" />
            </div>
          </div>
          <div className="photo-name">Rifki</div>
        </div>

        {/* Center Heart */}
        <div className="heart-container">
          <canvas ref={heartCanvasRef} width={420} height={420} />
          <div className="valentine-text">
            <span className="text-line1">Happy Valentine</span>
            <span className="text-line2">Sayang</span>
            <span className="sparkle-text">✨💕✨</span>
          </div>
        </div>

        {/* Right Photo */}
        <div className="photo-section">
          <div className="photo-frame">
            <div className="photo-inner">
              <img src="/photos/dia.jpg" alt="Ranti" />
            </div>
          </div>
          <div className="photo-name">Ranti</div>
        </div>
      </div>

      <Link to="/" className="back-btn">❮ Kembali</Link>

      {/* Background Music */}
      <audio id="specialMusic" loop>
        <source src="/justthewayuare.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}

export default SpecialPage
