-- Migration: Enable RLS and add policies for favorites table

-- Enable Row Level Security
alter table favorites enable row level security;

-- Policy: Anyone can view favorites
create policy "Allow read for all" on favorites
  for select using (true);

-- Policy: Only authenticated users can insert their own favorite
create policy "Allow insert for authenticated" on favorites
  for insert with check (auth.uid() = user_id);

-- Policy: Only authenticated users can delete their own favorite
create policy "Allow delete for owner" on favorites
  for delete using (auth.uid() = user_id);
