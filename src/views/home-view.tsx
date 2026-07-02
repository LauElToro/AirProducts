import { PageLayout } from "@/components/layout/page-layout"
import { Hero } from "@/components/home/hero"
import { Stats } from "@/components/home/stats"
import { ProductsPreview } from "@/components/home/products-preview"
import { EngineeringPreview } from "@/components/home/engineering-preview"
import { CertificationsPreview } from "@/components/home/certifications-preview"
import { CtaSection } from "@/components/home/cta-section"
import type { Locale } from "@/i18n/config"

export const HomeView = ({ locale }: { locale: Locale }) => (
  <PageLayout locale={locale}>
    <Hero />
    <Stats />
    <ProductsPreview />
    <EngineeringPreview />
    <CertificationsPreview />
    <CtaSection />
  </PageLayout>
)
