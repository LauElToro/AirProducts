"use client"

import { useState } from "react"
import type { EditRecord } from "@/lib/admin/types"

type EditHistoryPanelProps = {
  history: EditRecord[]
}

export const EditHistoryPanel = ({ history }: EditHistoryPanelProps) => {
  const [open, setOpen] = useState(false)

  if (history.length === 0) return null

  return (
    <div className="mt-8 border-t-2 border-slate-100 pt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xl font-bold text-slate-800"
      >
        Historial de cambios ({history.length})
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
          {[...history].reverse().map((record) => (
            <li
              key={record.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-base"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold capitalize text-[#0096D6]">{record.action}</span>
                <time className="text-sm text-slate-500">
                  {new Date(record.timestamp).toLocaleString("es-AR")}
                </time>
              </div>
              {record.note && <p className="mt-1 text-slate-700">{record.note}</p>}
              {Object.keys(record.changes).length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {Object.entries(record.changes).map(([key, change]) => (
                    <li key={key}>
                      <strong>{key}:</strong>{" "}
                      {change.from !== undefined && (
                        <span className="text-red-600">{JSON.stringify(change.from)} → </span>
                      )}
                      <span className="text-green-700">{JSON.stringify(change.to)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
