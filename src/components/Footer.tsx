'use client';

import { MapPin, Phone, Instagram } from 'lucide-react';
import { Logo } from './Logo';
import { useContent } from './ContentProvider';
import { waLink } from '@/lib/content';
import { WHATSAPP_MESSAGES } from '@/lib/constants';

export function Footer() {
  const { contato, medicos } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/15 bg-ivory/60 pt-16">
      <div className="container-luxe">
        <div className="grid gap-12 pb-14 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-11 w-11" />
              <div className="flex flex-col leading-none">
                <span className="font-roman text-lg tracking-[0.3em] text-espresso">
                  BRITO
                </span>
                <span className="mt-1 font-sans text-[0.58rem] uppercase tracking-[0.26em] text-bronze">
                  Instituto Médico
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-[0.86rem] leading-relaxed text-espresso-soft">
              Evolução com saúde e bem-estar. Medicina personalizada para
              emagrecimento, saúde metabólica, reposição hormonal e longevidade.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-bronze">
              Corpo Clínico
            </h4>
            <ul className="mt-4 space-y-2">
              <li className="font-display text-xl text-espresso">{medicos.nome1}</li>
              <li className="font-display text-xl text-espresso">{medicos.nome2}</li>
            </ul>
            <span className="mt-3 block font-sans text-[0.72rem] text-espresso-soft">
              Médicos Responsáveis
            </span>
          </div>

          <div>
            <h4 className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-bronze">
              Contato
            </h4>
            <ul className="mt-4 space-y-3.5 text-[0.86rem] text-espresso-soft">
              <li className="flex items-start gap-3">
                <MapPin size={17} strokeWidth={1.5} className="mt-0.5 shrink-0 text-bronze" />
                <span>
                  {contato.enderecoRua}
                  <br />
                  {contato.enderecoBairro}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} strokeWidth={1.5} className="shrink-0 text-bronze" />
                <a
                  href={waLink(contato.whatsappNumber, WHATSAPP_MESSAGES.default)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-espresso"
                >
                  {contato.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram size={17} strokeWidth={1.5} className="shrink-0 text-bronze" />
                <a
                  href={contato.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-espresso"
                >
                  {contato.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-thread max-w-none opacity-70" />

        <div className="flex flex-col items-center justify-between gap-3 py-7 sm:flex-row">
          <p className="font-sans text-[0.74rem] text-espresso-soft">
            © {year} Instituto Médico Brito. Todos os direitos reservados.
          </p>
          <p className="font-sans text-[0.7rem] text-espresso-soft/70">
            Evolução com saúde e bem-estar
          </p>
        </div>
      </div>
    </footer>
  );
}
