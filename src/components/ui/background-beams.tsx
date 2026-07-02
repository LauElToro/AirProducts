"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type BackgroundBeamsProps = {
  className?: string
}

export const BackgroundBeams = ({ className }: BackgroundBeamsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.005

      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(0, 150, 214, ${0.08 + i * 0.02})`
        ctx.lineWidth = 1

        for (let x = 0; x <= canvas.width; x += 4) {
          const y =
            canvas.height / 2 +
            Math.sin(x * 0.008 + time + i * 1.2) * (40 + i * 15) +
            Math.cos(x * 0.004 + time * 0.7) * 20

          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.stroke()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    />
  )
}
