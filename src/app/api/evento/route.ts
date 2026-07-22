import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Payload = {
  tipo?: string;
  rotulo?: string;
  sessaoId?: string;
  pagina?: string;
};

const TIPOS_VALIDOS = new Set(['click', 'form_step', 'form_submit', 'form_open']);

function sanitize(value: unknown, max = 160): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const tipo = sanitize(body.tipo, 30);
  const rotulo = sanitize(body.rotulo, 160);
  const sessaoId = sanitize(body.sessaoId, 60);
  const pagina = sanitize(body.pagina, 200);

  if (!TIPOS_VALIDOS.has(tipo) || !rotulo) {
    // Falha silenciosa: analytics nunca deve atrapalhar a navegação do usuário.
    return NextResponse.json({ ok: false });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const supabase = createSupabaseAdminClient();
    await supabase.from('eventos').insert({
      tipo,
      rotulo,
      sessao_id: sessaoId || null,
      pagina: pagina || null,
    });
  } catch (err) {
    console.error('[evento] Falha ao registrar (ignorada):', err);
  }

  return NextResponse.json({ ok: true });
}
