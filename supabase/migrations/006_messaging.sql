-- DM threads, participants, messages
create table if not exists dm_threads (
  id         uuid primary key default gen_random_uuid(),
  is_group   boolean not null default false,
  name       text,
  created_at timestamptz not null default now()
);

alter table dm_threads enable row level security;

create policy "Thread participants can view thread"
  on dm_threads for select using (
    exists (
      select 1 from dm_participants
      where thread_id = id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can create threads"
  on dm_threads for insert with check (auth.uid() is not null);

-- Participants
create table if not exists dm_participants (
  thread_id    uuid not null references dm_threads(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  last_read_at timestamptz,
  primary key (thread_id, user_id)
);

create index idx_dm_participants_user on dm_participants(user_id);

alter table dm_participants enable row level security;

create policy "Participants view own participation"
  on dm_participants for select using (auth.uid() = user_id);

create policy "Thread creator adds participants"
  on dm_participants for insert with check (auth.uid() is not null);

create policy "Participants update own last_read"
  on dm_participants for update using (auth.uid() = user_id);

-- Messages
create table if not exists dm_messages (
  id             uuid primary key default gen_random_uuid(),
  thread_id      uuid not null references dm_threads(id) on delete cascade,
  sender_id      uuid not null references profiles(id) on delete cascade,
  text           text,
  media_url      text,
  shared_post_id uuid references posts(id) on delete set null,
  reply_to_id    uuid references dm_messages(id) on delete set null,
  scheduled_for  timestamptz,
  created_at     timestamptz not null default now()
);

create index idx_dm_messages_thread on dm_messages(thread_id, created_at desc);

alter table dm_messages enable row level security;

create policy "Thread participants view messages"
  on dm_messages for select using (
    exists (
      select 1 from dm_participants
      where thread_id = dm_messages.thread_id and user_id = auth.uid()
    )
  );

create policy "Thread participants send messages"
  on dm_messages for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from dm_participants
      where thread_id = dm_messages.thread_id and user_id = auth.uid()
    )
  );

create policy "Senders delete own messages"
  on dm_messages for delete using (auth.uid() = sender_id);

-- Message reactions
create table if not exists message_reactions (
  message_id uuid not null references dm_messages(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  emoji      text not null,
  primary key (message_id, user_id)
);

alter table message_reactions enable row level security;

create policy "Thread participants view reactions"
  on message_reactions for select using (
    exists (
      select 1 from dm_messages m
        join dm_participants p on p.thread_id = m.thread_id
      where m.id = message_id and p.user_id = auth.uid()
    )
  );

create policy "Thread participants react"
  on message_reactions for all using (auth.uid() = user_id);

-- Enable Realtime on messaging tables
alter publication supabase_realtime add table dm_messages;
alter publication supabase_realtime add table message_reactions;
alter publication supabase_realtime add table dm_participants;
