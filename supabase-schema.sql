-- 理科キッズ アカウント・学習記録用 Supabase SQL
-- Supabase の SQL Editor で一度だけ実行してください。
-- Authentication > Providers > Email で Confirm email を OFF にしてください。
-- 画面上はメールアドレスを使いません。内部ではユーザー名から生成した
-- @accounts.rikakids.invalid の識別子を Supabase Auth に渡します。

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  correct_count bigint not null default 0 check (correct_count >= 0),
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username));

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  unit text not null check (unit in ('化学','物理','生物','地学')),
  correct_count integer not null default 1 check (correct_count = 1),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "Users can read own quiz attempts" on public.quiz_attempts;
create policy "Users can read own quiz attempts" on public.quiz_attempts
  for select to authenticated using (auth.uid() = user_id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_rikakids on auth.users;
create trigger on_auth_user_created_rikakids
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

create or replace function public.record_quiz_result(p_unit text)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare new_total bigint;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です';
  end if;
  if p_unit not in ('化学','物理','生物','地学') then
    raise exception '不正な分野です';
  end if;
  update public.profiles
    set correct_count = correct_count + 1
    where id = auth.uid()
    returning correct_count into new_total;
  if new_total is null then
    raise exception 'プロフィールが見つかりません';
  end if;
  insert into public.quiz_attempts (user_id, unit, correct_count)
    values (auth.uid(), p_unit, 1);
  return new_total;
end;
$$;

revoke all on function public.record_quiz_result(text) from public;
grant execute on function public.record_quiz_result(text) to authenticated;
