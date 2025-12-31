# New Year Surprise (React)

This is a **ready-to-run** React (Vite) project that recreates the interactive "New Year surprise" flow you showed:

1. Hold-to-unlock heart
2. Chat screen with a QR
3. Swipe cards away (Work/Stress/Distance/Bad Days)
4. Confetti + Golden Ticket
5. Tap-to-open card book
6. Polaroid-style memory deck

## Run locally

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Customize

- Change texts / steps: `src/App.jsx`
- QR link: `src/components/ChatReveal.jsx` (`qrValue`)
- Card labels: `src/components/SwipeAwayCards.jsx`
- Greeting pages: `src/components/FlipCardBook.jsx`
- Memories: `src/components/MemoryDeck.jsx`

## Notes

- No backend needed.
- Mobile friendly.
- Animations are pure CSS + a tiny canvas confetti.
