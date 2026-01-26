import * as React from "react"
import { cn } from "@/lib/utils"

export interface AffiliationCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  actionLabel?: string
  onActionClick?: () => void
  className?: string
}

export function AffiliationCard({
  icon,
  title,
  subtitle,
  actionLabel = "변경",
  onActionClick,
  className,
}: AffiliationCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-4 shadow-sm",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center text-3xl">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500 truncate">{subtitle}</p>
      </div>

      {onActionClick && (
        <button
          onClick={onActionClick}
          className="flex items-center gap-1 text-sm text-primary font-medium shrink-0"
        >
          {actionLabel}
          <span>{">"}</span>
        </button>
      )}
    </div>
  )
}
