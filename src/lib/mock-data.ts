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
const MOCK_POSTS: Post[] = [
  {
    id: 'p1', author_id: 'u2', type: 'image',
    images: ['https://picsum.photos/seed/post1/630/787'],
    caption: 'Streets of Shinjuku at 2am 🌙 The city never truly sleeps #tokyo #streetphotography #nightlife',
    location: 'Shinjuku, Tokyo', likes_count: 847, comments_count: 23, created_at: '2026-06-06T01:30:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p2', author_id: 'u3', type: 'carousel',
    images: [
      'https://picsum.photos/seed/post2a/630/787',
      'https://picsum.photos/seed/post2b/630/787',
      'https://picsum.photos/seed/post2c/630/787',
    ],
    caption: 'Golden hour in the mountains 🏔️ three frames, one perfect evening. Which one is your fav? #landscape #nature #goldenhour',
    location: 'Dolomites, Italy', likes_count: 4210, comments_count: 89, created_at: '2026-06-05T18:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p3', author_id: 'u5', type: 'carousel',
    images: [
      'https://picsum.photos/seed/post3a/630/630',
      'https://picsum.photos/seed/post3b/630/630',
    ],
    caption: 'Kyoto in spring 🌸 Every corner looks like a painting. This trip changed something in me. More photos in stories!',
    location: 'Kyoto, Japan', likes_count: 12800, comments_count: 312, created_at: '2026-06-05T09:00:00Z',
    aspect_ratio: '1:1',
  },
  {
    id: 'p4', author_id: 'u4', type: 'image',
    images: ['https://picsum.photos/seed/post4/630/787'],
    caption: 'Above the clouds ☁️ 4,200m and worth every step #hiking #mountains #adventure',
    location: 'Mont Blanc, France', likes_count: 2340, comments_count: 45, created_at: '2026-06-04T14:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p5', author_id: 'u7', type: 'image',
    images: ['https://picsum.photos/seed/post5/630/630'],
    caption: 'Homemade ramen from scratch 🍜 12-hour broth, fresh noodles, the works. Recipe on my blog (link in bio) #foodie #ramen #homecooking',
    likes_count: 934, comments_count: 67, created_at: '2026-06-04T12:00:00Z',
    aspect_ratio: '1:1',
  },
  {
    id: 'p6', author_id: 'u6', type: 'image',
    images: ['https://picsum.photos/seed/post6/630/787'],
    caption: 'New project dropping soon 👁️ #fashion #editorial #photography',
    location: 'New York City', likes_count: 521, comments_count: 18, created_at: '2026-06-03T20:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p7', author_id: 'u9', type: 'carousel',
    images: [
      'https://picsum.photos/seed/post7a/630/630',
      'https://picsum.photos/seed/post7b/630/630',
      'https://picsum.photos/seed/post7c/630/630',
      'https://picsum.photos/seed/post7d/630/630',
    ],
    caption: 'New illustration series: "Urban Ghosts" 👻 swipe to see all 4 panels. Each piece takes about 3 days to finish. #illustration #art #digitalart',
    likes_count: 1870, comments_count: 93, created_at: '2026-06-03T15:00:00Z',
    aspect_ratio: '1:1',
  },
  {
    id: 'p8', author_id: 'u11', type: 'image',
    images: ['https://picsum.photos/seed/post8/630/787'],
    caption: 'Minimal living. Maximal feeling. 🤍 New project for a client in Mitte #interiordesign #architecture #berlin',
    location: 'Berlin, Germany', likes_count: 3421, comments_count: 54, created_at: '2026-06-02T16:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p9', author_id: 'u10', type: 'image',
    images: ['https://picsum.photos/seed/post9/630/787'],
    caption: 'Dawn patrol 🌅 empty waves, clear mind #surf #california #earlymorning',
    location: 'Malibu, CA', likes_count: 789, comments_count: 31, created_at: '2026-06-01T07:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p10', author_id: 'u12', type: 'image',
    images: ['https://picsum.photos/seed/post10/630/630'],
    caption: 'Soundcheck in Prague 🎸 third night of the tour. The crowd here is unreal #tour #music #live',
    location: 'Prague, Czech Republic', likes_count: 4100, comments_count: 187, created_at: '2026-05-31T21:00:00Z',
    aspect_ratio: '1:1',
  },
  {
    id: 'p11', author_id: 'u2', type: 'image',
    images: ['https://picsum.photos/seed/post11/630/787'],
    caption: 'Rainy Tuesday. Film. ☔ #35mm #filmphotography #tokyo #rain',
    likes_count: 1230, comments_count: 28, created_at: '2026-05-30T14:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p12', author_id: 'u3', type: 'image',
    images: ['https://picsum.photos/seed/post12/630/787'],
    caption: 'The light at 6am is something else 🌄 #sunrise #landscape #photography',
    likes_count: 6700, comments_count: 142, created_at: '2026-05-29T06:00:00Z',
    aspect_ratio: '4:5',
  },
  // Alice's own posts (for her profile grid)
  {
    id: 'p13', author_id: 'u1', type: 'image',
    images: ['https://picsum.photos/seed/alice1/630/787'],
    caption: 'Some days you just wander 🚶‍♀️ #street #urban #photography',
    location: 'Barcelona', likes_count: 341, comments_count: 14, created_at: '2026-06-05T11:00:00Z',
    aspect_ratio: '4:5', is_pinned: true,
  },
  {
    id: 'p14', author_id: 'u1', type: 'carousel',
    images: ['https://picsum.photos/seed/alice2/630/787', 'https://picsum.photos/seed/alice3/630/787'],
    caption: 'Weekend getaway 🏖️ needed this more than I knew',
    location: 'Sitges, Spain', likes_count: 528, comments_count: 21, created_at: '2026-05-28T10:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p15', author_id: 'u1', type: 'image',
    images: ['https://picsum.photos/seed/alice4/630/630'],
    caption: 'Golden light ☀️',
    likes_count: 203, comments_count: 8, created_at: '2026-05-20T17:00:00Z',
    aspect_ratio: '1:1',
  },
  {
    id: 'p16', author_id: 'u1', type: 'image',
    images: ['https://picsum.photos/seed/alice5/630/787'],
    caption: 'New lens, new perspective 📸 #photography #portrait',
    likes_count: 445, comments_count: 19, created_at: '2026-05-15T14:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p17', author_id: 'u1', type: 'image',
    images: ['https://picsum.photos/seed/alice6/630/787'],
    caption: 'Quiet mornings are my favourite kind ☕',
    likes_count: 312, comments_count: 11, created_at: '2026-05-10T09:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p18', author_id: 'u1', type: 'image',
    images: ['https://picsum.photos/seed/alice7/630/630'],
    caption: 'Abstract 001 📷',
    likes_count: 198, comments_count: 5, created_at: '2026-05-05T16:00:00Z',
    aspect_ratio: '1:1',
  },
  {
    id: 'p19', author_id: 'u4', type: 'image',
    images: ['https://picsum.photos/seed/post19/630/787'],
    caption: 'Crater lake at sunset 🌋 words can\'t do it justice #adventure #landscape',
    location: 'Crater Lake, Oregon', likes_count: 1893, comments_count: 42, created_at: '2026-05-28T19:00:00Z',
    aspect_ratio: '4:5',
  },
  {
    id: 'p20', author_id: 'u5', type: 'image',
    images: ['https://picsum.photos/seed/post20/630/787'],
    caption: 'Budapest at dusk 🌆 one of the most underrated cities in Europe #travel #europe',
    location: 'Budapest, Hungary', likes_count: 8900, comments_count: 201, created_at: '2026-05-27T20:00:00Z',
    aspect_ratio: '4:5',
  },
  // ── Video / Reel feed posts ───────────────────────────────────────────────
  {
    id: 'pv1', author_id: 'u3', type: 'reel',
    images: ['https://picsum.photos/seed/reel1/420/745'],
    video_url: '/reels/reel1.mp4',
    caption: 'Mountain sunrise timelapse 🌄 Pure magic at 4am. #nature #landscape #timelapse',
    location: 'Dolomites, Italy',
    likes_count: 14200, comments_count: 234, plays_count: 89000,
    created_at: '2026-06-06T08:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv2', author_id: 'u5', type: 'reel',
    images: ['https://picsum.photos/seed/reel2/420/745'],
    video_url: '/reels/reel2.mp4',
    caption: 'Streets of Lisbon 🇵🇹 Hidden gems only locals know about #travel #europe #streetphotography',
    location: 'Lisbon, Portugal',
    likes_count: 28900, comments_count: 512, plays_count: 210000,
    created_at: '2026-06-05T15:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv3', author_id: 'u7', type: 'reel',
    images: ['https://picsum.photos/seed/reel3/420/745'],
    video_url: '/reels/reel3.mp4',
    caption: 'Flower close-up 🌸 Shot on iPhone — nature is the best studio. #macro #flowers #photography',
    likes_count: 9300, comments_count: 187, plays_count: 45000,
    created_at: '2026-06-04T11:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv4', author_id: 'u12', type: 'reel',
    images: ['https://picsum.photos/seed/reel4/420/745'],
    video_url: '/reels/reel4.mp4',
    caption: 'City rush hour 🚌 Every commuter has a story #citylife #urban #documentary',
    location: 'New York City',
    likes_count: 31000, comments_count: 890, plays_count: 145000,
    created_at: '2026-06-03T22:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv5', author_id: 'u4', type: 'reel',
    images: ['https://picsum.photos/seed/reel5/420/745'],
    video_url: '/reels/reel5.mp4',
    caption: 'Traffic in the rain 🌧️ Melancholic vibes #rainy #moody #cityscape',
    location: 'Seoul, Korea',
    likes_count: 7600, comments_count: 143, plays_count: 52000,
    created_at: '2026-06-02T16:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv6', author_id: 'u10', type: 'reel',
    images: ['https://picsum.photos/seed/reel6/420/745'],
    video_url: '/reels/reel6.mp4',
    caption: 'Just a chill morning ☕ slow life is the good life #slowliving #morning #vibes',
    likes_count: 4200, comments_count: 98, plays_count: 31000,
    created_at: '2026-06-01T09:00:00Z', aspect_ratio: '4:5',
  },
  // More in-feed video posts (source clips reused) — authored by followed users
  {
    id: 'pv7', author_id: 'u2', type: 'reel', images: ['https://picsum.photos/seed/reel7/420/745'],
    video_url: '/reels/reel1.mp4', caption: 'Rainy crossing 🚦 #tokyo #moody #reels',
    location: 'Shibuya, Tokyo', likes_count: 12300, comments_count: 198, plays_count: 81000,
    created_at: '2026-05-31T20:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv8', author_id: 'u3', type: 'reel', images: ['https://picsum.photos/seed/reel8/420/745'],
    video_url: '/reels/reel2.mp4', caption: 'Glacier melt up close ❄️ #nature #landscape',
    location: 'Dolomites, Italy', likes_count: 9600, comments_count: 134, plays_count: 64000,
    created_at: '2026-05-31T10:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv9', author_id: 'u5', type: 'reel', images: ['https://picsum.photos/seed/reel9/420/745'],
    video_url: '/reels/reel3.mp4', caption: 'Best pastéis de nata in Lisbon 🥮 #foodie #travel',
    location: 'Lisbon, Portugal', likes_count: 20100, comments_count: 372, plays_count: 142000,
    created_at: '2026-05-30T18:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv10', author_id: 'u7', type: 'reel', images: ['https://picsum.photos/seed/reel10/420/745'],
    video_url: '/reels/reel4.mp4', caption: 'Knife skills 101 🔪 #cooking #recipe',
    likes_count: 11800, comments_count: 221, plays_count: 79000,
    created_at: '2026-05-30T07:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv11', author_id: 'u4', type: 'reel', images: ['https://picsum.photos/seed/reel11/420/745'],
    video_url: '/reels/reel5.mp4', caption: 'Summit push at dawn ⛰️ #hiking #adventure',
    location: 'Mont Blanc, France', likes_count: 8200, comments_count: 147, plays_count: 57000,
    created_at: '2026-05-29T16:00:00Z', aspect_ratio: '4:5',
  },
  {
    id: 'pv12', author_id: 'u6', type: 'reel', images: ['https://picsum.photos/seed/reel13/420/745'],
    video_url: '/reels/reel6.mp4', caption: 'Set design reveal 🎬 #fashion #editorial',
    location: 'New York City', likes_count: 5900, comments_count: 79, plays_count: 36000,
    created_at: '2026-05-28T19:00:00Z', aspect_ratio: '4:5',
  },
]

