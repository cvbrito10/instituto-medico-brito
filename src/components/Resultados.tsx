'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  PersonStanding,
  BatteryCharging,
  Gauge,
  Scale,
  ShieldCheck,
  Moon,
  Heart,
  Smile,
  type LucideIcon,
} from 'lucide-react';
import { GoldDivider } from './GoldDivider';

type Result = { icon: LucideIcon; title: string };

const RESULTS: Result[] = [
  { icon: PersonStanding, title: 'Melhora da composição corporal' },
  { icon: BatteryCharging, title: 'Melhora da disposição' },
  { icon: Gauge, title: 'Melhora do metabolismo' },
  { icon: Scale, title: 'Controle hormonal' },
  { icon: ShieldCheck, title: 'Redução da inflamação' },
  { icon: Moon, title: 'Melhora do sono' },
  { icon: Heart, title: 'Qualidade de vida' },
  { icon: Smile, title: 'Bem-estar' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Resultados() {
  const reduce = useReducedMotion();

  return (
    <section id="resultados" className="relative py-24 lg:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">O caminho possível</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-espresso sm:text-[2.9rem]">
            Resultados Esperados
          </h2>
          <div className="mt-6 flex justify-center">
            <GoldDivider />
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESULTS.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.65, delay: (i % 4) * 0.07, ease }}
                className="group flex items-center gap-4 rounded-2xl border border-gold/12 bg-white/60 px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-soft"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 text-bronze transition-colors group-hover:border-gold/40">
                  <Icon size={20} strokeWidth={1.4} />
                </span>
                <h3 className="font-display text-[1.15rem] leading-tight text-espresso">
                  {r.title}
                </h3>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-12 max-w-2xl text-center text-[0.78rem] leading-relaxed text-espresso-soft/80"
        >
          Os resultados variam de pessoa para pessoa e dependem de fatores
          individuais, adesão ao tratamento e avaliação clínica. Não há promessa
          ou garantia de resultados específicos. As informações desta página têm
          caráter informativo e não substituem a consulta médica.
        </motion.p>
      </div>
    </section>
  );
}
