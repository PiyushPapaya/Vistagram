-- Likes, comments, saves
create table if not exists likes (
  user_id    uuid not null references profiles(id) on delete cascade,
  post_id    uuid not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create index idx_likes_post on likes(post_id);

alter table likes enable row level security;

create policy "Likes visible to all"
  on likes for select using (true);

create policy "Users like/unlike"
  on likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike"
  on likes for delete using (auth.uid() = user_id);

-- Comments
create table if not exists comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references posts(id) on delete cascade,
  author_id  uuid not null references profiles(id) on delete cascade,
  parent_id  uuid references comments(id) on delete cascade,
  text       text not null,
  created_at timestamptz not null default now()
);

create index idx_comments_post   on comments(post_id, created_at);
create index idx_comments_parent on comments(parent_id);

alter table comments enable row level security;

create policy "Comments visible like post"
  on comments for select using (
    exists (select 1 from posts where id = post_id)
  );

create policy "Authenticated users can comment"
  on comments for insert with check (auth.uid() = author_id);

create policy "Authors delete own comments"
  on comments for delete using (auth.uid() = author_id);

create policy "Authors edit own comments"
  on comments for update using (auth.uid() = author_id);

-- Comment likes
create table if not exists comment_likes (
  user_id    uuid not null references profiles(id) on delete cascade,
  comment_id uuid not null references comments(id) on delete cascade,
  primary key (user_id, comment_id)
);

alter table comment_likes enable row level security;

create policy "Comment likes visible to all"
  on comment_likes for select using (true);

create policy "Users like/unlike comments"
  on comment_likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike comments"
  on comment_likes for delete using (auth.uid() = user_id);

-- Saved collections
create table if not exists saved_collections (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

alter table saved_collections enable row level security;

create policy "Users see own collections"
  on saved_collections for select using (auth.uid() = user_id);

create policy "Users manage own collections"
  on saved_collections for all using (auth.uid() = user_id);

-- Saves
create table if not exists saves (
  user_id       uuid not null references profiles(id) on delete cascade,
  post_id       uuid not null references posts(id) on delete cascade,
  collection_id uuid references saved_collections(id) on delete set null,
  created_at    timestamptz not null default now(),
  primary key (user_id, post_id)
);

create index idx_saves_user on saves(user_id, created_at desc);

alter table saves enable row level security;

create policy "Users see own saves"
  on saves for select using (auth.uid() = user_id);

create policy "Users save posts"
  on saves for insert with check (auth.uid() = user_id);

create policy "Users unsave posts"
  on saves for delete using (auth.uid() = user_id);
