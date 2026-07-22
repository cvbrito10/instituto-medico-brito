'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, Loader2, Check, Phone } from 'lucide-react';
import { waLink } from '@/lib/content';
import { trackEvent } from '@/lib/track';
import { useContent } from './ContentProvider';
import { Monogram } from './Monogram';

type ModalContextValue = { open: () => void };
const ModalContext = createContext<ModalContextValue | null>(null);

export function useAgendamento() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useAgendamento deve ser usado dentro de <AgendamentoProvider>.');
  }
  return ctx;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function AgendamentoProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const content = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    objetivo: '',
    mensagem: '',
  });

  const open = useCallback(() => {
    setStatus('idle');
    setErrorMsg('');
    setIsOpen(true);
    trackEvent('form_open', 'agendamento');
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close]);

  const goToWhatsapp = useCallback(() => {
    const msg = [
      'Olá! Gostaria de agendar uma avaliação no Instituto Médico Brito.',
      form.nome && `Nome: ${form.nome}`,
      form.telefone && `Telefone: ${form.telefone}`,
      form.objetivo && `Objetivo: ${form.objetivo}`,
      form.mensagem && `Mensagem: ${form.mensagem}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(
      waLink(content.contato.whatsappNumber, msg),
      '_blank',
      'noopener,noreferrer',
    );
  }, [form, content.contato.whatsappNumber]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('loading');
      setErrorMsg('');
      try {
        const res = await fetch('/api/agendamento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data?.error ?? 'Não foi possível enviar agora.');
        }
        setStatus('success');
        trackEvent('form_submit', 'agendamento');
        // Encaminha para o WhatsApp logo após capturar o lead
        setTimeout(goToWhatsapp, 600);
      } catch (err) {
        setStatus('error');
        setErrorMsg(
          err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.',
        );
      }
    },
    [form, goToWhatsapp],
  );

  const setField =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <ModalContext.Provider value={{ open }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Agendar consulta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              aria-label="Fechar"
              onClick={close}
              className="absolute inset-0 bg-espresso/30 backdrop-blur-sm"
            />

            <motion.div
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-[26px] border border-gold/20 bg-porcelain shadow-lift"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-h-[90vh] overflow-y-auto px-7 py-8 sm:px-9">
                <button
                  onClick={close}
                  aria-label="Fechar"
                  className="absolute right-5 top-5 rounded-full p-1.5 text-espresso-soft transition hover:bg-nude/60 hover:text-espresso"
                >
                  <X size={18} strokeWidth={1.6} />
                </button>

                {status === 'success' ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-fade text-porcelain">
                      <Check size={26} strokeWidth={2} />
                    </div>
                    <h3 className="font-display text-3xl text-espresso">
                      Solicitação recebida
                    </h3>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-espresso-soft">
                      Estamos abrindo o WhatsApp para concluir seu agendamento.
                      Se não abrir automaticamente, toque no botão abaixo.
                    </p>
                    <button onClick={goToWhatsapp} className="btn-primary mt-6">
                      <Phone size={16} strokeWidth={1.8} />
                      Continuar no WhatsApp
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 text-center">
                      <Monogram className="mx-auto h-11 w-11" />
                      <p className="eyebrow mt-3">Agendamento</p>
                      <h3 className="mt-1 font-display text-3xl leading-tight text-espresso">
                        Agende sua avaliação
                      </h3>
                      <p className="mx-auto mt-2 max-w-sm text-sm text-espresso-soft">
                        Deixe seus dados e continuamos pelo WhatsApp para
                        encontrar o melhor horário.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Field label="Nome completo" htmlFor="nome">
                        <input
                          id="nome"
                          required
                          value={form.nome}
                          onChange={setField('nome')}
                          autoComplete="name"
                          className={inputCls}
                          placeholder="Seu nome"
                        />
                      </Field>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Telefone / WhatsApp" htmlFor="telefone">
                          <input
                            id="telefone"
                            required
                            inputMode="tel"
                            value={form.telefone}
                            onChange={setField('telefone')}
                            autoComplete="tel"
                            className={inputCls}
                            placeholder="(69) 9 0000-0000"
                          />
                        </Field>
                        <Field label="E-mail (opcional)" htmlFor="email">
                          <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={setField('email')}
                            autoComplete="email"
                            className={inputCls}
                            placeholder="voce@email.com"
                          />
                        </Field>
                      </div>

                      <Field label="Objetivo principal" htmlFor="objetivo">
                        <select
                          id="objetivo"
                          value={form.objetivo}
                          onChange={setField('objetivo')}
                          className={`${inputCls} appearance-none bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239A7B45' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                          }}
                        >
                          <option value="">Selecione</option>
                          {content.menuVitalidade.categorias.map((g) => (
                            <optgroup key={g.titulo} label={g.titulo}>
                              {g.itens.map((o) => (
                                <option key={`${g.titulo}-${o}`} value={o}>
                                  {o}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </Field>

                      <Field label="Mensagem (opcional)" htmlFor="mensagem">
                        <textarea
                          id="mensagem"
                          rows={3}
                          value={form.mensagem}
                          onChange={setField('mensagem')}
                          className={`${inputCls} resize-none`}
                          placeholder="Conte brevemente o que você busca."
                        />
                      </Field>

                      {status === 'error' && (
                        <p className="text-center text-sm text-red-700/90">
                          {errorMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Enviando…
                          </>
                        ) : (
                          'Enviar e continuar no WhatsApp'
                        )}
                      </button>

                      <p className="text-center text-[0.7rem] leading-relaxed text-espresso-soft/80">
                        Seus dados são utilizados apenas para contato sobre o
                        agendamento.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}

const inputCls =
  'w-full rounded-xl border border-nude-deep/50 bg-white/70 px-4 py-3 font-sans text-sm text-espresso placeholder:text-espresso-soft/50 transition focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/25';

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">
        {label}
      </span>
      {children}
    </label>
  );
}
