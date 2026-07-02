import Image from "next/image"
import { cn } from "@/lib/utils"

type EngineeringCardImageProps = {
  src: string
  alt: string
  featured?: boolean
  className?: string
}

export const EngineeringCardImage = ({
  src,
  alt,
  featured = false,
  className,
}: EngineeringCardImageProps) => (
  <div
    className={cn(
      "relative mb-4 w-full overflow-hidden rounded-lg bg-slate-50",
      featured ? "aspect-[3/2] sm:aspect-[16/9]" : "aspect-[4/3]",
      className
    )}
  >
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain p-3 sm:p-4"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  </div>
)
