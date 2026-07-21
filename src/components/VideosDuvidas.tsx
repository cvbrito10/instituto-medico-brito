'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useContent } from './ContentProvider';
import { GoldDivider } from './GoldDivider';

const ease = [0.22, 1, 0.36, 1] as const;

export function VideosDuvidas() {
  const { videos } = useContent();
  const [aberto, setAberto] = useState<string | null>(null);

  if (!videos.ativo || videos.itens.length === 0) return null;

  return (
    <section className="bg-porcelain py-24 lg:py-28">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{videos.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-espresso sm:text-[2.6rem]">
            {videos.titulo}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-espresso-soft">
            {videos.subtitulo}
          </p>
          <div className="mt-6 flex justify-center">
            <GoldDivider />
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.itens.map((v) => (
            <button
              key={v.youtubeId}
              onClick={() => setAberto(v.youtubeId)}
              className="group text-left"
            >
              <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-soft">
                <img
                  src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt={v.pergunta}
                  className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-espresso/20 transition-colors group-hover:bg-espresso/30">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-gold shadow-soft transition-transform group-hover:scale-110">
                    <Play size={22} className="ml-0.5" fill="currentColor" />
                  </span>
                </span>
              </div>
              <p className="mt-3 font-display text-lg leading-snug text-espresso">
                {v.pergunta}
              </p>
              <p className="font-sans text-[0.75rem] uppercase tracking-[0.14em] text-bronze">
                {v.medico}
              </p>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/80 p-4"
            onClick={() => setAberto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease }}
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setAberto(null)}
                aria-label="Fechar vídeo"
                className="absolute -top-11 right-0 text-porcelain/80 transition hover:text-porcelain"
              >
                <X size={26} strokeWidth={1.8} />
              </button>
              <div className="overflow-hidden rounded-2xl bg-black shadow-lift">
                <iframe
                  src={`https://www.youtube.com/embed/${aberto}?autoplay=1`}
                  title="Vídeo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="aspect-video w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
