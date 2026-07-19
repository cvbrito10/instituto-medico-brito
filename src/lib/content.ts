import { createClient } from '@supabase/supabase-js';

export type CardItem = { titulo: string; descricao: string };

/** Modelo COMPLETO de conteúdo editável do site. */
export type SiteContent = {
  seo: {
    titulo: string;
    descricao: string;
  };
  marca: {
    nome: string;
    subtitulo: string;
  };
  hero: {
    titulo: string;
    subtitulo1: string;
    subtitulo2: string;
    badges: string[];
    ctaPrimario: string;
    ctaSecundario: string;
    cardNumero: string;
    cardTexto: string;
  };
  sobre: {
    eyebrow: string;
    titulo: string;
    paragrafo1: string;
    paragrafo2: string;
    selo: string;
  };
  protocolos: {
    eyebrow: string;
    titulo: string;
    itens: CardItem[];
  };
  comoFunciona: {
    eyebrow: string;
    titulo: string;
    cta: string;
    passos: CardItem[];
  };
  diferenciais: {
    eyebrow: string;
    titulo: string;
    itens: string[];
  };
  resultados: {
    eyebrow: string;
    titulo: string;
    itens: string[];
    disclaimer: string;
  };
  cta: {
    titulo: string;
    texto: string;
    botao: string;
  };
  footer: {
    descricao: string;
  };
  medicos: { nome1: string; nome2: string };
  contato: {
    whatsappDisplay: string;
    whatsappNumber: string;
    enderecoRua: string;
    enderecoBairro: string;
    instagramHandle: string;
    instagramUrl: string;
  };
  whatsapp: {
    mensagemPadrao: string;
    mensagemConsulta: string;
  };
  assets: {
    logoUrl: string;
    medicosUrl: string;
    sobreUrl: string;
  };
};

