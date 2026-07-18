import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { DEFAULT_CONTENT, type SiteContent } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Mantém só as chaves conhecidas do modelo (evita dados arbitrários). */
function pick(input: Partial<SiteContent>): SiteContent {
  return {
    hero: { ...DEFAULT_CONTENT.hero, ...(input.hero ?? {}) },
    sobre: { ...DEFAULT_CONTENT.sobre, ...(input.sobre ?? {}) },
    contato: { ...DEFAULT_CONTENT.contato, ...(input.contato ?? {}) },
    medicos: { ...DEFAULT_CONTENT.medicos, ...(input.medicos ?? {}) },
    assets: { ...DEFAULT_CONTENT.assets, ...(input.assets ?? {}) },
  };
}

export async function POST(req: NextRequest) {
  // 1) Confirma que há um usuário autenticado (sessão via cookie)
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Não autorizado.' },
      { status: 401 },
    );
  }

  // 2) Lê e valida o corpo
  let body: Partial<SiteContent>;
  try {
    body = (await req.json()) as Partial<SiteContent>;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Dados inválidos.' },
      { status: 400 },
    );
  }

  const content = pick(body);

  // 3) Grava usando a service role (ignora RLS com segurança, já validado acima)
  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.from('site_content').upsert({
      id: 'main',
      data: content,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Erro interno.' },
      { status: 500 },
    );
  }
}
