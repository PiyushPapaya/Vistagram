import {
  GENERATED_POSTS,
  GENERATED_REELS,
  MEDIA_IMAGES,
} from './generated-media'

export type User = {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
  website?: string
  is_private: boolean
  is_verified: boolean
  followers_count: number
  following_count: number
  posts_count: number
  plan: 'free' | 'plus'
}

export type Post = {
  id: string
  author_id: string
  type: 'image' | 'carousel' | 'reel'
  images: string[]
  video_url?: string   // set for type === 'reel' feed posts
  caption: string
  location?: string
  likes_count: number
  comments_count: number
  plays_count?: number // for video/reel posts
  created_at: string
  is_pinned?: boolean
  aspect_ratio: '1:1' | '4:5' | '1.91:1'
}

export type Comment = {
  id: string
  post_id: string
  author_id: string
  text: string
  likes_count: number
  created_at: string
  replies?: Comment[]
}

export type Story = {
  id: string
  author_id: string
  media_url: string
  type: 'image' | 'video'
  created_at: string
  expires_at: string
  is_close_friends?: boolean
}

export type Reel = {
  id: string
  author_id: string
  video_url: string
  poster_url: string
  caption: string
  audio: string
  likes_count: number
  comments_count: number
  plays_count: number
  created_at: string
}

export type DmThread = {
  id: string
  participant_ids: string[]
  is_group: boolean
  name?: string
  last_message: string
  last_message_time: string
  unread_count: number
  messages: DmMessage[]
}

export type DmMessage = {
  id: string
  thread_id: string
  sender_id: string
  text?: string
  media_url?: string
  created_at: string
  reactions?: { emoji: string; user_id: string }[]
}

export type Notification = {
  id: string
  type: 'like' | 'comment' | 'follow' | 'follow_request' | 'mention' | 'tag'
  actor_id: string
  post_id?: string
  text: string
  created_at: string
  read: boolean
}

export type Note = {
  id: string
  user_id: string
  text: string
  created_at: string
}

