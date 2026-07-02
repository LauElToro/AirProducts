"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

type TimelineEntry = {
  year: string
  title: string
  description: string
}

type TimelineProps = {
  data: TimelineEntry[]
  className?: string
}

export const Timeline = ({ data, className }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 10%", "end 50%"],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div ref={ref} className={cn("w-full bg-white font-sans md:px-10", className)}>
      <div className="relative mx-auto max-w-7xl pb-20">
        <div
          className="absolute top-0 left-[1.15rem] h-full w-[2px] overflow-hidden md:left-8"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-slate-200" />
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-b from-[#0096D6] via-[#0096D6]/80 to-transparent"
          />
        </div>

        {data.map((item, index) => (
          <div
            key={`${item.year}-${index}`}
            className="relative flex gap-4 pt-10 md:gap-10 md:pt-16"
          >
            <div className="relative z-10 flex w-10 shrink-0 flex-col items-center md:w-16">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0096D6]">
                <div className="h-4 w-4 rounded-full border-2 border-white bg-[#0096D6]" />
              </div>
              <h3 className="mt-3 hidden text-center text-xl font-bold text-[#0096D6] md:block lg:text-2xl">
                {item.year}
              </h3>
            </div>

            <div className="min-w-0 flex-1 pb-2 pr-4 md:pb-4">
              <h3 className="mb-3 text-2xl font-bold text-[#0096D6] md:hidden">
                {item.year}
              </h3>
              <h4 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-600 md:text-base">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
