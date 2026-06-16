# Vistagram

A full-stack, production-quality Instagram clone built with Next.js 15, Supabase, and Tailwind CSS.

## Demo credentials (after seeding)

| Account | Email | Password |
|---|---|---|
| alice_v | alice@demo.vistagram.app | demo1234 |
| bob_snaps | bob@demo.vistagram.app | demo1234 |
| (+ 10 more) | | |

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (base-nova) + lucide-react
- **Backend:** Supabase (Postgres, Auth, Storage, Realtime)
- **State:** TanStack Query + Zustand
- **Forms:** react-hook-form + zod
- **Toasts:** sonner

## Setup

### 1. Clone & install

```bash
git clone <repo>
cd vistagram
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and grab:
- Project URL
- Anon (public) key

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Run migrations

In Supabase dashboard → SQL Editor, run each file in order:

```
supabase/migrations/001_profiles.sql
supabase/migrations/002_social_graph.sql
supabase/migrations/003_posts_media.sql
supabase/migrations/004_stories.sql
supabase/migrations/005_interactions.sql
supabase/migrations/006_messaging.sql
supabase/migrations/007_notifications.sql
supabase/migrations/008_discovery.sql
```

### 5. Enable Storage buckets

In Supabase dashboard → Storage, create:
- `avatars` (public)
- `posts` (public)
- `stories` (public)

### 6. Enable Google OAuth (optional)

In Supabase dashboard → Authentication → Providers → Google, add your OAuth credentials.

### 7. Run seed (Phase 1+)

```bash
# Available after Phase 1
npm run seed
```

### 8. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Supabase is optional.** With no `.env.local` the app runs entirely on local
> mock data **plus your own media** (see below) — nothing breaks, no env vars
> required. Supabase only adds live reels when configured.

## Your own media (`videos_phots/`)

Drop images and videos into the **`videos_phots/`** folder at the project root
(the correctly-spelled **`videos_photos/`** also works — the generator scans
whichever exists). They are scanned automatically and wired into the feed, reels,
explore grid, profile grids, avatars, story rings and story thumbnails — no
per-file config.

A small generator (`scripts/generate-media.mjs`) runs automatically on
`npm run dev` and `npm run build` (`predev` / `prebuild` hooks). It copies the
files into `public/media/feed/` with clean URLs and writes
`src/lib/generated-media.ts`. To re-scan after adding/removing files, just
restart the dev server (or run `npm run generate-media`).

### Naming convention → how files become posts

| Files | Becomes |
|---|---|
| `sunset.jpg`, `sunset1.jpg`, `sunset_2.jpg`, `sunset-3.jpg`, `"sunset 4.jpg"`, `"sunset (5).jpg"` | **one carousel** (slideshow), ordered by number; the un-numbered file is first |
| `portrait.jpg` (unique name) | a **single-image** post |
| `clip.mp4` | a **video** post **and** a reel |

- Numbered images that share a **base name** group into one carousel. Supported
  number styles: `name1`, `name_1`, `name-1`, `name 1`, `name (1)` — any digit count.
- Accidental duplicate videos that share a base name are de-duped to one post.
- Supported types: images `.jpg .jpeg .png .webp .gif .avif`, videos `.mp4 .webm .mov .m4v .ogv`.
  Anything else is ignored. An empty folder is fine — the app falls back to demo data.
- The filename (minus the number suffix) is used as the post caption, so emoji /
  hashtags / @mentions in filenames carry through.

### Optional metadata override (`videos_phots/media.json`)

Drop a `media.json` (or `metadata.json`) sidecar next to your media to pin the
author, caption, or like count for any post — otherwise realistic values are
generated. Keys are matched case-insensitively against the source filename, the
filename without extension, the carousel base name, or its slug:

```json
{
  "cannes-loading": { "username": "leonie.hanne", "caption": "Cannes 🎬", "likes": 48200 },
  "moody day in lake como.jpg": { "username": "samira.safi" }
}
```

`username` must match a user in `src/lib/mock-data.ts` (e.g. `leonie.hanne`); an
unknown name falls back to the round-robin author assignment.

### Auto-scroll (home feed)

Press **Alt+A** to toggle auto-scroll. Timings live in one place —
`src/lib/media-config.ts`:

| Constant | Default | Applies to |
|---|---|---|
| `SLIDE_INTERVAL` | `3000` ms | each carousel image (incl. the last) |
| `SLIDE_END_HOLD` | `1000` ms | pause after the last carousel image |
| `POST_VIDEO_HOLD` | `1000` ms | pause after a video finishes |
| `PHOTO_DWELL` | `10000` ms | single-photo posts |
| `RESUME_DELAY_MS` | `3000` ms | resume after a manual interaction |

Auto-scroll pauses on interaction and resumes after idle; media renders at fixed
ratios (feed 4:5, reels 9:16, `object-fit: cover`); the feed loops downward.

## Deploying (Vercel)

1. Commit **`videos_phots/`** (the source media) and `src/lib/generated-media.ts`.
   The large copies under `public/media/feed/` are git-ignored and regenerated by
   `prebuild` on every deploy.
2. Push and import the repo into Vercel — the default build (`npm run build`) runs
   the generator first, so your media is bundled as static assets served from the CDN.
3. Supabase env vars are **optional**; set `NEXT_PUBLIC_SUPABASE_URL` /
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel only if you want live reels.
4. Large media in git can be heavy — consider Git LFS for `videos_phots/` if the
   repo grows large.

## Project structure

```
src/
  app/
    (auth)/          # Login + signup pages
    (main)/          # Protected app shell
  components/
    layout/          # Sidebar, mobile nav, mobile header
    feed/            # Feed components (Phase 1+)
    ui/              # shadcn/ui components
  hooks/             # use-user, etc.
  lib/supabase/      # Browser + server clients
  providers/         # ThemeProvider, QueryProvider
  types/database.ts  # Full typed DB schema
supabase/
  migrations/        # 001-008 ordered SQL
```

## Feature phases

See [PROGRESS.md](./PROGRESS.md) for the full checklist.
