// @ts-check
/**
 * Drop-in media generator (build + dev time).
 *
 * Reads every image/video in `videos_phots/`, copies them into `public/media/feed/`
 * with clean ASCII filenames (incremental — unchanged files are skipped), groups
 * numbered images into ordered carousels, and writes `src/lib/generated-media.ts`.
 *
 * Run automatically via the `predev` / `prebuild` npm scripts, so simply adding or
 * removing a file in `videos_phots/` and restarting `npm run dev` (or rebuilding)
 * is enough — there is no per-file database entry.
 *
 * ── Naming convention ────────────────────────────────────────────────────────
 *   Numbered images that share a base name form ONE carousel post, ordered by
 *   number. All of these group together:
 *       sunset.jpg  sunset1.jpg  sunset_2.jpg  sunset-3.jpg  "sunset 4.jpg"
 *       cannes.jpg  "cannes (1).jpg"  "cannes (2).jpg"
 *   The un-numbered file (no trailing number) sorts first.
 *   A unique / standalone image  → single-image post.
 *   Any video file               → its own video post (and reel). Accidental
 *                                  duplicates that share a base name are de-duped.
 */

import { promises as fs } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { existsSync } from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
// Source folder: prefer `videos_phots` (legacy name), fall back to the correctly
// spelled `videos_photos` — whichever exists. Add files to either and they're scanned.
const SRC_DIR = ['videos_phots', 'videos_photos']
  .map((d) => path.join(ROOT, d))
  .find((p) => existsSync(p)) ?? path.join(ROOT, 'videos_phots')
const DEST_DIR = path.join(ROOT, 'public', 'media', 'feed')
const OUT_FILE = path.join(ROOT, 'src', 'lib', 'generated-media.ts')

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']
const VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.m4v', '.ogv']

// Fixed clock anchor so the generated file is byte-stable across rebuilds (no
// git churn from `Date.now()`); posts are still spaced an hour apart.
const BASE_TIME = Date.parse('2026-06-17T12:00:00.000Z')

const extOf = (f) => path.extname(f).toLowerCase()
const isImage = (f) => IMAGE_EXTS.includes(extOf(f))
const isVideo = (f) => VIDEO_EXTS.includes(extOf(f))

/** Stable non-negative hash for deterministic placeholder values. */
function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Short, collision-resistant hex tag for a string. */
function shortHash(s) {
  return createHash('sha1').update(s).digest('hex').slice(0, 6)
}

/** ASCII, URL-safe slug (drops emojis / punctuation, collapses to dashes). */
function slugify(s) {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 48)
    .replace(/-+$/g, '') || 'media'
}

/**
 * Split a base filename (no extension) into its grouping key + slide number.
 * Handles trailing `name1`, `name_1`, `name-1`, `name 1`, and `name (1)`.
 * Un-numbered files get number 0 so they sort first.
 */
function parseBase(base) {
  const m = base.match(/^(.*?)[\s._-]*(?:\((\d+)\)|(\d+))\s*$/)
  if (m && (m[2] !== undefined || m[3] !== undefined)) {
    const num = parseInt(m[2] ?? m[3], 10)
    const groupBase = m[1].replace(/[\s._-]+$/, '').trim()
    return { groupBase: groupBase || base, num }
  }
  return { groupBase: base.replace(/[\s._-]+$/, '').trim() || base, num: 0 }
}

/** Caption = the real (download) filename, just tidied of trailing separators. */
function cleanCaption(groupBase) {
  const c = groupBase.replace(/[\s._-]+$/, '').trim()
  return c || 'New post'
}

async function listSource() {
  try {
    const files = await fs.readdir(SRC_DIR)
    return files.filter((f) => isImage(f) || isVideo(f)).sort((a, b) => a.localeCompare(b))
  } catch {
    return []
  }
}

/**
 * Optional sidecar override file: `<source folder>/media.json`.
 * Maps a file → display metadata so you can pin a real author/caption/likes:
 *
 *   {
 *     "cannes-loading": { "username": "leonie.hanne", "caption": "Cannes 🎬", "likes": 48200 },
 *     "moody day in lake como.jpg": { "username": "samira.safi" }
 *   }
 *
 * A key may be: the exact source filename, the filename without extension, the
 * group base, or that base slugified — all are matched (case-insensitively), so
 * you don't have to think about how files get grouped/renamed.
 */
