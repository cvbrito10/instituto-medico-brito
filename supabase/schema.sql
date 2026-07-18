-- =====================================================================
-- Instituto Médico Brito — Schema Supabase
-- Cole este arquivo no Supabase Dashboard > SQL Editor > New query e RUN.
-- =====================================================================

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tabela de leads / solicitações de agendamento
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  nome         text not null,
  telefone     text not null,
  email        text,
  objetivo     text,           -- ex.: Emagrecimento, Reposição hormonal...
  mensagem     text,
  origem       text default 'landing-page',
  status       text not null default 'novo'  -- novo | contatado | agendado | arquivado
    check (status in ('novo', 'contatado', 'agendado', 'arquivado')),
  user_agent   text,
  referer      text
);

comment on table public.leads is 'Solicitações de agendamento captadas na landing page.';

-- Índice para ordenar por data (dashboard interno)
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- ---------------------------------------------------------------------
-- Row Level Security
-- A API insere usando a SERVICE ROLE KEY (bypassa RLS), então mantemos
-- RLS ativado e SEM políticas públicas de leitura. Dados ficam privados.
-- ---------------------------------------------------------------------
alter table public.leads enable row level security;

-- (Opcional) Permitir INSERT anônimo direto do cliente, caso você prefira
-- não usar a service role. Descomente as duas linhas abaixo se desejar.
-- create policy "allow anon insert" on public.leads
--   for insert to anon with check (true);

-- Nenhuma policy de SELECT/UPDATE/DELETE para anon: leitura só via painel
-- Supabase (service role) ou usuários autenticados que você configurar.
