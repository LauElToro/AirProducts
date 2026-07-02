import type { Metadata } from "next"
import { getSiteMetadata } from "@/components/layout/page-layout"

export const metadata: Metadata = getSiteMetadata("en")

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <div lang="en">{children}</div>
}
