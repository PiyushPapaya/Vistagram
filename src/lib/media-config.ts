/**
 * Single source of truth for media sizing + auto-scroll / auto-advance tuning.
 * Change these constants to re-tune the whole app — nothing is hard-coded elsewhere.
 */

/* ── Fixed, consistent media sizing (no random sizes) ──────────────────────── */
export const MEDIA = {
  /** Feed post media ratio (CSS `aspect-ratio`, width / height). 4:5 portrait, like IG. */
  POST_ASPECT_RATIO: '4 / 5',
  /** Reels ratio. 9:16 vertical. */
  REEL_ASPECT_RATIO: '9 / 16',
  /** Center feed column width (px). */
  FEED_MAX_WIDTH: 470,
} as const

/* ── Home-feed auto-scroll (per content type) ──────────────────────────────── */
export const AUTOSCROLL = {
  /** Single-photo post: dwell before advancing to the next post (ms). */
  PHOTO_DWELL: 10000,
  /** Carousel post: time spent on EACH image, including the last (ms). */
  SLIDE_INTERVAL: 3000,
  /** Carousel post: extra pause after the last image, before advancing (ms). */
  SLIDE_END_HOLD: 1000,
  /** Video post: pause after the video ENDS, before advancing (ms). */
  POST_VIDEO_HOLD: 1000,
  /** Resume auto-scroll this long after the user interacts (ms). */
  RESUME_DELAY_MS: 3000,
} as const

/* ── Reels auto-advance ────────────────────────────────────────────────────── */
export const REELS_CFG = {
  /** Resume auto-advance this long after a manual interaction (ms). */
  RESUME_DELAY_MS: 3000,
} as const

/* ── Accepted drop-in file types ───────────────────────────────────────────── */
export const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'] as const
export const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.m4v', '.ogv'] as const
