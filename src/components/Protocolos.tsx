'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Stethoscope,
  Salad,
  Activity,
  Syringe,
  Droplets,
  Pill,
  HeartPulse,
  LineChart,
  type LucideIcon,
} from 'lucide-react';
import { GoldDivider } from './GoldDivider';

type Protocolo = { icon: LucideIcon; title: string; desc: string };

const PROTOCOLOS: Protocolo[] = [
  {
    icon: Stethoscope,
    title: 'Acompanhamento Médico Personalizado',
    desc: 'Condução clínica próxima, com ajustes contínuos conforme sua evolução.',
  },
  {
    icon: Salad,
    title: 'Estratégias para Emagrecimento Saudável',
    desc: 'Abordagem sustentável, respeitando seu metabolismo e sua rotina.',
  },
  {
    icon: Activity,
    title: 'Tratamento Metabólico',
    desc: 'Cuidado com glicose, lipídios e demais marcadores da sua saúde.',
  },
  {
    icon: Syringe,
    title: 'Tirzepatida e Outras Medicações',
    desc: 'Quando clinicamente indicadas, com critério e segurança.',
  },
  {
    icon: Droplets,
    title: 'Protocolos com Injetáveis',
    desc: 'Recursos terapêuticos aplicados de forma individualizada.',
  },
  {
    icon: Pill,
    title: 'Suplementação Individualizada',
    desc: 'Definida a partir de exames e das suas necessidades reais.',
  },
  {
    icon: HeartPulse,
    title: 'Reposição Hormonal',
    desc: 'Avaliação criteriosa do equilíbrio hormonal e do bem-estar.',
  },
  {
    icon: LineChart,
    title: 'Acompanhamento Contínuo da Evolução',
    desc: 'Monitoramento de resultados e refinamento do seu plano.',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Protocolos() {
  const reduce = useReducedMotion();

  return (
    <section
      id="protocolos"
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
            O que oferecemos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="mt-3 font-display text-4xl leading-tight text-espresso sm:text-[2.9rem]"
          >
            Protocolos Personalizados
          </motion.h2>
          <div className="mt-6 flex justify-center">
            <GoldDivider />
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROTOCOLOS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.article
                key={p.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease }}
                whileHover={reduce ? undefined : { y: -8 }}
                className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-white/70 p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift"
              >
                {/* Barra dourada superior no hover */}
                <span className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-gold-fade transition-transform duration-500 group-hover:scale-x-100" />

                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/25 bg-porcelain text-bronze transition-colors duration-300 group-hover:border-gold/50 group-hover:text-espresso">
                  <Icon size={22} strokeWidth={1.4} />
                </span>

                <h3 className="mt-5 font-display text-[1.35rem] leading-tight text-espresso">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[0.86rem] leading-relaxed text-espresso-soft">
                  {p.desc}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
