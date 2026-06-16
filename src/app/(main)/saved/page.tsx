'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { POSTS } from '@/lib/mock-data'
import { PostModal } from '@/components/shared/post-modal'

export default function SavedPage() {
  const { savedPosts } = useStore()
  const [activePostId, setActivePostId] = useState<string | null>(null)

  const saved = POSTS.filter(p => savedPosts.includes(p.id))

  return (
    <div className="max-w-[935px] mx-auto px-4">
      <div className="flex items-center justify-between py-6">
        <h1 className="text-xl font-semibold">Saved</h1>
        <button className="text-[#0095f6] text-sm font-semibold">+ New collection</button>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="h-16 w-16 rounded-full border-2 border-foreground flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-foreground" strokeWidth="1.8">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p className="text-2xl font-bold">Save</p>
          <p className="text-sm text-muted-foreground text-center max-w-xs">Save photos and videos that you want to see again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[3px]">
          {saved.map(post => (
            <button
              key={post.id}
              className="relative overflow-hidden bg-muted"
              style={{ aspectRatio: '3/4' }}
              onClick={() => setActivePostId(post.id)}
            >
              <img src={post.images[0]} alt="" className="h-full w-full object-cover hover:opacity-90 transition-opacity" />
            </button>
          ))}
        </div>
      )}

      {activePostId && <PostModal postId={activePostId} onClose={() => setActivePostId(null)} />}
    </div>
  )
}
