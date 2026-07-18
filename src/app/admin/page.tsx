import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-server';
import { getSiteContent } from '@/lib/content';
import { AdminEditor } from './AdminEditor';
import { Monogram } from '@/components/Monogram';

export const dynamic = 'force-dynamic';

function ConfigNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-gold/20 bg-white/70 p-8 text-center shadow-soft">
        <Monogram className="mx-auto h-12 w-12" />
        <h1 className="mt-4 font-display text-2xl text-espresso">
          Painel ainda não configurado
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-espresso-soft">
          As chaves do Supabase não foram encontradas nesta publicação. Cadastre
          as variáveis de ambiente na Netlify (NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY) e refaça o
          deploy para ativar o painel.
        </p>
      </div>
    </main>
  );
}

export default async function AdminPage() {
  const hasEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasEnv) return <ConfigNotice />;

  let email = '';
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');
    email = user.email ?? '';
  } catch (err) {
    // redirect() lança um erro especial — deixa ele seguir
    if (err && typeof err === 'object' && 'digest' in err) throw err;
    redirect('/admin/login');
  }

  const content = await getSiteContent();
  return <AdminEditor initialContent={content} userEmail={email} />;
}
