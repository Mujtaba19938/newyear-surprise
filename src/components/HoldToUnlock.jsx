import React, { useEffect, useMemo, useRef, useState } from 'react'

const HOLD_MS = 2000

export default function HoldToUnlock({ onUnlocked }) {
  const raf = useRef(null)
  const startedAt = useRef(0)
  const isHolding = useRef(false)
  const [progress, setProgress] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const timeoutRef = useRef(null)

  const strokeDasharray = useMemo(() => 2 * Math.PI * 46, [])
  const strokeDashoffset = useMemo(() => strokeDasharray * (1 - progress), [strokeDasharray, progress])

  const stop = () => {
    isHolding.current = false
    startedAt.current = 0
    setIsActive(false)
    if (raf.current) {
      cancelAnimationFrame(raf.current)
      raf.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setProgress(0)
  }

  const tick = () => {
    if (!isHolding.current || !startedAt.current) {
      raf.current = null
      return
    }
    
    const now = performance.now()
    const elapsed = now - startedAt.current
    const p = Math.min(1, elapsed / HOLD_MS)
    setProgress(p)
    
    if (p >= 1) {
      isHolding.current = false
      setProgress(1)
      raf.current = null
      onUnlocked?.()
      return
    }
    
    raf.current = requestAnimationFrame(tick)
  }

  const start = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (isHolding.current) return
    
    isHolding.current = true
    setIsActive(true)
    startedAt.current = performance.now()
    setProgress(0)
    
    // Start the animation loop
    if (!raf.current) {
      raf.current = requestAnimationFrame(tick)
    }
  }

  useEffect(() => {
    const onBlur = () => stop()
    const onVisibilityChange = () => {
      if (document.hidden) stop()
    }
    
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibilityChange)
    
    return () => {
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      stop()
    }
  }, [])

  return (
    <div className="unlockCard">
      <div className="unlockInner">
        <div 
          className={`unlockRing ${isActive ? 'active' : ''}`}
          role="button" 
          tabIndex={0}
          onPointerDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.currentTarget.setPointerCapture) {
              e.currentTarget.setPointerCapture(e.pointerId)
            }
            start(e)
          }}
          onPointerUp={(e) => {
            e.preventDefault()
            if (e.currentTarget.releasePointerCapture) {
              e.currentTarget.releasePointerCapture(e.pointerId)
            }
            stop()
          }}
          onPointerCancel={(e) => {
            e.preventDefault()
            if (e.currentTarget.releasePointerCapture) {
              e.currentTarget.releasePointerCapture(e.pointerId)
            }
            stop()
          }}
          onPointerMove={(e) => {
            if (isHolding.current) {
              e.preventDefault()
            }
          }}
          onTouchStart={(e) => {
            e.preventDefault()
            e.stopPropagation()
            start(e)
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            stop()
          }}
          onTouchCancel={(e) => {
            e.preventDefault()
            stop()
          }}
          onTouchMove={(e) => {
            if (isHolding.current) {
              e.preventDefault()
            }
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            start(e)
          }}
          onMouseUp={(e) => {
            e.preventDefault()
            stop()
          }}
          onMouseLeave={(e) => {
            if (isHolding.current) {
              e.preventDefault()
              stop()
            }
          }}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              start(e)
            }
          }}
          onKeyUp={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              stop()
            }
          }}
          style={{ userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none', WebkitTouchCallout: 'none' }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" className="ringSvg">
            <circle cx="60" cy="60" r="46" stroke="rgba(255,255,255,0.10)" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="46"
              stroke="rgba(255, 105, 180, 0.95)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dashoffset 30ms linear' }}
            />
          </svg>

          <div className="heart" aria-hidden>
            <span>❤</span>
          </div>
        </div>

        <div className="unlockHint">Tap and hold</div>
      </div>
    </div>
  )
}
