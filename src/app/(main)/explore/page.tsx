'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { POSTS, USERS, type Post } from '@/lib/mock-data'
import { PostModal } from '@/components/shared/post-modal'
import { ExploreMedia } from '@/components/shared/explore-media'
import { IgSearch, IgVerified } from '@/components/shared/ig-icons'
import { AUTOSCROLL } from '@/lib/media-config'
import { cn } from '@/lib/utils'

const AUTOSCROLL_KEY = 'vistagram_explore_autoscroll'
/** Continuous auto-scroll speed for Explore (px / second). */
const SCROLL_SPEED = 55

/** Top-right tile badge — reel (video), then carousel, matching IG Explore. */
function TileBadge({ post }: { post: Post }) {
  if (post.type === 'reel') {
    return (
      <span className="absolute top-2 right-2 pointer-events-none z-10">
        <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] fill-white drop-shadow" aria-hidden>
          <path d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.908.908 0 0 1-.91 0Z"/>
          <path clipRule="evenodd" fillRule="evenodd" opacity=".85" d="M2 3.872A1.872 1.872 0 0 1 3.872 2h16.256A1.872 1.872 0 0 1 22 3.872v16.256A1.872 1.872 0 0 1 20.128 22H3.872A1.872 1.872 0 0 1 2 20.128V3.872Z"/>
        </svg>
      </span>
    )
  }
  if (post.images.length > 1) {
    return (
      <span className="absolute top-2 right-2 pointer-events-none z-10">
        <svg viewBox="0 0 48 48" fill="white" className="h-[18px] w-[18px] drop-shadow" aria-hidden>
          <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM41.1 15v25.6c0 1.4-1.1 2.5-2.5 2.5H13c-.6 0-1-.4-1-1s.4-1 1-1h25.6c.3 0 .5-.2.5-.5V15c0-.6.4-1 1-1s1 .4 1 1z"/>
        </svg>
      </span>
    )
  }
  return null
}

