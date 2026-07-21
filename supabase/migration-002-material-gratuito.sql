-- ---------------------------------------------------------------------
-- Migração: novas colunas na tabela leads para o funil de material
-- gratuito (PDF). Rode este arquivo no Supabase → SQL Editor.
-- ---------------------------------------------------------------------

alter table public.leads
  add column if not exists cidade text,
  add column if not exists material text;

comment on column public.leads.cidade is 'Cidade informada pelo lead (ex.: funil de material gratuito).';
comment on column public.leads.material is 'Nome do material/PDF baixado, quando origem = material-gratuito.';
