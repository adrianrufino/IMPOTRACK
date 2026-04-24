-- ============================================
-- ImportTrack V2 — Script SQL para Supabase
-- ============================================

-- 1. Tabla de perfiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  role text not null default 'empleado' check (role in ('maestro','admin','empleado')),
  created_at timestamptz default now()
);

-- 2. Tabla de importaciones (con campos nuevos)
create table if not exists public.imports (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  supplier text not null,
  stage integer not null default 0 check (stage >= 0 and stage <= 7),
  purchase_date date,
  estimated_arrival date,
  vessel_name text,
  container_number text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Tabla de items por importación
create table if not exists public.import_items (
  id uuid default gen_random_uuid() primary key,
  import_id uuid references public.imports on delete cascade not null,
  code text not null,
  description text not null,
  quantity integer not null default 1,
  created_at timestamptz default now()
);

-- 4. Trigger para crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'empleado')
  ) on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists set_imports_updated_at on public.imports;
create trigger set_imports_updated_at
  before update on public.imports
  for each row execute function public.set_updated_at();

-- 6. RLS
alter table public.profiles enable row level security;
alter table public.imports enable row level security;
alter table public.import_items enable row level security;

-- Perfiles
drop policy if exists "Authenticated can read all profiles" on public.profiles;
create policy "Authenticated can read all profiles" on public.profiles
  for select using (auth.role() = 'authenticated');
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
drop policy if exists "Service can insert profiles" on public.profiles;
create policy "Service can insert profiles" on public.profiles
  for insert with check (true);

-- Imports
drop policy if exists "Authenticated can read imports" on public.imports;
create policy "Authenticated can read imports" on public.imports
  for select using (auth.role() = 'authenticated');
drop policy if exists "Authenticated can insert imports" on public.imports;
create policy "Authenticated can insert imports" on public.imports
  for insert with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated can update imports" on public.imports;
create policy "Authenticated can update imports" on public.imports
  for update using (auth.role() = 'authenticated');
drop policy if exists "Authenticated can delete imports" on public.imports;
create policy "Authenticated can delete imports" on public.imports
  for delete using (auth.role() = 'authenticated');

-- Import items
drop policy if exists "Authenticated can read items" on public.import_items;
create policy "Authenticated can read items" on public.import_items
  for select using (auth.role() = 'authenticated');
drop policy if exists "Authenticated can insert items" on public.import_items;
create policy "Authenticated can insert items" on public.import_items
  for insert with check (auth.role() = 'authenticated');
drop policy if exists "Authenticated can delete items" on public.import_items;
create policy "Authenticated can delete items" on public.import_items
  for delete using (auth.role() = 'authenticated');

-- ============================================
-- Si ya tenés la base de datos del proyecto anterior,
-- solo ejecutá esto para agregar los campos nuevos:
-- ============================================
-- ALTER TABLE public.imports ADD COLUMN IF NOT EXISTS estimated_arrival date;
-- ALTER TABLE public.imports ADD COLUMN IF NOT EXISTS vessel_name text;
-- ALTER TABLE public.imports ADD COLUMN IF NOT EXISTS container_number text;
-- CREATE TABLE IF NOT EXISTS public.import_items ( ... );
-- ============================================
-- Acordate de hacer tu usuario maestro:
-- UPDATE public.profiles SET role = 'maestro' WHERE email = 'tu@email.com';
-- ============================================