/** All posts: real generated content first, demo posts behind it. */
export const POSTS: Post[] = [...GENERATED_FEED, ...MOCK_POSTS]

export const getPostsByUser = (userId: string) => POSTS.filter(p => p.author_id === userId)
export const getFeedPosts = (followingIds: string[]) =>
  POSTS.filter(p => followingIds.includes(p.author_id)).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

/* ── Comments ──────────────────────────────────────────── */
export const COMMENTS: Comment[] = [
  { id: 'c1', post_id: 'p1', author_id: 'u1', text: 'This shot is incredible 😍', likes_count: 12, created_at: '2026-06-06T02:00:00Z' },
  { id: 'c2', post_id: 'p1', author_id: 'u4', text: 'The atmosphere in this photo is unreal', likes_count: 8, created_at: '2026-06-06T02:30:00Z' },
  { id: 'c3', post_id: 'p1', author_id: 'u9', text: '🔥🔥🔥', likes_count: 3, created_at: '2026-06-06T03:00:00Z' },
  { id: 'c4', post_id: 'p2', author_id: 'u1', text: 'Middle one for sure! The light is perfect', likes_count: 22, created_at: '2026-06-05T19:00:00Z' },
  { id: 'c5', post_id: 'p2', author_id: 'u5', text: 'Absolutely breathtaking series 🏔️', likes_count: 15, created_at: '2026-06-05T19:30:00Z' },
  { id: 'c6', post_id: 'p3', author_id: 'u3', text: 'I still dream about this trip', likes_count: 45, created_at: '2026-06-05T10:00:00Z' },
  { id: 'c7', post_id: 'p5', author_id: 'u2', text: 'Can you please just come cook for me 🙏', likes_count: 31, created_at: '2026-06-04T13:00:00Z' },
  { id: 'c8', post_id: 'p7', author_id: 'u6', text: 'The detail in panel 3 is insane! How long did that take?', likes_count: 18, created_at: '2026-06-03T16:00:00Z' },
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
const MOCK_REELS: Reel[] = [
  {
    id: 'r1', author_id: 'u3',
    video_url: '/reels/reel1.mp4',
    poster_url: 'https://picsum.photos/seed/reel1/420/745',
    caption: 'Mountain sunrise timelapse 🌄 #nature #landscape #timelapse',
    audio: 'Original audio · carla_photos',
    likes_count: 14200, comments_count: 234, plays_count: 89000, created_at: '2026-06-06T08:00:00Z',
  },
  {
    id: 'r2', author_id: 'u5',
    video_url: '/reels/reel2.mp4',
    poster_url: 'https://picsum.photos/seed/reel2/420/745',
    caption: 'Streets of Lisbon 🇵🇹 Hidden gems only locals know #travel #europe',
    audio: 'Bossa Nova Vibes · Various Artists',
    likes_count: 28900, comments_count: 512, plays_count: 210000, created_at: '2026-06-05T15:00:00Z',
  },
  {
    id: 'r3', author_id: 'u7',
    video_url: '/reels/reel3.mp4',
    poster_url: 'https://picsum.photos/seed/reel3/420/745',
    caption: 'Making handmade dumplings from scratch 🥟 Full recipe in bio!',
    audio: 'Cooking Beats · Lofi Records',
    likes_count: 9300, comments_count: 187, plays_count: 45000, created_at: '2026-06-04T11:00:00Z',
  },
  {
    id: 'r4', author_id: 'u12',
    video_url: '/reels/reel4.mp4',
    poster_url: 'https://picsum.photos/seed/reel4/420/745',
    caption: 'Live session from last night 🎸 The crowd was incredible',
    audio: 'Live recording · liam_music',
    likes_count: 31000, comments_count: 890, plays_count: 145000, created_at: '2026-06-03T22:00:00Z',
  },
  {
    id: 'r5', author_id: 'u4',
    video_url: '/reels/reel5.mp4',
    poster_url: 'https://picsum.photos/seed/reel5/420/745',
    caption: 'Solo summit attempt ⛰️ 14 hours, zero regrets',
    audio: 'Epic Motivation · Study Beats',
    likes_count: 7600, comments_count: 143, plays_count: 52000, created_at: '2026-06-02T16:00:00Z',
  },
  {
    id: 'r6', author_id: 'u10',
    video_url: '/reels/reel6.mp4',
    poster_url: 'https://picsum.photos/seed/reel6/420/745',
    caption: 'Perfect barrel in Malibu 🌊 My best wave of 2026',
    audio: 'Surf Vibes · Ocean Sounds',
    likes_count: 4200, comments_count: 98, plays_count: 31000, created_at: '2026-06-01T09:00:00Z',
  },
  // ── More shorts (the 6 source clips reused with varied metadata) ────────────
  {
    id: 'r7', author_id: 'u2', video_url: '/reels/reel1.mp4', poster_url: 'https://picsum.photos/seed/reel7/420/745',
    caption: 'Neon nights in Shibuya 🌃 #tokyo #nightlife', audio: 'Synthwave · Retro Beats',
    likes_count: 18700, comments_count: 301, plays_count: 120000, created_at: '2026-05-31T22:00:00Z',
  },
  {
    id: 'r8', author_id: 'u3', video_url: '/reels/reel2.mp4', poster_url: 'https://picsum.photos/seed/reel8/420/745',
    caption: 'Alpine lake reflections 🏔️ #nature #reels', audio: 'Ambient · Calm Waves',
    likes_count: 9900, comments_count: 142, plays_count: 67000, created_at: '2026-05-31T12:00:00Z',
  },
  {
    id: 'r9', author_id: 'u5', video_url: '/reels/reel3.mp4', poster_url: 'https://picsum.photos/seed/reel9/420/745',
    caption: 'Street food tour 🍢 part 2! #foodie #travel', audio: 'Lofi · Chill Hop',
    likes_count: 22400, comments_count: 410, plays_count: 156000, created_at: '2026-05-30T19:00:00Z',
  },
  {
    id: 'r10', author_id: 'u7', video_url: '/reels/reel4.mp4', poster_url: 'https://picsum.photos/seed/reel10/420/745',
    caption: 'Plating like a pro 🍽️ #cooking #recipe', audio: 'Kitchen Groove · Various',
    likes_count: 13100, comments_count: 233, plays_count: 88000, created_at: '2026-05-30T08:00:00Z',
  },
  {
    id: 'r11', author_id: 'u4', video_url: '/reels/reel5.mp4', poster_url: 'https://picsum.photos/seed/reel11/420/745',
    caption: 'Ridge line at golden hour ⛰️ #hiking #adventure', audio: 'Epic · Cinematic',
    likes_count: 8700, comments_count: 159, plays_count: 61000, created_at: '2026-05-29T17:00:00Z',
  },
  {
    id: 'r12', author_id: 'u12', video_url: '/reels/reel6.mp4', poster_url: 'https://picsum.photos/seed/reel12/420/745',
    caption: 'Backstage before the show 🎸 #tour #music', audio: 'Live recording · liam_music',
    likes_count: 26800, comments_count: 540, plays_count: 178000, created_at: '2026-05-29T06:00:00Z',
  },
  {
    id: 'r13', author_id: 'u6', video_url: '/reels/reel1.mp4', poster_url: 'https://picsum.photos/seed/reel13/420/745',
    caption: 'Editorial BTS 📸 #fashion #photography', audio: 'Runway · Beat Lab',
    likes_count: 6400, comments_count: 88, plays_count: 39000, created_at: '2026-05-28T20:00:00Z',
  },
  {
    id: 'r14', author_id: 'u9', video_url: '/reels/reel2.mp4', poster_url: 'https://picsum.photos/seed/reel14/420/745',
    caption: 'Speed-paint timelapse 🎨 #art #illustration', audio: 'Focus · Study Beats',
    likes_count: 11200, comments_count: 207, plays_count: 74000, created_at: '2026-05-28T11:00:00Z',
  },
  {
    id: 'r15', author_id: 'u11', video_url: '/reels/reel3.mp4', poster_url: 'https://picsum.photos/seed/reel15/420/745',
    caption: 'Apartment tour — Berlin loft 🏠 #interiordesign', audio: 'House Tour · Lo-Fi',
    likes_count: 15600, comments_count: 276, plays_count: 99000, created_at: '2026-05-27T15:00:00Z',
  },
  {
    id: 'r16', author_id: 'u10', video_url: '/reels/reel4.mp4', poster_url: 'https://picsum.photos/seed/reel16/420/745',
    caption: 'Sunset skate session 🛹 #skate #california', audio: 'Punk · Garage',
    likes_count: 7300, comments_count: 121, plays_count: 48000, created_at: '2026-05-27T02:00:00Z',
  },
  {
    id: 'r17', author_id: 'u3', video_url: '/reels/reel5.mp4', poster_url: 'https://picsum.photos/seed/reel17/420/745',
    caption: 'Fog rolling over the peaks 🌫️ #landscape', audio: 'Drone · Ambient',
    likes_count: 19800, comments_count: 312, plays_count: 134000, created_at: '2026-05-26T18:00:00Z',
  },
  {
    id: 'r18', author_id: 'u5', video_url: '/reels/reel6.mp4', poster_url: 'https://picsum.photos/seed/reel18/420/745',
    caption: 'Tram rides through Lisbon 🚋 #travel #europe', audio: 'Fado · Acoustic',
    likes_count: 24100, comments_count: 489, plays_count: 167000, created_at: '2026-05-26T09:00:00Z',
  },
]

/** All reels: real generated reels first, demo reels behind them. */
export const REELS: Reel[] = [...GENERATED_FEED_REELS, ...MOCK_REELS]

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
  { id: 'n1', type: 'like', actor_id: 'u3', post_id: 'p13', text: 'liked your photo.', created_at: '2026-06-06T11:00:00Z', read: false },
  { id: 'n2', type: 'comment', actor_id: 'u2', post_id: 'p13', text: 'commented: "Stunning as always 🔥"', created_at: '2026-06-06T10:30:00Z', read: false },
  { id: 'n3', type: 'follow', actor_id: 'u4', text: 'started following you.', created_at: '2026-06-06T09:00:00Z', read: false },
  { id: 'n4', type: 'like', actor_id: 'u5', post_id: 'p14', text: 'liked your photo.', created_at: '2026-06-05T20:00:00Z', read: true },
  { id: 'n5', type: 'comment', actor_id: 'u7', post_id: 'p14', text: 'commented: "I need to go to Sitges 😍"', created_at: '2026-06-05T18:00:00Z', read: true },
  { id: 'n6', type: 'follow', actor_id: 'u9', text: 'started following you.', created_at: '2026-06-05T15:00:00Z', read: true },
  { id: 'n7', type: 'like', actor_id: 'u10', post_id: 'p15', text: 'liked your photo.', created_at: '2026-06-04T12:00:00Z', read: true },
  { id: 'n8', type: 'mention', actor_id: 'u2', post_id: 'p11', text: 'mentioned you in a comment.', created_at: '2026-06-03T16:00:00Z', read: true },
  { id: 'n9', type: 'follow', actor_id: 'u6', text: 'started following you.', created_at: '2026-06-02T10:00:00Z', read: true },
  { id: 'n10', type: 'like', actor_id: 'u12', post_id: 'p16', text: 'liked your photo.', created_at: '2026-06-01T20:00:00Z', read: true },
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
export const DEFAULT_LIKED_POSTS: string[] = ['p3', 'p5']
export const DEFAULT_SAVED_POSTS: string[] = ['p2', 'p8']
