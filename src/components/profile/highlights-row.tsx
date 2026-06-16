'use client'

import { Plus } from 'lucide-react'
import { type User } from '@/lib/mock-data'
import { MEDIA_IMAGES } from '@/lib/generated-media'
import { useStore } from '@/lib/store'

// Covers are pulled from the real generated media (videos_phots) — spread across
// the pool so each highlight shows a different local frame.
const HIGHLIGHT_TITLES = ['Travel', 'Food', 'Street', 'BTS']
const MOCK_HIGHLIGHTS = HIGHLIGHT_TITLES.map((title, i) => ({
  id: `h${i + 1}`,
  title,
  cover: MEDIA_IMAGES[(i * 7 + 2) % MEDIA_IMAGES.length] ?? '',
}))

export function HighlightsRow({ user }: { user: User }) {
  const { currentUserId } = useStore()
  const isOwn = user.id === currentUserId

  return (
    <div className="flex gap-4 overflow-x-auto px-4 md:px-0 py-4 border-b border-border" style={{ scrollbarWidth: 'none' }}>
      {isOwn && (
        <button className="flex flex-col items-center gap-1 shrink-0">
          <div className="h-[56px] w-[56px] rounded-full border-[1.5px] border-dashed border-muted-foreground flex items-center justify-center">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="text-[11px] text-foreground w-14 truncate text-center">New</span>
        </button>
      )}
      {MOCK_HIGHLIGHTS.map(h => (
        <button key={h.id} className="flex flex-col items-center gap-1 shrink-0">
          <div className="h-[56px] w-[56px] rounded-full overflow-hidden border-[1.5px] border-border">
            <img src={h.cover} alt={h.title} className="h-full w-full object-cover" />
          </div>
          <span className="text-[11px] text-foreground w-14 truncate text-center">{h.title}</span>
        </button>
      ))}
    </div>
  )
}
