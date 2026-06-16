'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Image that reserves its box (parent supplies the aspect-ratio), shows a shimmer
 * skeleton until the bytes paint, then fades in — so media never flashes a blank
 * black box and never shifts layout. Decodes off the main thread and lets callers
 * mark the first/above-the-fold image as high priority.
 *
 * The parent MUST be `position: relative` (the shimmer + image are absolutely
 * positioned to fill it).
 */
export function FadeImage({
  src,
  alt = '',
  className,
  eager,
  priority,
  draggable = false,
  onLoad,
}: {
  src: string
  alt?: string
  className?: string
  /** Load immediately instead of lazily (use for the first visible frame). */
  eager?: boolean
  /** Hint the browser to fetch this ahead of other images. */
  priority?: boolean
  draggable?: boolean
  onLoad?: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // If the image is already in the browser cache it can be `complete` before
  // React attaches onLoad — surface that synchronously so we never get stuck
  // on the shimmer for a cached frame.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true)
      onLoad?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  return (
    <>
      {!loaded && <div className="absolute inset-0 media-shimmer" aria-hidden />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={draggable}
        onLoad={() => {
          setLoaded(true)
          onLoad?.()
        }}
        className={cn(
          'absolute inset-0 h-full w-full object-cover object-center select-none media-fade',
          loaded && 'is-loaded',
          className,
        )}
      />
    </>
  )
}
