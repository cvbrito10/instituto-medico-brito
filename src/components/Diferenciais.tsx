'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  UserCog,
  Handshake,
  ScanSearch,
  Gem,
  Repeat,
  Award,
  Sparkles,
  Flame,
  type LucideIcon,
} from 'lucide-react';
import { GoldDivider } from './GoldDivider';

type Item = { icon: LucideIcon; title: string };

const ITEMS: Item[] = [
  { icon: UserCog, title: 'Medicina Personalizada' },
  { icon: Handshake, title: 'Atendimento Individualizado' },
  { icon: ScanSearch, title: 'Avaliação Completa' },
  { icon: Gem, title: 'Protocolos Exclusivos' },
  { icon: Repeat, title: 'Acompanhamento Contínuo' },
  { icon: Award, title: 'Equipe Médica Especializada' },
  { icon: Sparkles, title: 'Abordagem Integrativa' },
  { icon: Flame, title: 'Foco na Saúde Metabólica' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Diferenciais() {
  const reduce = useReducedMotion();

  return (
    <section
      id="diferenciais"
      className="relative bg-gradient-to-b from-porcelain via-linen/50 to-porcelain py-24 lg:py-32"
    >
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Diferenciais</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-espresso sm:text-[2.9rem]">
            Por que escolher o Instituto Médico Brito?
          </h2>
          <div className="mt-6 flex justify-center">
            <GoldDivider />
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.65, delay: (i % 4) * 0.07, ease }}
                className="group flex flex-col items-center rounded-2xl border border-gold/12 bg-white/60 px-5 py-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:bg-white hover:shadow-soft"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-fade/10 text-bronze transition-colors duration-300 group-hover:bg-gold-fade group-hover:text-porcelain">
                  <Icon size={24} strokeWidth={1.3} />
                </span>
                <h3 className="mt-4 font-display text-xl leading-tight text-espresso">
                  {it.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
