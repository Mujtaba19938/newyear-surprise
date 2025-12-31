import React, { useState, useEffect } from 'react';

export default function FlipCardBook({ onDone }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasRead, setHasRead] = useState(false);

  useEffect(() => {
    if (isFlipped && !hasRead) {
      setHasRead(true);
      const timer = setTimeout(() => {
        if (onDone) onDone();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, hasRead, onDone]);

  return (
    <div className="bookWrap">
      <div 
        className="flipCardContainer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="flipCardInner"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front of card - Decorated side */}
          <div className="flipCardFront">
            <div className="cardBorder">
              <div className="cardFrontContent">
                {/* Bunting Flags */}
                <div className="buntingContainer">
                  <div className="buntingFlag" style={{background: '#ff6b35'}}></div>
                  <div className="buntingFlag" style={{background: '#4ecdc4'}}></div>
                  <div className="buntingFlag" style={{background: '#ff6b6b'}}></div>
                  <div className="buntingFlag" style={{background: '#95e1d3'}}></div>
                  <div className="buntingFlag" style={{background: '#ff6b35'}}></div>
                </div>

                {/* Main text */}
                <div className="cardTextContent">
                  <div className="textRow">
                    <span className="star">★</span>
                    <h2 className="mainText">HAPPY</h2>
                  </div>
                  <div className="textRow">
                    <span className="sprig">🌿</span>
                    <h2 className="mainText">NEW</h2>
                  </div>
                  <div className="textRow">
                    <h2 className="mainText">YEAR</h2>
                    <span className="star">★</span>
                  </div>
                  <div className="textRow">
                    <h2 className="yearText">2026</h2>
                    <span className="sprig">🌿</span>
                  </div>
                </div>

                {/* Characters */}
                <div className="snowman">⛄</div>
                <div className="bear">🧸</div>

                {/* Green Sprigs */}
                <div className="sprig1">🌿</div>
                <div className="sprig2">🌿</div>
              </div>
            </div>
          </div>

          {/* Back of card - Message side */}
          <div className="flipCardBack">
            <div className="cardBorder">
              <div className="cardBackContent">
                <div className="messageContainer">
                  <div className="messageText">
                    <p>
                      I hope this year brings<br />
                      you calm mornings,<br />
                      peaceful nights,<br />
                      and little moments that<br />
                      make you smile without<br />
                      any reason.
                    </p>
                    <p>
                      No matter what this year<br />
                      holds for you,<br />
                      I hope you always feel<br />
                      supported, valued, and<br />
                      understood.<br />
                      May every challenge turn<br />
                      into strength.
                    </p>
                  </div>
                  <div className="verticalAccent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isFlipped && <div className="bookHint">Click the card</div>}
    </div>
  );
}
