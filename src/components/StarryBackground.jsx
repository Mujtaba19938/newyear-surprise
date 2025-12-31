import React from 'react'

// Pure CSS background (no canvas) so it runs everywhere, including mobile.
export default function StarryBackground() {
  return (
    <div className="bg" aria-hidden>
      <div className="bgGlow" />
      <div className="bgStars" />
      <div className="bgStars bgStars2" />
      <div className="bgStars bgStars3" />
    </div>
  )
}