export const DEFAULT_CONTENT: SiteContent = {
  seo: {
    titulo: 'Instituto Médico CV Brito — Medicina Personalizada',
    descricao:
      'Cada organismo é único. Seu tratamento também deve ser. Avaliação clínica completa e protocolos personalizados.',
  },
  marca: {
    nome: 'BRITO',
    subtitulo: 'Instituto Médico',
  },
  hero: {
    titulo:
      'Medicina Personalizada para Emagrecimento, Saúde Metabólica e Longevidade',
    subtitulo1: 'Cada organismo é único. Seu tratamento também deve ser.',
    subtitulo2:
      'Acompanhamento médico individualizado baseado em ciência, avaliação clínica completa e protocolos personalizados.',
    badges: [
      'Atendimento Individualizado',
      'Avaliação Completa',
      'Protocolos Personalizados',
      'Medicina Baseada em Evidências',
    ],
    ctaPrimario: 'Agendar Consulta',
    ctaSecundario: 'Falar no WhatsApp',
    cardNumero: '100%',
    cardTexto: 'Plano Personalizado',
  },
  sobre: {
    eyebrow: 'Quem Somos',
    titulo: 'O emagrecimento saudável vai muito além da balança.',
    paragrafo1:
      'No Instituto Médico Brito acreditamos que cada paciente possui uma história clínica única. Por isso, realizamos uma avaliação completa para compreender metabolismo, composição corporal, exames laboratoriais, fatores hormonais, inflamação, estilo de vida e demais aspectos que interferem na saúde e na perda de peso.',
    paragrafo2:
      'Nosso objetivo é oferecer um plano de tratamento totalmente personalizado, focado não apenas na redução do peso corporal, mas na melhora da saúde metabólica, energia, qualidade do sono, disposição e qualidade de vida.',
    selo: 'Evolução com saúde',
  },
  protocolos: {
    eyebrow: 'O que oferecemos',
    titulo: 'Protocolos Personalizados',
    itens: [
      { titulo: 'Acompanhamento Médico Personalizado', descricao: 'Condução clínica próxima, com ajustes contínuos conforme sua evolução.' },
      { titulo: 'Estratégias para Emagrecimento Saudável', descricao: 'Abordagem sustentável, respeitando seu metabolismo e sua rotina.' },
      { titulo: 'Tratamento Metabólico', descricao: 'Cuidado com glicose, lipídios e demais marcadores da sua saúde.' },
      { titulo: 'Tirzepatida e Outras Medicações', descricao: 'Quando clinicamente indicadas, com critério e segurança.' },
      { titulo: 'Protocolos com Injetáveis', descricao: 'Recursos terapêuticos aplicados de forma individualizada.' },
      { titulo: 'Suplementação Individualizada', descricao: 'Definida a partir de exames e das suas necessidades reais.' },
      { titulo: 'Reposição Hormonal', descricao: 'Avaliação criteriosa do equilíbrio hormonal e do bem-estar.' },
      { titulo: 'Acompanhamento Contínuo da Evolução', descricao: 'Monitoramento de resultados e refinamento do seu plano.' },
    ],
  },
  comoFunciona: {
    eyebrow: 'A jornada',
    titulo: 'Como Funciona',
    cta: 'Iniciar minha jornada',
    passos: [
      { titulo: 'Agendamento', descricao: 'Você entra em contato e reservamos o melhor horário para o seu atendimento.' },
      { titulo: 'Consulta Médica', descricao: 'Escuta atenta da sua história clínica, objetivos e estilo de vida.' },
      { titulo: 'Avaliação Clínica Completa', descricao: 'Análise de metabolismo, composição corporal, exames e fatores hormonais.' },
      { titulo: 'Plano Individualizado', descricao: 'Um protocolo desenhado exclusivamente para o seu organismo.' },
      { titulo: 'Acompanhamento Contínuo', descricao: 'Monitoramento da evolução e ajustes ao longo de toda a jornada.' },
    ],
  },
  diferenciais: {
    eyebrow: 'Diferenciais',
    titulo: 'Por que escolher o Instituto Médico Brito?',
    itens: [
      'Medicina Personalizada',
      'Atendimento Individualizado',
      'Avaliação Completa',
      'Protocolos Exclusivos',
      'Acompanhamento Contínuo',
      'Equipe Médica Especializada',
      'Abordagem Integrativa',
      'Foco na Saúde Metabólica',
    ],
  },
  resultados: {
    eyebrow: 'O caminho possível',
    titulo: 'Resultados Esperados',
    itens: [
      'Melhora da composição corporal',
      'Melhora da disposição',
      'Melhora do metabolismo',
      'Controle hormonal',
      'Redução da inflamação',
      'Melhora do sono',
      'Qualidade de vida',
      'Bem-estar',
    ],
    disclaimer:
      'Os resultados variam de pessoa para pessoa e dependem de fatores individuais, adesão ao tratamento e avaliação clínica. Não há promessa ou garantia de resultados específicos. As informações desta página têm caráter informativo e não substituem a consulta médica.',
  },
  cta: {
    titulo:
      'Sua transformação começa com uma avaliação médica personalizada.',
    texto:
      'Agende sua consulta e descubra um plano desenvolvido exclusivamente para você.',
    botao: 'Agendar Consulta',
  },
  footer: {
    descricao:
      'Evolução com saúde e bem-estar. Medicina personalizada para emagrecimento, saúde metabólica, reposição hormonal e longevidade.',
  },
  medicos: { nome1: 'Dr. Claudio Brito', nome2: 'Dra. Vanessa Brito' },
  contato: {
    whatsappDisplay: '(69) 98120-6377',
    whatsappNumber: '5569981206377',
    enderecoRua: 'Av. Amazonas, 2469',
    enderecoBairro: 'Centro',
    instagramHandle: '@institutomedicobrito',
    instagramUrl: 'https://instagram.com/institutomedicobrito',
  },
  whatsapp: {
    mensagemPadrao:
      'Olá! Gostaria de agendar uma avaliação médica no Instituto Médico Brito.',
    mensagemConsulta:
      'Olá! Vim pelo site e gostaria de agendar uma consulta de avaliação personalizada.',
  },
  assets: { logoUrl: '', medicosUrl: '', sobreUrl: '' },
};

/** Merge raso por seção: valores salvos sobrescrevem os defaults. */
export function mergeContent(overrides: Partial<SiteContent> | null): SiteContent {
  if (!overrides) return DEFAULT_CONTENT;
  const o = overrides as Record<string, unknown>;
  const d = DEFAULT_CONTENT as unknown as Record<string, Record<string, unknown>>;
  const out = {} as Record<string, unknown>;
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    out[key] = { ...d[key], ...((o[key] as object) ?? {}) };
  }
  return out as unknown as SiteContent;
}

export async function getSiteContent(): Promise<SiteContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return DEFAULT_CONTENT;

  try {
    const supabase = createClient(url, anon, {
      auth: { persistSession: false },
      // Impede o Next.js de cachear a leitura — o site sempre mostra o
      // conteúdo mais recente salvo no painel.
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, cache: 'no-store' }),
      },
    });
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', 'main')
      .maybeSingle();
    if (error || !data) return DEFAULT_CONTENT;
    return mergeContent(data.data as Partial<SiteContent>);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function waLink(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
