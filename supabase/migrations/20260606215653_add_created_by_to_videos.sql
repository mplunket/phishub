-- Track who submitted a video so submitters can delete their own.
alter table videos
  add column if not exists created_by uuid references auth.users(id) on delete set null;

create policy "Video owners can delete their videos" on videos
  for delete using (auth.uid() = created_by);
