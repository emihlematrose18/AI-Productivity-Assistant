create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.assign_founder_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) = 'emihlematrose18@gmail.com' then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.assign_founder_admin();
insert into public.user_roles(user_id, role) select id, 'admin' from auth.users where lower(email)='emihlematrose18@gmail.com' on conflict do nothing;

create table public.analytics (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('visit','chat_started','clear_chat')),
  language text not null check (language in ('en','xh','zu','af')),
  timestamp timestamptz not null default now()
);
grant insert on public.analytics to anon, authenticated;
grant select on public.analytics to authenticated;
grant all on public.analytics to service_role;
alter table public.analytics enable row level security;
create policy "Anyone can log anonymous events" on public.analytics for insert to anon, authenticated with check (true);
create policy "Admins read analytics" on public.analytics for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  rating text not null check (rating in ('up','down')),
  comment text check (comment is null or char_length(comment) <= 200),
  language text not null check (language in ('en','xh','zu','af')),
  timestamp timestamptz not null default now()
);
grant insert on public.feedback to anon, authenticated;
grant select on public.feedback to authenticated;
grant all on public.feedback to service_role;
alter table public.feedback enable row level security;
create policy "Anyone can leave anonymous feedback" on public.feedback for insert to anon, authenticated with check (comment is null or (comment !~* '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}' and comment !~ '(\+?\d[\s-]?){9,}'));
create policy "Admins read feedback" on public.feedback for select to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.parents_supported() returns bigint language sql stable security definer set search_path = public as $$ select count(*) from public.analytics where event_type = 'chat_started' $$;
grant execute on function public.parents_supported() to anon, authenticated;