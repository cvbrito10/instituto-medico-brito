import { createClient } from '@supabase/supabase-js';

/**
 * Modelo de conteúdo editável do site.
 * Os valores DEFAULT abaixo são o que aparece caso o Supabase esteja
 * vazio — o site nunca quebra por falta de conteúdo.
 */
export type SiteContent = {
  hero: {
    titulo: string;
    subtitulo1: string;
    subtitulo2: string;
    badges: string[];
  };
  sobre: {
    titulo: string;
    paragrafo1: string;
    paragrafo2: string;
  };
  contato: {
    whatsappDisplay: string;
    whatsappNumber: string;
    enderecoRua: string;
    enderecoBairro: string;
    instagramHandle: string;
    instagramUrl: string;
  };
  medicos: {
    nome1: string;
    nome2: string;
  };
  assets: {
    logoUrl: string; // vazio = usa o monograma SVG padrão
    medicosUrl: string; // vazio = usa o placeholder do retrato
  };
};

export const DEFAULT_CONTENT: SiteContent = {
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
  },
  sobre: {
    titulo: 'O emagrecimento saudável vai muito além da balança.',
    paragrafo1:
      'No Instituto Médico Brito acreditamos que cada paciente possui uma história clínica única. Por isso, realizamos uma avaliação completa para compreender metabolismo, composição corporal, exames laboratoriais, fatores hormonais, inflamação, estilo de vida e demais aspectos que interferem na saúde e na perda de peso.',
    paragrafo2:
      'Nosso objetivo é oferecer um plano de tratamento totalmente personalizado, focado não apenas na redução do peso corporal, mas na melhora da saúde metabólica, energia, qualidade do sono, disposição e qualidade de vida.',
  },
  contato: {
    whatsappDisplay: '(69) 98120-6377',
    whatsappNumber: '5569981206377',
    enderecoRua: 'Av. Amazonas, 2469',
    enderecoBairro: 'Centro',
    instagramHandle: '@institutomedicobrito',
    instagramUrl: 'https://instagram.com/institutomedicobrito',
  },
  medicos: {
    nome1: 'Dr. Claudio Brito',
    nome2: 'Dra. Vanessa Brito',
  },
  assets: {
    logoUrl: '',
    medicosUrl: '',
  },
};

/** Faz merge profundo dos overrides do Supabase sobre os defaults. */
function mergeContent(overrides: Partial<SiteContent> | null): SiteContent {
  if (!overrides) return DEFAULT_CONTENT;
  return {
    hero: { ...DEFAULT_CONTENT.hero, ...(overrides.hero ?? {}) },
    sobre: { ...DEFAULT_CONTENT.sobre, ...(overrides.sobre ?? {}) },
    contato: { ...DEFAULT_CONTENT.contato, ...(overrides.contato ?? {}) },
    medicos: { ...DEFAULT_CONTENT.medicos, ...(overrides.medicos ?? {}) },
    assets: { ...DEFAULT_CONTENT.assets, ...(overrides.assets ?? {}) },
  };
}

/**
 * Lê o conteúdo do site no servidor. Usa a chave pública (anon) —
 * leitura é liberada pela policy. Em caso de erro, retorna os defaults.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return DEFAULT_CONTENT;

  try {
    const supabase = createClient(url, anon, {
      auth: { persistSession: false },
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

/** Monta um link de WhatsApp a partir do número do conteúdo. */
export function waLink(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
