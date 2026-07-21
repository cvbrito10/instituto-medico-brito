'use client';

import { useContent } from './ContentProvider';
import { GoldDivider } from './GoldDivider';

export function GaleriaViagens() {
  const { galeria } = useContent();

  if (!galeria.ativo || galeria.itens.length === 0) return null;

  return (
    <section className="bg-ivory/50 py-24 lg:py-28">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{galeria.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-espresso sm:text-[2.6rem]">
            {galeria.titulo}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-espresso-soft">
            {galeria.subtitulo}
          </p>
          <div className="mt-6 flex justify-center">
            <GoldDivider />
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galeria.itens.map((item, i) => (
            <figure
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-gold/15 shadow-soft"
            >
              <img
                src={item.fotoUrl}
                alt={item.legenda}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/85 via-espresso/40 to-transparent p-4 pt-10">
                <p className="font-sans text-[0.85rem] leading-snug text-porcelain">
                  {item.legenda}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
