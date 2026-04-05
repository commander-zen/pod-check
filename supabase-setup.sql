-- Run this in your Supabase dashboard → SQL Editor

-- Sessions table
create table if not exists sessions (
  id      text primary key,
  data    jsonb not null,
  created_at timestamptz default now()
);

-- Auto-delete sessions older than 24 hours (keeps your DB clean)
-- You can run this manually or set up a pg_cron job
-- delete from sessions where created_at < now() - interval '24 hours';

-- Enable Row Level Security
alter table sessions enable row level security;

-- Allow anyone to read sessions (needed for players to join)
create policy "Anyone can read sessions"
  on sessions for select
  using (true);

-- Allow anyone to insert new sessions (host creates one)
create policy "Anyone can create sessions"
  on sessions for insert
  with check (true);

-- Allow anyone to update sessions (players update their slot)
create policy "Anyone can update sessions"
  on sessions for update
  using (true);

-- Enable realtime on the sessions table
-- Go to: Supabase Dashboard → Database → Replication
-- Toggle on the `sessions` table under "Source"
-- OR run:
alter publication supabase_realtime add table sessions;
