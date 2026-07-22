'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Download, Users, MousePointerClick } from 'lucide-react';
import { Monogram } from '@/components/Monogram';
import type { CliqueRow, FunilStep, LeadRow } from './page';

type Props = {
  userEmail: string;
  cliques: CliqueRow[];
  funilPreconsulta: FunilStep[];
  preconsultaEnviados: number;
  agendamentoAbertos: number;
  agendamentoEnviados: number;
  leads: LeadRow[];
  erro: string;
};

const ORIGENS = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'landing-page', label: 'Agendamento' },
  { valor: 'material-gratuito', label: 'Material Gratuito' },
];

export function MarketingDashboard({
  userEmail,
  cliques,
  funilPreconsulta,
  preconsultaEnviados,
  agendamentoAbertos,
  agendamentoEnviados,
  leads,
  erro,
}: Props) {
  const [filtro, setFiltro] = useState('todos');

  const leadsFiltrados = useMemo(
    () => (filtro === 'todos' ? leads : leads.filter((l) => l.origem === filtro)),
    [leads, filtro],
  );

  const maxClique = Math.max(1, ...cliques.map((c) => c.total));
  const maxFunil = Math.max(1, ...funilPreconsulta.map((f) => f.total));

  return (
    <main className="min-h-screen bg-porcelain pb-20">
      <header className="sticky top-0 z-10 glass border-b border-gold/15">
        <div className="container-luxe flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Monogram className="h-8 w-8" />
            <span className="font-roman text-sm tracking-[0.28em] text-espresso">MARKETING</span>
          </div>
          <a href="/admin"
            className="flex items-center gap-1.5 rounded-full border border-gold/30 px-4 py-2 text-sm text-espresso-soft hover:text-espresso">
            <ArrowLeft size={15} /> Voltar ao painel
          </a>
        </div>
      </header>

      <div className="container-luxe mt-8 max-w-5xl space-y-8">
        <p className="text-sm text-espresso-soft">
          Logado como <strong>{userEmail}</strong>. Dados de comportamento anônimo dos visitantes
          e leads capturados no site.
        </p>

        {erro && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            {erro}
          </div>
        )}

        {/* RESUMO */}
        <section className="grid gap-4 sm:grid-cols-3">
          <ResumoCard
            titulo="Agendamento"
            valor={`${agendamentoEnviados} / ${agendamentoAbertos}`}
            legenda="enviados / aberturas do modal"
          />
          <ResumoCard
            titulo="Pré-Consulta"
            valor={`${preconsultaEnviados} / ${funilPreconsulta[0]?.total ?? 0}`}
            legenda="enviados / iniciaram o formulário"
          />
          <ResumoCard
            titulo="Leads capturados"
            valor={String(leads.length)}
            legenda="agendamento + material gratuito"
          />
        </section>

        {/* CLIQUES */}
        <section className="rounded-2xl border border-gold/20 bg-white/70 p-6 shadow-soft">
          <h2 className="mb-1 flex items-center gap-2 font-display text-xl text-espresso">
            <MousePointerClick size={18} className="text-gold" />
            Onde os visitantes mais clicam
          </h2>
          <p className="mb-5 text-xs text-espresso-soft">
            Cliques em links do menu, botões de WhatsApp e chamadas para ação (últimos eventos registrados).
          </p>
          {cliques.length === 0 ? (
            <p className="text-sm text-espresso-soft">Ainda não há cliques registrados.</p>
          ) : (
            <div className="space-y-2.5">
              {cliques.map((c) => (
                <div key={c.rotulo} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-xs text-espresso-soft" title={c.rotulo}>
                    {c.rotulo}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-nude/60">
                    <div
                      className="h-full rounded-full bg-gold-fade"
                      style={{ width: `${(c.total / maxClique) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-medium text-espresso">
                    {c.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FUNIL PRÉ-CONSULTA */}
        <section className="rounded-2xl border border-gold/20 bg-white/70 p-6 shadow-soft">
          <h2 className="mb-1 font-display text-xl text-espresso">
            Funil do formulário de Pré-Consulta
          </h2>
          <p className="mb-5 text-xs text-espresso-soft">
            Quantas pessoas chegaram em cada etapa (cada etapa inclui quem foi além dela também).
          </p>
          <div className="space-y-2.5">
            {funilPreconsulta.map((f) => (
              <div key={f.etapa} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-xs text-espresso-soft">{f.etapa}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-nude/60">
                  <div
                    className="h-full rounded-full bg-gold-fade"
                    style={{ width: `${(f.total / maxFunil) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs font-medium text-espresso">
                  {f.total}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* LEADS */}
        <section className="rounded-2xl border border-gold/20 bg-white/70 p-6 shadow-soft">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl text-espresso">
              <Users size={18} className="text-gold" />
              Leads capturados
            </h2>
            <div className="flex gap-2">
              {ORIGENS.map((o) => (
                <button
                  key={o.valor}
                  onClick={() => setFiltro(o.valor)}
                  className={
                    filtro === o.valor
                      ? 'rounded-full border border-gold bg-gold-fade px-3 py-1 text-xs text-porcelain'
                      : 'rounded-full border border-nude-deep/50 px-3 py-1 text-xs text-espresso-soft'
                  }
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {leadsFiltrados.length === 0 ? (
            <p className="text-sm text-espresso-soft">Nenhum lead encontrado para este filtro.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-nude-deep/30 text-[0.7rem] uppercase tracking-wide text-bronze">
                    <th className="py-2 pr-4">Nome</th>
                    <th className="py-2 pr-4">WhatsApp</th>
                    <th className="py-2 pr-4">Cidade</th>
                    <th className="py-2 pr-4">E-mail</th>
                    <th className="py-2 pr-4">Origem</th>
                    <th className="py-2 pr-4">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsFiltrados.map((l) => (
                    <tr key={l.id} className="border-b border-nude-deep/15 text-espresso">
                      <td className="py-2 pr-4">{l.nome || '—'}</td>
                      <td className="py-2 pr-4">{l.telefone || '—'}</td>
                      <td className="py-2 pr-4">{l.cidade || '—'}</td>
                      <td className="py-2 pr-4">{l.email || '—'}</td>
                      <td className="py-2 pr-4">
                        {l.origem === 'material-gratuito' ? 'Material Gratuito' : 'Agendamento'}
                      </td>
                      <td className="py-2 pr-4 text-xs text-espresso-soft">
                        {new Date(l.created_at).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={() => baixarCsv(leadsFiltrados)}
            className="btn-primary mt-5"
          >
            <Download size={16} strokeWidth={1.8} />
            Baixar lista (CSV)
          </button>
        </section>
      </div>
    </main>
  );
}

function ResumoCard({ titulo, valor, legenda }: { titulo: string; valor: string; legenda: string }) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-white/70 p-6 text-center shadow-soft">
      <p className="text-[0.7rem] uppercase tracking-[0.14em] text-bronze">{titulo}</p>
      <p className="mt-2 font-display text-3xl text-espresso">{valor}</p>
      <p className="mt-1 text-xs text-espresso-soft">{legenda}</p>
    </div>
  );
}

function baixarCsv(leads: LeadRow[]) {
  const cabecalho = ['Nome', 'WhatsApp', 'Cidade', 'E-mail', 'Origem', 'Data'];
  const linhas = leads.map((l) => [
    l.nome ?? '',
    l.telefone ?? '',
    l.cidade ?? '',
    l.email ?? '',
    l.origem ?? '',
    new Date(l.created_at).toLocaleString('pt-BR'),
  ]);
  const csv = [cabecalho, ...linhas]
    .map((linha) => linha.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads-instituto-medico-brito.csv';
  a.click();
  URL.revokeObjectURL(url);
}