/* ── Users ─────────────────────────────────────────────── */
export const USERS: User[] = [
  {
    id: 'u1', username: 'leonie.hanne', full_name: 'Leonie Hanne',
    bio: '✨ Fashion & travel\n📍 based between Europe & everywhere\nbusiness: team@leoniehanne.com',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    website: 'https://leoniehanne.com', is_private: false, is_verified: true,
    followers_count: 4_300_000, following_count: 689, posts_count: 47, plan: 'plus',
  },
  {
    id: 'u2', username: 'nara.smith', full_name: 'Nara Smith',
    bio: 'wife & mama 🤍 making everything from scratch',
    avatar_url: 'https://i.pravatar.cc/150?img=5',
    is_private: false, is_verified: true,
    followers_count: 11_200_000, following_count: 240, posts_count: 134, plan: 'plus',
  },
  {
    id: 'u3', username: 'samira.safi', full_name: 'Samira Safi',
    bio: '🌿 lifestyle & slow living | Munich',
    avatar_url: 'https://i.pravatar.cc/150?img=16',
    is_private: false, is_verified: true,
    followers_count: 612_000, following_count: 412, posts_count: 287, plan: 'plus',
  },
  {
    id: 'u4', username: 'malu.borges', full_name: 'Malu Borges',
    bio: 'beauty & moda 💄 | São Paulo 🇧🇷',
    avatar_url: 'https://i.pravatar.cc/150?img=20',
    is_private: false, is_verified: true,
    followers_count: 2_100_000, following_count: 530, posts_count: 92, plan: 'plus',
  },
  {
    id: 'u5', username: 'isobel.lorna', full_name: 'Isobel Lorna',
    bio: '✈️ travel diaries | the world is my office',
    avatar_url: 'https://i.pravatar.cc/150?img=9',
    website: 'https://isobellorna.com',
    is_private: false, is_verified: true,
    followers_count: 845_000, following_count: 1200, posts_count: 403, plan: 'plus',
  },
  {
    id: 'u6', username: 'blanca.arimany', full_name: 'Blanca Arimany',
    bio: 'creative & contemporary style | Barcelona',
    avatar_url: 'https://i.pravatar.cc/150?img=23',
    is_private: false, is_verified: false,
    followers_count: 318_000, following_count: 270, posts_count: 58, plan: 'plus',
  },
  {
    id: 'u7', username: 'kyla.ryan', full_name: 'Kyla Ryan',
    bio: '☕️ everyday moments & cosy corners',
    avatar_url: 'https://i.pravatar.cc/150?img=10',
    website: 'https://kylaryan.co',
    is_private: false, is_verified: false,
    followers_count: 87_400, following_count: 780, posts_count: 211, plan: 'free',
  },
  {
    id: 'u8', username: 'sam.todd', full_name: 'Sam Todd',
    bio: 'menswear & city life 🏙️ | London',
    avatar_url: 'https://i.pravatar.cc/150?img=12',
    is_private: false, is_verified: false,
    followers_count: 54_300, following_count: 345, posts_count: 31, plan: 'free',
  },
  {
    id: 'u9', username: 'pauline.kulka', full_name: 'Pauline Kulka',
    bio: '🎨 art direction & visuals | Berlin',
    avatar_url: 'https://i.pravatar.cc/150?img=24',
    is_private: false, is_verified: false,
    followers_count: 129_000, following_count: 420, posts_count: 76, plan: 'plus',
  },
  {
    id: 'u10', username: 'olivia.yang', full_name: 'Olivia Yang',
    bio: '🌊 sun, sea & slow weekends | LA',
    avatar_url: 'https://i.pravatar.cc/150?img=27',
    is_private: false, is_verified: false,
    followers_count: 233_000, following_count: 190, posts_count: 44, plan: 'plus',
  },
  {
    id: 'u11', username: 'veronika.marfynets', full_name: 'Veronika Marfynets',
    bio: 'fashion editor 🤍 | Paris ↔ Kyiv',
    avatar_url: 'https://i.pravatar.cc/150?img=29',
    website: 'https://veronikamarfynets.com',
    is_private: false, is_verified: true,
    followers_count: 498_000, following_count: 340, posts_count: 118, plan: 'plus',
  },
  {
    id: 'u12', username: 'aurelie.bouti', full_name: 'Aurelie Bouti',
    bio: '💐 style & little luxuries | Côte d’Azur',
    avatar_url: 'https://i.pravatar.cc/150?img=32',
    is_private: false, is_verified: false,
    followers_count: 76_900, following_count: 610, posts_count: 89, plan: 'free',
  },
  {
    id: 'u13', username: 'polina.gorodnova', full_name: 'Polina Gorodnova',
    bio: '🤍 minimal style & travel | currently: everywhere',
    avatar_url: 'https://i.pravatar.cc/150?img=44',
    is_private: false, is_verified: false,
    followers_count: 162_000, following_count: 295, posts_count: 71, plan: 'plus',
  },
]

export const CURRENT_USER_ID = 'u1'
export const getCurrentUser = () => USERS.find(u => u.id === CURRENT_USER_ID)!
export const getUserById = (id: string) => USERS.find(u => u.id === id)
export const getUserByUsername = (username: string) => USERS.find(u => u.username === username)

/* ── Real media weaving ────────────────────────────────────
 * Content is generated from `videos_phots/` by scripts/generate-media.mjs into
 * `generated-media.ts`. Here we attach it to the demo users (avatars, stories,
 * posts, reels) so every surface shows the real files. When the folder is empty
 * the original placeholder values are kept so the app still runs. */

// Distribute authored content so the feed (followed users) and the current
// user's profile both fill up first, then spread across everyone else.
const AUTHOR_POOL = ['u1', 'u3', 'u2', 'u4', 'u5', 'u6', 'u7', 'u9', 'u10', 'u8', 'u11', 'u12', 'u13']

// Swap demo avatars for real images (deterministic, spread across the pool).
if (MEDIA_IMAGES.length > 0) {
  USERS.forEach((u, i) => {
    u.avatar_url = MEDIA_IMAGES[(i * 3 + 1) % MEDIA_IMAGES.length]
  })
}

// Resolve an optional sidecar `username` hint to a real user id; otherwise spread
// content across the author pool so every profile / the feed stay populated.
const USERNAME_TO_ID = new Map(USERS.map(u => [u.username, u.id]))
const resolveAuthor = (username: string | undefined, i: number) =>
  (username && USERNAME_TO_ID.get(username)) || AUTHOR_POOL[i % AUTHOR_POOL.length]

