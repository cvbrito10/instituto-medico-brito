'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, UserRound, ClipboardList, FileHeart, TrendingUp, type LucideIcon } from 'lucide-react';
import { GoldDivider } from './GoldDivider';
import { useAgendamento } from './AgendamentoModal';
import { useContent } from './ContentProvider';

const ICONS = [
  CalendarCheck, UserRound, ClipboardList, FileHeart, TrendingUp,
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function ComoFunciona() {
  const { open } = useAgendamento();
  const reduce = useReducedMotion();
  const { comoFunciona } = useContent();

  return (
    <section id="como-funciona" className="relative py-24 lg:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{comoFunciona.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-espresso sm:text-[2.9rem]">
            {comoFunciona.titulo}
          </h2>
          <div className="mt-6 flex justify-center">
            <GoldDivider />
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* Linha vertical dourada */}
          <div
            aria-hidden
            className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/10 via-gold/50 to-gold/10 sm:left-1/2 sm:-translate-x-1/2"
          />

          <ol className="space-y-8">
            {comoFunciona.passos.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              const alignRight = i % 2 === 1;
              return (
                <motion.li
                  key={i}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                  transition={{ duration: 0.7, delay: 0.05, ease }}
                  className={`relative flex items-start gap-6 sm:w-1/2 ${
                    alignRight
                      ? 'sm:ml-auto sm:flex-row sm:pl-12'
                      : 'sm:flex-row-reverse sm:pr-12 sm:text-right'
                  }`}
                >
                  {/* Nó */}
                  <span
                    className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-porcelain text-bronze shadow-soft ${
                      alignRight ? 'sm:-ml-[62px]' : 'sm:-mr-[62px]'
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.4} />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-fade font-sans text-[0.62rem] font-semibold text-porcelain">
                      {i + 1}
                    </span>
                  </span>

                  <div className="pt-1">
                    <h3 className="font-display text-2xl leading-tight text-espresso">
                      {s.titulo}
                    </h3>
                    <p className="mt-1.5 text-[0.88rem] leading-relaxed text-espresso-soft">
                      {s.descricao}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <div className="mt-14 text-center">
          <button onClick={open} className="btn-primary">
            {comoFunciona.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
