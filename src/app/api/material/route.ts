import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Payload = {
  nome?: string;
  cidade?: string;
  telefone?: string;
  email?: string;
  material?: string;
};

function sanitize(value: unknown, max = 200): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  let body: Payload;

  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Requisição inválida.' },
      { status: 400 },
    );
  }

  const nome = sanitize(body.nome, 120);
  const cidade = sanitize(body.cidade, 120);
  const telefone = sanitize(body.telefone, 40);
  const email = sanitize(body.email, 160);
  const material = sanitize(body.material, 160);

  if (nome.length < 2) {
    return NextResponse.json(
      { ok: false, error: 'Informe seu nome.' },
      { status: 422 },
    );
  }

  const digits = telefone.replace(/\D/g, '');
  if (digits.length < 10) {
    return NextResponse.json(
      { ok: false, error: 'Informe um WhatsApp válido com DDD.' },
      { status: 422 },
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.warn('[material] Supabase não configurado — lead não persistido:', {
      nome,
      telefone,
    });
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from('leads').insert({
      nome,
      telefone,
      cidade: cidade || null,
      email: email || null,
      material: material || null,
      origem: 'material-gratuito',
      user_agent: req.headers.get('user-agent'),
      referer: req.headers.get('referer'),
    });

    if (error) {
      console.error('[material] Erro Supabase:', error.message);
      return NextResponse.json(
        { ok: false, error: 'Não foi possível registrar agora.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    console.error('[material] Falha inesperada:', err);
    return NextResponse.json(
      { ok: false, error: 'Erro interno.' },
      { status: 500 },
    );
  }
}
