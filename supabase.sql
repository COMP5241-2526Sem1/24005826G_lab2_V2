-- Notes table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null default '',
  content text not null default '',
  tags text[] not null default '{}',
  language text,
  reminder_at timestamptz,
  market_refs jsonb,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_tags_gin on public.notes using gin(tags);
create index if not exists notes_created_at_idx on public.notes(created_at desc);


-- Disable RLS so all users can read/write notes
alter table public.notes disable row level security;

-- Trigger to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger set_updated_at before update on public.notes
  for each row execute procedure public.set_updated_at();
exception when others then null; end $$;
