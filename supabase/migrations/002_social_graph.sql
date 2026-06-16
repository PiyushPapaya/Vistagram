-- Follows & close friends
create type follow_status as enum ('accepted', 'requested');

create table if not exists follows (
  follower_id  uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  status       follow_status not null default 'accepted',
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create index idx_follows_following on follows(following_id);
create index idx_follows_follower  on follows(follower_id);

alter table follows enable row level security;

create policy "Follows viewable by participants"
  on follows for select using (
    auth.uid() = follower_id or auth.uid() = following_id or
    (select is_private from profiles where id = following_id) = false
  );

create policy "Users can follow others"
  on follows for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on follows for delete using (auth.uid() = follower_id);

create policy "Following user can accept requests"
  on follows for update using (auth.uid() = following_id);

-- Close friends list
create table if not exists close_friends (
  user_id   uuid not null references profiles(id) on delete cascade,
  friend_id uuid not null references profiles(id) on delete cascade,
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

alter table close_friends enable row level security;

create policy "Only owner sees close friends list"
  on close_friends for select using (auth.uid() = user_id);

create policy "Owner manages close friends"
  on close_friends for all using (auth.uid() = user_id);
