-- Posts & media
create type post_type as enum ('image', 'carousel', 'reel');

create table if not exists posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references profiles(id) on delete cascade,
  type          post_type not null default 'image',
  caption       text,
  location_id   uuid,
  music_id      text,
  is_pinned     boolean not null default false,
  scheduled_for timestamptz,
  created_at    timestamptz not null default now()
);

create index idx_posts_author    on posts(author_id, created_at desc);
create index idx_posts_created   on posts(created_at desc);
create index idx_posts_scheduled on posts(scheduled_for) where scheduled_for is not null;

alter table posts enable row level security;

create policy "Posts visible to all (public) or followers (private)"
  on posts for select using (
    (select is_private from profiles where id = author_id) = false
    or author_id = auth.uid()
    or exists (
      select 1 from follows
      where follower_id = auth.uid()
        and following_id = author_id
        and status = 'accepted'
    )
  );

create policy "Authors can insert posts"
  on posts for insert with check (auth.uid() = author_id);

create policy "Authors can update own posts"
  on posts for update using (auth.uid() = author_id);

create policy "Authors can delete own posts"
  on posts for delete using (auth.uid() = author_id);

-- Media
create table if not exists media (
  id        uuid primary key default gen_random_uuid(),
  post_id   uuid not null references posts(id) on delete cascade,
  url       text not null,
  type      text not null check (type in ('image', 'video')),
  width     int,
  height    int,
  position  int not null default 0,
  alt_text  text
);

create index idx_media_post on media(post_id, position);

alter table media enable row level security;

create policy "Media inherits post visibility"
  on media for select using (
    exists (select 1 from posts where id = post_id)
  );

create policy "Post author manages media"
  on media for all using (
    exists (select 1 from posts where id = post_id and author_id = auth.uid())
  );
