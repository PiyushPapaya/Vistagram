'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Volume2, VolumeX, MoreHorizontal, Music2, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { REELS, getUserById, formatCount, type Reel } from '@/lib/mock-data'
import { MEDIA_IMAGES } from '@/lib/generated-media'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { MEDIA } from '@/lib/media-config'
import { IgHeart, IgComment, IgShare, IgBookmark, IgVerified, IgMessages } from '@/components/shared/ig-icons'
import type { ReelRow } from '@/types/database'

const AUTOSCROLL_KEY = 'vistagram_reels_autoscroll'

// Convert a Supabase ReelRow into the mock Reel shape so ReelItem is data-agnostic
function rowToReel(row: ReelRow, fallbackAuthorId = 'u1'): Reel {
  return {
    id: row.id,
    author_id: row.author_id || fallbackAuthorId,
    video_url: row.video_url,
    poster_url: row.poster_url ?? '',
    caption: row.caption ?? '',
    audio: row.audio_label ?? 'Original audio',
    likes_count: row.likes_count,
    comments_count: row.comments_count,
    plays_count: row.plays_count,
    created_at: row.created_at,
  }
}

async function fetchReelsFromSupabase(): Promise<Reel[]> {
  // Guard: if env vars aren't set, skip silently and fall back to mock data
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  try {
    const { createClient } = await import('@/lib/supabase/client')
    const sb = createClient()
    const { data, error } = await sb
      .from('reels')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error || !data || data.length === 0) return []
    return (data as ReelRow[]).map(r => rowToReel(r))
  } catch {
    return []
  }
}

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>(REELS)
  const [activeIdx, setActiveIdx] = useState(0)
  const [muted, setMuted] = useState(true)
  const [reelsTab, setReelsTab] = useState<'for-you' | 'following'>('for-you')
  const [autoAdvance, setAutoAdvance] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const wheelLock = useRef(false)

  // REELS already leads with the real generated reels (from videos_phots); if
  // Supabase is configured and returns rows, those take over instead.
  useEffect(() => {
    let active = true
    fetchReelsFromSupabase().then(sb => {
      if (!active) return
      if (sb.length > 0) setReels(sb)
    })
    return () => { active = false }
  }, [])

  // Restore auto-advance preference (default OFF).
  useEffect(() => {
    try {
      if (localStorage.getItem(AUTOSCROLL_KEY) === 'true') setAutoAdvance(true)
    } catch { /* ignore */ }
  }, [])

  // Alt+A toggles auto-advance (no visible button); brief toast + persisted.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault()
        setAutoAdvance(prev => {
          const next = !prev
          try { localStorage.setItem(AUTOSCROLL_KEY, String(next)) } catch { /* ignore */ }
          toast(next ? 'Auto-scroll on' : 'Auto-scroll off', { duration: 1500 })
          return next
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const goNext = useCallback(() => setActiveIdx(i => Math.min(i + 1, reels.length - 1)), [reels.length])
  const goPrev = useCallback(() => setActiveIdx(i => Math.max(i - 1, 0)), [])
  // Auto-advance moves downward only and stops on the last reel (never wraps up).
  const advanceLooping = useCallback(() => setActiveIdx(i => Math.min(i + 1, reels.length - 1)), [reels.length])

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (wheelLock.current) return
    if (Math.abs(e.deltaY) < 30) return
    wheelLock.current = true
    setTimeout(() => { wheelLock.current = false }, 600)
    if (e.deltaY > 0) goNext()
    else goPrev()
  }, [goNext, goPrev])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // Keyboard navigation: ↑ / ↓
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); goNext() }
      else if (e.key === 'ArrowUp') { e.preventDefault(); goPrev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100dvh-44px)] md:h-screen overflow-hidden bg-black flex items-center justify-center"
      style={{ touchAction: 'none' }}
    >
      {/* For you / Following tabs — top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        <button
          onClick={() => setReelsTab('for-you')}
          className={cn(
            'text-[15px] font-semibold transition-colors drop-shadow',
            reelsTab === 'for-you' ? 'text-white' : 'text-white/50'
          )}
        >
          For you
        </button>
        <button
          onClick={() => setReelsTab('following')}
          className={cn(
            'text-[15px] font-semibold transition-colors drop-shadow',
            reelsTab === 'following' ? 'text-white' : 'text-white/50'
          )}
        >
          Following
        </button>
      </div>

      {/* Up / Down nav arrows + auto-advance toggle — right side center */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3">
        <button
          onClick={goPrev}
          disabled={activeIdx === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm disabled:opacity-30"
          aria-label="Previous reel"
        >
          <ChevronUp className="h-6 w-6" strokeWidth={2.5} />
        </button>
        <button
          onClick={goNext}
          disabled={activeIdx === reels.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm disabled:opacity-30"
          aria-label="Next reel"
        >
          <ChevronDown className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* Floating Messages button — bottom right */}
      <Link
        href="/direct/inbox"
        className="absolute bottom-6 right-5 z-20 hidden md:flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white rounded-full px-4 py-2 hover:bg-black/70 transition-colors border border-white/20"
      >
        <IgMessages size={20} className="text-white" />
        <span className="text-[13px] font-semibold">Messages</span>
      </Link>

      {reels.map((reel, idx) => (
        <ReelItem
          key={reel.id}
          reel={reel}
          isActive={idx === activeIdx}
          offset={idx - activeIdx}
          muted={muted}
          autoAdvance={autoAdvance}
          onEnded={advanceLooping}
          onToggleMute={() => setMuted(m => !m)}
        />
      ))}
    </div>
  )
}

