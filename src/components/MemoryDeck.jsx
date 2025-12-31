import React, { useMemo, useState } from 'react'

function PhotoPlaceholder({ label }) {
  return (
    <div className="photoPh">
      <div className="phSky" />
      <div className="phHills" />
      <div className="phChars" aria-hidden>
        <div className="phGirl" />
        <div className="phBoy" />
      </div>
      <div className="phLabel">{label}</div>
    </div>
  )
}

export default function MemoryDeck() {
  const items = useMemo(() => [
    { id: 1, label: 'A calm day' },
    { id: 2, label: 'Little laughs' },
    { id: 3, label: 'New beginnings' }
  ], [])

  const [i, setI] = useState(0)

  const next = () => {
    setI((p) => (p + 1) % items.length)
  }

  const current = items[i]

  return (
    <div className="memWrap">
      <div className="polaroidStack" onClick={next} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') next() }}
      >
        <div className="polaroid back" />
        <div className="polaroid mid" />
        <div className="polaroid front">
          <PhotoPlaceholder label={current.label} />
        </div>
      </div>

      <div className="memHint">Tap the photo</div>
    </div>
  )
}
