import React, { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function ChatReveal({ qrValue, onNext }) {
  const now = useMemo(() => {
    const d = new Date()
    return d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' })
  }, [])

  return (
    <div className="chatWrapper">
      <div className="chatHeader">
        <span className="chatTime">Today {now}</span>
      </div>

      <div className="bubbleRow">
        <div className="bubble bubbleLeft">
          It&apos;s New Year... where&apos;s my gift?? 👀
        </div>
      </div>

      <div className="bubbleRow right">
        <div className="bubble bubbleRight">
          I have a little surprise for you ✨
        </div>
      </div>

      <div className="qrCard" onClick={onNext} role="button" tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onNext?.()
        }}
      >
        <div className="qrBox">
          <QRCodeSVG 
            value={qrValue} 
            size={200} 
            bgColor="#ffffff" 
            fgColor="#2b1b3a" 
            includeMargin={false}
            level="M"
          />
        </div>
        <div className="scanRibbon">Scan Me</div>
        <div className="tiny">Tap the QR to continue</div>
      </div>

    </div>
  )
}
