-- =====================================================================
-- Instituto Médico Brito — Área Admin (conteúdo editável + imagens)
-- Cole no Supabase > SQL Editor > New query e clique em RUN.
-- Pode rodar mesmo que o schema.sql já tenha sido executado antes.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Tabela de conteúdo editável do site (uma única linha, em JSON)
-- ---------------------------------------------------------------------
create table if not exists public.site_content (
  id          text primary key default 'main',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Garante que a linha principal exista
insert into public.site_content (id, data)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_content enable row level security;

-- Leitura pública (o site precisa ler o conteúdo para exibir)
drop policy if exists "site_content público leitura" on public.site_content;
create policy "site_content público leitura"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Escrita apenas por usuários autenticados (o painel /admin)
drop policy if exists "site_content escrita autenticada" on public.site_content;
create policy "site_content escrita autenticada"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------
-- 2) Bucket de imagens (logo, foto dos médicos, etc.)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- Leitura pública das imagens
drop policy if exists "assets leitura pública" on storage.objects;
create policy "assets leitura pública"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-assets');

-- Upload / atualização / remoção apenas por usuários autenticados
drop policy if exists "assets upload autenticado" on storage.objects;
create policy "assets upload autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-assets');

drop policy if exists "assets update autenticado" on storage.objects;
create policy "assets update autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-assets');

drop policy if exists "assets delete autenticado" on storage.objects;
create policy "assets delete autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-assets');