async function loadSidecar() {
  const lookup = new Map()
  for (const name of ['media.json', 'metadata.json']) {
    try {
      const raw = await fs.readFile(path.join(SRC_DIR, name), 'utf8')
      const json = JSON.parse(raw)
      for (const [key, val] of Object.entries(json)) {
        if (val && typeof val === 'object') lookup.set(key.toLowerCase(), val)
      }
    } catch {
      /* no sidecar — fine */
    }
  }
  return lookup
}

/** Resolve a sidecar override for a group, trying every reasonable key form. */
function resolveOverride(sidecar, groupBase, firstSrcName) {
  if (sidecar.size === 0) return undefined
  const ext = extOf(firstSrcName)
  const candidates = [
    firstSrcName,
    firstSrcName.slice(0, firstSrcName.length - ext.length),
    groupBase,
    slugify(groupBase),
  ]
  for (const c of candidates) {
    const hit = sidecar.get(String(c).toLowerCase())
    if (hit) return hit
  }
  return undefined
}

/** Copy a source file into public/media/feed (skip if same size already there). */
async function ensureCopied(srcName, destName) {
  const src = path.join(SRC_DIR, srcName)
  const dest = path.join(DEST_DIR, destName)
  const srcStat = await fs.stat(src)
  try {
    const destStat = await fs.stat(dest)
    if (destStat.size === srcStat.size) return // already up to date
  } catch {
    /* dest missing — copy below */
  }
  await fs.copyFile(src, dest)
}

