import { createClient } from '@supabase/supabase-js';

export type CardItem = { titulo: string; descricao: string };
export type CampoConfig = { key: string; label: string; placeholder: string };

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
    selo: string;
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
  menuVitalidade: {
    eyebrow: string;
    titulo: string;
    subtitulo: string;
    categorias: { titulo: string; itens: string[] }[];
  };
  preconsulta: {
    ativo: boolean;
    eyebrow: string;
    titulo: string;
    subtitulo: string;
    whatsappNumero: string;
    mensagemFechamento: string;
    objetivosLabel: string;
    objetivosAjuda: string;
    camposDadosPessoais: CampoConfig[];
    camposHistorico: CampoConfig[];
    camposSaudeGeral: CampoConfig[];
    camposObjetivos: CampoConfig[];
  };
  depoimentos: {
    ativo: boolean;
    itens: { fotoUrl: string; nome: string; texto: string; posicao: 'top' | 'center' | 'bottom' }[];
  };
  videos: {
    ativo: boolean;
    eyebrow: string;
    titulo: string;
    subtitulo: string;
    itens: {
      pergunta: string;
      medico: string;
      tipo: 'youtube' | 'upload' | 'instagram';
      youtubeId: string;
      videoUrl: string;
      instagramUrl: string;
      capaUrl: string;
    }[];
  };
  galeria: {
    ativo: boolean;
    eyebrow: string;
    titulo: string;
    subtitulo: string;
    itens: { fotoUrl: string; legenda: string }[];
  };
  material: {
    ativo: boolean;
    titulo: string;
    descricao: string;
    textoBotao: string;
    imagemUrl: string;
    pdfUrl: string;
  };
};

