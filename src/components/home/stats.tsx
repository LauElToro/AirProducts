"use client"

import { useLocale } from "@/i18n/locale-context"

export const Stats = () => {
  const { dict } = useLocale()

  const stats = [
    { value: "30+", label: dict.stats.experience },
    { value: "2200 m²", label: dict.stats.facility },
    { value: "11", label: dict.stats.models },
    { value: "CE/PED", label: dict.stats.certification },
  ]

  return (
    <section className="border-y border-slate-200 bg-white py-10 sm:py-12" aria-label="Stats">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:gap-8 md:grid-cols-4 md:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-[#0096D6] sm:text-3xl md:text-4xl">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
