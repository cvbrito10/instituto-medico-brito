import { cn } from '@/lib/utils';

export function GoldDivider({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={cn('gold-thread mx-auto max-w-[220px]', className)}
    />
  );
}
