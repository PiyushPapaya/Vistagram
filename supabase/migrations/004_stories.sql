-- Stories, highlights, notes
create type sticker_kind as enum ('poll', 'quiz', 'question', 'music', 'location', 'mention');

create table if not exists stories (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references profiles(id) on delete cascade,
  media_url  text not null,
  type       text not null check (type in ('image', 'video')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create index idx_stories_author  on stories(author_id, created_at desc);
create index idx_stories_expires on stories(expires_at);

alter table stories enable row level security;

create policy "Stories visible to all (public authors) or followers"
  on stories for select using (
    expires_at > now()
    and (
      (select is_private from profiles where id = author_id) = false
      or author_id = auth.uid()
      or exists (
        select 1 from follows
        where follower_id = auth.uid()
          and following_id = author_id
          and status = 'accepted'
      )
    )
  );

create policy "Authors insert own stories"
  on stories for insert with check (auth.uid() = author_id);

create policy "Authors delete own stories"
  on stories for delete using (auth.uid() = author_id);

-- Story views
create table if not exists story_views (
  story_id  uuid not null references stories(id) on delete cascade,
  viewer_id uuid not null references profiles(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (story_id, viewer_id)
);

alter table story_views enable row level security;

create policy "Authors see viewers of own stories"
  on story_views for select using (
    exists (select 1 from stories where id = story_id and author_id = auth.uid())
    or viewer_id = auth.uid()
  );

create policy "Authenticated users can mark stories viewed"
  on story_views for insert with check (auth.uid() = viewer_id);

-- Story stickers
create table if not exists story_stickers (
  id       uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  kind     sticker_kind not null,
  payload  jsonb not null default '{}'
);

alter table story_stickers enable row level security;

create policy "Stickers inherit story visibility"
  on story_stickers for select using (
    exists (select 1 from stories where id = story_id)
  );

create policy "Story author manages stickers"
  on story_stickers for all using (
    exists (select 1 from stories where id = story_id and author_id = auth.uid())
  );

-- Story sticker responses
create table if not exists story_sticker_responses (
  id         uuid primary key default gen_random_uuid(),
  sticker_id uuid not null references story_stickers(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  response   jsonb not null,
  created_at timestamptz not null default now()
);

alter table story_sticker_responses enable row level security;

create policy "Authors see responses to own story stickers"
  on story_sticker_responses for select using (
    user_id = auth.uid()
    or exists (
      select 1 from story_stickers ss
        join stories s on s.id = ss.story_id
      where ss.id = sticker_id and s.author_id = auth.uid()
    )
  );

create policy "Users can respond to stickers"
  on story_sticker_responses for insert with check (auth.uid() = user_id);

-- Highlights
create table if not exists highlights (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  title      text not null,
  cover_url  text,
  created_at timestamptz not null default now()
);

create index idx_highlights_user on highlights(user_id);

alter table highlights enable row level security;

create policy "Highlights visible like profile"
  on highlights for select using (
    (select is_private from profiles where id = user_id) = false
    or user_id = auth.uid()
    or exists (
      select 1 from follows
      where follower_id = auth.uid()
        and following_id = user_id
        and status = 'accepted'
    )
  );

create policy "Users manage own highlights"
  on highlights for all using (auth.uid() = user_id);

-- Highlight items
create table if not exists highlight_items (
  highlight_id uuid not null references highlights(id) on delete cascade,
  story_id     uuid not null references stories(id) on delete cascade,
  primary key (highlight_id, story_id)
);

alter table highlight_items enable row level security;

create policy "Highlight items inherit highlight visibility"
  on highlight_items for select using (
    exists (select 1 from highlights where id = highlight_id)
  );

create policy "Highlight owner manages items"
  on highlight_items for all using (
    exists (select 1 from highlights where id = highlight_id and user_id = auth.uid())
  );

-- Notes (DM inbox bubbles, 24h)
create table if not exists notes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  text         text not null,
  music_id     text,
  bubble_color text not null default '#ffffff',
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null default (now() + interval '24 hours')
);

create index idx_notes_user    on notes(user_id, created_at desc);
create index idx_notes_expires on notes(expires_at);

alter table notes enable row level security;

create policy "Notes visible to followers"
  on notes for select using (
    user_id = auth.uid()
    or exists (
      select 1 from follows
      where follower_id = auth.uid()
        and following_id = user_id
        and status = 'accepted'
    )
  );

create policy "Users manage own notes"
  on notes for all using (auth.uid() = user_id);
