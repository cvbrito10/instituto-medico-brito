import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/components/ContentProvider';
import { AgendamentoProvider } from '@/components/AgendamentoModal';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { QuemSomos } from '@/components/QuemSomos';
import { Protocolos } from '@/components/Protocolos';
import { MenuVitalidade } from '@/components/MenuVitalidade';
import { ComoFunciona } from '@/components/ComoFunciona';
import { Diferenciais } from '@/components/Diferenciais';
import { VideosDuvidas } from '@/components/VideosDuvidas';
import { Resultados } from '@/components/Resultados';
import { GaleriaViagens } from '@/components/GaleriaViagens';
import { CTA } from '@/components/CTA';
import { MaterialGratuito } from '@/components/MaterialGratuito';
import { Depoimentos } from '@/components/Depoimentos';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

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
          <MenuVitalidade />
          <ComoFunciona />
          <Diferenciais />
          <VideosDuvidas />
          <Resultados />
          <GaleriaViagens />
          <CTA />
          <MaterialGratuito />
        </main>
        <Depoimentos />
        <Footer />
        <WhatsAppFloat />
      </AgendamentoProvider>
    </ContentProvider>
  );
}
