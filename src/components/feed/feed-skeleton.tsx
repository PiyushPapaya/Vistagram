export function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4 md:px-0 py-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="animate-pulse border border-border rounded-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-3">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="h-3 w-32 rounded bg-muted" />
          </div>
          {/* Image */}
          <div className="aspect-[4/5] bg-muted" />
          {/* Actions */}
          <div className="p-3 flex gap-4">
            <div className="h-6 w-6 rounded bg-muted" />
            <div className="h-6 w-6 rounded bg-muted" />
            <div className="h-6 w-6 rounded bg-muted" />
          </div>
          {/* Caption */}
          <div className="px-3 pb-3 flex flex-col gap-2">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-3 w-48 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
