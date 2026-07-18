'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MessageCircle, Check } from 'lucide-react';
import { Monogram } from './Monogram';
import { useAgendamento } from './AgendamentoModal';
import { whatsappLink, WHATSAPP_MESSAGES } from '@/lib/constants';

const BADGES = [
  'Atendimento Individualizado',
  'Avaliação Completa',
  'Protocolos Personalizados',
  'Medicina Baseada em Evidências',
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { open } = useAgendamento();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  return (
    <section
      id="topo"
      ref={ref}
      className="relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-40"
    >
      {/* Halo dourado ambiente */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(228,206,153,0.35), transparent 65%)',
        }}
      />

      <div className="container-luxe grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Coluna de texto */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-white/60 px-4 py-1.5"
          >
            <Monogram className="h-4 w-4" />
            <span className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-bronze">
              Medicina Personalizada
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease }}
            className="font-display text-[2.6rem] font-medium leading-[1.05] text-espresso sm:text-6xl lg:text-[4.1rem]"
          >
            Medicina Personalizada para{' '}
            <span className="text-gold-fill italic">Emagrecimento</span>, Saúde
            Metabólica e{' '}
            <span className="text-gold-fill italic">Longevidade</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-7 max-w-xl"
          >
            <p className="font-display text-xl italic leading-snug text-espresso-soft">
              Cada organismo é único. Seu tratamento também deve ser.
            </p>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-espresso-soft">
              Acompanhamento médico individualizado baseado em ciência,
              avaliação clínica completa e protocolos personalizados.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <button onClick={open} className="btn-primary">
              <Calendar size={17} strokeWidth={1.7} />
              Agendar Consulta
            </button>
            <a
              href={whatsappLink(WHATSAPP_MESSAGES.consulta)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <MessageCircle size={17} strokeWidth={1.7} />
              Falar no WhatsApp
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-10 grid max-w-lg grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2"
          >
            {BADGES.map((b) => (
              <li key={b} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-fade text-porcelain">
                  <Check size={12} strokeWidth={2.5} />
                </span>
                <span className="font-sans text-[0.82rem] text-espresso-soft">
                  {b}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Coluna do retrato */}
        <motion.div
          style={{ y: portraitY }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-gold/25 bg-gradient-to-b from-ivory to-linen shadow-lift">
            {/*
              PLACEHOLDER — substitua por:
              <Image src="/medicos.jpg" alt="Dr. Claudio e Dra. Vanessa Brito" fill className="object-cover" priority />
            */}
            <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-8 text-center">
              <Monogram className="h-24 w-24 opacity-90" />
              <div className="gold-thread max-w-[120px]" />
              <p className="font-display text-2xl text-espresso">
                Dr. Claudio &amp; Dra. Vanessa Brito
              </p>
              <p className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-bronze">
                Corpo Clínico
              </p>
              <p className="mt-1 max-w-[220px] font-sans text-[0.7rem] leading-relaxed text-espresso-soft/70">
                Substitua este espaço pela foto dos médicos
              </p>
            </div>
          </div>

          {/* Cartão flutuante */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-gold/20 bg-porcelain/90 px-5 py-3.5 shadow-soft backdrop-blur-sm sm:-left-8"
          >
            <span className="font-display text-3xl text-gold-fill">100%</span>
            <span className="font-sans text-[0.72rem] uppercase leading-tight tracking-[0.14em] text-espresso-soft">
              Plano
              <br />
              Personalizado
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
