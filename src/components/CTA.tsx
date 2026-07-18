'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Monogram } from './Monogram';
import { useAgendamento } from './AgendamentoModal';
import { CONTACT } from '@/lib/constants';

const ease = [0.22, 1, 0.36, 1] as const;

export function CTA() {
  const { open } = useAgendamento();

  return (
    <section className="relative px-6 py-20 lg:py-28">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-[32px] border border-gold/25 px-8 py-16 text-center shadow-lift sm:px-16 lg:py-20">
          {/* Fundo dourado claro */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, #F7EFDC 0%, #F1E4C6 45%, #EAD8B2 100%)',
            }}
          />
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #E4CE99, transparent 70%)',
            }}
          />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Monogram className="mx-auto h-12 w-12" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.05, ease }}
              className="mx-auto mt-6 max-w-2xl font-display text-4xl leading-[1.1] text-espresso sm:text-5xl"
            >
              Sua transformação começa com uma avaliação médica personalizada.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mt-5 max-w-xl text-[0.98rem] leading-relaxed text-espresso-soft"
            >
              Agende sua consulta e descubra um plano desenvolvido
              exclusivamente para você.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="mt-9"
            >
              <button onClick={open} className="btn-primary px-9 py-4 text-base">
                <Calendar size={18} strokeWidth={1.7} />
                Agendar Consulta
              </button>
              <p className="mt-5 font-sans text-[0.76rem] uppercase tracking-[0.18em] text-bronze">
                Atendimento pelo WhatsApp · {CONTACT.whatsapp.display}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
