"use client"

import { useState } from "react"
import Link from "next/link"
import { oxProducts } from "@/data/products"
import { getProductPath } from "@/i18n/config"
import { useLocale } from "@/i18n/locale-context"
import { cn } from "@/lib/utils"

type SelectorMode = "flow" | "cylinders"

export const CompressorSelector = () => {
  const { locale, dict } = useLocale()
  const [mode, setMode] = useState<SelectorMode>("flow")
  const [flowValue, setFlowValue] = useState(5)
  const [cylinderValue, setCylinderValue] = useState(20)

  const matchedProducts = oxProducts.filter((product) => {
    if (mode === "flow") {
      return flowValue >= product.flowMin && flowValue <= product.flowMax
    }
    return cylinderValue >= product.cylindersMin && cylinderValue <= product.cylindersMax
  })

  const handleModeFlow = () => setMode("flow")
  const handleModeCylinders = () => setMode("cylinders")

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 sm:mb-8 sm:flex-row">
        <button
          type="button"
          onClick={handleModeFlow}
          className={cn(
            "flex-1 rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm",
            mode === "flow"
              ? "bg-white text-[#0096D6] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
          aria-pressed={mode === "flow"}
        >
          {dict.selector.byFlow}
        </button>
        <button
          type="button"
          onClick={handleModeCylinders}
          className={cn(
            "flex-1 rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm",
            mode === "cylinders"
              ? "bg-white text-[#0096D6] shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
          aria-pressed={mode === "cylinders"}
        >
          {dict.selector.byCylinders}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {mode === "flow" ? (
          <div>
            <label htmlFor="flow-slider" className="block text-sm font-medium text-slate-700">
              {dict.selector.flowLabel}:{" "}
              <span className="font-bold text-[#0096D6]">{flowValue} m³/h</span>
            </label>
            <p className="mt-1 text-xs text-slate-500">{dict.selector.flowNote}</p>
            <input
              id="flow-slider"
              type="range"
              min={0.5}
              max={44}
              step={0.5}
              value={flowValue}
              onChange={(e) => setFlowValue(Number(e.target.value))}
              className="mt-4 w-full accent-[#0096D6]"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="cylinder-slider" className="block text-sm font-medium text-slate-700">
              {dict.selector.cylinderLabel}:{" "}
              <span className="font-bold text-[#0096D6]">{cylinderValue}</span>
            </label>
            <p className="mt-1 text-xs text-slate-500">{dict.selector.cylinderNote}</p>
            <input
              id="cylinder-slider"
              type="range"
              min={1}
              max={140}
              step={1}
              value={cylinderValue}
              onChange={(e) => setCylinderValue(Number(e.target.value))}
              className="mt-4 w-full accent-[#0096D6]"
            />
          </div>
        )}
      </div>

      <div className="mt-6 sm:mt-8">
        <h3 className="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
          {matchedProducts.length > 0
            ? `${matchedProducts.length} ${dict.selector.matches}`
            : dict.selector.noMatch}
        </h3>

        <div className="space-y-3">
          {(matchedProducts.length > 0 ? matchedProducts : oxProducts.slice(0, 3)).map(
            (product) => (
              <Link
                key={product.slug}
                href={getProductPath(locale, product.slug)}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#0096D6] hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                tabIndex={0}
              >
                <div>
                  <p className="font-bold text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-600 sm:text-sm">
                    {product.flowMin}–{product.flowMax} m³/h · {product.cylindersMin}–
                    {product.cylindersMax} cil./día · {product.pressureBar} bar
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#0096D6]">{dict.selector.view}</span>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  )
}
