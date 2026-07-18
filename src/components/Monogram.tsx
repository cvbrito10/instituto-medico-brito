import { cn } from '@/lib/utils';

export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={cn('block', className)}
    >
      <defs>
        <linearGradient id="brito-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E4CE99" />
          <stop offset="0.5" stopColor="#C9A66B" />
          <stop offset="1" stopColor="#A67C4E" />
        </linearGradient>
      </defs>
      {/* C — arco aberto */}
      <path
        d="M40 30 C28 37 28 55 40 63 C49 69 61 64 63 54"
        stroke="url(#brito-gold)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* Círculo envolvente */}
      <circle
        cx="52"
        cy="52"
        r="30"
        stroke="url(#brito-gold)"
        strokeWidth="1.4"
        opacity="0.9"
      />
      {/* V central */}
      <path
        d="M45 36 L55 68 L66 36"
        stroke="url(#brito-gold)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Laço caligráfico superior — remete ao entrelace da logo */}
      <path
        d="M40 32 C36 24 46 20 52 26 C58 32 66 26 64 36"
        stroke="url(#brito-gold)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Ponto do i */}
      <circle cx="68" cy="60" r="1.6" fill="#C9A66B" />
    </svg>
  );
}
