import type { Metadata } from "next"
import { getSiteMetadata } from "@/components/layout/page-layout"
import { HomeView } from "@/views/home-view"

export const metadata: Metadata = getSiteMetadata("en")

export default function EnHomePage() {
  return <HomeView locale="en" />
}
