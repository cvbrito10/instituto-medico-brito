'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { useAgendamento } from './AgendamentoModal';
import { useContent } from './ContentProvider';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '#sobre', label: 'Quem Somos' },
  { href: '#protocolos', label: 'Protocolos' },
  { href: '#como-funciona', label: 'Como Funciona' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#resultados', label: 'Resultados' },
];

export function Navbar() {
  const { open } = useAgendamento();
  const { assets, marca } = useContent();
  const hasLogo = !!assets.logoUrl;
  const showText = !!(marca.nome || marca.subtitulo);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass border-b border-gold/15 shadow-[0_10px_40px_-28px_rgba(42,36,28,0.4)]'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="container-luxe flex h-[76px] items-center justify-between">
        <a
          href="#topo"
          className="flex items-center gap-3"
          aria-label="Instituto Médico Brito — início"
        >
          <Logo className={hasLogo ? 'h-10 w-auto sm:h-12' : 'h-9 w-9'} />
          {showText && (
            <span className="flex flex-col leading-none">
              {marca.nome && (
                <span className="font-roman text-[0.95rem] tracking-[0.32em] text-espresso">
                  {marca.nome}
                </span>
              )}
              {marca.subtitulo && (
                <span className="mt-1 font-sans text-[0.56rem] uppercase tracking-[0.28em] text-bronze">
                  {marca.subtitulo}
                </span>
              )}
            </span>
          )}
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative font-sans text-[0.82rem] tracking-wide text-espresso-soft transition-colors hover:text-espresso"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={open} className="btn-primary hidden px-6 py-3 sm:inline-flex">
            Agendar Consulta
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="rounded-full p-2 text-espresso lg:hidden"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-espresso/25 backdrop-blur-sm"
            />
            <motion.div
              className="absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-porcelain px-7 py-7 shadow-lift"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo className={hasLogo ? 'h-11 w-auto' : 'h-9 w-9'} />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="rounded-full p-1.5 text-espresso-soft hover:text-espresso"
                >
                  <X size={20} strokeWidth={1.6} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-nude/70 py-3.5 font-display text-2xl text-espresso"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  open();
                }}
                className="btn-primary mt-8 w-full"
              >
                Agendar Consulta
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
