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

export default function Home() {
  return (
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
  );
}
