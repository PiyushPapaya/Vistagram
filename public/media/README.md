# Media

**Your own media now lives in `videos_phots/` at the project root**, not here.

Drop images/videos into `videos_phots/` and they are scanned automatically and
wired across the whole app. See the **"Your own media"** section of the root
[`README.md`](../../README.md) for the naming convention (numbered images →
carousels) and details.

This `public/media/` folder only holds generated/served copies:

- `feed/` — auto-generated from `videos_phots/` by `scripts/generate-media.mjs`
  (git-ignored; regenerated on `npm run dev` / `npm run build`). Do not edit by hand.
- `posts/`, `reels/` — legacy drop-in folders, kept for backwards compatibility.
