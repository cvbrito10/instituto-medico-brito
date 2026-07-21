'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { Monogram } from '@/components/Monogram';
import { CONTACT, whatsappLink } from '@/lib/constants';

type FormState = {
  // Dados pessoais
  nome: string;
  sexo: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  profissao: string;
  convenio: string;
  email: string;
  endereco: string;
  comoConheceu: string;
  quemIndicou: string;

  // Histórico Ginecológico
  queixaPrincipal: string;
  historiaResumo: string;
  temFilhos: string;
  quantosFilhos: string;
  tipoParto: string;
  idadeMenarca: string;
  idadePrimeiraRelacao: string;
  dum: string;
  cicloMenstrual: string;
  fluxo: string;
  tpm: string;
  metodoContraceptivo: string;
  ultimoPapanicolau: string;

  // Saúde Geral
  doencasPrevias: string;
  medicamentos: string;
  cirurgias: string;
  historicoFamiliarCancer: string;
  peso: string;
  altura: string;
  atividadeFisica: string;
  tabagismo: string;
  qualidadeSono: string;
  qualidadeAlimentacao: string;
  evacuaDiariamente: string;
  libido: string;

  // Seus Objetivos
  objetivo1: string;
  objetivo2: string;
  objetivo3: string;
};

const INITIAL: FormState = {
  nome: '',
  sexo: '',
  dataNascimento: '',
  cpf: '',
  rg: '',
  profissao: '',
  convenio: '',
  email: '',
  endereco: '',
  comoConheceu: '',
  quemIndicou: '',
  queixaPrincipal: '',
  historiaResumo: '',
  temFilhos: '',
  quantosFilhos: '',
  tipoParto: '',
  idadeMenarca: '',
  idadePrimeiraRelacao: '',
  dum: '',
  cicloMenstrual: '',
  fluxo: '',
  tpm: '',
  metodoContraceptivo: '',
  ultimoPapanicolau: '',
  doencasPrevias: '',
  medicamentos: '',
  cirurgias: '',
  historicoFamiliarCancer: '',
  peso: '',
  altura: '',
  atividadeFisica: '',
  tabagismo: '',
  qualidadeSono: '',
  qualidadeAlimentacao: '',
  evacuaDiariamente: '',
  libido: '',
  objetivo1: '',
  objetivo2: '',
  objetivo3: '',
};

const STEP_LABELS = [
  'Início',
  'Dados Pessoais',
  'Histórico Ginecológico',
  'Saúde Geral',
  'Seus Objetivos',
  'Enviar',
];

const ease = [0.22, 1, 0.36, 1] as const;

