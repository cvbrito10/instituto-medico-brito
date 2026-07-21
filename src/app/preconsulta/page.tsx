import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/components/ContentProvider';
import { Monogram } from '@/components/Monogram';
import { PreConsultaForm } from './PreConsultaForm';

// Aba oculta: não aparece no menu, não é indexada por buscadores,
// mas fica acessível para quem tiver o link direto.
export const metadata: Metadata = {
  title: 'Formulário Pré-Consulta',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function PreConsultaPage() {
  const content = await getSiteContent();

  if (!content.preconsulta.ativo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-porcelain px-4 text-center">
        <div>
          <Monogram className="mx-auto h-12 w-12" />
          <p className="mt-6 text-sm leading-relaxed text-espresso-soft">
            Este formulário está temporariamente indisponível.
            <br />
            Entre em contato pelo WhatsApp para agendar sua consulta.
          </p>
        </div>
      </main>
    );
  }

  return (
    <ContentProvider value={content}>
      <PreConsultaForm />
    </ContentProvider>
  );
}

