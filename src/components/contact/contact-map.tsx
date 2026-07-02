import { companyInfo } from "@/data/company"

type ContactMapProps = {
  openInMapsLabel: string
}

export const ContactMap = ({ openInMapsLabel }: ContactMapProps) => (
  <div className="mt-8">
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <iframe
        src={companyInfo.mapEmbedUrl}
        width="100%"
        height="300"
        className="block min-h-[260px] w-full sm:min-h-[300px]"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación Air Products SRL"
      />
    </div>
    <a
      href={companyInfo.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#0096D6] hover:underline"
      aria-label={openInMapsLabel}
    >
      {openInMapsLabel} →
    </a>
  </div>
)
