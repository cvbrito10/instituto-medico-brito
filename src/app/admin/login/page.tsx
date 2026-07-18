'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Monogram } from '@/components/Monogram';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });
      if (error) {
        setErro('E-mail ou senha incorretos.');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setErro('Não foi possível entrar agora. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-gold/20 bg-white/70 p-8 shadow-soft">
        <div className="text-center">
          <Monogram className="mx-auto h-12 w-12" />
          <h1 className="mt-4 font-display text-3xl text-espresso">
            Painel do Instituto
          </h1>
          <p className="mt-1 text-sm text-espresso-soft">
            Acesso restrito à equipe.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-nude-deep/50 bg-white px-4 py-3 text-sm text-espresso focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">
              Senha
            </label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-nude-deep/50 bg-white px-4 py-3 text-sm text-espresso focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
            />
          </div>

          {erro && <p className="text-center text-sm text-red-700/90">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Entrando…
              </>
            ) : (
              <>
                <Lock size={15} strokeWidth={1.8} />
                Entrar
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
