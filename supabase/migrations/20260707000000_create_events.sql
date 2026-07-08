-- supabase/migrations/20260707000000_create_events.sql
create table public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  tipo_evento text not null,
  fecha_evento timestamptz not null,
  ubicacion text not null,
  slug text not null unique,
  paquete text not null check (paquete in ('esencial', 'clasico', 'premium')),
  estado text not null default 'borrador' check (estado in ('borrador', 'activo', 'finalizado'))
);

alter table public.events enable row level security;

create policy "Authenticated users can select events"
  on public.events for select
  to authenticated
  using (true);

create policy "Authenticated users can insert events"
  on public.events for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update events"
  on public.events for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete events"
  on public.events for delete
  to authenticated
  using (true);
