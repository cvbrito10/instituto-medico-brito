'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SiteContent } from '@/lib/content';

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({
  value,
  children,
}: {
  value: SiteContent;
  children: ReactNode;
}) {
  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent deve ser usado dentro de <ContentProvider>.');
  }
  return ctx;
}