const GENERATED_FEED: Post[] = GENERATED_POSTS.map(({ username, ...p }, i) => ({
  ...p,
  author_id: resolveAuthor(username, i),
}))
const GENERATED_FEED_REELS: Reel[] = GENERATED_REELS.map(({ username, ...r }, i) => ({
  ...r,
  author_id: resolveAuthor(username, i),
}))

/** Generated feed posts (with authors) — consumed directly by the home feed. */
export const GENERATED_FEED_POSTS = GENERATED_FEED

/* ── Posts ─────────────────────────────────────────────── */


/** Every post comes from `videos_phots/` (generated-media) — no demo filler. */
export const POSTS: Post[] = [...GENERATED_FEED]

export const getPostsByUser = (userId: string) => POSTS.filter(p => p.author_id === userId)
export const getFeedPosts = (followingIds: string[]) =>
  POSTS.filter(p => followingIds.includes(p.author_id)).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

/* ── Comments ──────────────────────────────────────────── */
export const COMMENTS: Comment[] = [
  { id: 'c1', post_id: 'gen-post-0', author_id: 'u1', text: 'This shot is incredible 😍', likes_count: 12, created_at: '2026-06-06T02:00:00Z' },
  { id: 'c2', post_id: 'gen-post-0', author_id: 'u4', text: 'The atmosphere in this photo is unreal', likes_count: 8, created_at: '2026-06-06T02:30:00Z' },
  { id: 'c3', post_id: 'gen-post-0', author_id: 'u9', text: '🔥🔥🔥', likes_count: 3, created_at: '2026-06-06T03:00:00Z' },
  { id: 'c4', post_id: 'gen-post-0', author_id: 'u1', text: 'Middle one for sure! The light is perfect', likes_count: 22, created_at: '2026-06-05T19:00:00Z' },
  { id: 'c5', post_id: 'gen-post-0', author_id: 'u5', text: 'Absolutely breathtaking series 🏔️', likes_count: 15, created_at: '2026-06-05T19:30:00Z' },
  { id: 'c6', post_id: 'gen-post-26', author_id: 'u3', text: 'I still dream about this trip', likes_count: 45, created_at: '2026-06-05T10:00:00Z' },
  { id: 'c7', post_id: 'gen-post-3', author_id: 'u2', text: 'Can you please just come cook for me 🙏', likes_count: 31, created_at: '2026-06-04T13:00:00Z' },
  { id: 'c8', post_id: 'gen-post-4', author_id: 'u6', text: 'The detail in panel 3 is insane! How long did that take?', likes_count: 18, created_at: '2026-06-03T16:00:00Z' },
]

export const getCommentsByPost = (postId: string) => COMMENTS.filter(c => c.post_id === postId)

/* ── Stories ───────────────────────────────────────────── */
export const STORIES: Story[] = [
  { id: 's1', author_id: 'u2', media_url: 'https://picsum.photos/seed/story1/420/745', type: 'image', created_at: '2026-06-06T04:00:00Z', expires_at: '2026-06-07T04:00:00Z' },
  { id: 's2', author_id: 'u2', media_url: 'https://picsum.photos/seed/story2/420/745', type: 'image', created_at: '2026-06-06T05:00:00Z', expires_at: '2026-06-07T05:00:00Z' },
  { id: 's3', author_id: 'u3', media_url: 'https://picsum.photos/seed/story3/420/745', type: 'image', created_at: '2026-06-06T06:00:00Z', expires_at: '2026-06-07T06:00:00Z' },
  { id: 's4', author_id: 'u4', media_url: 'https://picsum.photos/seed/story4/420/745', type: 'image', created_at: '2026-06-06T07:00:00Z', expires_at: '2026-06-07T07:00:00Z' },
  { id: 's5', author_id: 'u4', media_url: 'https://picsum.photos/seed/story5/420/745', type: 'image', created_at: '2026-06-06T08:00:00Z', expires_at: '2026-06-07T08:00:00Z' },
  { id: 's6', author_id: 'u5', media_url: 'https://picsum.photos/seed/story6/420/745', type: 'image', created_at: '2026-06-06T09:00:00Z', expires_at: '2026-06-07T09:00:00Z' },
  { id: 's7', author_id: 'u7', media_url: 'https://picsum.photos/seed/story7/420/745', type: 'image', created_at: '2026-06-06T10:00:00Z', expires_at: '2026-06-07T10:00:00Z' },
  { id: 's8', author_id: 'u7', media_url: 'https://picsum.photos/seed/story8/420/745', type: 'image', created_at: '2026-06-06T10:30:00Z', expires_at: '2026-06-07T10:30:00Z' },
  { id: 's9', author_id: 'u9', media_url: 'https://picsum.photos/seed/story9/420/745', type: 'image', created_at: '2026-06-06T11:00:00Z', expires_at: '2026-06-07T11:00:00Z' },
  { id: 's10', author_id: 'u10', media_url: 'https://picsum.photos/seed/story10/420/745', type: 'image', created_at: '2026-06-06T11:30:00Z', expires_at: '2026-06-07T11:30:00Z' },
  { id: 's11', author_id: 'u12', media_url: 'https://picsum.photos/seed/story11/420/745', type: 'image', created_at: '2026-06-06T12:00:00Z', expires_at: '2026-06-07T12:00:00Z' },
  // Alice's own story
  { id: 's12', author_id: 'u1', media_url: 'https://picsum.photos/seed/story12/420/745', type: 'image', created_at: '2026-06-06T13:00:00Z', expires_at: '2026-06-07T13:00:00Z', is_close_friends: false },
]

