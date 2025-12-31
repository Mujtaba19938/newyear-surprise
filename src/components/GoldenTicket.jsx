import React from 'react'
import ConfettiCanvas from './ConfettiCanvas.jsx'

export default function GoldenTicket({ onClaim }) {
  return (
    <div className="ticketWrap">
      <ConfettiCanvas />

      <div className="ticket">
        <div className="ticketTop">
          <div className="ticketBadge">⭐</div>
          <div className="ticketTitle">GOLDEN TICKET</div>
        </div>

        <div className="ticketSub">VALID FOR EVERY DAY AHEAD</div>

        <div className="ticketLine" />

        <div className="ticketMain">“Unlimited Love & Smiles”</div>
        <div className="ticketSmall">No expiration date</div>
      </div>

      <button className="claimBtn" onClick={onClaim}>
        CLAIM TICKET →
      </button>
    </div>
  )
}