type Cell = { key: string; post: Post }

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [activePostId, setActivePostId] = useState<string | null>(null)
  const [exploreTab, setExploreTab] = useState<'for-you' | 'not-personalized'>('for-you')

  // ── Infinite content pool ────────────────────────────────────────────────
  // Every post with real media (single image, carousel, or video) is eligible.
  const basePool = useMemo(
    () => POSTS.filter(p => p.images.length > 0 || (p.type === 'reel' && !!p.video_url)),
    []
  )
  const [cycles, setCycles] = useState(2)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Repeat the pool `cycles` times with unique keys → the grid never runs out.
  const cells = useMemo<Cell[]>(() => {
    const out: Cell[] = []
    for (let c = 0; c < cycles; c++) {
      basePool.forEach((post, i) => out.push({ key: `${post.id}#${c}#${i}`, post }))
    }
    return out
  }, [basePool, cycles])

  const rows = useMemo<Cell[][]>(() => {
    const r: Cell[][] = []
    for (let i = 0; i < cells.length; i += 3) r.push(cells.slice(i, i + 3))
    return r
  }, [cells])

  // Append another copy when the sentinel scrolls into view (infinite scroll).
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setCycles(c => c + 1) },
      { rootMargin: '800px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── Alt+A continuous auto-scroll (persisted, pause-on-interact) ───────────
  const [autoScroll, setAutoScroll] = useState(false)
  const pausedRef = useRef(false)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      if (localStorage.getItem(AUTOSCROLL_KEY) === 'true') setAutoScroll(true)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault()
        setAutoScroll(prev => {
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

  const pause = useCallback(() => {
    if (!autoScroll) return
    pausedRef.current = true
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => { pausedRef.current = false }, AUTOSCROLL.RESUME_DELAY_MS)
  }, [autoScroll])

  useEffect(() => {
    if (!autoScroll) return
    pausedRef.current = false
    let raf = 0
    let last = performance.now()
    let acc = window.scrollY
    const step = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      if (pausedRef.current) {
        acc = window.scrollY // resync so we don't jump after the user scrolls
      } else {
        acc += SCROLL_SPEED * dt
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (acc >= max) { setCycles(c => c + 1); acc = max - 2 } // keep going forever
        window.scrollTo(0, acc)
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    window.addEventListener('wheel', pause, { passive: true })
    window.addEventListener('touchmove', pause, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', pause)
      window.removeEventListener('touchmove', pause)
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [autoScroll, pause])

  // ── Search ────────────────────────────────────────────────────────────────
  const filteredUsers = query
    ? USERS.filter(u =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.full_name.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="max-w-[975px] mx-auto px-0">
      {/* Search bar */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2 rounded-lg bg-[#efefef] dark:bg-[#262626] px-3 py-2 max-w-[500px] mx-auto">
          {!query && <IgSearch size={16} className="text-muted-foreground shrink-0" />}
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
            aria-label="Search"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* User results */}
      {query && (
        <div className="border-b border-border">
          {filteredUsers.length === 0 ? (
            <p className="px-4 py-8 text-[14px] text-muted-foreground text-center">
              No results found.
            </p>
          ) : (
            filteredUsers.map(u => (
              <a
                key={u.id}
                href={`/${u.username}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
              >
                <img src={u.avatar_url} alt={u.username} className="h-[44px] w-[44px] rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[14px] font-semibold leading-[18px]">{u.username}</p>
                    {u.is_verified && <IgVerified size={12} />}
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-[16px]">{u.full_name}</p>
                </div>
              </a>
            ))
          )}
        </div>
      )}

      {/* For you / Not personalized tabs */}
      {!query && (
        <div className="flex px-4 py-2.5 gap-2 border-b border-border/60 justify-center">
          {(['for-you', 'not-personalized'] as const).map(t => (
            <button
              key={t}
              onClick={() => setExploreTab(t)}
              className={cn(
                'px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors',
                exploreTab === t
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {t === 'for-you' ? 'For you' : 'Not personalized'}
            </button>
          ))}
        </div>
      )}

      {/* Explore grid (live: autoplaying videos + slideshow carousels) */}
      {!query && (
        <>
          <div className="flex flex-col gap-[3px] mt-[3px]">
            {rows.map((row, rowIdx) => {
              const largeLeft = rowIdx % 2 === 0
              return (
                <div key={rowIdx} className="flex gap-[3px]">
                  {largeLeft ? (
                    <>
                      {row[0] && (
                        <ExploreTile cell={row[0]} large onOpen={setActivePostId} />
                      )}
                      <div className="flex flex-1 flex-col gap-[3px]">
                        {row.slice(1).map(cell => (
                          <ExploreTile key={cell.key} cell={cell} onOpen={setActivePostId} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-1 flex-col gap-[3px]">
                        {row.slice(0, 2).map(cell => (
                          <ExploreTile key={cell.key} cell={cell} onOpen={setActivePostId} />
                        ))}
                      </div>
                      {row[2] && (
                        <ExploreTile cell={row[2]} large onOpen={setActivePostId} />
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
          {/* Infinite-scroll sentinel */}
          <div ref={loaderRef} className="h-10" />
        </>
      )}

      {activePostId && <PostModal postId={activePostId} onClose={() => setActivePostId(null)} />}
    </div>
  )
}

function ExploreTile({
  cell, large, onOpen,
}: {
  cell: Cell
  large?: boolean
  onOpen: (id: string) => void
}) {
  return (
    <button
      className="relative overflow-hidden bg-muted group"
      style={large ? { flex: '2', aspectRatio: '1' } : { flex: '1', aspectRatio: '1' }}
      onClick={() => onOpen(cell.post.id)}
    >
      <ExploreMedia
        post={cell.post}
        className="h-full w-full object-cover transition-all duration-150 group-hover:brightness-90"
      />
      <TileBadge post={cell.post} />
    </button>
  )
}
