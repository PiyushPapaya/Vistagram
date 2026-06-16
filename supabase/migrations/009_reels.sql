-- Reels table and storage bucket
-- Run this migration then seed via the Supabase dashboard or seed script.

create table if not exists public.reels (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(id) on delete cascade,
  video_url     text not null,
  poster_url    text,
  caption       text,
  audio_label   text,
  likes_count   integer not null default 0,
  comments_count integer not null default 0,
  plays_count   integer not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.reels enable row level security;

-- Anyone authenticated can read reels
create policy "reels_select" on public.reels
  for select using (auth.role() = 'authenticated');

-- Only the author can insert/update/delete
create policy "reels_insert" on public.reels
  for insert with check (auth.uid() = author_id);

create policy "reels_update" on public.reels
  for update using (auth.uid() = author_id);

create policy "reels_delete" on public.reels
  for delete using (auth.uid() = author_id);

-- Storage bucket for reel videos
-- Create a bucket named "reels-videos" in the Supabase dashboard (Storage → New bucket)
-- and set it to Public so video_url links work without auth tokens.
-- Then add this policy via the dashboard or run:
--
--   insert into storage.buckets (id, name, public) values ('reels-videos', 'reels-videos', true);
--
--   create policy "reels_videos_public_read" on storage.objects
--     for select using (bucket_id = 'reels-videos');
--
--   create policy "reels_videos_auth_upload" on storage.objects
--     for insert with check (bucket_id = 'reels-videos' and auth.role() = 'authenticated');

-- Sample seed rows (replace video_url / poster_url with your Supabase storage URLs or any public MP4):
-- insert into public.reels (author_id, video_url, poster_url, caption, audio_label, likes_count, comments_count, plays_count)
-- values
--   ('<your-profile-uuid>', 'https://<project>.supabase.co/storage/v1/object/public/reels-videos/reel1.mp4',
--    'https://<project>.supabase.co/storage/v1/object/public/reels-videos/reel1_poster.jpg',
--    'My first reel #vistagram', 'Original audio', 42, 5, 300),
--   ('<your-profile-uuid>', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
--    null, 'Public sample reel', 'Original audio', 10, 2, 50);
