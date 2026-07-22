-- ---------------------------------------------------------------------
-- Migração: tabela de eventos (analytics simples) + e-mail nos leads.
-- Rode este arquivo no Supabase → SQL Editor.
-- ---------------------------------------------------------------------

-- E-mail opcional no funil de material gratuito
alter table public.leads
  add column if not exists email text;

comment on column public.leads.email is 'E-mail opcional informado no funil de material gratuito.';

-- Tabela de eventos de comportamento (cliques e progresso em formulários)
create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,           -- 'click' | 'form_step' | 'form_submit' | 'form_open'
  rotulo text not null,         -- ex.: 'nav:Protocolos', 'preconsulta:Dados Pessoais'
  sessao_id text,               -- id anônimo gerado no navegador (sem dado pessoal)
  pagina text,                  -- caminho da página (ex.: '/', '/preconsulta')
  created_at timestamptz not null default now()
);

comment on table public.eventos is 'Eventos anônimos de comportamento (cliques e progresso em formulários) para a aba Marketing do painel.';

create index if not exists eventos_created_at_idx on public.eventos (created_at desc);
create index if not exists eventos_tipo_rotulo_idx on public.eventos (tipo, rotulo);

-- A API insere e o painel lê usando a SERVICE ROLE KEY (bypassa RLS).
-- RLS fica ativado e SEM políticas públicas — nada acessível pela chave anon.
alter table public.eventos enable row level security;
