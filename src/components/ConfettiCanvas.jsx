import React, { useEffect, useRef } from 'react'

export default function ConfettiCanvas({ burst = true }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')

    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['#ff69b4', '#b36bff', '#ffd166', '#06d6a0', '#4cc9f0']
    const W = () => canvas.getBoundingClientRect().width
    const H = () => canvas.getBoundingClientRect().height

    const particles = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * W(),
      y: -20 - Math.random() * H(),
      vx: (Math.random() - 0.5) * 2.2,
      vy: 1.5 + Math.random() * 2.4,
      r: 2 + Math.random() * 3,
      a: Math.random() * Math.PI,
      va: (Math.random() - 0.5) * 0.25,
      c: colors[Math.floor(Math.random() * colors.length)]
    }))

    let alive = true
    let last = 0
    const loop = (t) => {
      if (!alive) return
      const dt = Math.min(33, t - last || 16)
      last = t

      ctx.clearRect(0, 0, W(), H())
      particles.forEach((p) => {
        p.x += p.vx * (dt / 16)
        p.y += p.vy * (dt / 16)
        p.a += p.va * (dt / 16)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.a)
        ctx.fillStyle = p.c
        ctx.fillRect(-p.r, -p.r * 0.6, p.r * 2, p.r * 1.2)
        ctx.restore()

        if (p.y > H() + 40) {
          p.y = -20 - Math.random() * 120
          p.x = Math.random() * W()
        }
      })

      requestAnimationFrame(loop)
    }

    const id = requestAnimationFrame(loop)
    return () => {
      alive = false
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
    }
  }, [burst])

  return <canvas ref={ref} className="confetti" aria-hidden />
}
