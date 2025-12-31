import React, { useState, useRef, useEffect } from 'react'
import image1 from '../assets/images/WhatsApp Image 2025-12-31 at 11.19.40 PM.jpeg'
import image2 from '../assets/images/WhatsApp Image 2025-12-31 at 11.19.41 PM (2).jpeg'
import image3 from '../assets/images/WhatsApp Image 2025-12-31 at 11.19.41 PM.jpeg'
import image4 from '../assets/images/WhatsApp Image 2025-12-31 at 11.19.42 PM (2).jpeg'
import image5 from '../assets/images/WhatsApp Image 2025-12-31 at 11.19.42 PM (3).jpeg'
import image6 from '../assets/images/WhatsApp Image 2025-12-31 at 11.19.42 PM.jpeg'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export default function ImageCardSwiper({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, index: 0 })
  
  const cards = [
    { id: 1, image: image1, title: '' },
    { id: 2, image: image2, title: '' },
    { id: 3, image: image3, title: '' },
    { id: 4, image: image4, title: '' },
    { id: 5, image: image5, title: '' },
    { id: 6, image: image6, title: '' }
  ]

  const handlePointerDown = (e) => {
    setIsDragging(true)
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0
    dragStart.current = { x: clientX, y: clientY, index: currentIndex }
    e.preventDefault()
  }

  const handlePointerMove = (e) => {
    if (!isDragging) return
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0
    const deltaX = clientX - dragStart.current.x
    const deltaY = clientY - dragStart.current.y
    
    // Determine if horizontal or vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffset(deltaX)
    }
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    
    const threshold = 80
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      } else if (dragOffset < 0 && currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else if (dragOffset < 0 && currentIndex === cards.length - 1 && onComplete) {
        onComplete()
      }
    }
    
    setDragOffset(0)
    setIsDragging(false)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
      if (e.key === 'ArrowRight') {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else if (onComplete) {
          onComplete()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, cards.length, onComplete])

  return (
    <div className="imageSwiperWrap">
      <div 
        className="imageSwiperContainer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={(e) => {
          e.preventDefault()
          handlePointerDown(e)
        }}
        onTouchMove={(e) => {
          e.preventDefault()
          handlePointerMove(e)
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          handlePointerUp()
        }}
        style={{ touchAction: 'none' }}
      >
        {cards.map((card, idx) => {
          const offset = idx - currentIndex
          const isActive = idx === currentIndex
          const isNext = idx === currentIndex + 1
          const isPrev = idx === currentIndex - 1
          
          // Stacked card positioning
          let translateX = 0
          let translateY = 0
          let scale = 1
          let opacity = 1
          let zIndex = cards.length - Math.abs(offset)
          
          if (isActive) {
            translateX = dragOffset
            scale = 1
            opacity = 1
            zIndex = cards.length
          } else if (isNext) {
            translateX = 20
            translateY = 20
            scale = 0.92
            opacity = 0.7
            zIndex = cards.length - 1
          } else if (isPrev) {
            translateX = -20
            translateY = 20
            scale = 0.92
            opacity = 0.7
            zIndex = cards.length - 1
          } else if (offset > 1) {
            translateX = 30
            translateY = 30
            scale = 0.85
            opacity = 0.4
            zIndex = cards.length - Math.abs(offset)
          } else if (offset < -1) {
            translateX = -30
            translateY = 30
            scale = 0.85
            opacity = 0.4
            zIndex = cards.length - Math.abs(offset)
          }

          return (
            <div
              key={card.id}
              className={`imageCard ${isActive ? 'active' : ''}`}
              style={{
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                opacity,
                zIndex,
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease'
              }}
            >
              <div className="imageCardContent">
                {card.image ? (
                  <img src={card.image} alt={card.title || `Card ${idx + 1}`} />
                ) : (
                  <div className="imageCardPlaceholder">
                    <div className="placeholderIcon">📷</div>
                    <div className="placeholderText">Image {idx + 1}</div>
                  </div>
                )}
                {card.title && <div className="imageCardTitle">{card.title}</div>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="swiperIndicators">
        {cards.map((_, idx) => (
          <div
            key={idx}
            className={`swiperDot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>

      <div className="swiperHint">
        {currentIndex === cards.length - 1 
          ? 'Swipe to finish →' 
          : 'Swipe to see more →'}
      </div>
    </div>
  )
}

