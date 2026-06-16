import type { Post } from '@/lib/mock-data'

/**
 * Thumbnail for a post inside a grid (explore / profile). Renders the first image
 * for photo & carousel posts, or a first-frame <video> for video posts that have
 * no poster image (generated video posts), so every cell shows real media.
 */
export function GridMedia({ post, className }: { post: Post; className?: string }) {
  const cls = className ?? 'h-full w-full object-cover'
  const isVideo = post.type === 'reel' && !!post.video_url
  const firstImage = post.images[0]

  if (isVideo && !firstImage) {
    return (
      <video
        src={`${post.video_url}#t=0.1`}
        muted
        playsInline
        preload="metadata"
        className={cls}
      />
    )
  }

  return <img src={firstImage} alt="" className={cls} loading="lazy" />
}