function ReelItem({
  reel, isActive, offset, muted, autoAdvance, onEnded, onToggleMute,
}: {
  reel: Reel; isActive: boolean; offset: number; muted: boolean
  autoAdvance: boolean; onEnded: () => void; onToggleMute: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(reel.likes_count)
  const [likeAnimating, setLikeAnimating] = useState(false)
  const [ready, setReady] = useState(false)   // first frame painted → fade in
  const author = getUserById(reel.author_id) ?? {
    id: reel.author_id,
    username: 'user',
    full_name: 'User',
    avatar_url: MEDIA_IMAGES[0] ?? '',
    is_verified: false,
  }
  const { isFollowing, follow } = useStore()
  const following = isFollowing(reel.author_id)

  // Only the active reel, the one above, and the next two carry a real <video>
  // src. Everything else is an inert placeholder — so we never have ~30 videos
  // fetching at once. The active + next clip preload fully ('auto') so swiping
  // / auto-advancing to the next reel plays instantly with no spinner.
  const inWindow = offset >= -1 && offset <= 2
  const preload: 'auto' | 'metadata' = offset === 0 || offset === 1 ? 'auto' : 'metadata'

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isActive) { v.currentTime = 0; v.play().catch(() => {}) }
    else v.pause()
  }, [isActive, inWindow])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  // Auto-advance: when this is the active reel and auto-advance is on, advance
  // to the next reel as soon as the video ends. (When off, the video loops.)
  useEffect(() => {
    const v = videoRef.current
    if (!v || !isActive || !autoAdvance) return
    const handler = () => onEnded()
    v.addEventListener('ended', handler)
    return () => v.removeEventListener('ended', handler)
  }, [isActive, autoAdvance, onEnded])

  function handleLike() {
    setLiked(l => {
      const next = !l
      setLikeCount(c => next ? c + 1 : c - 1)
      if (next) { setLikeAnimating(true); setTimeout(() => setLikeAnimating(false), 400) }
      return next
    })
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
      style={{ transform: `translateY(${offset * 100}%)`, pointerEvents: isActive ? 'auto' : 'none' }}
    >
      <div className="relative flex items-end gap-3 h-full w-full justify-center">
        {/* ── Video card ── */}
        <div
          className="relative h-full bg-black overflow-hidden flex-shrink-0"
          style={{ width: `min(calc(100vh * ${MEDIA.REEL_ASPECT_RATIO}), 100vw)`, maxWidth: '100vw' }}
        >
          {/* Skeleton until the first frame paints (reels ship without posters,
              so this prevents a black flash while the clip buffers). */}
          {!ready && <div className="absolute inset-0 media-shimmer" aria-hidden />}
          <video
            ref={videoRef}
            src={inWindow ? reel.video_url : undefined}
            poster={reel.poster_url || undefined}
            loop={!autoAdvance}
            muted={muted}
            playsInline
            preload={preload}
            onLoadedData={() => setReady(true)}
            onCanPlay={() => { setReady(true); if (isActive) videoRef.current?.play().catch(() => {}) }}
            // When this slot leaves the window its src is dropped → the element
            // empties; show the skeleton again until it reloads on return.
            onEmptied={() => setReady(false)}
            className={cn(
              'absolute inset-0 h-full w-full object-cover media-fade',
              ready && 'is-loaded',
            )}
          />

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
          {/* Top gradient for mute button */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

          {/* Mute / unmute — top right */}
          <button
            onClick={onToggleMute}
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted
              ? <VolumeX className="h-[18px] w-[18px]" strokeWidth={2} />
              : <Volume2 className="h-[18px] w-[18px]" strokeWidth={2} />
            }
          </button>

          {/* Bottom-left: author info + caption + music */}
          <div className="absolute bottom-4 left-3 z-10" style={{ right: '4.5rem' }}>
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/${author.username}`} className="shrink-0" onClick={e => e.stopPropagation()}>
                <div className="h-8 w-8 rounded-full overflow-hidden border-[1.5px] border-white">
                  <img src={author.avatar_url} alt={author.username} className="h-full w-full object-cover" />
                </div>
              </Link>
              <Link href={`/${author.username}`} className="text-white font-semibold text-[14px] drop-shadow">
                {author.username}
              </Link>
              {author.is_verified && <IgVerified size={12} />}
              {!following && (
                <>
                  <span className="text-white/60 text-[13px] font-light">•</span>
                  <button
                    onClick={() => follow(reel.author_id)}
                    className="text-white font-semibold text-[14px] hover:opacity-70 transition-opacity"
                  >
                    Follow
                  </button>
                </>
              )}
            </div>

            {reel.caption && (
              <p className="text-white text-[14px] leading-[18px] mb-2 line-clamp-2 drop-shadow-sm">
                {reel.caption}
              </p>
            )}

            <div className="flex items-center gap-1.5">
              <Music2 className="h-[13px] w-[13px] text-white shrink-0" />
              <p className="text-white text-[12px] truncate">{reel.audio}</p>
            </div>
          </div>

          {/* Mobile-only right actions */}
          <div className="absolute right-3 bottom-4 flex flex-col items-center gap-5 z-10 md:hidden">
            <MobileActions
              liked={liked}
              saved={saved}
              likeCount={likeCount}
              commentsCount={reel.comments_count}
              likeAnimating={likeAnimating}
              authorAvatarUrl={author.avatar_url}
              isActive={isActive}
              onLike={handleLike}
              onSave={() => setSaved(s => !s)}
            />
          </div>
        </div>

        {/* ── Desktop right-side actions panel ── */}
        <div className="hidden md:flex flex-col items-center gap-[22px] pb-6 shrink-0 self-end">
          <ActionBtn label={formatCount(likeCount)} onClick={handleLike} animating={likeAnimating}>
            <IgHeart filled={liked} size={28} className={cn('text-white drop-shadow', liked && 'text-[#ed4956]')} />
          </ActionBtn>

          <ActionBtn label={formatCount(reel.comments_count)}>
            <IgComment size={28} className="text-white drop-shadow" />
          </ActionBtn>

          <ActionBtn label="Share">
            <IgShare size={28} className="text-white drop-shadow" />
          </ActionBtn>

          <ActionBtn onClick={() => setSaved(s => !s)}>
            <IgBookmark filled={saved} size={26} className="text-white drop-shadow" />
          </ActionBtn>

          <ActionBtn>
            <MoreHorizontal className="h-7 w-7 text-white drop-shadow" />
          </ActionBtn>

          {/* Spinning audio disc */}
          <div
            className="h-9 w-9 rounded-full overflow-hidden relative"
            style={{
              animation: isActive ? 'reelSpin 3s linear infinite' : 'none',
              background: 'linear-gradient(135deg, #1a1a1a, #333)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <img src={author.avatar_url} alt="" className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-black/60 border border-white/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({
  children, label, onClick, animating,
}: {
  children: React.ReactNode
  label?: string
  onClick?: () => void
  animating?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn('flex flex-col items-center gap-[5px]', animating && 'like-animate')}
    >
      {children}
      {label && (
        <span className="text-white text-[12px] font-semibold leading-none drop-shadow">
          {label}
        </span>
      )}
    </button>
  )
}

function MobileActions({
  liked, saved, likeCount, commentsCount, likeAnimating, authorAvatarUrl, isActive, onLike, onSave,
}: {
  liked: boolean; saved: boolean; likeCount: number; commentsCount: number
  likeAnimating: boolean; authorAvatarUrl: string; isActive: boolean
  onLike: () => void; onSave: () => void
}) {
  return (
    <>
      <ActionBtn label={formatCount(likeCount)} onClick={onLike} animating={likeAnimating}>
        <IgHeart filled={liked} size={28} className={cn('text-white drop-shadow', liked && 'text-[#ed4956]')} />
      </ActionBtn>
      <ActionBtn label={formatCount(commentsCount)}>
        <IgComment size={28} className="text-white drop-shadow" />
      </ActionBtn>
      <ActionBtn label="Share">
        <IgShare size={28} className="text-white drop-shadow" />
      </ActionBtn>
      <ActionBtn onClick={onSave}>
        <IgBookmark filled={saved} size={26} className="text-white drop-shadow" />
      </ActionBtn>
      <ActionBtn>
        <MoreHorizontal className="h-7 w-7 text-white drop-shadow" />
      </ActionBtn>
      <div
        className="h-9 w-9 rounded-full overflow-hidden relative"
        style={{
          animation: isActive ? 'reelSpin 3s linear infinite' : 'none',
          background: 'linear-gradient(135deg, #1a1a1a, #333)',
          border: '2px solid rgba(255,255,255,0.3)',
        }}
      >
        <img src={authorAvatarUrl} alt="" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-black/60 border border-white/40" />
        </div>
      </div>
    </>
  )
}