export const DEFAULT_CONTENT: SiteContent = {
  seo: {
    titulo: 'Instituto Médico CV Brito — Saúde Feminina e Medicina Personalizada',
    descricao:
      'Cuidado médico individualizado em saúde feminina e masculina, emagrecimento, saúde metabólica e longevidade. Avaliação clínica completa e protocolos personalizados para você e seu casal.',
  },
  marca: {
    nome: 'BRITO',
    subtitulo: 'Instituto Médico',
  },
  hero: {
    titulo:
      'Medicina Personalizada para a Saúde da Mulher, em Cada Fase da Vida',
    subtitulo1:
      'Do equilíbrio hormonal ao emagrecimento saudável — cuidado médico feito sob medida para você e para quem você ama.',
    subtitulo2:
      'Acompanhamento individualizado em saúde feminina e masculina, com foco também em emagrecimento, saúde metabólica e longevidade — ciência, avaliação clínica completa e protocolos personalizados para o seu casal.',
    badges: [
      'Foco em Saúde Feminina',
      'Atendimento Individualizado',
      'Avaliação Completa',
      'Protocolos Personalizados',
    ],
    ctaPrimario: 'Agendar Consulta',
    ctaSecundario: 'Falar no WhatsApp',
    cardNumero: '100%',
    cardTexto: 'Plano Personalizado',
    selo: 'Saúde Feminina & Bem-Estar do Casal',
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
  menuVitalidade: {
    eyebrow: 'Evolução com saúde',
    titulo: 'Menu de Vitalidade',
    subtitulo:
      'Um cuidado completo para cada fase e cada necessidade — da saúde feminina e masculina à composição corporal, vitalidade e saúde capilar.',
    categorias: [
      {
        titulo: 'Saúde Feminina',
        itens: ['Menopausa', 'Vitalidade', 'TPM', 'Libido', 'Endometriose', 'Lipedema'],
      },
      {
        titulo: 'Saúde Masculina',
        itens: ['Hipogonadismo', 'Vitalidade', 'Performance', 'Longevidade'],
      },
      {
        titulo: 'Metabolismo e Composição Corporal',
        itens: ['Obesidade', 'Emagrecimento', 'Preservação Muscular', 'Saúde Metabólica'],
      },
      {
        titulo: 'Sala de Vitalidade',
        itens: [
          'Protocolos Injetáveis',
          'Reposição de Nutrientes',
          'Performance e Energia',
          'Imunidade e Longevidade',
        ],
      },
      {
        titulo: 'Tricologia',
        itens: ['Saúde Capilar', 'Protocolos Personalizados', 'Exossomos e Tecnologias Avançadas'],
      },
    ],
  },
  preconsulta: {
    ativo: true,
    eyebrow: 'Dr. Claudio Brito & Dra. Vanessa Brito',
    titulo: 'Formulário de Pré-Consulta',
    subtitulo:
      'Bem-vindo(a) ao seu cuidado. Leva menos de 3 minutos e nos ajuda a conhecer sua história antes mesmo da consulta.',
    whatsappNumero: '5569981206377',
    mensagemFechamento:
      'Obrigado por preencher este formulário com carinho.\nEle nos ajuda a te conhecer antes mesmo da consulta.',
    objetivosLabel: 'Seus 3 principais objetivos com esta consulta',
    objetivosAjuda: 'Em ordem de prioridade — o que é mais importante para você?',
    camposDadosPessoais: [
      { key: 'nome', label: 'Nome completo', placeholder: 'Seu nome completo' },
      { key: 'sexo', label: 'Sexo', placeholder: '' },
      { key: 'dataNascimento', label: 'Data de nascimento', placeholder: '' },
      { key: 'cpf', label: 'CPF', placeholder: '000.000.000-00' },
      { key: 'rg', label: 'RG (opcional)', placeholder: '' },
      { key: 'profissao', label: 'Profissão (opcional)', placeholder: '' },
      { key: 'convenio', label: 'Convênio médico (opcional)', placeholder: "Particular ou nome do convênio" },
      { key: 'email', label: 'E-mail (opcional)', placeholder: '' },
      { key: 'endereco', label: 'Endereço completo com CEP (opcional)', placeholder: '' },
      { key: 'comoConheceu', label: 'Como conheceu o Instituto Médico Brito?', placeholder: '' },
      { key: 'quemIndicou', label: 'Quem lhe indicou?', placeholder: '' },
    ],
    camposHistorico: [
      { key: 'queixaPrincipal', label: 'Queixa principal', placeholder: 'Descreva o motivo principal da sua consulta...' },
      { key: 'historiaResumo', label: 'Sua história (resumo)', placeholder: 'Conte um pouco sobre sua saúde, trajetória, o que achar relevante...' },
      { key: 'temFilhos', label: 'Tem filhos?', placeholder: '' },
      { key: 'quantosFilhos', label: 'Quantos filhos?', placeholder: '' },
      { key: 'tipoParto', label: 'Tipo de parto', placeholder: '' },
      { key: 'idadeMenarca', label: 'Com quantos anos menstruou pela 1ª vez?', placeholder: 'Ex: 12 anos' },
      { key: 'idadePrimeiraRelacao', label: 'Com quantos anos foi sua 1ª relação sexual?', placeholder: 'Ex: 17 anos' },
      { key: 'dum', label: 'Data da última menstruação (DUM)', placeholder: '' },
      { key: 'cicloMenstrual', label: 'Período do ciclo menstrual', placeholder: '' },
      { key: 'fluxo', label: 'Característica do fluxo', placeholder: '' },
      { key: 'tpm', label: 'Possui TPM?', placeholder: '' },
      { key: 'metodoContraceptivo', label: 'Método anticoncepcional atual', placeholder: "Pílula, DIU, preservativo, nenhum..." },
      { key: 'ultimoPapanicolau', label: 'Quando foi o último Papanicolau?', placeholder: "Mês/Ano ou 'Nunca fiz'" },
    ],
    camposSaudeGeral: [
      { key: 'doencasPrevias', label: 'Doenças prévias', placeholder: "Hipertensão, diabetes, tireoide, outras... ou 'Nenhuma'" },
      { key: 'medicamentos', label: 'Medicamentos ou suplementos em uso', placeholder: "Liste os medicamentos/suplementos ou 'Nenhum'" },
      { key: 'cirurgias', label: 'Cirurgias realizadas', placeholder: "Quais cirurgias? Quando? Ou 'Nenhuma'" },
      { key: 'historicoFamiliarCancer', label: 'Histórico de câncer de mama na família?', placeholder: '' },
      { key: 'peso', label: 'Peso', placeholder: 'Ex: 65 kg' },
      { key: 'altura', label: 'Altura', placeholder: 'Ex: 1,68 m' },
      { key: 'atividadeFisica', label: 'Atividade física', placeholder: 'Qual? Quantas vezes por semana?' },
      { key: 'tabagismo', label: 'Tabagismo', placeholder: '' },
      { key: 'qualidadeSono', label: 'Qualidade do sono', placeholder: '' },
      { key: 'qualidadeAlimentacao', label: 'Qualidade da alimentação', placeholder: '' },
      { key: 'evacuaDiariamente', label: 'Evacua diariamente?', placeholder: '' },
      { key: 'libido', label: 'Como está sua libido (desejo sexual)?', placeholder: 'Descreva como está seu desejo sexual...' },
    ],
    camposObjetivos: [
      { key: 'objetivo1', label: '1', placeholder: 'Objetivo prioritário' },
      { key: 'objetivo2', label: '2', placeholder: 'Segundo objetivo' },
      { key: 'objetivo3', label: '3', placeholder: 'Terceiro objetivo' },
    ],
  },
  depoimentos: {
    ativo: false,
    itens: [],
  },
  videos: {
    ativo: false,
    eyebrow: 'Tire suas dúvidas',
    titulo: 'Perguntas para a Dra. e o Dr.',
    subtitulo:
      'Vídeos rápidos com a Dra. Vanessa e o Dr. Claudio respondendo as dúvidas mais comuns.',
    itens: [],
  },
  galeria: {
    ativo: false,
    eyebrow: 'Atualização constante',
    titulo: 'Congressos e Treinamentos',
    subtitulo:
      'Nossa equipe médica em constante atualização científica pelo Brasil e pelo mundo.',
    itens: [],
  },
  material: {
    ativo: false,
    titulo: 'Baixe nosso guia gratuito',
    descricao:
      'Preencha seus dados e receba agora um material exclusivo, preparado pela nossa equipe médica.',
    textoBotao: 'Quero receber',
    imagemUrl: '',
    pdfUrl: '',
  },
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