// Use real images for story media (cycle through the pool).
if (MEDIA_IMAGES.length > 0) {
  STORIES.forEach((s, i) => {
    s.media_url = MEDIA_IMAGES[(i * 2) % MEDIA_IMAGES.length]
    s.type = 'image'
  })
}

export const getStoriesByUser = (userId: string) => STORIES.filter(s => s.author_id === userId)
export const getStoryAuthors = () => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const s of STORIES) {
    if (!seen.has(s.author_id)) { seen.add(s.author_id); result.push(s.author_id) }
  }
  return result
}

/* ── Reels ─────────────────────────────────────────────── */


/** All reels: real generated reels first, demo reels behind them. */
export const REELS: Reel[] = [...GENERATED_FEED_REELS]

/* ── DM Threads ────────────────────────────────────────── */
export const DM_THREADS: DmThread[] = [
  {
    id: 't1', participant_ids: ['u1', 'u2'], is_group: false,
    last_message: 'That shot is amazing, which lens?', last_message_time: '2026-06-06T10:30:00Z', unread_count: 2,
    messages: [
      { id: 'm1', thread_id: 't1', sender_id: 'u2', text: 'Hey! Love your Barcelona shots 📸', created_at: '2026-06-06T09:00:00Z' },
      { id: 'm2', thread_id: 't1', sender_id: 'u1', text: 'Thanks Bob! That trip was incredible', created_at: '2026-06-06T09:05:00Z' },
      { id: 'm3', thread_id: 't1', sender_id: 'u2', text: 'That shot is amazing, which lens?', created_at: '2026-06-06T10:30:00Z' },
    ],
  },
  {
    id: 't2', participant_ids: ['u1', 'u3'], is_group: false,
    last_message: 'See you there! 🙌', last_message_time: '2026-06-05T18:00:00Z', unread_count: 0,
    messages: [
      { id: 'm4', thread_id: 't2', sender_id: 'u3', text: 'Are you going to the photo walk on Saturday?', created_at: '2026-06-05T17:30:00Z' },
      { id: 'm5', thread_id: 't2', sender_id: 'u1', text: 'Yes! Can\'t wait 🎉', created_at: '2026-06-05T17:45:00Z' },
      { id: 'm6', thread_id: 't2', sender_id: 'u3', text: 'See you there! 🙌', created_at: '2026-06-05T18:00:00Z' },
    ],
  },
  {
    id: 't3', participant_ids: ['u1', 'u5', 'u7'], is_group: true, name: 'Travel crew 🌍',
    last_message: 'Next trip: Morocco?', last_message_time: '2026-06-04T20:00:00Z', unread_count: 5,
    messages: [
      { id: 'm7', thread_id: 't3', sender_id: 'u5', text: 'Next trip: Morocco?', created_at: '2026-06-04T20:00:00Z' },
      { id: 'm8', thread_id: 't3', sender_id: 'u7', text: 'YES 🙌 I\'ve been wanting to go for years', created_at: '2026-06-04T20:05:00Z' },
    ],
  },
  {
    id: 't4', participant_ids: ['u1', 'u9'], is_group: false,
    last_message: '❤️', last_message_time: '2026-06-03T15:00:00Z', unread_count: 0,
    messages: [
      { id: 'm9', thread_id: 't4', sender_id: 'u9', text: 'Just saw your story! Love the new series', created_at: '2026-06-03T14:00:00Z' },
      { id: 'm10', thread_id: 't4', sender_id: 'u1', text: 'Means so much coming from you! Your art is incredible', created_at: '2026-06-03T14:30:00Z' },
      { id: 'm11', thread_id: 't4', sender_id: 'u9', text: '❤️', created_at: '2026-06-03T15:00:00Z' },
    ],
  },
]

