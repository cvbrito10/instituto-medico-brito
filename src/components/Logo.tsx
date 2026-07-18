'use client';

import { useContent } from './ContentProvider';
import { Monogram } from './Monogram';
import { cn } from '@/lib/utils';

/**
 * Exibe a logo enviada pelo painel; se não houver, usa o monograma SVG.
 */
export function Logo({ className }: { className?: string }) {
  const { assets } = useContent();

  if (assets.logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={assets.logoUrl}
        alt="Instituto Médico Brito"
        className={cn('object-contain', className)}
      />
    );
  }

  return <Monogram className={className} />;
}
