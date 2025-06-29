-- Migration: Add foreign key from tabs.author_id to profiles.user_id
alter table tabs
  add constraint fk_tabs_author
  foreign key (author_id) references profiles(user_id) on delete set null;
