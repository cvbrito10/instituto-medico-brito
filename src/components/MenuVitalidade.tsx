'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Flower2,
  Dumbbell,
  Scale,
  Sparkles,
  Scissors,
  type LucideIcon,
} from 'lucide-react';
import { GoldDivider } from './GoldDivider';
import { useAgendamento } from './AgendamentoModal';
import { useContent } from './ContentProvider';

// Ícone por posição (o painel edita título/itens; o ícone acompanha a ordem).
const ICONS: LucideIcon[] = [Flower2, Dumbbell, Scale, Sparkles, Scissors];

const ease = [0.22, 1, 0.36, 1] as const;

export function MenuVitalidade() {
  const reduce = useReducedMotion();
  const { open } = useAgendamento();
  const { menuVitalidade } = useContent();

  return (
    <section
      id="menu-vitalidade"
      className="relative bg-gradient-to-b from-porcelain via-ivory/60 to-porcelain py-24 lg:py-32"
    >
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="eyebrow"
          >
            {menuVitalidade.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="mt-3 font-display text-4xl leading-tight text-espresso sm:text-[2.9rem]"
          >
            {menuVitalidade.titulo}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-espresso-soft"
          >
            {menuVitalidade.subtitulo}
          </motion.p>
          <div className="mt-6 flex justify-center">
            <GoldDivider />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-5">
          {menuVitalidade.categorias.map((cat, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.article
                key={cat.titulo}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease }}
                whileHover={reduce ? undefined : { y: -8 }}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gold/15 bg-white/70 p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.84rem)]"
              >
                <span className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-gold-fade transition-transform duration-500 group-hover:scale-x-100" />

                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/25 bg-porcelain text-bronze transition-colors duration-300 group-hover:border-gold/50 group-hover:text-espresso">
                  <Icon size={22} strokeWidth={1.4} />
                </span>

                <h3 className="mt-5 font-display text-[1.35rem] leading-tight text-espresso">
                  {cat.titulo}
                </h3>

                <ul className="mt-4 space-y-2">
                  {cat.itens.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-[0.85rem] leading-relaxed text-espresso-soft"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <button onClick={open} className="btn-primary">
            Iniciar minha jornada
          </button>
        </div>
      </div>
    </section>
  );
}
