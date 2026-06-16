'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { POSTS } from '@/lib/mock-data'
import { PostModal } from '@/components/shared/post-modal'
import { ArrowLeft } from 'lucide-react'

export default function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = use(params)
  const router = useRouter()
  const [activePostId, setActivePostId] = useState<string | null>(null)

  const tagged = POSTS.filter(p => p.caption?.toLowerCase().includes(`#${tag.toLowerCase()}`))
  const fallback = POSTS.slice(0, 9)
  const posts = tagged.length > 0 ? tagged : fallback

  return (
    <div className="max-w-[935px] mx-auto px-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <button onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">#{tag}</h1>
          <p className="text-xs text-muted-foreground">{posts.length * 1000 + 4200} posts</p>
        </div>
      </div>

      {/* Top post hero */}
      {posts[0] && (
        <div className="px-0 mb-1">
          <button
            className="relative w-full overflow-hidden bg-muted"
            style={{ aspectRatio: '1.2' }}
            onClick={() => setActivePostId(posts[0].id)}
          >
            <img src={posts[0].images[0]} alt="" className="h-full w-full object-cover hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <p className="text-white font-semibold text-sm">Top post</p>
            </div>
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-3 gap-[3px]">
        {posts.slice(1).map(post => (
          <button
            key={post.id}
            className="relative overflow-hidden bg-muted"
            style={{ aspectRatio: '1' }}
            onClick={() => setActivePostId(post.id)}
          >
            <img src={post.images[0]} alt="" className="h-full w-full object-cover hover:opacity-90 transition-opacity" />
          </button>
        ))}
      </div>

      {activePostId && <PostModal postId={activePostId} onClose={() => setActivePostId(null)} />}
    </div>
  )
}
