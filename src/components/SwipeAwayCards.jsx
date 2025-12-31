import React, { useMemo, useRef, useState } from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

const DEFAULT_CARDS = [
  { id: 'work', title: 'Work', emoji: '🧳', color: '#f2b28f' },
  { id: 'stress', title: 'Stress', emoji: '🧠', color: '#f7d067' },
  { id: 'distance', title: 'Distance', emoji: '🛰️', color: '#9bc6ff' },
  { id: 'bad', title: 'Bad Days', emoji: '🌧️', color: '#f4a6c8' }
]

export default function SwipeAwayCards({ onAllCleared }) {
  const [cards, setCards] = useState(DEFAULT_CARDS)
  const [activeId, setActiveId] = useState(DEFAULT_CARDS[0].id)
  const drag = useRef({ id: null, startX: 0, startY: 0, dx: 0, dy: 0 })
  const [offsets, setOffsets] = useState({})
  const [showGift, setShowGift] = useState(false)

  const remaining = cards.length

  const topCard = useMemo(() => cards[0], [cards])

  const onPointerDown = (e, id) => {
    if (id !== topCard?.id) return
    e.preventDefault()
    e.stopPropagation()
    drag.current = { id, startX: e.clientX, startY: e.clientY, dx: 0, dy: 0 }
    setActiveId(id)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!drag.current.id) return
    e.preventDefault()
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    drag.current.dx = dx
    drag.current.dy = dy
    setOffsets((o) => ({ ...o, [drag.current.id]: { x: dx, y: dy } }))
  }

  const removeTop = () => {
    setOffsets((o) => {
      const copy = { ...o }
      delete copy[topCard.id]
      return copy
    })
    setCards((c) => c.slice(1))
    if (cards.length <= 1) {
      setTimeout(() => {
        setShowGift(true)
      }, 400)
    }
  }

  const handleGiftClick = () => {
    setShowGift(false)
    setTimeout(() => {
      onAllCleared?.()
    }, 300)
  }

  const onPointerUp = () => {
    const id = drag.current.id
    if (!id) return
    const { dx, dy } = drag.current
    const dist = Math.hypot(dx, dy)
    const throwIt = dist > 110

    if (throwIt) {
      // animate off-screen
      setOffsets((o) => ({
        ...o,
        [id]: { x: dx * 6, y: dy * 6, thrown: true }
      }))
      setTimeout(removeTop, 220)
    } else {
      // snap back
      setOffsets((o) => ({ ...o, [id]: { x: 0, y: 0 } }))
    }

    drag.current = { id: null, startX: 0, startY: 0, dx: 0, dy: 0 }
  }

  return (
    <div className="swipeWrap">
      <div className="stack">
        {cards.map((card, idx) => {
          const isTop = idx === 0
          const off = offsets[card.id] || { x: 0, y: 0 }
          const rot = clamp(off.x / 18, -12, 12)
          // Base offset for stacking effect - subtle offset to show cards are stacked
          const stackOffsetX = idx * 6
          const stackOffsetY = idx * 4
          const stackRot = idx * 1.5
          const scale = 1 - idx * 0.04
          
          // Calculate total transform: center first, then apply offsets and rotation
          const totalX = off.x + stackOffsetX
          const totalY = off.y + stackOffsetY
          const totalRot = rot + stackRot
          
          return (
            <div
              key={card.id}
              className={`floatCard ${isTop ? 'top' : ''}`}
              style={{
                background: card.color,
                transform: `translate(-50%, -50%) translate(${totalX}px, ${totalY}px) rotate(${totalRot}deg) scale(${scale})`,
                zIndex: 50 - idx,
                opacity: 1 - idx * 0.1,
                transition: isTop ? (off.thrown ? 'transform 220ms ease-out' : 'transform 180ms ease') : 'transform 240ms ease',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none',
                cursor: isTop ? 'grab' : 'default'
              }}
              onPointerDown={(e) => onPointerDown(e, card.id)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onTouchStart={(e) => {
                if (card.id === topCard?.id) {
                  e.preventDefault()
                  const touch = e.touches[0]
                  onPointerDown({ 
                    clientX: touch.clientX, 
                    clientY: touch.clientY, 
                    currentTarget: e.currentTarget, 
                    preventDefault: () => {}, 
                    stopPropagation: () => {},
                    setPointerCapture: () => {}
                  }, card.id)
                }
              }}
              onTouchMove={(e) => {
                if (drag.current.id === card.id) {
                  e.preventDefault()
                  const touch = e.touches[0]
                  onPointerMove({ 
                    clientX: touch.clientX, 
                    clientY: touch.clientY, 
                    preventDefault: () => {} 
                  })
                }
              }}
              onTouchEnd={(e) => {
                if (drag.current.id === card.id) {
                  e.preventDefault()
                  onPointerUp()
                }
              }}
            >
              <div className="fcEmoji" aria-hidden>{card.emoji}</div>
              <div className="fcTitle">{card.title}</div>
              {isTop ? <div className="fcHint">drag away</div> : null}
            </div>
          )
        })}

        {remaining === 0 ? null : (
          <div className="stackHint">Swipe/drag the cards away</div>
        )}

        {showGift && (
          <div className="giftButtonContainer">
            <button 
              className="giftButton"
              onClick={handleGiftClick}
              onTouchStart={(e) => e.preventDefault()}
            >
              <div className="giftIcon">🎁</div>
              <div className="giftGlow" />
            </button>
            <div className="giftHint">Click me</div>
          </div>
        )}
      </div>
    </div>
  )
}