export const getDmThread = (id: string) => DM_THREADS.find(t => t.id === id)

/* ── Notifications ─────────────────────────────────────── */
export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like', actor_id: 'u3', post_id: 'gen-post-0', text: 'liked your photo.', created_at: '2026-06-06T11:00:00Z', read: false },
  { id: 'n2', type: 'comment', actor_id: 'u2', post_id: 'gen-post-0', text: 'commented: "Stunning as always 🔥"', created_at: '2026-06-06T10:30:00Z', read: false },
  { id: 'n3', type: 'follow', actor_id: 'u4', text: 'started following you.', created_at: '2026-06-06T09:00:00Z', read: false },
  { id: 'n4', type: 'like', actor_id: 'u5', post_id: 'gen-post-26', text: 'liked your photo.', created_at: '2026-06-05T20:00:00Z', read: true },
  { id: 'n5', type: 'comment', actor_id: 'u7', post_id: 'gen-post-26', text: 'commented: "I need to go to Sitges 😍"', created_at: '2026-06-05T18:00:00Z', read: true },
  { id: 'n6', type: 'follow', actor_id: 'u9', text: 'started following you.', created_at: '2026-06-05T15:00:00Z', read: true },
  { id: 'n7', type: 'like', actor_id: 'u10', post_id: 'gen-post-0', text: 'liked your photo.', created_at: '2026-06-04T12:00:00Z', read: true },
  { id: 'n8', type: 'mention', actor_id: 'u2', post_id: 'gen-post-26', text: 'mentioned you in a comment.', created_at: '2026-06-03T16:00:00Z', read: true },
  { id: 'n9', type: 'follow', actor_id: 'u6', text: 'started following you.', created_at: '2026-06-02T10:00:00Z', read: true },
  { id: 'n10', type: 'like', actor_id: 'u12', post_id: 'gen-post-26', text: 'liked your photo.', created_at: '2026-06-01T20:00:00Z', read: true },
]

/* ── Notes ─────────────────────────────────────────────── */
export const NOTES: Note[] = [
  { id: 'note1', user_id: 'u2', text: 'Just discovered this view 👁️', created_at: '2026-06-06T06:00:00Z' },
  { id: 'note2', user_id: 'u5', text: 'Exploring Lisbon today ✈️', created_at: '2026-06-06T07:00:00Z' },
  { id: 'note3', user_id: 'u7', text: 'Testing new recipes 🍜', created_at: '2026-06-06T08:00:00Z' },
  { id: 'note4', user_id: 'u12', text: 'Last show tonight 🎸', created_at: '2026-06-06T09:00:00Z' },
]

/* ── Helpers ───────────────────────────────────────────── */
export function relativeTime(dateStr: string): string {
  const now = new Date()
  const then = new Date(dateStr)
  const secs = Math.floor((now.getTime() - then.getTime()) / 1000)
  if (secs < 60) return `${secs}s`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w`
  return `${Math.floor(days / 30)}mo`
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

// Default follows: alice follows u2-u7
export const DEFAULT_FOLLOWING = ['u2', 'u3', 'u4', 'u5', 'u6', 'u7']
export const DEFAULT_LIKED_POSTS: string[] = ['gen-post-3', 'gen-post-4']
export const DEFAULT_SAVED_POSTS: string[] = ['gen-post-0', 'gen-post-6']