async function main() {
  const files = await listSource()
  const sidecar = await loadSidecar()
  await fs.mkdir(DEST_DIR, { recursive: true })

  // Optional: tiny blurred placeholders (LQIP) embedded as data URLs so feed /
  // grid images paint an instant low-res preview that sharpens in, instead of a
  // blank box. Sharp ships with Next, so this normally runs; if it's somehow
  // missing we just skip blur and the UI falls back to the shimmer skeleton.
  let sharp = null
  try { sharp = (await import('sharp')).default } catch { /* no sharp — skip blur */ }
  /** @type {Record<string, string>} */
  const blurMap = {}

  /** @type {Map<string, { kind: 'image'|'video', groupBase: string, items: {num:number, srcName:string, destName:string, url:string}[] }>} */
  const groups = new Map()

  for (const srcName of files) {
    const ext = extOf(srcName)
    const base = srcName.slice(0, srcName.length - ext.length)
    const kind = isVideo(srcName) ? 'video' : 'image'
    const { groupBase, num } = parseBase(base)
    const key = `${kind}:${slugify(groupBase)}:${shortHash(groupBase.toLowerCase())}`

    const groupSlug = slugify(groupBase)
    const tag = shortHash(groupBase.toLowerCase())
    const destName = `${groupSlug}-${tag}-${String(num).padStart(2, '0')}${ext}`
    const url = `/media/feed/${destName}`

    await ensureCopied(srcName, destName)

    if (sharp && kind === 'image') {
      try {
        const buf = await sharp(path.join(SRC_DIR, srcName))
          .rotate()                              // honour EXIF orientation
          .resize(24, 24, { fit: 'inside' })     // ~24px longest edge
          .webp({ quality: 40 })
          .toBuffer()
        blurMap[url] = `data:image/webp;base64,${buf.toString('base64')}`
      } catch { /* skip this one — falls back to shimmer */ }
    }

    if (!groups.has(key)) groups.set(key, { kind, groupBase, items: [] })
    groups.get(key).items.push({ num, srcName, destName, url })
  }

  // Stable group order (by first source filename) so output is deterministic.
  const ordered = [...groups.values()].sort((a, b) =>
    a.items[0].srcName.localeCompare(b.items[0].srcName)
  )

  /** @type {object[]} */
  const posts = []
  /** @type {object[]} */
  const reels = []
  /** @type {string[]} */
  const imagePool = []

  let idx = 0
  for (const g of ordered) {
    g.items.sort((x, y) => x.num - y.num)
    const seed = hashStr(g.groupBase)
    const ov = resolveOverride(sidecar, g.groupBase, g.items[0].srcName) ?? {}
    const caption = typeof ov.caption === 'string' ? ov.caption : cleanCaption(g.groupBase)
    const username = typeof ov.username === 'string' ? ov.username : undefined
    const likes = Number.isFinite(ov.likes) ? Number(ov.likes) : 120 + (seed % 9000)
    const createdAt = new Date(BASE_TIME - idx * 3_600_000).toISOString()

    if (g.kind === 'image') {
      const images = g.items.map((it) => it.url)
      imagePool.push(...images)
      posts.push({
        id: `gen-post-${idx}`,
        type: images.length > 1 ? 'carousel' : 'image',
        username,
        images,
        caption,
        likes_count: likes,
        comments_count: 5 + (seed % 220),
        created_at: createdAt,
        aspect_ratio: '4:5',
      })
    } else {
      // Each video → one post (de-duped within a base name) + one reel.
      const url = g.items[0].url
      posts.push({
        id: `gen-post-${idx}`,
        type: 'reel',
        username,
        images: [],
        video_url: url,
        caption,
        likes_count: likes,
        comments_count: 5 + (seed % 220),
        plays_count: 1000 + (seed % 90000),
        created_at: createdAt,
        aspect_ratio: '4:5',
      })
      reels.push({
        id: `gen-reel-${idx}`,
        username,
        video_url: url,
        poster_url: '',
        caption,
        audio: 'Original audio',
        likes_count: Number.isFinite(ov.likes) ? Number(ov.likes) : 500 + (seed % 30000),
        comments_count: 10 + (seed % 500),
        plays_count: 2000 + (seed % 200000),
        created_at: createdAt,
      })
    }
    idx++
  }

  const banner =
    '// AUTO-GENERATED by scripts/generate-media.mjs — do not edit by hand.\n' +
    '// Regenerated on `npm run dev` / `npm run build` (predev / prebuild hooks).\n'

  const body =
    banner +
    '\n' +
    'export type GenPost = {\n' +
    "  id: string\n  type: 'image' | 'carousel' | 'reel'\n  username?: string\n  images: string[]\n  video_url?: string\n" +
    '  caption: string\n  likes_count: number\n  comments_count: number\n  plays_count?: number\n' +
    "  created_at: string\n  aspect_ratio: '1:1' | '4:5' | '1.91:1'\n}\n\n" +
    'export type GenReel = {\n' +
    '  id: string\n  username?: string\n  video_url: string\n  poster_url: string\n  caption: string\n  audio: string\n' +
    '  likes_count: number\n  comments_count: number\n  plays_count: number\n  created_at: string\n}\n\n' +
    `export const GENERATED_AVAILABLE = ${posts.length > 0 || reels.length > 0}\n\n` +
    `export const GENERATED_POSTS: GenPost[] = ${JSON.stringify(posts, null, 2)}\n\n` +
    `export const GENERATED_REELS: GenReel[] = ${JSON.stringify(reels, null, 2)}\n\n` +
    `export const MEDIA_IMAGES: string[] = ${JSON.stringify(imagePool, null, 2)}\n\n` +
    '/** Tiny blurred data-URL placeholder per image url (LQIP). */\n' +
    `export const MEDIA_BLUR: Record<string, string> = ${JSON.stringify(blurMap, null, 2)}\n`

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true })
  await fs.writeFile(OUT_FILE, body, 'utf8')

  const imgGroups = ordered.filter((g) => g.kind === 'image').length
  const vidGroups = ordered.filter((g) => g.kind === 'video').length
  console.log(
    `[generate-media] ${files.length} source files → ${imgGroups} image post(s) ` +
      `(${imagePool.length} images), ${vidGroups} video(s). Wrote ${path.relative(ROOT, OUT_FILE)}.`
  )
}

main().catch((err) => {
  console.error('[generate-media] failed:', err)
  process.exit(1)
})
