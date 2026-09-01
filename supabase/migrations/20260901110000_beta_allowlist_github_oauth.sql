-- Admit GitHub OAuth users by github_login as well as email. Email stays unique
-- when present but is no longer required, so GitHub-only invites do not need a
-- dummy address. Self-read RLS uses auth.identities (not user_metadata).

alter table public.beta_allowlist
    add column if not exists github_login text;

-- Surrogate PK so email can be nullable (GitHub-only rows).
alter table public.beta_allowlist
    add column if not exists id uuid default gen_random_uuid();

update public.beta_allowlist
    set id = gen_random_uuid()
    where id is null;

alter table public.beta_allowlist
    alter column id set not null;

alter table public.beta_allowlist
    drop constraint if exists beta_allowlist_pkey;

alter table public.beta_allowlist
    add constraint beta_allowlist_pkey primary key (id);

alter table public.beta_allowlist
    alter column email drop not null;

create unique index if not exists beta_allowlist_email_lower
    on public.beta_allowlist (lower(email))
    where email is not null;

create unique index if not exists beta_allowlist_github_login_lower
    on public.beta_allowlist (lower(github_login))
    where github_login is not null;

alter table public.beta_allowlist
    drop constraint if exists beta_allowlist_email_or_github;

alter table public.beta_allowlist
    add constraint beta_allowlist_email_or_github
    check (email is not null or github_login is not null);

create or replace function public.lower_beta_email()
returns trigger as $$
begin
    if new.email is not null then
        new.email = lower(new.email);
    end if;
    if new.github_login is not null then
        new.github_login = lower(new.github_login);
    end if;
    return new;
end;
$$ language plpgsql;

drop policy if exists "Users can check their own allowlist status" on public.beta_allowlist;

create policy "Users can check their own allowlist status" on public.beta_allowlist
    for select using (
        (email is not null and lower(auth.jwt() ->> 'email') = email)
        or (
            github_login is not null
            and exists (
                select 1
                from auth.identities i
                where i.user_id = auth.uid()
                  and i.provider = 'github'
                  and lower(coalesce(
                      i.identity_data->>'user_name',
                      i.identity_data->>'login',
                      i.identity_data->>'preferred_username',
                      ''
                  )) = lower(beta_allowlist.github_login)
            )
        )
    );

insert into public.beta_allowlist (github_login, note)
select v.github_login, v.note
from (values
    ('cactusbass', 'Chad Kimner / issue 28'),
    ('moomoomoo1', 'Moomoomoo1 / issue 28')
) as v(github_login, note)
where not exists (
    select 1
    from public.beta_allowlist b
    where lower(b.github_login) = lower(v.github_login)
);
