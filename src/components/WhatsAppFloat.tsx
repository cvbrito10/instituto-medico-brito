'use client';

import { useContent } from './ContentProvider';
import { waLink } from '@/lib/content';

export function WhatsAppFloat() {
  const { contato, whatsapp } = useContent();

  return (
    <a
      href={waLink(contato.whatsappNumber, whatsapp.mensagemPadrao)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_14px_34px_-10px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-105"
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" />
      <svg
        viewBox="0 0 24 24"
        fill="#fff"
        className="relative h-7 w-7"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.17c-.25.69-1.46 1.32-2 1.36-.51.05-1.17.07-1.88-.12-.43-.14-.99-.32-1.7-.63-2.99-1.29-4.94-4.3-5.09-4.5-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.04-2.49.27-.3.59-.37.79-.37h.57c.18.01.43-.07.67.51.25.6.84 2.07.91 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.18 1.41Z" />
      </svg>
    </a>
  );
}
