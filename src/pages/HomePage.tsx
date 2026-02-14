import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import FloatingHearts from '../components/FloatingHearts'
import PhotoGallery from '../components/PhotoGallery'
import CelebrationCanvas from '../components/CelebrationCanvas'
import Lightbox from '../components/Lightbox'
import TypeWriter from '../components/TypeWriter'

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [celebrate, setCelebrate] = useState(false)
  const [letterStep, setLetterStep] = useState(0)

  const photoConfig = [
    { src: '/photos/foto1.jpg', caption: '💕' },
    { src: '/photos/foto2.jpg', caption: '💖' },
    { src: '/photos/foto3.jpg', caption: '🌸' },
    { src: '/photos/foto4.jpg', caption: '💗' },
    { src: '/photos/foto5.jpg', caption: '✨' },
    { src: '/photos/foto6.jpg', caption: '💝' }
  ]

  const showPage = useCallback((pageNum: number) => {
    setCurrentPage(pageNum)
    if (pageNum === 6) {
      setTimeout(() => setCelebrate(true), 500)
    }
  }, [])

  const toggleMusic = () => {
    const audio = document.getElementById('bgMusic') as HTMLAudioElement
    if (musicPlaying) {
      audio?.pause()
    } else {
      audio?.play().catch(() => {
        alert('Tambahkan file musik "your-romantic-song.mp3" ke folder public untuk memutar musik!')
      })
    }
    setMusicPlaying(!musicPlaying)
  }

  const openPhoto = (index: number) => {
    setCurrentPhotoIndex(index)
    setLightboxOpen(true)
  }

  const launchCelebration = () => {
    setCelebrate(true)
    setTimeout(() => setCelebrate(false), 8000)
  }

  // Reset letter typing and auto-play music when entering page 5
  useEffect(() => {
    if (currentPage === 5) {
      setLetterStep(0)
      // Auto-play music when Love Letter opens
      const audio = document.getElementById('bgMusic') as HTMLAudioElement
      if (audio && !musicPlaying) {
        audio.play().then(() => {
          setMusicPlaying(true)
        }).catch(() => {
          // Browser blocked autoplay, user needs to click
        })
      }
    }
  }, [currentPage, musicPlaying])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') setLightboxOpen(false)
        if (e.key === 'ArrowLeft') {
          setCurrentPhotoIndex(prev => (prev - 1 + photoConfig.length) % photoConfig.length)
        }
        if (e.key === 'ArrowRight') {
          setCurrentPhotoIndex(prev => (prev + 1) % photoConfig.length)
        }
        return
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentPage < 6) showPage(currentPage + 1)
      } else if (e.key === 'ArrowLeft') {
        if (currentPage > 1) showPage(currentPage - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, lightboxOpen, showPage, photoConfig.length])

  return (
    <>
      <div className="glitter" />
      <FloatingHearts />
      <CelebrationCanvas trigger={celebrate} />

      {/* Navigation Dots */}
      <div className="nav-dots">
        {[1, 2, 3, 4, 5, 6].map(num => (
          <div
            key={num}
            className={`nav-dot ${currentPage === num ? 'active' : ''}`}
            onClick={() => showPage(num)}
          />
        ))}
      </div>

      {/* Page 1: Homepage */}
      <div className={`page ${currentPage === 1 ? 'active' : ''}`}>
        <div className="sparkle" style={{ top: '20%', left: '10%' }}>✦</div>
        <div className="sparkle" style={{ top: '30%', right: '15%', animationDelay: '0.5s' }}>✦</div>
        <div className="sparkle" style={{ bottom: '25%', left: '20%', animationDelay: '1s' }}>✦</div>
        <div className="sparkle" style={{ top: '15%', right: '25%', animationDelay: '1.5s' }}>✦</div>

        <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'pulse 1.5s ease infinite' }}>💕</div>

        <h1 className="retro-title">FOR MY VALENTINE,<br />ALWAYS</h1>
        <div className="decorative-line" />
        <p className="subtitle">Open gently. It's meant for you.</p>

        <button className="btn" onClick={() => showPage(2)}>💗 Open With Love 💗</button>
      </div>

      {/* Page 2: Dedication */}
      <div className={`page ${currentPage === 2 ? 'active' : ''}`}>
        <div className="content-box">
          <h2 className="retro-title" style={{ fontSize: '1.2rem' }}>This Is For You</h2>
          <div className="decorative-line" />
          <p style={{ textAlign: 'center', lineHeight: 2, margin: '20px 0' }}>
            For the person I choose in every version of the day...<br />
            In every quiet moment, in every loud laugh,<br />
            In every dream I dream, you're always there.<br />
            This is my heart, wrapped in pixels and love.
          </p>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn" onClick={() => showPage(4)}>📁 Surprise Files</button>
          <button className="btn btn-secondary" onClick={() => showPage(3)}>🎁 Surprise 1</button>
          <button className="btn btn-secondary" onClick={() => showPage(5)}>💌 Surprise 2</button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link to="/special" className="btn btn-special">❤ SOMETHING FOR U ❤</Link>
        </div>
      </div>

      {/* Page 3: Photo Gallery */}
      <div className={`page ${currentPage === 3 ? 'active' : ''}`}>
        <h2 className="retro-title" style={{ fontSize: '1.3rem' }}>Our Photo Memory</h2>
        <p className="subtitle">These still make me smile.</p>

        <PhotoGallery photos={photoConfig} onPhotoClick={openPhoto} />

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => showPage(4)}>← Menu</button>
          <button className="btn" onClick={() => showPage(5)}>Next → 💌</button>
        </div>
      </div>

      {/* Page 4: Menu Navigation */}
      <div className={`page ${currentPage === 4 ? 'active' : ''}`}>
        <h2 className="retro-title" style={{ fontSize: '1.1rem' }}>♥ Menu ♥</h2>
        <p className="subtitle">Love unfolds one click at a time</p>

        <div className="menu-grid">
          <button className="btn" onClick={() => showPage(1)}>🏠 Home</button>
          <button className="btn btn-secondary" onClick={() => showPage(2)}>💌 Dedication</button>
          <button className="btn" onClick={() => showPage(3)}>📷 Photos</button>
          <button className="btn btn-secondary" onClick={() => showPage(5)}>💌 Love Letter</button>
          <button className="btn" onClick={() => showPage(6)}>🎉 Final Surprise</button>
        </div>
      </div>

      {/* Page 5: Love Letter */}
      <div className={`page ${currentPage === 5 ? 'active' : ''}`}>
        <div className="content-box" style={{ maxWidth: '900px' }}>
          <h2 className="retro-title" style={{ fontSize: '1.2rem' }}>A Letter From My Heart</h2>
          <div className="decorative-line" />

          <div className="music-hint" onClick={toggleMusic}>
            <span className="music-icon">{musicPlaying ? '🎶' : '🎵'}</span>
            <span>{musicPlaying ? 'Give Me Your Forever💕' : 'Play our music while reading my letter for you'}</span>
          </div>

          <div className="letter">
            <p style={{ textAlign: 'center', textIndent: 0, marginBottom: '25px' }}>
              <strong>
                <TypeWriter
                  text="Hii Sayang 💖"
                  delay={80}
                  startDelay={500}
                  onComplete={() => setLetterStep(1)}
                  showCursor={letterStep === 0}
                  isActive={currentPage === 5}
                />
              </strong>
              <br />
              <em>
                <TypeWriter
                  text="Happy Valentine yaa 💕"
                  delay={70}
                  onComplete={() => setLetterStep(2)}
                  showCursor={letterStep === 1}
                  isActive={letterStep >= 1}
                />
              </em>
            </p>

            <p>
              <TypeWriter
                text="Aku nggak jago nulis yang manis-manis, jadi langsung aja ya. Aku seneng banget bisa kenal kamu dan ngobrol sejauh ini. Rasanya nyaman aja, nggak ribet, nggak dibuat-buat."
                delay={30}
                onComplete={() => setLetterStep(3)}
                showCursor={letterStep === 2}
                isActive={letterStep >= 2}
              />
            </p>

            <p>
              <TypeWriter
                text="Aku cuma mau bilang kalau aku nggak nganggep ini sekadar lewat doang. Aku beneran pengen jalanin pelan-pelan dan lihat bisa sejauh apa. Nggak perlu buru-buru, yang penting sama-sama enak dan sama-sama mau."
                delay={30}
                onComplete={() => setLetterStep(4)}
                showCursor={letterStep === 3}
                isActive={letterStep >= 3}
              />
            </p>

            <p>
              <TypeWriter
                text="Makasih ya udah kasih kesempatan buat aku deket sama kamu."
                delay={35}
                onComplete={() => setLetterStep(5)}
                showCursor={letterStep === 4}
                isActive={letterStep >= 4}
              />
            </p>

            <p style={{ textAlign: 'center', textIndent: 0, fontSize: '1.2rem' }}>
              <TypeWriter
                text="Love u more! ✨💕✨"
                delay={70}
                onComplete={() => setLetterStep(6)}
                showCursor={letterStep === 5}
                isActive={letterStep >= 5}
              />
            </p>

            <p className="letter-signature">
              <TypeWriter
                text="Forever yours,"
                delay={50}
                onComplete={() => setLetterStep(7)}
                showCursor={letterStep === 6}
                isActive={letterStep >= 6}
              />
              <br />
              <TypeWriter
                text="♥ Rifki ♥"
                delay={80}
                showCursor={letterStep === 7}
                onComplete={() => setLetterStep(8)}
                isActive={letterStep >= 7}
              />
            </p>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => showPage(3)}>← Back</button>
          <button className="btn" onClick={() => showPage(6)}>Next → 🎁</button>
        </div>
      </div>

      {/* Page 6: Final Page */}
      <div className={`page ${currentPage === 6 ? 'active' : ''}`}>
        <div style={{ fontSize: '6rem', marginBottom: '20px', animation: 'heartbeat 1s ease infinite' }}>💕</div>

        <h1 className="final-title">
          I LOVE YOU<br /><br />
          HAPPY<br />VALENTINE'S DAY!
        </h1>

        <div style={{ fontSize: '3rem', margin: '20px 0', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <span style={{ animation: 'bounce 0.6s ease infinite' }}>💗</span>
          <span style={{ animation: 'bounce 0.6s ease infinite 0.1s' }}>💕</span>
          <span style={{ animation: 'bounce 0.6s ease infinite 0.2s' }}>💘</span>
          <span style={{ animation: 'bounce 0.6s ease infinite 0.3s' }}>💕</span>
          <span style={{ animation: 'bounce 0.6s ease infinite 0.4s' }}>💗</span>
        </div>

        <p className="subtitle" style={{ fontSize: '1.4rem' }}>You mean everything to me. 💜</p>

        <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => showPage(5)}>← Back</button>
          <button className="btn btn-celebrate" onClick={launchCelebration}>🎉 Celebrate! 🎉</button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link to="/special" className="btn btn-special">Next → ❤ Something For U ❤</Link>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        photos={photoConfig}
        currentIndex={currentPhotoIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setCurrentPhotoIndex(prev => (prev - 1 + photoConfig.length) % photoConfig.length)}
        onNext={() => setCurrentPhotoIndex(prev => (prev + 1) % photoConfig.length)}
      />

      {/* Background Music */}
      <audio id="bgMusic" loop>
        <source src="/givemeforever.mp3" type="audio/mpeg" />
      </audio>
    </>
  )
}

export default HomePage
