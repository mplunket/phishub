-- Migration: Create profiles table for user metadata
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  country text,
  state text,
  city text,
  created_at timestamp with time zone default now()
);

create unique index if not exists idx_profiles_username on profiles (username);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Policy: Anyone can view profiles
create policy "Allow read for all" on profiles
  for select using (true);

-- Policy: Only authenticated user can insert their own profile
create policy "Allow insert for self" on profiles
  for insert with check (auth.uid() = user_id);

-- Policy: Only owner can update their avatar (not username)
create policy "Allow update avatar for self" on profiles
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);