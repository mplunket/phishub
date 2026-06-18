-- Private beta allowlist. During the pilot, the site is publicly visible (the
-- landing page + waitlist), but only people whose email is listed here may
-- actually enter the app. The gate is enforced in middleware (see
-- utils/supabase/middleware.ts): an authenticated user whose email is not in
-- this table is redirected to /pending instead of the dashboard.
--
-- Invites are managed out-of-band (Supabase dashboard / SQL editor / service
-- role) by adding the invitee's email here BEFORE sending them a sign-up link.
-- There are intentionally no INSERT/UPDATE/DELETE policies, so end users can
-- never add themselves.

create table if not exists beta_allowlist (
    email text primary key,
    note text,
    invited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Store/compare emails lowercased so allowlist checks are case-insensitive and
-- match however Supabase Auth normalizes the address.
create or replace function lower_beta_email()
returns trigger as $$
begin
    new.email = lower(new.email);
    return new;
end;
$$ language plpgsql;

create trigger beta_allowlist_lower_email
    before insert or update on beta_allowlist
    for each row
    execute function lower_beta_email();

alter table beta_allowlist enable row level security;

-- A signed-in user may check ONLY whether their own email is allowlisted. This
-- is the single query the middleware runs; it never exposes the full list.
create policy "Users can check their own allowlist status" on beta_allowlist
    for select using (lower(auth.jwt() ->> 'email') = email);
