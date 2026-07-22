'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useContent } from './ContentProvider';

const INTERVALO_MS = 20000;
const ease = [0.22, 1, 0.36, 1] as const;

export function Depoimentos() {
  const { depoimentos } = useContent();
  const [i, setI] = useState(0);

  const itens = depoimentos.itens;

  useEffect(() => {
    if (itens.length < 2) return;
    const id = setInterval(() => {
      setI((prev) => (prev + 1) % itens.length);
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [itens.length]);

  if (!depoimentos.ativo || itens.length === 0) return null;

  const atual = itens[i % itens.length];

  return (
    <section className="bg-nude/40 py-16 sm:py-20">
      <div className="container-luxe">
        <p className="eyebrow text-center">Quem já vive essa evolução</p>
        <h2 className="mt-2 text-center font-display text-3xl text-espresso sm:text-4xl">
          Depoimentos
        </h2>

        <div className="mx-auto mt-10 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.6, ease }}
              className="flex flex-col items-center gap-5 rounded-[26px] border border-gold/20 bg-white/70 p-8 text-center shadow-soft sm:flex-row sm:text-left"
            >
              <span className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-gold/30 bg-porcelain sm:h-32 sm:w-32">
                {atual.fotoUrl ? (
                  <img
                    src={atual.fotoUrl}
                    alt={atual.nome}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition:
                        atual.posicao === 'top' ? 'center top' : atual.posicao === 'bottom' ? 'center bottom' : 'center center',
                    }}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-display text-2xl text-bronze">
                    {atual.nome.trim().charAt(0).toUpperCase() || '✦'}
                  </span>
                )}
              </span>

              <div>
                <Quote className="mx-auto mb-2 text-gold sm:mx-0" size={22} strokeWidth={1.5} />
                <p className="font-display text-lg italic leading-relaxed text-espresso">
                  “{atual.texto}”
                </p>
                <p className="mt-3 font-sans text-[0.75rem] uppercase tracking-[0.16em] text-bronze">
                  {atual.nome}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {itens.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {itens.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Ver depoimento ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={
                    idx === i % itens.length
                      ? 'h-2 w-6 rounded-full bg-gold-fade transition-all'
                      : 'h-2 w-2 rounded-full bg-nude-deep/50 transition-all hover:bg-gold/50'
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
