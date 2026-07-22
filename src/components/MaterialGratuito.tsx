'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { useContent } from './ContentProvider';
import { trackEvent } from '@/lib/track';

const ease = [0.22, 1, 0.36, 1] as const;

export function MaterialGratuito() {
  const { material } = useContent();
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'enviando' | 'ok' | 'erro'>('idle');
  const [erro, setErro] = useState('');

  if (!material.ativo || !material.pdfUrl) return null;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setStatus('enviando');
    setErro('');
    try {
      const res = await fetch('/api/material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cidade, telefone, email, material: material.titulo }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErro(data.error || 'Não foi possível enviar. Tente novamente.');
        setStatus('erro');
        return;
      }
      setStatus('ok');
      trackEvent('form_submit', 'material-gratuito');
    } catch {
      setErro('Falha de conexão. Tente novamente.');
      setStatus('erro');
    }
  }

  return (
    <section className="bg-gradient-to-b from-nude/50 to-porcelain py-24 lg:py-28">
      <div className="container-luxe">
        <div className="mx-auto grid max-w-4xl items-center gap-10 rounded-[28px] border border-gold/20 bg-white/70 p-8 shadow-soft sm:p-12 lg:grid-cols-2">
          <div>
            {material.imagemUrl && (
              <img
                src={material.imagemUrl}
                alt={material.titulo}
                className="mb-6 aspect-[4/3] w-full rounded-2xl object-cover shadow-soft lg:mb-0"
              />
            )}
          </div>

          <div>
            <p className="eyebrow">Presente exclusivo</p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-espresso sm:text-4xl">
              {material.titulo}
            </h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-espresso-soft">
              {material.descricao}
            </p>

            {status === 'ok' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                className="mt-7"
              >
                <div className="mb-4 flex items-center gap-2 text-espresso">
                  <CheckCircle2 size={20} className="text-gold" />
                  <span className="text-sm">Recebemos seus dados! Seu presente está pronto.</span>
                </div>
                <a
                  href={material.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <Download size={16} strokeWidth={1.8} />
                  Baixar agora
                </a>
              </motion.div>
            ) : (
              <form onSubmit={enviar} className="mt-7 space-y-3">
                <input
                  required
                  className={inputCls}
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <input
                  required
                  className={inputCls}
                  placeholder="Sua cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
                <input
                  required
                  className={inputCls}
                  placeholder="Seu WhatsApp com DDD"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
                <input
                  type="email"
                  className={inputCls}
                  placeholder="Seu e-mail (opcional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {status === 'erro' && (
                  <p className="text-sm text-red-700">{erro}</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'enviando'}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {status === 'enviando' ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} strokeWidth={1.8} />
                  )}
                  {material.textoBotao}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  'w-full rounded-xl border border-nude-deep/50 bg-white/70 px-4 py-3 font-sans text-sm text-espresso placeholder:text-espresso-soft/50 transition focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/25';
