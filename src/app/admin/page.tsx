import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-server';
import { getSiteContent } from '@/lib/content';
import { AdminEditor } from './AdminEditor';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const content = await getSiteContent();

  return <AdminEditor initialContent={content} userEmail={user.email ?? ''} />;
}
