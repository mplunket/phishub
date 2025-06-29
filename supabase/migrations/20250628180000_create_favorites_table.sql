-- Migration: Create a favorites table for tabs, videos, etc.
create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  content_type text not null, -- e.g. 'tab', 'video'
  content_id uuid not null,   -- id of the tab or video
  created_at timestamp with time zone default now(),
  unique (user_id, content_type, content_id)
);

-- Index for fast aggregation
create index if not exists idx_favorites_content on favorites (content_type, content_id);
create index if not exists idx_favorites_user on favorites (user_id);