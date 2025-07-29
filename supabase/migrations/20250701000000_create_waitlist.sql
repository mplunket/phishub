-- Migration: Create waitlist table
create table if not exists waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamp with time zone default now()
);
