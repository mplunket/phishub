-- Migration: Add explicit foreign keys for favorites
-- 1. Add new nullable foreign key columns
alter table favorites add column tab_id uuid references tabs(id) on delete cascade;
alter table favorites add column song_id uuid references songs(id) on delete cascade;
alter table favorites add column video_id uuid references videos(id) on delete cascade;

-- 3. Drop old columns
alter table favorites drop column content_id;
alter table favorites drop column content_type;

-- 4. Add unique constraints
alter table favorites add constraint unique_user_tab unique (user_id, tab_id);
alter table favorites add constraint unique_user_song unique (user_id, song_id);
alter table favorites add constraint unique_user_video unique (user_id, video_id);

-- 5. (Re)add RLS and policies as needed
