import type { Metadata } from 'next';
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

export default function PreConsultaPage() {
  return <PreConsultaForm />;
}
