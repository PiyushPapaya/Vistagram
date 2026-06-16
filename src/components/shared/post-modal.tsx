'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { POSTS, getUserById, getCommentsByPost, relativeTime, formatCount, getCurrentUser } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  IgHeart, IgComment, IgShare, IgBookmark, IgEmoji, IgEllipsis, IgVerified,
} from '@/components/shared/ig-icons'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function PostModal({ postId, onClose }: { postId: string; onClose: () => void }) {
  const post = POSTS.find(p => p.id === postId)
  const [imgIdx, setImgIdx] = useState(0)
  const [newComment, setNewComment] = useState('')
  const { isLiked, toggleLike, isSaved, toggleSave, following, follow } = useStore()

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!post) return null

  const author = getUserById(post.author_id)!
  const liked = isLiked(post.id)
  const saved = isSaved(post.id)
  const comments = getCommentsByPost(post.id)
  const me = getCurrentUser()
  const likeCount = post.likes_count + (liked ? 1 : 0)
  const isFollowing = following.includes(post.author_id)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[2px]"
      onClick={onClose}
    >
      {/* Close button (top right, outside modal) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <X className="h-7 w-7" strokeWidth={1.5} />
      </button>

      <div
        className="flex bg-background overflow-hidden shadow-2xl max-h-[90vh] w-full max-w-[1100px] mx-4"
        style={{ borderRadius: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {/* ─── Image pane ─── */}
        <div
          className="hidden md:flex relative bg-black items-center justify-center shrink-0"
          style={{ width: 'min(614px, 55vw)', aspectRatio: '1 / 1' }}
        >
          {post.type === 'reel' && post.video_url ? (
            <video
              src={post.video_url}
              poster={post.images[0] || undefined}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <img
              src={post.images[imgIdx]}
              alt=""
              className="max-h-full max-w-full object-contain select-none"
              draggable={false}
            />
          )}
          {post.type !== 'reel' && post.images.length > 1 && (
            <>
              {imgIdx > 0 && (
                <button
                  onClick={() => setImgIdx(i => i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 text-black shadow"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                </button>
              )}
              {imgIdx < post.images.length - 1 && (
                <button
                  onClick={() => setImgIdx(i => i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 text-black shadow"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[3px]">
                {post.images.map((_, i) => (
                  <span key={i} className={cn('h-[6px] w-[6px] rounded-full', i === imgIdx ? 'bg-[#0095f6]' : 'bg-white/50')} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ─── Right pane ─── */}
        <div className="flex flex-col flex-1 min-w-0 md:w-[340px] md:max-w-[340px] md:flex-none border-l border-border">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
            <Link href={`/${author.username}`} onClick={onClose}>
              <img src={author.avatar_url} alt={author.username} className="h-8 w-8 rounded-full object-cover" />
            </Link>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <Link href={`/${author.username}`} onClick={onClose} className="text-[14px] font-semibold hover:opacity-60">
                  {author.username}
                </Link>
                {author.is_verified && <IgVerified size={12} />}
              </div>
              {post.location && (
                <span className="text-[11px] text-foreground">{post.location}</span>
              )}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {!isFollowing && post.author_id !== me.id && (
                <>
                  <span className="text-muted-foreground text-[14px]">•</span>
                  <button
                    onClick={() => follow(post.author_id)}
                    className="text-[14px] font-semibold text-[#0095f6]"
                  >
                    Follow
                  </button>
                </>
              )}
              <button className="ml-1" aria-label="More">
                <IgEllipsis size={20} />
              </button>
            </div>
          </div>

          {/* Comments scroll */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Caption row */}
            {post.caption && (
              <div className="flex gap-3">
                <Link href={`/${author.username}`} onClick={onClose} className="shrink-0">
                  <img src={author.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover mt-0.5" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] leading-[18px]">
                    <Link href={`/${author.username}`} onClick={onClose} className="font-semibold mr-1.5">{author.username}</Link>
                    <CaptionText text={post.caption} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 uppercase">{relativeTime(post.created_at)}</p>
                </div>
              </div>
            )}

            {/* Comments */}
            {comments.map(c => {
              const cAuthor = getUserById(c.author_id)
              if (!cAuthor) return null
              return (
                <div key={c.id} className="flex gap-3">
                  <Link href={`/${cAuthor.username}`} onClick={onClose} className="shrink-0">
                    <img src={cAuthor.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover mt-0.5" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] leading-[18px]">
                      <Link href={`/${cAuthor.username}`} onClick={onClose} className="font-semibold mr-1.5">{cAuthor.username}</Link>
                      {c.text}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase">{relativeTime(c.created_at)}</span>
                      <button className="text-[12px] text-muted-foreground font-semibold">Reply</button>
                    </div>
                  </div>
                  <button className="shrink-0 self-start pt-1">
                    <IgHeart size={12} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="border-t border-border px-4 pt-3 pb-0 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button onClick={() => toggleLike(post.id)} aria-label={liked ? 'Unlike' : 'Like'}>
                  <IgHeart filled={liked} size={24} />
                </button>
                <button aria-label="Comment">
                  <IgComment size={24} />
                </button>
                <button aria-label="Share">
                  <IgShare size={24} />
                </button>
              </div>
              <button onClick={() => toggleSave(post.id)} aria-label={saved ? 'Unsave' : 'Save'}>
                <IgBookmark filled={saved} size={24} />
              </button>
            </div>

            {likeCount > 0 && (
              <p className="text-[14px] font-semibold leading-[18px] mb-1">
                {formatCount(likeCount)} {likeCount === 1 ? 'like' : 'likes'}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground uppercase mb-3 leading-[13px]">
              {relativeTime(post.created_at)}
            </p>
          </div>

          {/* Add comment */}
          <div className="border-t border-border flex items-center gap-3 px-4 py-3 shrink-0">
            <button aria-label="Emoji">
              <IgEmoji size={24} className="text-muted-foreground" />
            </button>
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 text-[14px] bg-transparent outline-none placeholder:text-muted-foreground"
              aria-label="Add a comment"
            />
            {newComment && (
              <button
                className="text-[14px] font-semibold text-[#0095f6]"
                onClick={() => setNewComment('')}
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

function CaptionText({ text }: { text: string }) {
  const parts = text.split(/(#\w+|@\w+)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('#') || part.startsWith('@')) {
          return <span key={i} className="ig-hashtag">{part}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}
