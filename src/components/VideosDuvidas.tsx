'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, X, Instagram, ExternalLink } from 'lucide-react';
import { useContent } from './ContentProvider';
import { GoldDivider } from './GoldDivider';

const ease = [0.22, 1, 0.36, 1] as const;

type VideoItem = {
  pergunta: string;
  medico: string;
  tipo: 'youtube' | 'upload' | 'instagram';
  youtubeId: string;
  videoUrl: string;
  instagramUrl: string;
  capaUrl: string;
};

export function VideosDuvidas() {
  const { videos } = useContent();
  const [aberto, setAberto] = useState<VideoItem | null>(null);

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

        <div className="mt-14 flex flex-wrap justify-center gap-6">
          {videos.itens.map((v, i) => {
            // Instagram abre em nova aba (o post precisa ser público);
            // YouTube e upload direto abrem num player por cima da página.
            if (v.tipo === 'instagram' && v.instagramUrl) {
              return (
                <a
                  key={i}
                  href={v.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-nude to-porcelain shadow-soft">
                    {v.capaUrl ? (
                      <img src={v.capaUrl} alt={v.pergunta} className="absolute inset-0 h-full w-full object-cover" />
                    ) : null}
                    <span className={
                      v.capaUrl
                        ? 'relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-gold shadow-soft transition-transform group-hover:scale-110'
                        : 'flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-gold shadow-soft transition-transform group-hover:scale-110'
                    }>
                      <Instagram size={24} strokeWidth={1.6} />
                    </span>
                    <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-espresso/40 px-2 py-1 text-[0.7rem] text-porcelain backdrop-blur-sm">
                      Ver no Instagram <ExternalLink size={12} />
                    </span>
                  </div>
                  <p className="mt-3 font-display text-lg leading-snug text-espresso">
                    {v.pergunta}
                  </p>
                  <p className="font-sans text-[0.75rem] uppercase tracking-[0.14em] text-bronze">
                    {v.medico}
                  </p>
                </a>
              );
            }

            return (
              <button
                key={i}
                onClick={() => setAberto(v)}
                className="group block w-full max-w-sm text-left sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-soft">
                  {v.capaUrl ? (
                    <img
                      src={v.capaUrl}
                      alt={v.pergunta}
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : v.tipo === 'upload' && v.videoUrl ? (
                    <video
                      src={v.videoUrl}
                      className="aspect-video w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                      alt={v.pergunta}
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
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
            );
          })}
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
                {aberto.tipo === 'upload' && aberto.videoUrl ? (
                  <video
                    src={aberto.videoUrl}
                    controls
                    autoPlay
                    className="aspect-video w-full"
                  />
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${aberto.youtubeId}?autoplay=1`}
                    title="Vídeo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
