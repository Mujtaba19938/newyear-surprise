import React, { useMemo, useState } from 'react'
import StarryBackground from './components/StarryBackground.jsx'
import StepShell from './components/StepShell.jsx'
import HoldToUnlock from './components/HoldToUnlock.jsx'
import ChatReveal from './components/ChatReveal.jsx'
import SwipeAwayCards from './components/SwipeAwayCards.jsx'
import GoldenTicket from './components/GoldenTicket.jsx'
import ImageCardSwiper from './components/ImageCardSwiper.jsx'
import FlipCardBook from './components/FlipCardBook.jsx'
import MemoryDeck from './components/MemoryDeck.jsx'

const STEPS = {
  HOLD: 0,
  CHAT: 1,
  SWIPE: 2,
  TICKET: 3,
  IMAGE_SWIPER: 4,
  BOOK: 5,
  MEMORIES: 6
}

export default function App() {
  const [step, setStep] = useState(STEPS.HOLD)
  const [confettiKey, setConfettiKey] = useState(0)

  const onAdvance = () => {
    setStep((s) => Math.min(s + 1, STEPS.MEMORIES))
  }

  const stepTitle = useMemo(() => {
    switch (step) {
      case STEPS.HOLD:
        return { h1: 'A little surprise for you', h2: 'Before this year begins' }
      case STEPS.CHAT:
        return { h1: 'A little surprise for you ✨', h2: '' }
      case STEPS.SWIPE:
        return { h1: 'Something is waiting for you', h2: 'Move the little distractions aside' }
      case STEPS.TICKET:
        return { h1: 'Something is waiting for you', h2: '' }
      case STEPS.IMAGE_SWIPER:
        return { h1: 'Some moments from this year', h2: 'Swipe to see more' }
      case STEPS.BOOK:
        return { h1: 'For my mahnoor  :) ♥️' }
      case STEPS.MEMORIES:
        return { h1: 'Some moments from this year', h2: 'Tap the photo to continue' }
      default:
        return { h1: '', h2: '' }
    }
  }, [step])

  return (
    <div className="app">
      <StarryBackground />
      <StepShell title={stepTitle.h1} subtitle={stepTitle.h2}>
        {step === STEPS.HOLD && (
          <HoldToUnlock
            onUnlocked={() => {
              onAdvance()
            }}
          />
        )}

        {step === STEPS.CHAT && (
          <ChatReveal
            qrValue="https://example.com/surprise"
            onNext={onAdvance}
          />
        )}

        {step === STEPS.SWIPE && (
          <SwipeAwayCards
            onAllCleared={() => {
              setConfettiKey((k) => k + 1)
              setStep(STEPS.TICKET)
            }}
          />
        )}

        {step === STEPS.TICKET && (
          <GoldenTicket key={confettiKey} onClaim={onAdvance} />
        )}

        {step === STEPS.IMAGE_SWIPER && (
          <ImageCardSwiper onComplete={onAdvance} />
        )}

        {step === STEPS.BOOK && (
          <FlipCardBook onDone={onAdvance} />
        )}

        {step === STEPS.MEMORIES && (
          <MemoryDeck />
        )}
      </StepShell>

    </div>
  )
}
