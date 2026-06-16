'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Grid3X3, Film, Tag, Bookmark, Pin, Heart } from 'lucide-react'
import { HighlightsRow } from '@/components/profile/highlights-row'

function IgReelsBadge() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="h-[18px] w-[18px] drop-shadow" aria-hidden>
      <path d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.908.908 0 0 1-.91 0Z"/>
      <path clipRule="evenodd" d="M2 3.872A1.872 1.872 0 0 1 3.872 2h16.256A1.872 1.872 0 0 1 22 3.872v16.256A1.872 1.872 0 0 1 20.128 22H3.872A1.872 1.872 0 0 1 2 20.128V3.872Z" fillRule="evenodd" opacity=".85"/>
    </svg>
  )
}
import { getPostsByUser, type User, type Post } from '@/lib/mock-data'
import { PostModal } from '@/components/shared/post-modal'
import { GridMedia } from '@/components/shared/grid-media'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'

type Tab = 'posts' | 'reels' | 'highlights' | 'tagged' | 'saved'

export function ProfileGrid({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>('posts')
  const [activePostId, setActivePostId] = useState<string | null>(null)
  const { currentUserId, savedPosts } = useStore()
  const isOwn = user.id === currentUserId

  const allPosts = getPostsByUser(user.id)
  const pinnedPosts = allPosts.filter(p => p.is_pinned)
  const regularPosts = allPosts.filter(p => !p.is_pinned)
  const reelPosts = allPosts.filter(p => p.type === 'reel')
  const savedPostsList = allPosts.filter(p => savedPosts.includes(p.id))

  const tabPosts: Post[] = tab === 'posts' ? [...pinnedPosts, ...regularPosts]
    : tab === 'reels' ? reelPosts
    : tab === 'saved' ? savedPostsList
    : [] // 'tagged' and 'highlights' have no post grid

  const tabs: { id: Tab; icon: React.ElementType; label: string; ownerOnly?: boolean }[] = [
    { id: 'posts', icon: Grid3X3, label: 'Posts' },
    { id: 'reels', icon: Film, label: 'Reels' },
    { id: 'highlights', icon: Heart, label: 'Highlights' },
    { id: 'tagged', icon: Tag, label: 'Tagged' },
    { id: 'saved', icon: Bookmark, label: 'Saved', ownerOnly: true },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-t border-border">
        {tabs.filter(t => !t.ownerOnly || isOwn).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 py-3 text-xs font-semibold tracking-widest uppercase transition-colors',
              tab === id
                ? 'border-t-2 border-foreground text-foreground -mt-px'
                : 'text-muted-foreground border-t-2 border-transparent'
            )}
          >
            <Icon className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Highlights — now their own dedicated tab (no longer circles above the grid) */}
      {tab === 'highlights' ? (
        <HighlightsRow user={user} />
      ) : tabPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          {tab === 'posts' ? (
            <>
              <div className="h-16 w-16 rounded-full border-2 border-foreground flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="h-7 w-7 fill-none stroke-foreground stroke-2">
                  <rect x="6" y="6" width="20" height="20" rx="3" />
                  <circle cx="16" cy="16" r="5" />
                  <circle cx="22" cy="10" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <p className="text-2xl font-bold">Share Photos</p>
              <p className="text-sm text-muted-foreground">When you share photos, they will appear on your profile.</p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold">No {tab}</p>
              <p className="text-sm text-muted-foreground">Nothing here yet.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[3px]">
          {tabPosts.map(post => (
            <button
              key={post.id}
              className="relative overflow-hidden bg-muted group"
              style={{ aspectRatio: '3/4' }}
              onClick={() => setActivePostId(post.id)}
            >
              <GridMedia
                post={post}
                className="h-full w-full object-cover transition-opacity duration-150 group-hover:brightness-75"
              />

              {/* Hover overlay — likes + comments */}
              <div className="absolute inset-0 flex items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-white drop-shadow" aria-hidden>
                    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938"/>
                  </svg>
                  <span className="text-white text-[14px] font-bold drop-shadow">{post.likes_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-white drop-shadow" aria-hidden>
                    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"/>
                  </svg>
                  <span className="text-white text-[14px] font-bold drop-shadow">{post.comments_count.toLocaleString()}</span>
                </div>
              </div>

              {/* Badges — top right */}
              {post.is_pinned && !post.images.length && (
                <span className="absolute top-1.5 right-1.5 z-10">
                  <Pin className="h-3.5 w-3.5 fill-white text-white drop-shadow" />
                </span>
              )}
              {post.images.length > 1 && (
                <span className="absolute top-1.5 right-1.5 z-10">
                  {/* Carousel stacked-pages icon (Instagram's actual carousel badge) */}
                  <svg viewBox="0 0 48 48" fill="white" className="h-[18px] w-[18px] drop-shadow" aria-hidden>
                    <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM41.1 15v25.6c0 1.4-1.1 2.5-2.5 2.5H13c-.6 0-1-.4-1-1s.4-1 1-1h25.6c.3 0 .5-.2.5-.5V15c0-.6.4-1 1-1s1 .4 1 1z"/>
                  </svg>
                </span>
              )}
              {post.type === 'reel' && (
                <span className="absolute top-1.5 right-1.5 z-10">
                  <IgReelsBadge />
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {activePostId && (
        <PostModal postId={activePostId} onClose={() => setActivePostId(null)} />
      )}
    </div>
  )
}
