export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-lg text-slate-900 antialiased">{children}</div>
  )
}

export const metadata = {
  title: "Panel Admin | Air Products",
  robots: { index: false, follow: false },
}
