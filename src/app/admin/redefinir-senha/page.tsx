'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check, KeyRound } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Monogram } from '@/components/Monogram';

type State = 'checking' | 'ready' | 'invalid' | 'done';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [state, setState] = useState<State>('checking');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // O link do e-mail traz um token que o Supabase transforma em sessão.
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setState('ready');
      }
    });

    // Se já houver sessão (token processado), libera.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setState('ready');
      else
        setTimeout(() => {
          setState((s) => (s === 'checking' ? 'invalid' : s));
        }, 2500);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    if (senha.length < 6) {
      setErro('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (senha !== confirma) {
      setErro('As senhas não são iguais.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) {
        setErro('Não foi possível atualizar. Solicite um novo link.');
        setLoading(false);
        return;
      }
      setState('done');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1800);
    } catch {
      setErro('Erro ao atualizar a senha.');
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-gold/20 bg-white/70 p-8 text-center shadow-soft">
        <Monogram className="mx-auto h-12 w-12" />
        <h1 className="mt-4 font-display text-3xl text-espresso">Nova senha</h1>

        {state === 'checking' && (
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-espresso-soft">
            <Loader2 size={16} className="animate-spin" /> Validando o link…
          </p>
        )}

        {state === 'invalid' && (
          <div className="mt-4">
            <p className="text-sm leading-relaxed text-espresso-soft">
              Este link é inválido ou expirou. Volte ao login e solicite um novo
              link de recuperação.
            </p>
            <a href="/admin/login" className="btn-primary mt-6 w-full">
              Voltar ao login
            </a>
          </div>
        )}

        {state === 'ready' && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <div>
              <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">
                Nova senha
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="new-password"
                className={inp}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">
                Confirmar senha
              </label>
              <input
                type="password"
                required
                value={confirma}
                onChange={(e) => setConfirma(e.target.value)}
                autoComplete="new-password"
                className={inp}
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
                  <Loader2 size={16} className="animate-spin" /> Salvando…
                </>
              ) : (
                <>
                  <KeyRound size={15} strokeWidth={1.8} /> Salvar nova senha
                </>
              )}
            </button>
          </form>
        )}

        {state === 'done' && (
          <div className="mt-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-fade text-porcelain">
              <Check size={24} strokeWidth={2} />
            </div>
            <p className="text-sm text-espresso-soft">
              Senha atualizada! Entrando no painel…
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

const inp =
  'w-full rounded-xl border border-nude-deep/50 bg-white px-4 py-3 text-sm text-espresso focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25';
