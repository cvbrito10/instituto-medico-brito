import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/components/ContentProvider';
import { AgendamentoProvider } from '@/components/AgendamentoModal';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { QuemSomos } from '@/components/QuemSomos';
import { Protocolos } from '@/components/Protocolos';
import { ComoFunciona } from '@/components/ComoFunciona';
import { Diferenciais } from '@/components/Diferenciais';
import { Resultados } from '@/components/Resultados';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const content = await getSiteContent();

  return (
    <ContentProvider value={content}>
      <AgendamentoProvider>
        <Navbar />
        <main>
          <Hero />
          <QuemSomos />
          <Protocolos />
          <ComoFunciona />
          <Diferenciais />
          <Resultados />
          <CTA />
        </main>
        <Footer />
        <WhatsAppFloat />
      </AgendamentoProvider>
    </ContentProvider>
  );
}
