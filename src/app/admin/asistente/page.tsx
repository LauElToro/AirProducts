"use client"

import { useEffect, useRef, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/lib/admin/types"

export default function AdminAsistentePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("xlarge")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/admin/chat")
      .then((r) => r.json())
      .then((data: { messages?: ChatMessage[] }) => {
        if (data.messages) setMessages(data.messages)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput("")
    setLoading(true)

    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      },
    ])

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, section: "Asistente" }),
      })
      const data = (await res.json()) as { session?: { messages: ChatMessage[] }; error?: string }
      if (data.session?.messages) {
        setMessages(data.session.messages)
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: `Error: ${data.error}`,
            timestamp: new Date().toISOString(),
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "No pude conectar con el asistente. Intente de nuevo.",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    if (!confirm("¿Borrar todo el historial del chat?")) return
    await fetch("/api/admin/chat", { method: "DELETE" })
    setMessages([])
  }

  const fontClass =
    fontSize === "xlarge" ? "text-xl" : fontSize === "large" ? "text-lg" : "text-base"

  return (
    <AdminShell
      title="Asistente"
      subtitle="Consulte cómo usar el panel. Puede elegir el tamaño de letra que le resulte más cómodo."
    >
      <div className="mx-auto flex max-w-4xl flex-col rounded-2xl border-2 border-[#0096D6] bg-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl bg-[#0096D6] px-6 py-4 text-white">
          <div>
            <p className="text-xl font-bold">Asistente del Panel</p>
            <p className="text-base opacity-90">
              Pregunte sobre contactos, emails, métricas o cualquier sección
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-base">
              Tamaño:
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as typeof fontSize)}
                className="rounded-lg bg-white px-3 py-2 text-base text-slate-900"
              >
                <option value="normal">Normal</option>
                <option value="large">Grande</option>
                <option value="xlarge">Muy grande</option>
              </select>
            </label>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg bg-white/20 px-4 py-2 text-base font-semibold hover:bg-white/30"
            >
              Limpiar chat
            </button>
          </div>
        </div>

        <div className={cn("min-h-[480px] flex-1 overflow-y-auto px-6 py-6", fontClass)}>
          {messages.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-6 text-slate-700">
              <p className="text-xl font-bold">¡Hola! Soy su asistente.</p>
              <p className="mt-3">
                Puede preguntarme, por ejemplo: &quot;¿Cómo agrego un contacto?&quot;,
                &quot;¿Cómo envío un email?&quot; o &quot;¿Qué significan las métricas?&quot;
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "mb-4 max-w-[85%] rounded-2xl px-5 py-4",
                msg.role === "user"
                  ? "ml-auto bg-[#0096D6] text-white"
                  : "mr-auto bg-slate-100 text-slate-800"
              )}
            >
              {msg.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escriba su consulta aquí..."
              className={cn(
                "flex-1 rounded-xl border-2 border-slate-300 px-5 py-4 focus:border-[#0096D6] focus:outline-none",
                fontClass
              )}
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-xl bg-[#0096D6] px-8 py-4 text-xl font-bold text-white hover:bg-[#007bb5] disabled:opacity-50"
            >
              {loading ? "..." : "Enviar"}
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
