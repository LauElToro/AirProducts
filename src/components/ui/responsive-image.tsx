import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

type ResponsiveImageProps = Omit<ImageProps, "fill"> & {
  aspectRatio?: "square" | "video" | "portrait" | "wide" | "auto"
  fit?: "contain" | "cover"
  containerClassName?: string
  priority?: boolean
}

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/10]",
  auto: "min-h-[240px] sm:min-h-[320px] md:min-h-[420px]",
}

export const ResponsiveImage = ({
  aspectRatio = "wide",
  fit = "contain",
  containerClassName,
  className,
  alt,
  src,
  sizes,
  priority,
}: ResponsiveImageProps) => (
  <div
    className={cn(
      "relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50",
      aspectRatio !== "auto" && aspectClasses[aspectRatio],
      aspectRatio === "auto" && aspectClasses.auto,
      containerClassName
    )}
  >
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      className={cn(
        fit === "contain" ? "object-contain p-2 sm:p-3 md:p-4" : "object-cover",
        className
      )}
    />
  </div>
)
