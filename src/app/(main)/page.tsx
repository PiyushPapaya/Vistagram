'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useStore } from '@/lib/store'
import { POSTS, getFeedPosts, DEFAULT_FOLLOWING, GENERATED_FEED_POSTS } from '@/lib/mock-data'
import { AUTOSCROLL } from '@/lib/media-config'
import { StoryTray } from '@/components/feed/story-tray'
import { PostCard } from '@/components/feed/post-card'
import { SuggestedUsers } from '@/components/feed/suggested-users'
import { PostModal } from '@/components/shared/post-modal'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Delay before resuming after a user interaction pauses auto-scroll
const RESUME_DELAY_MS = AUTOSCROLL.RESUME_DELAY_MS
const AUTOSCROLL_KEY = 'vistagram_autoscroll'

export default function FeedPage() {
  const { following } = useStore()
  const [activePostId, setActivePostId] = useState<string | null>(null)
  // The feed only scrolls downward: when content runs out we append another copy
  // of the sequence below (never jump back to the top). `cycles` = how many copies.
  const [cycles, setCycles] = useState(2)
  const [feedTab, setFeedTab] = useState<'for-you' | 'following'>('for-you')

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false)
  const [autoScrollRunning, setAutoScrollRunning] = useState(false)  // false = paused by user
  const [autoScrollTargetId, setAutoScrollTargetId] = useState<string | null>(null)
  const postRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const currentIdxRef = useRef(0)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isProgrammaticScroll = useRef(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Real generated media (from videos_phots) leads the feed; demo posts fill in behind.
  const allFeedPosts = useMemo(() => {
    const generatedImages = GENERATED_FEED_POSTS.filter(p => !(p.type === 'reel' && p.video_url))
    // Exclude reels here — video posts are injected separately via `videoPosts`
    // (interleaving). Keeping them here too would duplicate keys in displayPosts.
    const mockFeedPosts = getFeedPosts(following.length > 0 ? following : DEFAULT_FOLLOWING)
      .filter(p => p.type !== 'reel' && !p.id.startsWith('gen-'))
    return [...generatedImages, ...mockFeedPosts]
  }, [following])

  // Interleave video posts into the feed at regular intervals (generated videos first)
  const videoPosts = useMemo(
    () => POSTS.filter(p => p.type === 'reel' && !!p.video_url),
    []
  )

  // One pass of the feed: image posts with a video injected every 3 posts.
  const baseSequence = useMemo(() => {
    const result: typeof allFeedPosts = []
    let vIdx = 0
    for (let i = 0; i < allFeedPosts.length; i++) {
      result.push(allFeedPosts[i])
      if ((i + 1) % 3 === 0 && videoPosts.length > 0) {
        result.push(videoPosts[vIdx % videoPosts.length]); vIdx++
      }
    }
    while (vIdx < videoPosts.length) { result.push(videoPosts[vIdx++]) }
    return result
  }, [allFeedPosts, videoPosts])

  // The rendered list = baseSequence repeated `cycles` times, each item with a
  // unique key so React never sees duplicates and the page just keeps going down.
  const displayItems = useMemo(() => {
    const items: { key: string; post: typeof baseSequence[number] }[] = []
    for (let c = 0; c < cycles; c++) {
      baseSequence.forEach((post, i) => items.push({ key: `${post.id}#${c}#${i}`, post }))
    }
    return items
  }, [baseSequence, cycles])
  const baseLen = baseSequence.length

  // Read auto-scroll preference from localStorage
  useEffect(() => {
    try {
      if (localStorage.getItem('vistagram_autoscroll') === 'true') setAutoScrollEnabled(true)
    } catch { /* ignore */ }
  }, [])

  // Infinite scroll trigger — append another copy below (downward only)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCycles(c => c + 1) },
      { threshold: 0.1 }
    )
    if (loaderRef.current) obs.observe(loaderRef.current)
    return () => obs.disconnect()
  }, [])

  // ── Scroll helpers ─────────────────────────────────────────────────────────

  const clearTimers = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
  }, [])

  const scrollToKey = useCallback((key: string) => {
    const el = postRefs.current.get(key)
    if (!el) return
    isProgrammaticScroll.current = true
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => { isProgrammaticScroll.current = false }, 800)
  }, [])

  /** Make `idx` the active auto-scroll target and scroll it into view. PostCard
   *  drives the per-content-type dwell and calls onAutoAdvance when it's time. */
  const goToIdx = useCallback((idx: number) => {
    const item = displayItems[idx]
    if (!item) return
    currentIdxRef.current = idx
    setAutoScrollTargetId(item.key)
    scrollToKey(item.key)
  }, [displayItems, scrollToKey])

  /** Advance to the next post — downward only. Grows the list before the end so
   *  there's always more below; never wraps back to the top. */
  const advance = useCallback(() => {
    if (displayItems.length === 0) return
    const next = currentIdxRef.current + 1
    if (next >= displayItems.length - baseLen) setCycles(c => c + 1)
    if (next < displayItems.length) goToIdx(next)
  }, [displayItems.length, baseLen, goToIdx])

  /** Pause auto-scroll on user interaction, resume after idle */
  const pauseAutoScroll = useCallback(() => {
    if (!autoScrollEnabled || isProgrammaticScroll.current) return
    clearTimers()
    setAutoScrollRunning(false)
    resumeTimer.current = setTimeout(() => {
      setAutoScrollRunning(true)
      goToIdx(currentIdxRef.current)
    }, RESUME_DELAY_MS)
  }, [autoScrollEnabled, clearTimers, goToIdx])

  // Start/stop auto-scroll when enabled flag changes
  useEffect(() => {
    if (autoScrollEnabled) {
      setAutoScrollRunning(true)
      goToIdx(0)
    } else {
      setAutoScrollRunning(false)
      setAutoScrollTargetId(null)
      clearTimers()
    }
    return clearTimers
    // goToIdx intentionally omitted: only re-run when the enabled flag flips
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScrollEnabled, clearTimers])

  // Attach wheel + touch listeners for pause-on-interact
  useEffect(() => {
    if (!autoScrollEnabled) return
    const handler = () => pauseAutoScroll()
    window.addEventListener('wheel', handler, { passive: true })
    window.addEventListener('touchmove', handler, { passive: true })
    return () => {
      window.removeEventListener('wheel', handler)
      window.removeEventListener('touchmove', handler)
    }
  }, [autoScrollEnabled, pauseAutoScroll])

  // Alt+A toggles auto-scroll (no visible button); shows a brief toast + persists.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault()
        setAutoScrollEnabled(prev => {
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

  const setPostRef = useCallback((key: string, el: HTMLDivElement | null) => {
    if (el) postRefs.current.set(key, el)
    else postRefs.current.delete(key)
  }, [])

  return (
    <div className="w-full flex justify-center px-0">
      <div className="flex w-full max-w-[935px] gap-8 justify-center">
        {/* ── Feed column ── */}
        <div className="w-full max-w-[470px] min-w-0">

          {/* For you / Following tabs (auto-scroll toggles via Alt+A — no visible button) */}
          <div className="flex items-center border-b border-border/60 mb-0">
            {(['for-you', 'following'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFeedTab(tab)}
                className={cn(
                  'flex-1 py-3 text-[14px] font-semibold transition-colors relative',
                  feedTab === tab ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {tab === 'for-you' ? 'For you' : 'Following'}
                {feedTab === tab && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-foreground" />}
              </button>
            ))}
          </div>

          <StoryTray />

          {/* Posts — video posts interleaved, sequence repeats downward forever */}
          <div className="mt-3 flex flex-col gap-0">
            {displayItems.map(({ key, post }, i) => (
              <div
                key={key}
                ref={el => setPostRef(key, el)}
                className={i > 0 ? 'border-t border-border/50 pt-3' : ''}
              >
                <PostCard
                  post={post}
                  onOpenComments={id => setActivePostId(id)}
                  onAutoAdvance={advance}
                  isAutoScrollTarget={autoScrollEnabled && autoScrollTargetId === key}
                  autoScrollActive={autoScrollEnabled && autoScrollRunning}
                />
              </div>
            ))}
          </div>

          <div ref={loaderRef} className="h-4" />
        </div>

        {/* ── Right rail (desktop only) ── */}
        <div className="hidden lg:block w-[319px] shrink-0">
          <SuggestedUsers />
        </div>
      </div>

      {activePostId && (
        <PostModal postId={activePostId} onClose={() => setActivePostId(null)} />
      )}
    </div>
  )
}
