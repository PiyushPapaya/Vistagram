'use client'

import { Plus } from 'lucide-react'
import { type User } from '@/lib/mock-data'
import { useStore } from '@/lib/store'

const MOCK_HIGHLIGHTS = [
  { id: 'h1', title: 'Travel', cover: 'https://picsum.photos/seed/hl1/150/150' },
  { id: 'h2', title: 'Food', cover: 'https://picsum.photos/seed/hl2/150/150' },
  { id: 'h3', title: 'Street', cover: 'https://picsum.photos/seed/hl3/150/150' },
  { id: 'h4', title: 'BTS', cover: 'https://picsum.photos/seed/hl4/150/150' },
]

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
