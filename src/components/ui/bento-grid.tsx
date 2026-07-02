import { cn } from "@/lib/utils"

type BentoGridProps = {
  className?: string
  children: React.ReactNode
}

export const BentoGrid = ({ className, children }: BentoGridProps) => (
  <div
    className={cn(
      "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-6",
      className
    )}
  >
    {children}
  </div>
)

type BentoGridItemProps = {
  className?: string
  title: string
  description: string
  header?: React.ReactNode
  icon?: React.ReactNode
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: BentoGridItemProps) => (
  <div
    className={cn(
      "group/bento relative row-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-lg md:p-6",
      className
    )}
  >
    {header}
    <div className="transition duration-200 group-hover/bento:translate-x-1">
      {icon}
      <div className="mt-2 mb-2 font-sans font-bold text-slate-900">{title}</div>
      <div className="font-sans text-sm font-normal text-slate-600">{description}</div>
    </div>
  </div>
)
