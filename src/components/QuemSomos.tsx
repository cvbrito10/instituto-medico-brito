import { Reveal } from './Reveal';
import { GoldDivider } from './GoldDivider';
import { Monogram } from './Monogram';

export function QuemSomos() {
  return (
    <section id="sobre" className="relative py-24 lg:py-32">
      <div className="container-luxe grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-0 rounded-full border border-gold/20" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-white to-ivory shadow-soft" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Monogram className="h-28 w-28" />
              <span className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-bronze">
                Evolução com saúde
              </span>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow">Quem Somos</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl leading-[1.1] text-espresso sm:text-[2.9rem]">
              O emagrecimento saudável vai muito além da balança.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-6 max-w-xl space-y-5 text-[0.98rem] leading-relaxed text-espresso-soft">
              <p>
                No <strong className="font-medium text-espresso">Instituto
                Médico Brito</strong> acreditamos que cada paciente possui uma
                história clínica única. Por isso, realizamos uma avaliação
                completa para compreender metabolismo, composição corporal,
                exames laboratoriais, fatores hormonais, inflamação, estilo de
                vida e demais aspectos que interferem na saúde e na perda de
                peso.
              </p>
              <p>
                Nosso objetivo é oferecer um plano de tratamento{' '}
                <strong className="font-medium text-espresso">totalmente
                personalizado</strong>, focado não apenas na redução do peso
                corporal, mas na melhora da saúde metabólica, energia, qualidade
                do sono, disposição e qualidade de vida.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-9">
              <GoldDivider className="ml-0 max-w-[140px]" />
              <div className="mt-5 flex flex-col">
                <span className="font-display text-2xl text-espresso">
                  Dr. Claudio Brito &amp; Dra. Vanessa Brito
                </span>
                <span className="mt-1 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-bronze">
                  Médicos Responsáveis
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
