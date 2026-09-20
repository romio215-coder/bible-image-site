-- 준비용 마이그레이션: 실제 Supabase 프로젝트에서 적용한 적이 없습니다.
create table if not exists public.user_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('bookmark','note','read','settings','plan','last')),
  record_key text not null check (length(record_key) between 1 and 200),
  payload jsonb not null default '{}'::jsonb,
  deleted boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, kind, record_key)
);
alter table public.user_records enable row level security;
create policy "Read own records" on public.user_records for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own records" on public.user_records for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own records" on public.user_records for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own records" on public.user_records for delete to authenticated using ((select auth.uid()) = user_id);
revoke all on public.user_records from anon;
grant select, insert, update, delete on public.user_records to authenticated;
create or replace function public.touch_user_record() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger touch_user_record before update on public.user_records for each row execute function public.touch_user_record();
