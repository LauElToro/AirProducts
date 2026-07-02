"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type InfiniteMovingCardsProps = {
  items: string[]
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) => {
  const [start, setStart] = useState(false)

  useEffect(() => {
    setStart(true)
  }, [])

  return (
    <div
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
          direction === "left" ? "[animation-direction:normal]" : "[animation-direction:reverse]",
          speed === "fast" && "[animation-duration:20s]",
          speed === "normal" && "[animation-duration:40s]",
          speed === "slow" && "[animation-duration:80s]"
        )}
        aria-label="Certificaciones y normas"
      >
        {[...items, ...items].map((item, idx) => (
          <li
            key={`${item}-${idx}`}
            className="relative w-[200px] max-w-full shrink-0 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm md:w-[220px]"
          >
            <span className="text-center text-sm font-semibold tracking-wide text-[#0096D6] uppercase">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
