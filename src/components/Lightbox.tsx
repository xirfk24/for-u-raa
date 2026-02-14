interface Photo {
  src: string
  caption: string
}

interface LightboxProps {
  isOpen: boolean
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const Lightbox = ({ isOpen, photos, currentIndex, onClose, onPrev, onNext }: LightboxProps) => {
  if (!isOpen) return null

  const currentPhoto = photos[currentIndex]

  return (
    <div className={`lightbox ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <span className="lightbox-close">&times;</span>
      <img
        className="lightbox-img"
        src={currentPhoto.src}
        alt={currentPhoto.caption}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="lightbox-nav">
        <button
          className="lightbox-btn"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
        >
          ❮
        </button>
        <button
          className="lightbox-btn"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
        >
          ❯
        </button>
      </div>
      <p className="lightbox-caption">{currentPhoto.caption}</p>
    </div>
  )
}

export default Lightbox
