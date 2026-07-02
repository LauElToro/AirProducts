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
        {data.map((item, index) => (
          <div key={`${item.year}-${index}`} className="flex justify-start pt-10 md:gap-10 md:pt-20">
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0096D6] md:left-3">
                <div className="h-4 w-4 rounded-full border border-white bg-[#0096D6]" />
              </div>
              <h3 className="hidden text-xl font-bold text-[#0096D6] md:block md:pl-20 md:text-4xl">
                {item.year}
              </h3>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="mb-4 block text-left text-2xl font-bold text-[#0096D6] md:hidden">
                {item.year}
              </h3>
              <h4 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-600 md:text-base">{item.description}</p>
            </div>
          </div>
        ))}

        <div
          style={{ height: `${data.length * 120}px` }}
          className="absolute top-0 left-8 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-slate-200 via-10% to-transparent to-100% md:left-8"
          aria-hidden="true"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[#0096D6] via-[#0096D6]/80 to-transparent"
          />
        </div>
      </div>
    </div>
  )
}
