'use client'

import { useEffect, useRef, useState } from 'react'
import type { Post } from '@/lib/mock-data'
import { AUTOSCROLL } from '@/lib/media-config'
import { cn } from '@/lib/utils'

/**
 * Explore-grid media cell. Unlike the static profile thumbnail, this one is
 * "alive" like real Instagram Explore:
 *   • single image  → shown as-is
 *   • carousel       → auto-cycling slideshow (cross-fades when on-screen)
 *   • video / reel   → autoplays muted + looped while visible, pauses off-screen
 * All work is gated by an IntersectionObserver so off-screen cells cost nothing.
 */
export function ExploreMedia({ post, className }: { post: Post; className?: string }) {
  const cls = className ?? 'h-full w-full object-cover'
  const isVideo = post.type === 'reel' && !!post.video_url

  if (isVideo) return <ExploreVideo post={post} className={cls} />
  if (post.images.length > 1) return <ExploreSlideshow images={post.images} className={cls} />
  return <img src={post.images[0]} alt="" className={cls} loading="lazy" draggable={false} />
}

function ExploreVideo({ post, className }: { post: Post; className: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.4) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: [0, 0.4, 0.75] }
    )
    obs.observe(v)
    return () => obs.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={post.video_url}
      poster={post.images[0] || undefined}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  )
}

function ExploreSlideshow({ images, className }: { images: string[]; className: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting && e.intersectionRatio >= 0.3),
      { threshold: [0, 0.3] }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || images.length < 2) return
    const t = setInterval(
      () => setIdx(i => (i + 1) % images.length),
      AUTOSCROLL.SLIDE_INTERVAL
    )
    return () => clearInterval(t)
  }, [visible, images.length])

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          draggable={false}
          className={cn(
            className,
            'absolute inset-0 transition-opacity duration-700 ease-in-out',
            i === idx ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}
    </div>
  )
}
