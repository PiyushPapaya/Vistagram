'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { getUserById, POSTS, relativeTime, type Notification } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { IgHeart, IgVerified } from '@/components/shared/ig-icons'
import { MessageCircle, UserPlus, AtSign, Tag, SlidersHorizontal } from 'lucide-react'

type FilterTab = 'all' | 'follow' | 'comments' | 'follows'

function NotifIcon({ type }: { type: Notification['type'] }) {
  const base = "h-3 w-3"
  if (type === 'like') return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ed4956]">
      <IgHeart filled size={10} className="text-white" />
    </span>
  )
  if (type === 'follow' || type === 'follow_request') return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0095f6]">
      <UserPlus className={cn(base, 'text-white')} strokeWidth={2.5} />
    </span>
  )
  if (type === 'comment') return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1c1c1c] dark:bg-[#363636]">
      <MessageCircle className={cn(base, 'text-white fill-[#0095f6]')} />
    </span>
  )
  if (type === 'mention') return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0095f6]">
      <AtSign className={cn(base, 'text-white')} strokeWidth={2.5} />
    </span>
  )
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#a855f7]">
      <Tag className={cn(base, 'text-white')} strokeWidth={2.5} />
    </span>
  )
}

export default function NotificationsPage() {
  const { notifications, markAllNotificationsRead } = useStore()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(markAllNotificationsRead, 1500)
    return () => clearTimeout(t)
  }, [markAllNotificationsRead])

  const now = Date.now()

  const filterNotifs = (items: Notification[]) => {
    if (activeFilter === 'all') return items
    if (activeFilter === 'follow') return items.filter(n => n.type === 'follow' || n.type === 'follow_request')
    if (activeFilter === 'comments') return items.filter(n => n.type === 'comment' || n.type === 'mention')
    if (activeFilter === 'follows') return items.filter(n => n.type === 'follow')
    return items
  }

  const followRequests = notifications.filter(n => n.type === 'follow_request')
  const regularNotifs = notifications.filter(n => n.type !== 'follow_request')

  const newNotifs = filterNotifs(regularNotifs.filter(n => now - new Date(n.created_at).getTime() < 86400000))
  const thisWeek = filterNotifs(regularNotifs.filter(n => {
    const age = now - new Date(n.created_at).getTime()
    return age >= 86400000 && age < 7 * 86400000
  }))
  const thisMonth = filterNotifs(regularNotifs.filter(n => {
    const age = now - new Date(n.created_at).getTime()
    return age >= 7 * 86400000 && age < 30 * 86400000
  }))
  const earlier = filterNotifs(regularNotifs.filter(n => now - new Date(n.created_at).getTime() >= 30 * 86400000))

  const Section = ({ title, items }: { title: string; items: Notification[] }) => {
    if (items.length === 0) return null
    return (
      <div className="mb-4">
        <p className="px-4 py-2 text-[16px] font-semibold">{title}</p>
        {items.map(n => <NotifRow key={n.id} notif={n} />)}
      </div>
    )
  }

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'follow', label: 'People you follow' },
    { id: 'comments', label: 'Comments' },
    { id: 'follows', label: 'Follows' },
  ]

  return (
    <div className="max-w-[600px] mx-auto py-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-2 pb-3 border-b border-border md:border-0">
        <h1 className="text-[22px] font-semibold">Notifications</h1>
        <button
          onClick={() => setFilterOpen(o => !o)}
          className="flex items-center gap-1.5 text-[14px] font-semibold text-foreground hover:opacity-60 transition-opacity"
          aria-label="Filter"
        >
          <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Filter tabs (horizontal scroll) */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto border-b border-border/60" style={{ scrollbarWidth: 'none' }}>
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              'shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap',
              activeFilter === tab.id
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 px-4">
          <div className="h-16 w-16 rounded-full border-2 border-foreground flex items-center justify-center">
            <IgHeart size={28} />
          </div>
          <p className="text-[22px] font-semibold">Activity on your posts</p>
          <p className="text-[14px] text-muted-foreground text-center">
            When someone likes or comments on one of your posts, you'll see it here.
          </p>
        </div>
      ) : (
        <>
          {/* Follow requests at top */}
          {(activeFilter === 'all' || activeFilter === 'follow' || activeFilter === 'follows') && followRequests.length > 0 && (
            <div className="mb-1">
              <div className="flex items-center justify-between px-4 py-2">
                <p className="text-[16px] font-semibold">Follow requests</p>
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              {followRequests.slice(0, 1).map(n => <NotifRow key={n.id} notif={n} />)}
            </div>
          )}

          <Section title="New" items={newNotifs} />
          <Section title="This week" items={thisWeek} />
          <Section title="This month" items={thisMonth} />
          <Section title="Earlier" items={earlier} />
        </>
      )}
    </div>
  )
}

function NotifRow({ notif }: { notif: Notification }) {
  const actor = getUserById(notif.actor_id)
  const post = notif.post_id ? POSTS.find(p => p.id === notif.post_id) : null
  if (!actor) return null

  return (
    <div className={cn(
      'flex items-center gap-3 py-2 px-4',
      !notif.read && 'bg-blue-50/30 dark:bg-blue-950/10'
    )}>
      {/* Avatar + icon badge */}
      <div className="relative shrink-0">
        <Link href={`/${actor.username}`}>
          <img src={actor.avatar_url} alt={actor.username} className="h-11 w-11 rounded-full object-cover" />
        </Link>
        <span className="absolute -bottom-0.5 -right-0.5">
          <NotifIcon type={notif.type} />
        </span>
      </div>

      {/* Text */}
      <p className="flex-1 text-[14px] leading-[18px] min-w-0">
        <Link href={`/${actor.username}`} className="font-semibold">{actor.username}</Link>
        {actor.is_verified && <IgVerified size={11} />}
        {' '}{notif.text}
        {' '}<span className="text-muted-foreground font-normal">{relativeTime(notif.created_at)}</span>
      </p>

      {/* Right side: post thumb or follow/confirm+delete buttons */}
      {post ? (
        <Link href={`/p/${post.id}`} className="shrink-0">
          <div className="h-11 w-11 overflow-hidden rounded-sm">
            <img src={post.images[0]} alt="" className="h-full w-full object-cover" />
          </div>
        </Link>
      ) : notif.type === 'follow_request' ? (
        <div className="flex gap-2 shrink-0">
          <button className="rounded-lg bg-[#0095f6] text-white text-[13px] font-semibold px-4 py-[6px]">
            Confirm
          </button>
          <button className="rounded-lg bg-muted text-foreground text-[13px] font-semibold px-4 py-[6px]">
            Delete
          </button>
        </div>
      ) : notif.type === 'follow' ? (
        <button className="shrink-0 rounded-lg bg-muted text-foreground text-[13px] font-semibold px-4 py-[6px]">
          Follow Back
        </button>
      ) : null}
    </div>
  )
}
