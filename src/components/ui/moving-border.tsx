"use client"

import { cn } from "@/lib/utils"
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { useRef } from "react"

type MovingBorderProps = {
  children: React.ReactNode
  duration?: number
  className?: string
  containerClassName?: string
  borderRadius?: string
  as?: React.ElementType
  href?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  ariaLabel?: string
}

export const MovingBorder = ({
  children,
  duration = 3000,
  className,
  containerClassName,
  borderRadius = "1rem",
  as: Component = "button",
  href,
  onClick,
  type = "button",
  ariaLabel,
}: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement>(null)
  const progress = useMotionValue<number>(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength()
    if (!length) return
    const pxPerMs = length / duration
    progress.set((time * pxPerMs) % length)
  })

  const x = useTransform(progress, (val) => {
    const point = pathRef.current?.getPointAtLength(val)
    return point?.x ?? 0
  })

  const y = useTransform(progress, (val) => {
    const point = pathRef.current?.getPointAtLength(val)
    return point?.y ?? 0
  })

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  const sharedProps = {
    className: cn(
      "relative inline-flex overflow-hidden bg-transparent p-[1px] text-sm",
      containerClassName
    ),
    style: { borderRadius },
    onClick,
    "aria-label": ariaLabel,
  }

  const inner = (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={borderRadius}
          ry={borderRadius}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{ position: "absolute", top: 0, left: 0, display: "inline-block", transform }}
      >
        <div
          className="h-20 w-20 bg-[radial-gradient(#0096D6_40%,transparent_60%)] opacity-80"
          aria-hidden="true"
        />
      </motion.div>
      <div
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center border border-slate-200 bg-white text-sm font-semibold text-slate-900 antialiased backdrop-blur-xl",
          className
        )}
        style={{ borderRadius }}
      >
        {children}
      </div>
    </>
  )

  if (Component === "a" && href) {
    return (
      <a href={href} {...sharedProps} tabIndex={0}>
        {inner}
      </a>
    )
  }

  return (
    <Component {...sharedProps} type={type}>
      {inner}
    </Component>
  )
}
