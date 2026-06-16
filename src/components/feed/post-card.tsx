'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { getUserById, getCommentsByPost, getStoriesByUser, relativeTime, formatCount, getCurrentUser, type Post } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { MEDIA, AUTOSCROLL } from '@/lib/media-config'
import {
  IgHeart, IgComment, IgShare, IgBookmark, IgEmoji, IgEllipsis, IgVerified,
} from '@/components/shared/ig-icons'
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play } from 'lucide-react'

interface PostCardProps {
  post: Post
  onOpenComments?: (postId: string) => void
  /**
   * Called when this post has finished its auto-scroll dwell and the feed should
   * advance to the next post. Timing depends on content type:
   *  - single photo → after PHOTO_DWELL
   *  - carousel      → slideshow (SLIDE_INTERVAL each) + SLIDE_END_HOLD after the final image
   *  - video         → POST_VIDEO_HOLD after the video ends
   */
  onAutoAdvance?: () => void
  /** When true this post is the active auto-scroll target (video restarts from 0). */
  isAutoScrollTarget?: boolean
  /** When true auto-scroll is actively running (not paused). Gates the dwell timers. */
  autoScrollActive?: boolean
}

export function PostCard({ post, onOpenComments, onAutoAdvance, isAutoScrollTarget, autoScrollActive }: PostCardProps) {
  const { toggleLike, isLiked, toggleSave, isSaved, isFollowing, follow, currentUserId, isStoryViewed } = useStore()
  const me = getCurrentUser()
  const author = getUserById(post.author_id)!
  const liked = isLiked(post.id)
  const saved = isSaved(post.id)
  const following = isFollowing(post.author_id)
  const comments = getCommentsByPost(post.id)

  const authorStories = getStoriesByUser(author?.id ?? '')
  const authorHasStories = authorStories.length > 0
  const authorStorySeen = authorHasStories && authorStories.every(s => isStoryViewed(s.id))

  const [carouselIdx, setCarouselIdx] = useState(0)
  const [showHeart, setShowHeart] = useState(false)
  const [heartPos, setHeartPos] = useState({ x: 0, y: 0 })
  const [likeAnimating, setLikeAnimating] = useState(false)
  const [commentText, setCommentText] = useState('')
  const lastTapRef = useRef(0)

  const likeCount = post.likes_count + (liked ? 1 : 0)

  const handleDoubleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now()
    let x = 0, y = 0
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    if ('touches' in e) {
      const t = e.changedTouches[0]
      x = t.clientX - rect.left; y = t.clientY - rect.top
    } else {
      x = (e as React.MouseEvent).clientX - rect.left
      y = (e as React.MouseEvent).clientY - rect.top
    }
    if (now - lastTapRef.current < 350) {
      if (!liked) {
        toggleLike(post.id)
        setLikeAnimating(true)
        setTimeout(() => setLikeAnimating(false), 400)
      }
      setHeartPos({ x, y })
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 800)
    }
    lastTapRef.current = now
  }, [liked, post.id, toggleLike])

  const handleLike = useCallback(() => {
    toggleLike(post.id)
    if (!liked) { setLikeAnimating(true); setTimeout(() => setLikeAnimating(false), 400) }
  }, [liked, post.id, toggleLike])

  // ── Auto-scroll timing per content type ──────────────────────────────────────
  // Videos advance via the <video> 'ended' event (see FeedVideo). Photos/carousels
  // are driven here so the feed only needs a single onAutoAdvance callback.
  // The callback is held in a ref so its (frequently-changing) identity never
  // restarts the dwell timers.
  const isVideoPost = post.type === 'reel' && !!post.video_url
  const imageCount = post.images.length
  const advanceRef = useRef(onAutoAdvance)
  useEffect(() => { advanceRef.current = onAutoAdvance }, [onAutoAdvance])

  useEffect(() => {
    if (!isAutoScrollTarget || !autoScrollActive || isVideoPost) return

    // Single photo → dwell, then advance.
    if (imageCount <= 1) {
      const t = setTimeout(() => advanceRef.current?.(), AUTOSCROLL.PHOTO_DWELL)
      return () => clearTimeout(t)
    }

    // Carousel → slideshow: SLIDE_INTERVAL on every image (incl. the last), then a
    // SLIDE_END_HOLD pause after the last image before advancing to the next post.
    setCarouselIdx(0)
    let i = 0
    let timer = setTimeout(function step() {
      if (i < imageCount - 1) {
        i += 1
        setCarouselIdx(i)
        timer = setTimeout(step, AUTOSCROLL.SLIDE_INTERVAL)
      } else {
        timer = setTimeout(() => advanceRef.current?.(), AUTOSCROLL.SLIDE_END_HOLD)
      }
    }, AUTOSCROLL.SLIDE_INTERVAL)
    return () => clearTimeout(timer)
  }, [isAutoScrollTarget, autoScrollActive, isVideoPost, imageCount])

  if (!author) return null

  const isVideo = isVideoPost

  // Fixed, consistent feed sizing — every post (image or video) renders at one
  // ratio with object-cover, so the source file's dimensions never matter.
  const aspectStyle = { aspectRatio: MEDIA.POST_ASPECT_RATIO }

  return (
    <article className="pb-3 mb-0 post-enter">
      {/* ─── Header ─── */}
      <div className="flex items-center px-3 py-2 md:px-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Link href={`/${author.username}`} className="shrink-0 block">
            {authorHasStories ? (
              <div
                className="h-[34px] w-[34px] rounded-full p-[1.5px]"
                style={{ background: authorStorySeen ? 'var(--border)' : 'linear-gradient(to bottom right, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
              >
                <div className="h-full w-full rounded-full overflow-hidden border-[1.5px] border-background">
                  <img src={author.avatar_url} alt={author.username} className="h-full w-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img src={author.avatar_url} alt={author.username} className="h-full w-full object-cover" />
              </div>
            )}
          </Link>

          <div className="flex flex-col min-w-0 leading-[1.2]">
            <div className="flex items-center gap-1 min-w-0">
              <Link href={`/${author.username}`} className="font-semibold text-[14px] hover:opacity-60 transition-opacity truncate min-w-0">
                {author.username}
              </Link>
              {author.is_verified && <span className="shrink-0"><IgVerified size={12} /></span>}
              {post.author_id !== currentUserId && !following && (
                <span className="flex items-center shrink-0">
                  <span className="text-muted-foreground text-[14px] mx-0.5">•</span>
                  <button onClick={() => follow(post.author_id)} className="text-[#0095f6] text-[14px] font-semibold hover:text-foreground transition-colors">
                    Follow
                  </button>
                </span>
              )}
            </div>
            {post.location && (
              <span className="text-[11px] text-foreground font-normal mt-0.5 flex items-center gap-0.5 truncate">
                {post.location}
              </span>
            )}
          </div>
        </div>
        <button className="p-2 -mr-2 hover:opacity-60" aria-label="More options">
          <IgEllipsis size={20} />
        </button>
      </div>

      {/* ─── Media ─── */}
      <div
        className="relative bg-black overflow-hidden"
        style={aspectStyle}
        onDoubleClick={handleDoubleTap}
        onTouchEnd={handleDoubleTap}
      >
        {isVideo ? (
          <FeedVideo
            src={post.video_url!}
            poster={post.images[0]}
            onVideoEnded={isAutoScrollTarget && autoScrollActive ? onAutoAdvance : undefined}
            isAutoScrollTarget={isAutoScrollTarget}
          />
        ) : (
          // Sliding track: all slides side-by-side, translated by the active index
          // so the carousel glides smoothly (and stays perfectly centered).
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${carouselIdx * 100}%)` }}
          >
            {post.images.map((src, i) => (
              <div key={i} className="carousel-slide">
                <FadeImage src={src} alt={`Post by ${author.username}`} eager={i === 0} />
              </div>
            ))}
          </div>
        )}

        {/* Double-tap heart */}
        {showHeart && (
          <div className="pointer-events-none absolute z-10 heart-burst" style={{ left: heartPos.x, top: heartPos.y }}>
            <svg width="90" height="90" viewBox="0 0 24 24" fill="white" style={{ filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.4))', transform: 'translate(-50%,-50%)' }}>
              <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938"/>
            </svg>
          </div>
        )}

        {/* Carousel controls (images only) */}
        {!isVideo && post.images.length > 1 && (
          <>
            {carouselIdx > 0 && (
              <button onClick={e => { e.stopPropagation(); setCarouselIdx(i => i - 1) }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-md" aria-label="Previous">
                <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
              </button>
            )}
            {carouselIdx < post.images.length - 1 && (
              <button onClick={e => { e.stopPropagation(); setCarouselIdx(i => i + 1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-md" aria-label="Next">
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[3px]">
              {post.images.map((_, i) => (
                <span key={i} className={cn('rounded-full transition-all duration-200', i === carouselIdx ? 'h-[6px] w-[6px] bg-[#0095f6]' : 'h-[6px] w-[6px] bg-white/60')} />
              ))}
            </div>
            {post.images.length <= 10 && (
              <span className="absolute top-3 right-3 bg-black/60 text-white text-[12px] font-semibold px-2 py-0.5 rounded-full leading-5">
                {carouselIdx + 1}/{post.images.length}
              </span>
            )}
          </>
        )}

        {/* Reel badge top-left */}
        {isVideo && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white" aria-hidden>
              <path d="M11.659 4.853a.75.75 0 0 1 .682 0l8.25 4.125a.75.75 0 0 1 0 1.344l-8.25 4.125a.75.75 0 0 1-.682 0l-8.25-4.125a.75.75 0 0 1 0-1.344l8.25-4.125Z"/>
              <path d="M3 14.625c0-.069.006-.137.017-.204l8.584 4.293a.75.75 0 0 0 .799 0l8.584-4.293c.011.067.016.135.016.204v.024a.75.75 0 0 1-.412.667l-8.25 4.125a.75.75 0 0 1-.682 0L3.412 15.316A.75.75 0 0 1 3 14.648v-.023Z"/>
            </svg>
            <span className="text-white text-[11px] font-semibold">Reel</span>
          </div>
        )}
      </div>

      {/* ─── Actions ─── */}
      <div className="px-3 md:px-0">
        <div className="flex items-center justify-between pt-[6px] pb-[2px]">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} aria-label={liked ? 'Unlike' : 'Like'} className={cn(likeAnimating && 'like-animate')}>
              <IgHeart filled={liked} size={24} />
            </button>
            <button onClick={() => onOpenComments?.(post.id)} aria-label="Comment">
              <IgComment size={24} />
            </button>
            <button aria-label="Share"><IgShare size={24} /></button>
          </div>
          <button onClick={() => toggleSave(post.id)} aria-label={saved ? 'Unsave' : 'Save'}>
            <IgBookmark filled={saved} size={24} />
          </button>
        </div>

        {/* Plays count for video posts */}
        {isVideo && post.plays_count && post.plays_count > 0 && (
          <p className="text-[14px] font-semibold mt-1 leading-[18px]">
            {formatCount(post.plays_count)} views
          </p>
        )}

        {/* Likes line */}
        {!isVideo && likeCount > 0 && (
          <button className="text-[14px] font-semibold mt-1 leading-[18px] text-left block hover:opacity-70 transition-opacity">
            {likeCount === 1 ? '1 like' : likeCount < 100 ? `${likeCount} likes` : (
              <span>
                Liked by <span className="font-semibold">{author.username}</span>
                {likeCount > 1 && <span className="font-normal"> and <span className="font-semibold">{formatCount(likeCount - 1)} others</span></span>}
              </span>
            )}
          </button>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="mt-0.5 text-[14px] leading-[18px]">
            <Link href={`/${author.username}`} className="font-semibold mr-1.5 hover:opacity-60">{author.username}</Link>
            <CaptionText text={post.caption} />
          </div>
        )}

        {post.comments_count > 2 && (
          <button className="mt-1 text-[14px] text-muted-foreground leading-[18px] block" onClick={() => onOpenComments?.(post.id)}>
            View all {post.comments_count} comments
          </button>
        )}

        {comments.slice(0, 2).map(c => {
          const cAuthor = getUserById(c.author_id)
          if (!cAuthor) return null
          return (
            <div key={c.id} className="mt-0.5 text-[14px] leading-[18px]">
              <Link href={`/${cAuthor.username}`} className="font-semibold mr-1.5 hover:opacity-60">{cAuthor.username}</Link>
              <CaptionText text={c.text} />
            </div>
          )
        })}

        <p suppressHydrationWarning className="mt-1.5 text-[10px] text-muted-foreground uppercase tracking-wide leading-[13px]">
          {relativeTime(post.created_at)}
        </p>
      </div>

      {/* ─── Add a comment ─── */}
      <div className="flex items-center justify-between px-3 md:px-0 mt-1.5 pt-2 border-t border-border/60">
        <input
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
          aria-label="Add a comment"
        />
        {commentText ? (
          <button className="text-[14px] font-semibold text-[#0095f6] ml-2 shrink-0" onClick={() => setCommentText('')}>Post</button>
        ) : (
          <button aria-label="Emoji" className="ml-2 shrink-0">
            <IgEmoji size={20} className="text-muted-foreground" />
          </button>
        )}
      </div>
    </article>
  )
}

// ─── Fade-in image (centered, with a shimmer placeholder until painted) ───────
function FadeImage({ src, alt, eager }: { src: string; alt: string; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {!loaded && <div className="absolute inset-0 media-shimmer" aria-hidden />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn('absolute inset-0 h-full w-full object-cover object-center select-none media-fade', loaded && 'is-loaded')}
        draggable={false}
        loading={eager ? 'eager' : 'lazy'}
      />
    </>
  )
}

// ─── Feed Video Player ────────────────────────────────────────────────────────
function FeedVideo({
  src, poster, onVideoEnded, isAutoScrollTarget,
}: {
  src: string
  poster?: string
  onVideoEnded?: () => void
  isAutoScrollTarget?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [showPlayBtn, setShowPlayBtn] = useState(false)
  const showPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // IntersectionObserver: autoplay when ≥50% visible, pause when gone
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          video.play().then(() => setPlaying(true)).catch(() => {})
        } else {
          video.pause()
          setPlaying(false)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(video)
    return () => obs.disconnect()
  }, [])

  // Restart from beginning when this post becomes the auto-scroll target
  useEffect(() => {
    if (isAutoScrollTarget && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [isAutoScrollTarget])

  // Wire up the onVideoEnded callback — hold POST_VIDEO_HOLD after the video ends
  // before advancing, so the final frame lingers briefly (matches carousel pause).
  useEffect(() => {
    const video = videoRef.current
    if (!video || !onVideoEnded) return
    let hold: ReturnType<typeof setTimeout>
    const handler = () => { hold = setTimeout(onVideoEnded, AUTOSCROLL.POST_VIDEO_HOLD) }
    video.addEventListener('ended', handler)
    return () => { video.removeEventListener('ended', handler); clearTimeout(hold) }
  }, [onVideoEnded])

  function handleTap() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setPlaying(false)
      // Flash the play icon
      if (showPlayTimer.current) clearTimeout(showPlayTimer.current)
      setShowPlayBtn(true)
      showPlayTimer.current = setTimeout(() => setShowPlayBtn(false), 1200)
    }
  }

  return (
    <div className="relative h-full w-full bg-black" onClick={handleTap}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={false}
        muted={muted}
        playsInline
        preload="metadata"
        className="h-full w-full object-cover object-center"
      />

      {/* Play/pause flash overlay */}
      {showPlayBtn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <Play className="h-7 w-7 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Mute toggle — bottom-right */}
      <button
        onClick={e => { e.stopPropagation(); setMuted(m => !m) }}
        className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="h-4 w-4" strokeWidth={2} /> : <Volume2 className="h-4 w-4" strokeWidth={2} />}
      </button>
    </div>
  )
}

// ─── Caption text (hashtag/mention links) ─────────────────────────────────────
function CaptionText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  const parts = text.split(/(#\w+|@\w+)/g)
  const rendered = (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('#')) return <Link key={i} href={`/explore/tags/${part.slice(1)}`} className="ig-hashtag">{part}</Link>
        if (part.startsWith('@')) return <Link key={i} href={`/${part.slice(1)}`} className="ig-hashtag">{part}</Link>
        return <span key={i}>{part}</span>
      })}
    </span>
  )
  if (text.length <= 125 || expanded) return rendered
  const shortParts = text.slice(0, 125).split(/(#\w+|@\w+)/g)
  return (
    <span>
      {shortParts.map((part, i) => {
        if (part.startsWith('#') || part.startsWith('@')) return <span key={i} className="ig-hashtag">{part}</span>
        return <span key={i}>{part}</span>
      })}
      {'… '}
      <button className="text-muted-foreground font-normal" onClick={() => setExpanded(true)}>more</button>
    </span>
  )
}
