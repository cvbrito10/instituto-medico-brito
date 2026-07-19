import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { mergeContent, type SiteContent } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: 'Não autorizado.' }, { status: 401 });
  }

  let body: Partial<SiteContent>;
  try {
    body = (await req.json()) as Partial<SiteContent>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Dados inválidos.' }, { status: 400 });
  }

  const content = mergeContent(body);

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.from('site_content').upsert({
      id: 'main',
      data: content,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Erro interno.' },
      { status: 500 },
    );
  }
}
