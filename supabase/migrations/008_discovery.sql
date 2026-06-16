-- Hashtags, locations, user topics, shopping products
create table if not exists hashtags (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

create index idx_hashtags_name on hashtags(name);

alter table hashtags enable row level security;

create policy "Hashtags public"
  on hashtags for select using (true);

create policy "Authenticated users can create hashtags"
  on hashtags for insert with check (auth.uid() is not null);

-- Post hashtags (M:M)
create table if not exists post_hashtags (
  post_id    uuid not null references posts(id) on delete cascade,
  hashtag_id uuid not null references hashtags(id) on delete cascade,
  primary key (post_id, hashtag_id)
);

create index idx_post_hashtags_tag on post_hashtags(hashtag_id);

alter table post_hashtags enable row level security;

create policy "Post hashtags public"
  on post_hashtags for select using (true);

create policy "Post author manages tags"
  on post_hashtags for all using (
    exists (select 1 from posts where id = post_id and author_id = auth.uid())
  );

-- Locations (for map search)
create table if not exists locations (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  lat  double precision not null,
  lng  double precision not null
);

alter table locations enable row level security;

create policy "Locations public"
  on locations for select using (true);

create policy "Authenticated users can add locations"
  on locations for insert with check (auth.uid() is not null);

-- User algorithm topic controls
create table if not exists user_topics (
  user_id uuid not null references profiles(id) on delete cascade,
  topic   text not null,
  weight  numeric not null default 1.0,
  primary key (user_id, topic)
);

alter table user_topics enable row level security;

create policy "Users see own topics"
  on user_topics for select using (auth.uid() = user_id);

create policy "Users manage own topics"
  on user_topics for all using (auth.uid() = user_id);

-- Products (shopping/affiliate)
create table if not exists products (
  id    uuid primary key default gen_random_uuid(),
  name  text not null,
  url   text not null,
  image text
);

alter table products enable row level security;

create policy "Products public"
  on products for select using (true);

create policy "Authenticated users can add products"
  on products for insert with check (auth.uid() is not null);

-- Post products (M:M)
create table if not exists post_products (
  post_id    uuid not null references posts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  primary key (post_id, product_id)
);

alter table post_products enable row level security;

create policy "Post products public"
  on post_products for select using (true);

create policy "Post author manages product tags"
  on post_products for all using (
    exists (select 1 from posts where id = post_id and author_id = auth.uid())
  );

-- Add location FK on posts (after locations table exists)
alter table posts add column if not exists
  location_id uuid references locations(id) on delete set null;
