-- Enable Row Level Security on the waitlist table and allow anonymous email
-- submissions. There is intentionally no SELECT policy, so waitlist emails are
-- not publicly readable.
alter table waitlist enable row level security;

create policy "Allow anyone to insert their email" on waitlist
  for insert
  with check (true);
