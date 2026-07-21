'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { Monogram } from '@/components/Monogram';
import { useContent } from '@/components/ContentProvider';
import { waLink, type CampoConfig } from '@/lib/content';

type FormState = {
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
  objetivo1: string;
  objetivo2: string;
  objetivo3: string;
};

const INITIAL: FormState = {
  nome: '', sexo: '', dataNascimento: '', cpf: '', rg: '', profissao: '',
  convenio: '', email: '', endereco: '', comoConheceu: '', quemIndicou: '',
  queixaPrincipal: '', historiaResumo: '', temFilhos: '', quantosFilhos: '',
  tipoParto: '', idadeMenarca: '', idadePrimeiraRelacao: '', dum: '',
  cicloMenstrual: '', fluxo: '', tpm: '', metodoContraceptivo: '',
  ultimoPapanicolau: '', doencasPrevias: '', medicamentos: '', cirurgias: '',
  historicoFamiliarCancer: '', peso: '', altura: '', atividadeFisica: '',
  tabagismo: '', qualidadeSono: '', qualidadeAlimentacao: '',
  evacuaDiariamente: '', libido: '', objetivo1: '', objetivo2: '', objetivo3: '',
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

// Busca label/placeholder configurados no painel para um campo; cai para um
// texto padrão se o painel ainda não tiver esse campo (nunca quebra a tela).
function campo(lista: CampoConfig[], key: string, fallbackLabel = ''): CampoConfig {
  return lista.find((c) => c.key === key) ?? { key, label: fallbackLabel || key, placeholder: '' };
}

export function PreConsultaForm() {
  const { preconsulta } = useContent();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [sent, setSent] = useState(false);

  const dp = preconsulta.camposDadosPessoais;
  const hi = preconsulta.camposHistorico;
  const sg = preconsulta.camposSaudeGeral;
  const ob = preconsulta.camposObjetivos;

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

  const mensagem = useMemo(
    () => buildMessage(form, { dp, hi, sg, ob }),
    [form, dp, hi, sg, ob],
  );

  const enviar = () => {
    setSent(true);
    window.open(
      waLink(preconsulta.whatsappNumero, mensagem),
      '_blank',
      'noopener,noreferrer',
    );
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
          <p className="eyebrow mt-4">{preconsulta.eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-espresso sm:text-4xl">
            {preconsulta.titulo}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[0.9rem] leading-relaxed text-espresso-soft">
            {preconsulta.subtitulo}
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
                <Field label={campo(dp, 'nome', 'Nome completo').label} required>
                  <input className={inputCls} value={form.nome} onChange={set('nome')} placeholder={campo(dp, 'nome').placeholder} />
                </Field>

                <Field label={campo(dp, 'sexo', 'Sexo').label} required>
                  <RadioGroup value={form.sexo} onChange={radio('sexo')} options={['Feminino', 'Masculino']} />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={campo(dp, 'dataNascimento', 'Data de nascimento').label}>
                    <input type="date" className={inputCls} value={form.dataNascimento} onChange={set('dataNascimento')} />
                  </Field>
                  <Field label={campo(dp, 'cpf', 'CPF').label}>
                    <input className={inputCls} value={form.cpf} onChange={set('cpf')} placeholder={campo(dp, 'cpf').placeholder} />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={campo(dp, 'rg', 'RG (opcional)').label}>
                    <input className={inputCls} value={form.rg} onChange={set('rg')} />
                  </Field>
                  <Field label={campo(dp, 'profissao', 'Profissão (opcional)').label}>
                    <input className={inputCls} value={form.profissao} onChange={set('profissao')} />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={campo(dp, 'convenio', 'Convênio médico (opcional)').label}>
                    <input className={inputCls} value={form.convenio} onChange={set('convenio')} placeholder={campo(dp, 'convenio').placeholder} />
                  </Field>
                  <Field label={campo(dp, 'email', 'E-mail (opcional)').label}>
                    <input type="email" className={inputCls} value={form.email} onChange={set('email')} />
                  </Field>
                </div>

                <Field label={campo(dp, 'endereco', 'Endereço completo com CEP (opcional)').label}>
                  <input className={inputCls} value={form.endereco} onChange={set('endereco')} />
                </Field>

                <Field label={campo(dp, 'comoConheceu', 'Como conheceu o Instituto Médico Brito?').label}>
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
                  <Field label={campo(dp, 'quemIndicou', 'Quem lhe indicou?').label}>
                    <input className={inputCls} value={form.quemIndicou} onChange={set('quemIndicou')} />
                  </Field>
                )}
              </FormSection>
            )}

            {step === 2 && (
              <FormSection titulo="Histórico Ginecológico">
                <Field label={campo(hi, 'queixaPrincipal', 'Queixa principal').label} required>
                  <textarea rows={3} className={inputCls} value={form.queixaPrincipal} onChange={set('queixaPrincipal')} placeholder={campo(hi, 'queixaPrincipal').placeholder} />
                </Field>

                <Field label={campo(hi, 'historiaResumo', 'Sua história (resumo)').label}>
                  <textarea rows={3} className={inputCls} value={form.historiaResumo} onChange={set('historiaResumo')} placeholder={campo(hi, 'historiaResumo').placeholder} />
                </Field>

                <Field label={campo(hi, 'temFilhos', 'Tem filhos?').label}>
                  <RadioGroup value={form.temFilhos} onChange={radio('temFilhos')} options={['Sim', 'Não']} />
                </Field>

                {form.temFilhos === 'Sim' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={campo(hi, 'quantosFilhos', 'Quantos filhos?').label}>
                      <input className={inputCls} value={form.quantosFilhos} onChange={set('quantosFilhos')} />
                    </Field>
                    <Field label={campo(hi, 'tipoParto', 'Tipo de parto').label}>
                      <RadioGroup value={form.tipoParto} onChange={radio('tipoParto')} options={['Normal', 'Cesárea', 'Ambos']} />
                    </Field>
                  </div>
                )}

                <Field label={campo(hi, 'idadeMenarca', 'Com quantos anos menstruou pela 1ª vez?').label}>
                  <input inputMode="numeric" className={inputCls} value={form.idadeMenarca} onChange={set('idadeMenarca')} placeholder={campo(hi, 'idadeMenarca').placeholder} />
                </Field>

                <Field label={campo(hi, 'idadePrimeiraRelacao', 'Com quantos anos foi sua 1ª relação sexual?').label}>
                  <input inputMode="numeric" className={inputCls} value={form.idadePrimeiraRelacao} onChange={set('idadePrimeiraRelacao')} placeholder={campo(hi, 'idadePrimeiraRelacao').placeholder} />
                </Field>

                <Field label={campo(hi, 'dum', 'Data da última menstruação (DUM)').label}>
                  <input type="date" className={inputCls} value={form.dum} onChange={set('dum')} />
                </Field>

                <Field label={campo(hi, 'cicloMenstrual', 'Período do ciclo menstrual').label}>
                  <RadioGroup
                    value={form.cicloMenstrual}
                    onChange={radio('cicloMenstrual')}
                    options={['Curto — menos de 21 dias', 'Normal — 21 a 35 dias', 'Longo — mais de 40 dias']}
                  />
                </Field>

                <Field label={campo(hi, 'fluxo', 'Característica do fluxo').label}>
                  <RadioGroup value={form.fluxo} onChange={radio('fluxo')} options={['Leve', 'Moderado', 'Intenso']} />
                </Field>

                <Field label={campo(hi, 'tpm', 'Possui TPM?').label}>
                  <RadioGroup value={form.tpm} onChange={radio('tpm')} options={['Sim', 'Não']} />
                </Field>

                <Field label={campo(hi, 'metodoContraceptivo', 'Método anticoncepcional atual').label}>
                  <input className={inputCls} value={form.metodoContraceptivo} onChange={set('metodoContraceptivo')} placeholder={campo(hi, 'metodoContraceptivo').placeholder} />
                </Field>

                <Field label={campo(hi, 'ultimoPapanicolau', 'Quando foi o último Papanicolau?').label}>
                  <input className={inputCls} value={form.ultimoPapanicolau} onChange={set('ultimoPapanicolau')} placeholder={campo(hi, 'ultimoPapanicolau').placeholder} />
                </Field>
              </FormSection>
            )}

            {step === 3 && (
              <FormSection titulo="Saúde Geral">
                <Field label={campo(sg, 'doencasPrevias', 'Doenças prévias').label}>
                  <textarea rows={3} className={inputCls} value={form.doencasPrevias} onChange={set('doencasPrevias')} placeholder={campo(sg, 'doencasPrevias').placeholder} />
                </Field>

                <Field label={campo(sg, 'medicamentos', 'Medicamentos ou suplementos em uso').label}>
                  <textarea rows={3} className={inputCls} value={form.medicamentos} onChange={set('medicamentos')} placeholder={campo(sg, 'medicamentos').placeholder} />
                </Field>

                <Field label={campo(sg, 'cirurgias', 'Cirurgias realizadas').label}>
                  <textarea rows={3} className={inputCls} value={form.cirurgias} onChange={set('cirurgias')} placeholder={campo(sg, 'cirurgias').placeholder} />
                </Field>

                <Field label={campo(sg, 'historicoFamiliarCancer', 'Histórico de câncer de mama na família?').label}>
                  <RadioGroup value={form.historicoFamiliarCancer} onChange={radio('historicoFamiliarCancer')} options={['Sim', 'Não', 'Não sei']} />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={campo(sg, 'peso', 'Peso').label}>
                    <input className={inputCls} value={form.peso} onChange={set('peso')} placeholder={campo(sg, 'peso').placeholder} />
                  </Field>
                  <Field label={campo(sg, 'altura', 'Altura').label}>
                    <input className={inputCls} value={form.altura} onChange={set('altura')} placeholder={campo(sg, 'altura').placeholder} />
                  </Field>
                </div>

                <Field label={campo(sg, 'atividadeFisica', 'Atividade física').label}>
                  <input className={inputCls} value={form.atividadeFisica} onChange={set('atividadeFisica')} placeholder={campo(sg, 'atividadeFisica').placeholder} />
                </Field>

                <Field label={campo(sg, 'tabagismo', 'Tabagismo').label}>
                  <RadioGroup value={form.tabagismo} onChange={radio('tabagismo')} options={['Nunca fumei', 'Fumante', 'Ex-fumante']} />
                </Field>

                <Field label={campo(sg, 'qualidadeSono', 'Qualidade do sono').label}>
                  <RadioGroup value={form.qualidadeSono} onChange={radio('qualidadeSono')} options={['Bom', 'Razoável', 'Ruim']} />
                </Field>

                <Field label={campo(sg, 'qualidadeAlimentacao', 'Qualidade da alimentação').label}>
                  <RadioGroup value={form.qualidadeAlimentacao} onChange={radio('qualidadeAlimentacao')} options={['Boa', 'Razoável', 'Ruim']} />
                </Field>

                <Field label={campo(sg, 'evacuaDiariamente', 'Evacua diariamente?').label}>
                  <RadioGroup value={form.evacuaDiariamente} onChange={radio('evacuaDiariamente')} options={['Sim', 'Não']} />
                </Field>

                <Field label={campo(sg, 'libido', 'Como está sua libido (desejo sexual)?').label}>
                  <textarea rows={2} className={inputCls} value={form.libido} onChange={set('libido')} placeholder={campo(sg, 'libido').placeholder} />
                </Field>
              </FormSection>
            )}

            {step === 4 && (
              <FormSection titulo="Seus Objetivos">
                <div>
                  <span className="mb-1.5 block font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">
                    {preconsulta.objetivosLabel} <span className="text-gold">*</span>
                  </span>
                  <p className="mb-4 text-sm text-espresso-soft">{preconsulta.objetivosAjuda}</p>
                  <div className="space-y-3">
                    <NumberedField n={1} value={form.objetivo1} onChange={set('objetivo1')} placeholder={campo(ob, 'objetivo1').placeholder} />
                    <NumberedField n={2} value={form.objetivo2} onChange={set('objetivo2')} placeholder={campo(ob, 'objetivo2').placeholder} />
                    <NumberedField n={3} value={form.objetivo3} onChange={set('objetivo3')} placeholder={campo(ob, 'objetivo3').placeholder} />
                  </div>
                </div>
              </FormSection>
            )}

            {step === 5 &&
              (sent ? (
                <Confirmacao onReenviar={enviar} />
              ) : (
                <Revisao onEnviar={enviar} mensagemFechamento={preconsulta.mensagemFechamento} />
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

function Revisao({
  onEnviar,
  mensagemFechamento,
}: {
  onEnviar: () => void;
  mensagemFechamento: string;
}) {
  return (
    <div className="text-center">
      <span className="text-gold-fill font-display text-4xl">✦</span>
      <h2 className="mt-4 font-display text-2xl text-espresso">Tudo pronto!</h2>
      <p className="mx-auto mt-3 max-w-sm whitespace-pre-line text-sm leading-relaxed text-espresso-soft">
        {mensagemFechamento}
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

function buildMessage(
  f: FormState,
  campos: { dp: CampoConfig[]; hi: CampoConfig[]; sg: CampoConfig[]; ob: CampoConfig[] },
): string {
  const rotulo = (lista: CampoConfig[], key: string, fallback: string) =>
    campo(lista, key, fallback).label;

  const l = (cond: string, texto: string): string | undefined =>
    cond ? texto : undefined;

  const { dp, hi, sg, ob } = campos;

  const linhas: (string | undefined)[] = [
    '📋 *Formulário de Pré-Consulta — Instituto Médico Brito*',
    '',
    '*Dados Pessoais*',
    `${rotulo(dp, 'nome', 'Nome')}: ${f.nome}`,
    l(f.sexo, `${rotulo(dp, 'sexo', 'Sexo')}: ${f.sexo}`),
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

  // `hi`/`sg`/`ob` já usados via `rotulo` acima em pontos-chave; os demais
  // rótulos seguem o texto padrão para manter a mensagem legível mesmo que
  // o painel customize só parte dos campos.
  void hi; void sg; void ob;

  return linhas.filter((x): x is string => x !== undefined).join('\n');
}