export function PreConsultaForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [sent, setSent] = useState(false);

  const progress = Math.round((step / (STEP_LABELS.length - 1)) * 100);

  const set =
    <K extends keyof FormState>(key: K) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const radio = (key: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const next = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const mensagem = useMemo(() => buildMessage(form), [form]);

  const enviar = () => {
    setSent(true);
    window.open(whatsappLink(mensagem), '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-porcelain font-sans text-espresso">
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(120% 80% at 50% -10%, #ffffff 0%, #fcfaf6 45%, #f6f1e8 100%)',
        }}
      />

      {/* Barra de progresso */}
      <div className="fixed inset-x-0 top-0 z-20 h-1.5 bg-nude/60">
        <motion.div
          className="h-full bg-gold-fade"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease }}
        />
      </div>

      <div className="container-luxe max-w-2xl py-14 sm:py-20">
        {/* Cabeçalho */}
        <div className="mb-10 text-center">
          <Monogram className="mx-auto h-12 w-12" />
          <p className="eyebrow mt-4">{CONTACT.doctors.join(' & ')}</p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-espresso sm:text-4xl">
            Formulário de Pré-Consulta
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed text-espresso-soft">
            Bem-vindo(a) ao seu cuidado. Leva menos de 3 minutos e nos ajuda a
            conhecer sua história antes mesmo da consulta.
          </p>
          <p className="mt-3 font-sans text-[0.7rem] uppercase tracking-[0.2em] text-bronze">
            {STEP_LABELS[step]} · {progress}%
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease }}
            className="rounded-[26px] border border-gold/20 bg-white/70 p-7 shadow-soft sm:p-10"
          >
            {step === 0 && <Intro onStart={next} />}

            {step === 1 && (
              <FormSection titulo="Dados Pessoais">
                <Field label="Nome completo" required>
                  <input className={inputCls} value={form.nome} onChange={set('nome')} placeholder="Seu nome completo" />
                </Field>

                <Field label="Sexo" required>
                  <RadioGroup value={form.sexo} onChange={radio('sexo')} options={['Feminino', 'Masculino']} />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Data de nascimento">
                    <input type="date" className={inputCls} value={form.dataNascimento} onChange={set('dataNascimento')} />
                  </Field>
                  <Field label="CPF">
                    <input className={inputCls} value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="RG (opcional)">
                    <input className={inputCls} value={form.rg} onChange={set('rg')} />
                  </Field>
                  <Field label="Profissão (opcional)">
                    <input className={inputCls} value={form.profissao} onChange={set('profissao')} />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Convênio médico (opcional)">
                    <input className={inputCls} value={form.convenio} onChange={set('convenio')} placeholder="Particular ou nome do convênio" />
                  </Field>
                  <Field label="E-mail (opcional)">
                    <input type="email" className={inputCls} value={form.email} onChange={set('email')} />
                  </Field>
                </div>

                <Field label="Endereço completo com CEP (opcional)">
                  <input className={inputCls} value={form.endereco} onChange={set('endereco')} />
                </Field>

                <Field label="Como conheceu o Instituto Médico Brito?">
                  <select className={selectCls} value={form.comoConheceu} onChange={set('comoConheceu')}>
                    <option value="">Selecione...</option>
                    <option>Instagram</option>
                    <option>Google</option>
                    <option>Indicação</option>
                    <option>Hospital / Clínica</option>
                    <option>Outro</option>
                  </select>
                </Field>

                {form.comoConheceu === 'Indicação' && (
                  <Field label="Quem lhe indicou?">
                    <input className={inputCls} value={form.quemIndicou} onChange={set('quemIndicou')} />
                  </Field>
                )}
              </FormSection>
            )}

            {step === 2 && (
              <FormSection titulo="Histórico Ginecológico">
                <Field label="Queixa principal" required>
                  <textarea rows={3} className={inputCls} value={form.queixaPrincipal} onChange={set('queixaPrincipal')} placeholder="Descreva o motivo principal da sua consulta..." />
                </Field>

                <Field label="Sua história (resumo)">
                  <textarea rows={3} className={inputCls} value={form.historiaResumo} onChange={set('historiaResumo')} placeholder="Conte um pouco sobre sua saúde, trajetória, o que achar relevante..." />
                </Field>

                <Field label="Tem filhos?">
                  <RadioGroup value={form.temFilhos} onChange={radio('temFilhos')} options={['Sim', 'Não']} />
                </Field>

                {form.temFilhos === 'Sim' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Quantos filhos?">
                      <input className={inputCls} value={form.quantosFilhos} onChange={set('quantosFilhos')} />
                    </Field>
                    <Field label="Tipo de parto">
                      <RadioGroup value={form.tipoParto} onChange={radio('tipoParto')} options={['Normal', 'Cesárea', 'Ambos']} />
                    </Field>
                  </div>
                )}

                <Field label="Com quantos anos menstruou pela 1ª vez?">
                  <input inputMode="numeric" className={inputCls} value={form.idadeMenarca} onChange={set('idadeMenarca')} placeholder="Ex: 12 anos" />
                </Field>

                <Field label="Com quantos anos foi sua 1ª relação sexual?">
                  <input inputMode="numeric" className={inputCls} value={form.idadePrimeiraRelacao} onChange={set('idadePrimeiraRelacao')} placeholder="Ex: 17 anos" />
                </Field>

                <Field label="Data da última menstruação (DUM)">
                  <input type="date" className={inputCls} value={form.dum} onChange={set('dum')} />
                </Field>

                <Field label="Período do ciclo menstrual">
                  <RadioGroup
                    value={form.cicloMenstrual}
                    onChange={radio('cicloMenstrual')}
                    options={['Curto — menos de 21 dias', 'Normal — 21 a 35 dias', 'Longo — mais de 40 dias']}
                  />
                </Field>

                <Field label="Característica do fluxo">
                  <RadioGroup value={form.fluxo} onChange={radio('fluxo')} options={['Leve', 'Moderado', 'Intenso']} />
                </Field>

                <Field label="Possui TPM?">
                  <RadioGroup value={form.tpm} onChange={radio('tpm')} options={['Sim', 'Não']} />
                </Field>

                <Field label="Método anticoncepcional atual">
                  <input className={inputCls} value={form.metodoContraceptivo} onChange={set('metodoContraceptivo')} placeholder="Pílula, DIU, preservativo, nenhum..." />
                </Field>

                <Field label="Quando foi o último Papanicolau?">
                  <input className={inputCls} value={form.ultimoPapanicolau} onChange={set('ultimoPapanicolau')} placeholder="Mês/Ano ou 'Nunca fiz'" />
                </Field>
              </FormSection>
            )}

            {step === 3 && (
              <FormSection titulo="Saúde Geral">
                <Field label="Doenças prévias">
                  <textarea rows={3} className={inputCls} value={form.doencasPrevias} onChange={set('doencasPrevias')} placeholder="Hipertensão, diabetes, tireoide, outras... ou 'Nenhuma'" />
                </Field>

                <Field label="Medicamentos ou suplementos em uso">
                  <textarea rows={3} className={inputCls} value={form.medicamentos} onChange={set('medicamentos')} placeholder="Liste os medicamentos/suplementos ou 'Nenhum'" />
                </Field>

                <Field label="Cirurgias realizadas">
                  <textarea rows={3} className={inputCls} value={form.cirurgias} onChange={set('cirurgias')} placeholder="Quais cirurgias? Quando? Ou 'Nenhuma'" />
                </Field>

                <Field label="Histórico de câncer de mama na família?">
                  <RadioGroup value={form.historicoFamiliarCancer} onChange={radio('historicoFamiliarCancer')} options={['Sim', 'Não', 'Não sei']} />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Peso">
                    <input className={inputCls} value={form.peso} onChange={set('peso')} placeholder="Ex: 65 kg" />
                  </Field>
                  <Field label="Altura">
                    <input className={inputCls} value={form.altura} onChange={set('altura')} placeholder="Ex: 1,68 m" />
                  </Field>
                </div>

                <Field label="Atividade física">
                  <input className={inputCls} value={form.atividadeFisica} onChange={set('atividadeFisica')} placeholder="Qual? Quantas vezes por semana?" />
                </Field>

                <Field label="Tabagismo">
                  <RadioGroup value={form.tabagismo} onChange={radio('tabagismo')} options={['Nunca fumei', 'Fumante', 'Ex-fumante']} />
                </Field>

                <Field label="Qualidade do sono">
                  <RadioGroup value={form.qualidadeSono} onChange={radio('qualidadeSono')} options={['Bom', 'Razoável', 'Ruim']} />
                </Field>

                <Field label="Qualidade da alimentação">
                  <RadioGroup value={form.qualidadeAlimentacao} onChange={radio('qualidadeAlimentacao')} options={['Boa', 'Razoável', 'Ruim']} />
                </Field>

                <Field label="Evacua diariamente?">
                  <RadioGroup value={form.evacuaDiariamente} onChange={radio('evacuaDiariamente')} options={['Sim', 'Não']} />
                </Field>

                <Field label="Como está sua libido (desejo sexual)?">
                  <textarea rows={2} className={inputCls} value={form.libido} onChange={set('libido')} placeholder="Descreva como está seu desejo sexual..." />
                </Field>
              </FormSection>
            )}

            {step === 4 && (
              <FormSection titulo="Seus Objetivos">
                <div>
                  <span className="mb-1.5 block font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">
                    Seus 3 principais objetivos com esta consulta <span className="text-gold">*</span>
                  </span>
                  <p className="mb-4 text-sm text-espresso-soft">
                    Em ordem de prioridade — o que é mais importante para você?
                  </p>
                  <div className="space-y-3">
                    <NumberedField n={1} value={form.objetivo1} onChange={set('objetivo1')} placeholder="Objetivo prioritário" />
                    <NumberedField n={2} value={form.objetivo2} onChange={set('objetivo2')} placeholder="Segundo objetivo" />
                    <NumberedField n={3} value={form.objetivo3} onChange={set('objetivo3')} placeholder="Terceiro objetivo" />
                  </div>
                </div>
              </FormSection>
            )}

            {step === 5 &&
              (sent ? (
                <Confirmacao onReenviar={enviar} />
              ) : (
                <Revisao onEnviar={enviar} />
              ))}
          </motion.div>
        </AnimatePresence>

        {/* Navegação */}
        {step > 0 && step < STEP_LABELS.length - 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={back}
              className="inline-flex items-center gap-1.5 font-sans text-sm text-espresso-soft transition hover:text-espresso"
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              Voltar
            </button>
            <button onClick={next} className="btn-primary">
              Continuar
              <ArrowRight size={16} strokeWidth={1.8} />
            </button>
          </div>
        )}
        {step === STEP_LABELS.length - 1 && !sent && (
          <div className="mt-6">
            <button
              onClick={back}
              className="inline-flex items-center gap-1.5 font-sans text-sm text-espresso-soft transition hover:text-espresso"
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              Voltar e revisar
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------------------------------------------------------------------- */
/* Início e Envio                                                          */
/* ---------------------------------------------------------------------- */

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center">
      <span className="text-gold-fill font-display text-4xl">✦</span>
      <h2 className="mt-4 font-display text-2xl text-espresso">Vamos começar?</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-espresso-soft">
        Suas respostas chegam diretamente à nossa equipe médica pelo
        WhatsApp, com total privacidade. Nenhum dado fica armazenado neste
        formulário.
      </p>
      <button onClick={onStart} className="btn-primary mt-7">
        Iniciar formulário
        <ArrowRight size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}

function Revisao({ onEnviar }: { onEnviar: () => void }) {
  return (
    <div className="text-center">
      <span className="text-gold-fill font-display text-4xl">✦</span>
      <h2 className="mt-4 font-display text-2xl text-espresso">Tudo pronto!</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-espresso-soft">
        Suas respostas serão enviadas diretamente à nossa equipe pelo
        WhatsApp. Obrigado por preencher este formulário com carinho — ele
        nos ajuda a te conhecer antes mesmo da consulta.
      </p>
      <button onClick={onEnviar} className="btn-primary mt-7">
        <Phone size={16} strokeWidth={1.8} />
        Enviar Formulário via WhatsApp
      </button>
    </div>
  );
}

function Confirmacao({ onReenviar }: { onReenviar: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-fade text-porcelain">
        <CheckCircle2 size={26} strokeWidth={2} />
      </div>
      <h2 className="font-display text-2xl text-espresso">Formulário enviado</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-espresso-soft">
        Estamos abrindo o WhatsApp com o seu resumo. Se não abrir
        automaticamente, toque no botão abaixo.
      </p>
      <button onClick={onReenviar} className="btn-primary mt-6">
        <Phone size={16} strokeWidth={1.8} />
        Abrir WhatsApp novamente
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Peças reutilizáveis                                                     */
/* ---------------------------------------------------------------------- */

function FormSection({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="text-gold-fill font-display text-2xl">✦</span>
        <h2 className="font-display text-2xl text-espresso">{titulo}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
    </label>
  );
}

function RadioGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            className={
              active
                ? 'rounded-full border border-gold bg-gold-fade px-4 py-2 font-sans text-[0.8rem] text-porcelain shadow-soft transition'
                : 'rounded-full border border-nude-deep/50 bg-white/70 px-4 py-2 font-sans text-[0.8rem] text-espresso-soft transition hover:border-gold/50'
            }
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function NumberedField({
  n,
  value,
  onChange,
  placeholder,
}: {
  n: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-fade font-sans text-sm font-semibold text-porcelain">
        {n}
      </span>
      <input className={inputCls} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-nude-deep/50 bg-white/70 px-4 py-3 font-sans text-sm text-espresso placeholder:text-espresso-soft/50 transition focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/25';

const selectCls = `${inputCls} appearance-none bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10`;

/* ---------------------------------------------------------------------- */
/* Montagem da mensagem do WhatsApp                                        */
/* ---------------------------------------------------------------------- */

function buildMessage(f: FormState): string {
  const l = (cond: string, texto: string): string | undefined =>
    cond ? texto : undefined;

  const linhas: (string | undefined)[] = [
    '📋 *Formulário de Pré-Consulta — Instituto Médico Brito*',
    '',
    '*Dados Pessoais*',
    `Nome: ${f.nome}`,
    l(f.sexo, `Sexo: ${f.sexo}`),
    l(f.dataNascimento, `Nascimento: ${f.dataNascimento}`),
    l(f.cpf, `CPF: ${f.cpf}`),
    l(f.rg, `RG: ${f.rg}`),
    l(f.profissao, `Profissão: ${f.profissao}`),
    l(f.convenio, `Convênio: ${f.convenio}`),
    l(f.email, `E-mail: ${f.email}`),
    l(f.endereco, `Endereço: ${f.endereco}`),
    l(f.comoConheceu, `Como conheceu: ${f.comoConheceu}`),
    l(f.quemIndicou, `Indicação de: ${f.quemIndicou}`),
    '',
    '*Histórico Ginecológico*',
    l(f.queixaPrincipal, `Queixa principal: ${f.queixaPrincipal}`),
    l(f.historiaResumo, `História: ${f.historiaResumo}`),
    l(f.temFilhos, `Tem filhos: ${f.temFilhos}`),
    l(f.quantosFilhos, `Quantos filhos: ${f.quantosFilhos}`),
    l(f.tipoParto, `Tipo de parto: ${f.tipoParto}`),
    l(f.idadeMenarca, `Idade da 1ª menstruação: ${f.idadeMenarca}`),
    l(f.idadePrimeiraRelacao, `Idade da 1ª relação: ${f.idadePrimeiraRelacao}`),
    l(f.dum, `DUM: ${f.dum}`),
    l(f.cicloMenstrual, `Ciclo menstrual: ${f.cicloMenstrual}`),
    l(f.fluxo, `Fluxo: ${f.fluxo}`),
    l(f.tpm, `TPM: ${f.tpm}`),
    l(f.metodoContraceptivo, `Método contraceptivo: ${f.metodoContraceptivo}`),
    l(f.ultimoPapanicolau, `Último Papanicolau: ${f.ultimoPapanicolau}`),
    '',
    '*Saúde Geral*',
    l(f.doencasPrevias, `Doenças prévias: ${f.doencasPrevias}`),
    l(f.medicamentos, `Medicamentos/suplementos: ${f.medicamentos}`),
    l(f.cirurgias, `Cirurgias: ${f.cirurgias}`),
    l(f.historicoFamiliarCancer, `Histórico familiar de câncer de mama: ${f.historicoFamiliarCancer}`),
    l(f.peso, `Peso: ${f.peso}`),
    l(f.altura, `Altura: ${f.altura}`),
    l(f.atividadeFisica, `Atividade física: ${f.atividadeFisica}`),
    l(f.tabagismo, `Tabagismo: ${f.tabagismo}`),
    l(f.qualidadeSono, `Sono: ${f.qualidadeSono}`),
    l(f.qualidadeAlimentacao, `Alimentação: ${f.qualidadeAlimentacao}`),
    l(f.evacuaDiariamente, `Evacuação diária: ${f.evacuaDiariamente}`),
    l(f.libido, `Libido: ${f.libido}`),
    '',
    '*Objetivos (em ordem de prioridade)*',
    l(f.objetivo1, `1. ${f.objetivo1}`),
    l(f.objetivo2, `2. ${f.objetivo2}`),
    l(f.objetivo3, `3. ${f.objetivo3}`),
  ];

  return linhas.filter((x): x is string => x !== undefined).join('\n');
}
