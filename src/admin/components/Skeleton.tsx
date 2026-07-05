export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-xl bg-white/[0.04]"
        />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return <div className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
}
