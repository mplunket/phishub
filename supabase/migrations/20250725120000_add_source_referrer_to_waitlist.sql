-- Add source and referrer_url columns to waitlist table
alter table waitlist
  add column source text,
  add column referrer_url text;
