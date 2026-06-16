-- Notifications
create type notification_type as enum (
  'like', 'comment', 'follow', 'follow_request', 'mention', 'tag'
);

create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  actor_id   uuid not null references profiles(id) on delete cascade,
  type       notification_type not null,
  entity_id  uuid,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user on notifications(user_id, created_at desc);
create index idx_notifications_unread on notifications(user_id) where read = false;

alter table notifications enable row level security;

create policy "Users see own notifications"
  on notifications for select using (auth.uid() = user_id);

create policy "System inserts notifications"
  on notifications for insert with check (true);

create policy "Users mark own notifications read"
  on notifications for update using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table notifications;

-- Trigger: like → notification
create or replace function notify_on_like()
returns trigger language plpgsql security definer as $$
declare
  post_author uuid;
begin
  select author_id into post_author from posts where id = new.post_id;

  if post_author is distinct from new.user_id then
    insert into notifications (user_id, actor_id, type, entity_id)
    values (post_author, new.user_id, 'like', new.post_id);
  end if;

  return new;
end;
$$;

create trigger on_like
  after insert on likes
  for each row execute function notify_on_like();

-- Trigger: comment → notification
create or replace function notify_on_comment()
returns trigger language plpgsql security definer as $$
declare
  post_author uuid;
begin
  select author_id into post_author from posts where id = new.post_id;

  if post_author is distinct from new.author_id then
    insert into notifications (user_id, actor_id, type, entity_id)
    values (post_author, new.author_id, 'comment', new.id);
  end if;

  return new;
end;
$$;

create trigger on_comment
  after insert on comments
  for each row execute function notify_on_comment();

-- Trigger: follow → notification
create or replace function notify_on_follow()
returns trigger language plpgsql security definer as $$
declare
  notif_type notification_type;
begin
  if new.status = 'accepted' then
    notif_type := 'follow';
  else
    notif_type := 'follow_request';
  end if;

  insert into notifications (user_id, actor_id, type)
  values (new.following_id, new.follower_id, notif_type);

  return new;
end;
$$;

create trigger on_follow
  after insert on follows
  for each row execute function notify_on_follow();
