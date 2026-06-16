'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, MoreHorizontal } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getStoriesByUser, getStoryAuthors, getUserById, relativeTime } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { IgHeart, IgEmoji } from '@/components/shared/ig-icons'

const DURATION = 5000

interface StoryViewerProps {
  userId: string
}

export function StoryViewer({ userId }: StoryViewerProps) {
  const { setActiveStoryUserId, markStoryViewed } = useStore()
  const [storyIdx, setStoryIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reply, setReply] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const storyAuthors = getStoryAuthors()
  const authorIdx = storyAuthors.indexOf(userId)
  const stories = getStoriesByUser(userId)
  const user = getUserById(userId)!
  const currentStory = stories[storyIdx]

  const prevUserId = authorIdx > 0 ? storyAuthors[authorIdx - 1] : null
  const nextUserId = authorIdx < storyAuthors.length - 1 ? storyAuthors[authorIdx + 1] : null
  const prevUser = prevUserId ? getUserById(prevUserId) : null
  const nextUser = nextUserId ? getUserById(nextUserId) : null
  const prevStory = prevUserId ? getStoriesByUser(prevUserId)[0] : null
  const nextStory = nextUserId ? getStoriesByUser(nextUserId)[0] : null

  const goNext = useCallback(() => {
    if (storyIdx < stories.length - 1) {
      setStoryIdx(i => i + 1); setProgress(0)
    } else if (nextUserId) {
      setActiveStoryUserId(nextUserId)
    } else {
      setActiveStoryUserId(null)
    }
  }, [storyIdx, stories.length, nextUserId, setActiveStoryUserId])

  const goPrev = useCallback(() => {
    if (storyIdx > 0) {
      setStoryIdx(i => i - 1); setProgress(0)
    } else if (prevUserId) {
      setActiveStoryUserId(prevUserId)
    }
  }, [storyIdx, prevUserId, setActiveStoryUserId])

  useEffect(() => {
    if (currentStory) markStoryViewed(currentStory.id)
  }, [currentStory?.id])

  useEffect(() => {
    if (paused || inputFocused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { goNext(); return 0 }
        return p + (100 / (DURATION / 100))
      })
    }, 100)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [storyIdx, paused, inputFocused, goNext])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape') setActiveStoryUserId(null)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goNext, goPrev, setActiveStoryUserId])

  if (!currentStory || !user) return null

  const isPaused = paused || inputFocused

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background fill */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${currentStory.media_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px) brightness(0.3)',
          transform: 'scale(1.2)',
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Click backdrop to close */}
      <div className="absolute inset-0 z-[1]" onClick={() => setActiveStoryUserId(null)} />

      {/* ── Desktop: prev user peek ── */}
      {prevUser && prevStory && (
        <button
          className="absolute z-20 hidden md:flex flex-col items-center gap-2 group"
          style={{ left: 'calc(50% - 230px - 72px)', top: '50%', transform: 'translateY(-50%)' }}
          onClick={e => { e.stopPropagation(); setActiveStoryUserId(prevUserId!) }}
        >
          <div
            className="w-[56px] h-[100px] rounded-lg overflow-hidden opacity-50 group-hover:opacity-80 transition-all duration-200 scale-90 group-hover:scale-100"
            style={{
              backgroundImage: `url(${prevStory.media_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <img src={prevUser.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover border border-white/50" />
            <span className="text-white text-[11px]">{prevUser.username}</span>
          </div>
        </button>
      )}

      {/* ── Story card ── */}
      <div
        className="relative z-10 flex flex-col overflow-hidden select-none bg-black"
        style={{
          width: '100%',
          maxWidth: 400,
          height: '100dvh',
        }}
        onPointerDown={e => { if ((e.target as HTMLElement).tagName !== 'INPUT') setPaused(true) }}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
        onClick={e => e.stopPropagation()}
      >
        {/* Story media */}
        <img
          src={currentStory.media_url}
          alt="Story"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* Top scrim */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/65 via-black/20 to-transparent pointer-events-none z-[1]" />
        {/* Bottom scrim */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none z-[1]" />

        {/* Progress bars */}
        <div className="absolute top-[10px] left-[10px] right-[10px] flex gap-[3px] z-20 pointer-events-none">
          {stories.map((_, i) => (
            <div key={i} className="h-[2px] flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.35)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  width: i < storyIdx ? '100%' : i === storyIdx ? `${progress}%` : '0%',
                  transition: i === storyIdx ? 'none' : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {/* Header: avatar + name + time + actions */}
        <div className="absolute top-[22px] left-0 right-0 flex items-center gap-2 px-[10px] z-20">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="h-8 w-8 rounded-full overflow-hidden border-[1.5px] border-white shrink-0">
              <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
            </div>
            <span className="text-white text-[13px] font-semibold leading-none drop-shadow-sm">{user.username}</span>
            <span className="text-white/60 text-[12px]">{relativeTime(currentStory.created_at)}</span>
            {isPaused && (
              <span className="text-white/50 text-[11px] font-medium">Paused</span>
            )}
          </div>
          <div className="flex items-center shrink-0">
            <button
              className="p-1.5 text-white hover:opacity-70 transition-opacity"
              onClick={e => e.stopPropagation()}
              aria-label="More options"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <button
              className="p-1.5 text-white hover:opacity-70 transition-opacity"
              onClick={e => { e.stopPropagation(); setActiveStoryUserId(null) }}
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Tap zones */}
        <div className="absolute inset-0 flex z-[5] pointer-events-none">
          <div className="flex-[0_0_35%] h-full pointer-events-auto" onClick={e => { e.stopPropagation(); goPrev() }} />
          <div className="flex-1 pointer-events-none" />
          <div className="flex-[0_0_35%] h-full pointer-events-auto" onClick={e => { e.stopPropagation(); goNext() }} />
        </div>

        {/* Reply bar */}
        <div
          className="absolute bottom-4 left-[10px] right-[10px] flex items-center gap-2 z-20"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex-1 flex items-center rounded-full bg-transparent border border-white/40 px-4 py-[9px] gap-2">
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder={`Reply to ${user.username}…`}
              className="flex-1 bg-transparent text-white text-[14px] outline-none placeholder:text-white/50 min-w-0"
              onPointerDown={e => e.stopPropagation()}
              onPointerUp={e => e.stopPropagation()}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <button
              className="shrink-0 text-white/60 hover:text-white transition-colors"
              onPointerDown={e => e.stopPropagation()}
            >
              <IgEmoji size={18} />
            </button>
          </div>
          <button
            onPointerDown={e => e.stopPropagation()}
            className="shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Like"
          >
            <IgHeart size={24} className="text-white" />
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            className="shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Share"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M22.003 1.161a1.016 1.016 0 0 0-1.392-.135L1.05 15.296a1 1 0 0 0 .54 1.786l4.907.655L8.37 23.05a1.001 1.001 0 0 0 1.803-.036l2.332-5.887 8.222 1.098a1 1 0 0 0 1.085-1.24L22.003 1.161ZM9.902 21.098l-1.49-4.199 8.392-8.386-9.8 6.816-.962-.128L18.848 3.374l2.887 11.936-11.833-1.58z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Desktop: next user peek ── */}
      {nextUser && nextStory && (
        <button
          className="absolute z-20 hidden md:flex flex-col items-center gap-2 group"
          style={{ right: 'calc(50% - 230px - 72px)', top: '50%', transform: 'translateY(-50%)' }}
          onClick={e => { e.stopPropagation(); setActiveStoryUserId(nextUserId!) }}
        >
          <div
            className="w-[56px] h-[100px] rounded-lg overflow-hidden opacity-50 group-hover:opacity-80 transition-all duration-200 scale-90 group-hover:scale-100"
            style={{
              backgroundImage: `url(${nextStory.media_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <img src={nextUser.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover border border-white/50" />
            <span className="text-white text-[11px]">{nextUser.username}</span>
          </div>
        </button>
      )}
    </div>
  )
}
