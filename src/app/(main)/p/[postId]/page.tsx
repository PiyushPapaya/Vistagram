'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { POSTS, getUserById, relativeTime, formatCount, getCommentsByPost } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params)
  const router = useRouter()
  const post = POSTS.find(p => p.id === postId)

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-3">
        <p className="text-xl font-semibold">Post not found</p>
        <button onClick={() => router.back()} className="text-[#0095f6] text-sm">Go back</button>
      </div>
    )
  }

  return <PostDetail postId={postId} />
}

function PostDetail({ postId }: { postId: string }) {
  const post = POSTS.find(p => p.id === postId)!
  const author = getUserById(post.author_id)!
  const comments = getCommentsByPost(postId)
  const { likedPosts, savedPosts, toggleLike, toggleSave, currentUserId } = useStore()
  const isLiked = likedPosts.includes(post.id)
  const isSaved = savedPosts.includes(post.id)
  const [imgIdx, setImgIdx] = useState(0)
  const [comment, setComment] = useState('')

  return (
    <div className="max-w-[935px] mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row border border-border rounded-sm overflow-hidden bg-background">
        {/* Image */}
        <div className="relative md:w-[600px] bg-black flex items-center justify-center" style={{ aspectRatio: '1' }}>
          <img
            src={post.images[imgIdx]}
            alt=""
            className="h-full w-full object-contain"
          />
          {post.images.length > 1 && (
            <>
              {imgIdx > 0 && (
                <button
                  onClick={() => setImgIdx(i => i - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-black shadow"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              {imgIdx < post.images.length - 1 && (
                <button
                  onClick={() => setImgIdx(i => i + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-black shadow"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {post.images.map((_, i) => (
                  <div key={i} className={cn('h-1.5 w-1.5 rounded-full', i === imgIdx ? 'bg-white' : 'bg-white/50')} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Link href={`/${author.username}`}>
              <img src={author.avatar_url} alt={author.username} className="h-8 w-8 rounded-full object-cover" />
            </Link>
            <Link href={`/${author.username}`} className="font-semibold text-sm flex-1">{author.username}</Link>
            <button><MoreHorizontal className="h-5 w-5" /></button>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 max-h-[400px]">
            {/* Caption */}
            {post.caption && (
              <div className="flex gap-3">
                <Link href={`/${author.username}`} className="shrink-0">
                  <img src={author.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                </Link>
                <div className="text-sm">
                  <Link href={`/${author.username}`} className="font-semibold">{author.username}</Link>
                  {' '}{post.caption}
                  <p className="text-xs text-muted-foreground mt-1">{relativeTime(post.created_at)}</p>
                </div>
              </div>
            )}

            {/* Comments */}
            {comments.map(c => {
              const u = getUserById(c.author_id)
              if (!u) return null
              return (
                <div key={c.id} className="flex gap-3">
                  <Link href={`/${u.username}`} className="shrink-0">
                    <img src={u.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                  </Link>
                  <div className="text-sm">
                    <Link href={`/${u.username}`} className="font-semibold">{u.username}</Link>
                    {' '}{c.text}
                    <p className="text-xs text-muted-foreground mt-1">{relativeTime(c.created_at)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button onClick={() => toggleLike(post.id)}>
                  <Heart className={cn('h-6 w-6', isLiked && 'fill-[#ff3040] text-[#ff3040]')} strokeWidth={1.8} />
                </button>
                <button>
                  <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
                </button>
                <button>
                  <Send className="h-6 w-6" strokeWidth={1.8} />
                </button>
              </div>
              <button onClick={() => toggleSave(post.id)}>
                <Bookmark className={cn('h-6 w-6', isSaved && 'fill-foreground')} strokeWidth={1.8} />
              </button>
            </div>
            <p className="text-sm font-semibold">{formatCount(post.likes_count + (isLiked ? 1 : 0))} likes</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase">{relativeTime(post.created_at)}</p>
          </div>

          {/* Comment input */}
          <div className="border-t border-border flex items-center gap-3 px-4 py-2.5">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {comment && (
              <button
                onClick={() => setComment('')}
                className="text-[#0095f6] text-sm font-semibold"
              >
                Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
