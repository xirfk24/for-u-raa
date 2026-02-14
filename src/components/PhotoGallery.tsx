import { useState } from 'react'

interface Photo {
  src: string
  caption: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  onPhotoClick: (index: number) => void
}

const PhotoGallery = ({ photos, onPhotoClick }: PhotoGalleryProps) => {
  const [loadedPhotos, setLoadedPhotos] = useState<boolean[]>(new Array(photos.length).fill(false))

  const handleImageLoad = (index: number) => {
    setLoadedPhotos(prev => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
  }

  const handleImageError = (index: number) => {
    setLoadedPhotos(prev => {
      const newState = [...prev]
      newState[index] = false
      return newState
    })
  }

  const placeholderIcons = ['📷', '💕', '🌸', '💖', '✨', '💝']

  return (
    <div className="gallery">
      {photos.map((photo, index) => (
        <div
          key={index}
          className="gallery-item photo-slot"
          onClick={() => loadedPhotos[index] && onPhotoClick(index)}
        >
          <img
            src={photo.src}
            alt={`Kenangan ${index + 1}`}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
            style={{ display: loadedPhotos[index] ? 'block' : 'none' }}
          />
          {!loadedPhotos[index] && (
            <span className="photo-placeholder">
              {placeholderIcons[index] || '📷'}
              <br />
              <small>Foto {index + 1}</small>
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default PhotoGallery
