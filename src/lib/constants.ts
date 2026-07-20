export const SITE = {
  name: 'Instituto Médico Brito',
  tagline: 'Evolução com saúde e bem-estar',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://institutomedicobrito.com.br',
  description:
    'Medicina personalizada em saúde feminina e masculina, emagrecimento, saúde metabólica, reposição hormonal e longevidade. Avaliação clínica completa e protocolos individualizados.',
} as const;

export const CONTACT = {
  doctors: ['Dr. Claudio Brito', 'Dra. Vanessa Brito'],
  address: {
    street: 'Av. Amazonas, 2469',
    district: 'Centro',
  },
  whatsapp: {
    display: '(69) 98120-6377',
    number:
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5569981206377',
  },
  instagram: {
    handle: '@institutomedicobrito',
    url: 'https://instagram.com/institutomedicobrito',
  },
} as const;

/**
 * Monta um link do WhatsApp com mensagem pré-preenchida.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp.number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_MESSAGES = {
  default:
    'Olá! Gostaria de agendar uma avaliação médica no Instituto Médico Brito.',
  consulta:
    'Olá! Vim pelo site e gostaria de agendar uma consulta de avaliação personalizada.',
  duvida:
    'Olá! Vim pelo site do Instituto Médico Brito e gostaria de tirar algumas dúvidas.',
} as const;

/**
 * Menu de Vitalidade — usado no seletor "Objetivo principal" do formulário
 * de agendamento, agrupado por especialidade.
 */
export const OBJETIVOS_GRUPOS = [
  {
    grupo: 'Saúde Feminina',
    itens: ['Menopausa', 'Vitalidade Feminina', 'TPM', 'Libido', 'Endometriose', 'Lipedema'],
  },
  {
    grupo: 'Saúde Masculina',
    itens: ['Hipogonadismo', 'Vitalidade Masculina', 'Performance', 'Longevidade Masculina'],
  },
  {
    grupo: 'Metabolismo e Composição Corporal',
    itens: ['Obesidade', 'Emagrecimento', 'Preservação Muscular', 'Saúde Metabólica'],
  },
  {
    grupo: 'Sala de Vitalidade',
    itens: [
      'Protocolos Injetáveis',
      'Reposição de Nutrientes',
      'Performance e Energia',
      'Imunidade e Longevidade',
    ],
  },
  {
    grupo: 'Tricologia',
    itens: ['Saúde Capilar', 'Protocolos Personalizados', 'Exossomos e Tecnologias Avançadas'],
  },
  {
    grupo: 'Outro',
    itens: ['Ainda não sei / Avaliação geral'],
  },
] as const;

/** Lista achatada, mantida para compatibilidade com trechos que precisem de todos os valores. */
export const OBJETIVOS = OBJETIVOS_GRUPOS.flatMap((g) => g.itens);
