import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { MarketingDashboard } from './MarketingDashboard';

export const dynamic = 'force-dynamic';

const STEP_LABELS = [
  'Início',
  'Dados Pessoais',
  'Histórico Ginecológico',
  'Saúde Geral',
  'Seus Objetivos',
  'Enviar',
];

export type LeadRow = {
  id: string;
  nome: string | null;
  telefone: string | null;
  cidade: string | null;
  email: string | null;
  origem: string | null;
  objetivo: string | null;
  created_at: string;
};

export type CliqueRow = { rotulo: string; total: number };
export type FunilStep = { etapa: string; total: number };

export default async function MarketingPage() {
  let userEmail = '';
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');
    userEmail = user.email ?? '';
  } catch (err) {
    if (err && typeof err === 'object' && 'digest' in err) throw err;
    redirect('/admin/login');
  }

  let cliques: CliqueRow[] = [];
  let funilPreconsulta: FunilStep[] = [];
  let preconsultaEnviados = 0;
  let agendamentoAbertos = 0;
  let agendamentoEnviados = 0;
  let leads: LeadRow[] = [];
  let erro = '';

  try {
    const admin = createSupabaseAdminClient();

    const { data: eventos, error: erroEventos } = await admin
      .from('eventos')
      .select('tipo, rotulo')
      .order('created_at', { ascending: false })
      .limit(8000);

    if (erroEventos) throw erroEventos;

    const contagemCliques = new Map<string, number>();
    const contagemFunil = new Map<string, number>();

    for (const ev of eventos ?? []) {
      if (ev.tipo === 'click') {
        contagemCliques.set(ev.rotulo, (contagemCliques.get(ev.rotulo) ?? 0) + 1);
      }
      if (ev.tipo === 'form_step' && ev.rotulo.startsWith('preconsulta:')) {
        contagemFunil.set(ev.rotulo, (contagemFunil.get(ev.rotulo) ?? 0) + 1);
      }
      if (ev.tipo === 'form_submit' && ev.rotulo === 'preconsulta') preconsultaEnviados++;
      if (ev.tipo === 'form_open' && ev.rotulo === 'agendamento') agendamentoAbertos++;
      if (ev.tipo === 'form_submit' && ev.rotulo === 'agendamento') agendamentoEnviados++;
    }

    cliques = Array.from(contagemCliques.entries())
      .map(([rotulo, total]) => ({ rotulo, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);

    funilPreconsulta = STEP_LABELS.map((etapa) => ({
      etapa,
      total: contagemFunil.get(`preconsulta:${etapa}`) ?? 0,
    }));

    const { data: leadsData, error: erroLeads } = await admin
      .from('leads')
      .select('id, nome, telefone, cidade, email, origem, objetivo, created_at')
      .order('created_at', { ascending: false })
      .limit(300);

    if (erroLeads) throw erroLeads;
    leads = leadsData ?? [];
  } catch (err) {
    erro =
      err instanceof Error
        ? err.message
        : 'Não foi possível carregar os dados. Confira se a migração do Supabase (eventos/leads) foi aplicada.';
  }

  return (
    <MarketingDashboard
      userEmail={userEmail}
      cliques={cliques}
      funilPreconsulta={funilPreconsulta}
      preconsultaEnviados={preconsultaEnviados}
      agendamentoAbertos={agendamentoAbertos}
      agendamentoEnviados={agendamentoEnviados}
      leads={leads}
      erro={erro}
    />
  );
}
