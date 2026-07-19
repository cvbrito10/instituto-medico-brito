'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2, Check, LogOut, UploadCloud, ExternalLink,
  Image as ImageIcon, Plus, Trash2,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SiteContent, CardItem } from '@/lib/content';
import { Monogram } from '@/components/Monogram';

type Props = { initialContent: SiteContent; userEmail: string };
type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type AssetKey = 'logoUrl' | 'medicosUrl' | 'sobreUrl';

export function AdminEditor({ initialContent, userEmail }: Props) {
  const router = useRouter();
  const [c, setC] = useState<SiteContent>(initialContent);
  const [save, setSave] = useState<SaveState>('idle');
  const [msg, setMsg] = useState('');

  function update<K extends keyof SiteContent>(section: K, patch: Partial<SiteContent[K]>) {
    setC((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
    setSave('idle');
  }

  async function handleSave() {
    setSave('saving');
    setMsg('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error ?? 'Falha ao salvar.');
      setSave('saved');
      router.refresh();
      setTimeout(() => setSave('idle'), 3000);
    } catch (e) {
      setSave('error');
      setMsg(e instanceof Error ? e.message : 'Erro ao salvar.');
    }
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  async function uploadImage(file: File, key: AssetKey) {
    const supabase = createSupabaseBrowserClient();
    const ext = file.name.split('.').pop() ?? 'png';
    const path = `${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('site-assets')
      .upload(path, file, { upsert: true, cacheControl: '3600' });
    if (error) {
      setSave('error');
      setMsg('Falha no upload da imagem: ' + error.message);
      return;
    }
    const { data } = supabase.storage.from('site-assets').getPublicUrl(path);
    update('assets', { [key]: data.publicUrl } as Partial<SiteContent['assets']>);
  }

  return (
    <main className="min-h-screen pb-28">
      <header className="sticky top-0 z-10 glass border-b border-gold/15">
        <div className="container-luxe flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Monogram className="h-8 w-8" />
            <span className="font-roman text-sm tracking-[0.28em] text-espresso">PAINEL</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-sm text-espresso-soft hover:text-espresso sm:flex">
              <ExternalLink size={15} /> Ver site
            </a>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-gold/30 px-4 py-2 text-sm text-espresso-soft hover:text-espresso">
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container-luxe mt-8 max-w-3xl">
        <p className="text-sm text-espresso-soft">
          Logado como <strong>{userEmail}</strong>. Edite qualquer parte do site e clique em{' '}
          <strong>Salvar alterações</strong> no rodapé.
        </p>

        {/* IMAGENS */}
        <Section title="Logo e imagens">
          <ImageField label="Logo do site" value={c.assets.logoUrl}
            hint="Substitui o monograma no topo e no rodapé. Formato quadrado, PNG com fundo transparente, ~512 × 512 px."
            onUpload={(f) => uploadImage(f, 'logoUrl')}
            onClear={() => update('assets', { logoUrl: '' })} />
          <ImageField label="Foto dos médicos — destaque do topo" value={c.assets.medicosUrl}
            hint="Aparece ao lado do título principal. Vertical (retrato), proporção 4:5, ~1000 × 1250 px, JPG ou PNG."
            onUpload={(f) => uploadImage(f, 'medicosUrl')}
            onClear={() => update('assets', { medicosUrl: '' })} />
          <ImageField label="Imagem da seção Quem Somos" value={c.assets.sobreUrl}
            hint="Aparece ao lado do texto “Quem Somos”. Quadrada, proporção 1:1, ~800 × 800 px, JPG ou PNG."
            onUpload={(f) => uploadImage(f, 'sobreUrl')}
            onClear={() => update('assets', { sobreUrl: '' })} />
        </Section>

        {/* SEO / PREVIEW DO LINK */}
        <Section title="Preview do link (WhatsApp / Google)">
          <p className="text-xs leading-relaxed text-espresso-soft/80">
            É o título e o texto que aparecem quando o link do site é enviado no
            WhatsApp ou aparece no Google. A imagem do preview usa a logo enviada
            acima.
          </p>
          <Field label="Título do preview">
            <input className={inp} value={c.seo.titulo}
              onChange={(e) => update('seo', { titulo: e.target.value })} />
          </Field>
          <Field label="Descrição do preview">
            <textarea rows={2} className={ta} value={c.seo.descricao}
              onChange={(e) => update('seo', { descricao: e.target.value })} />
          </Field>
        </Section>

        {/* MARCA / NOME AO LADO DA LOGO */}
        <Section title="Nome ao lado da logo">
          <p className="text-xs leading-relaxed text-espresso-soft/80">
            Texto exibido ao lado da logo, no topo e no rodapé. Deixe os campos
            em branco se quiser mostrar apenas a imagem da logo.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome (linha principal)">
              <input className={inp} value={c.marca.nome}
                onChange={(e) => update('marca', { nome: e.target.value })} />
            </Field>
            <Field label="Subtítulo (linha menor)">
              <input className={inp} value={c.marca.subtitulo}
                onChange={(e) => update('marca', { subtitulo: e.target.value })} />
            </Field>
          </div>
        </Section>

        {/* HERO */}
        <Section title="Topo do site (Hero)">
          <Field label="Título principal">
            <textarea rows={2} className={ta} value={c.hero.titulo}
              onChange={(e) => update('hero', { titulo: e.target.value })} />
          </Field>
          <Field label="Frase de destaque">
            <input className={inp} value={c.hero.subtitulo1}
              onChange={(e) => update('hero', { subtitulo1: e.target.value })} />
          </Field>
          <Field label="Texto de apoio">
            <textarea rows={2} className={ta} value={c.hero.subtitulo2}
              onChange={(e) => update('hero', { subtitulo2: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Botão principal (texto)">
              <input className={inp} value={c.hero.ctaPrimario}
                onChange={(e) => update('hero', { ctaPrimario: e.target.value })} />
            </Field>
            <Field label="Botão WhatsApp (texto)">
              <input className={inp} value={c.hero.ctaSecundario}
                onChange={(e) => update('hero', { ctaSecundario: e.target.value })} />
            </Field>
          </div>
          <Field label="Selos de confiança (um por linha)">
            <textarea rows={4} className={ta} value={c.hero.badges.join('\n')}
              onChange={(e) => update('hero', { badges: linesToArr(e.target.value) })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Selo flutuante — número">
              <input className={inp} value={c.hero.cardNumero}
                onChange={(e) => update('hero', { cardNumero: e.target.value })} />
            </Field>
            <Field label="Selo flutuante — texto">
              <input className={inp} value={c.hero.cardTexto}
                onChange={(e) => update('hero', { cardTexto: e.target.value })} />
            </Field>
          </div>
        </Section>

        {/* BOTÕES / WHATSAPP */}
        <Section title="Botões e WhatsApp">
          <p className="text-xs leading-relaxed text-espresso-soft/80">
            O botão “Agendar Consulta” abre o formulário. O botão de WhatsApp e o
            botão flutuante abrem uma conversa já com a mensagem abaixo.
          </p>
          <Field label="Mensagem padrão do WhatsApp (botão flutuante e rodapé)">
            <textarea rows={2} className={ta} value={c.whatsapp.mensagemPadrao}
              onChange={(e) => update('whatsapp', { mensagemPadrao: e.target.value })} />
          </Field>
          <Field label="Mensagem do botão “Falar no WhatsApp” (topo)">
            <textarea rows={2} className={ta} value={c.whatsapp.mensagemConsulta}
              onChange={(e) => update('whatsapp', { mensagemConsulta: e.target.value })} />
          </Field>
        </Section>

        {/* QUEM SOMOS */}
        <Section title="Quem Somos">
          <Field label="Rótulo (eyebrow)">
            <input className={inp} value={c.sobre.eyebrow}
              onChange={(e) => update('sobre', { eyebrow: e.target.value })} />
          </Field>
          <Field label="Título da seção">
            <textarea rows={2} className={ta} value={c.sobre.titulo}
              onChange={(e) => update('sobre', { titulo: e.target.value })} />
          </Field>
          <Field label="Primeiro parágrafo">
            <textarea rows={4} className={ta} value={c.sobre.paragrafo1}
              onChange={(e) => update('sobre', { paragrafo1: e.target.value })} />
          </Field>
          <Field label="Segundo parágrafo">
            <textarea rows={4} className={ta} value={c.sobre.paragrafo2}
              onChange={(e) => update('sobre', { paragrafo2: e.target.value })} />
          </Field>
          <Field label="Texto do selo (sob a imagem)">
            <input className={inp} value={c.sobre.selo}
              onChange={(e) => update('sobre', { selo: e.target.value })} />
          </Field>
        </Section>

        {/* MÉDICOS */}
        <Section title="Nomes dos médicos">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Médico 1">
              <input className={inp} value={c.medicos.nome1}
                onChange={(e) => update('medicos', { nome1: e.target.value })} />
            </Field>
            <Field label="Médico 2">
              <input className={inp} value={c.medicos.nome2}
                onChange={(e) => update('medicos', { nome2: e.target.value })} />
            </Field>
          </div>
        </Section>

        {/* PROTOCOLOS */}
        <Section title="Protocolos Personalizados">
          <TwoCol>
            <Field label="Rótulo">
              <input className={inp} value={c.protocolos.eyebrow}
                onChange={(e) => update('protocolos', { eyebrow: e.target.value })} />
            </Field>
            <Field label="Título da seção">
              <input className={inp} value={c.protocolos.titulo}
                onChange={(e) => update('protocolos', { titulo: e.target.value })} />
            </Field>
          </TwoCol>
          <CardListEditor
            items={c.protocolos.itens}
            onChange={(itens) => update('protocolos', { itens })}
            withDesc
            addLabel="Adicionar protocolo"
          />
        </Section>

        {/* COMO FUNCIONA */}
        <Section title="Como Funciona (jornada)">
          <TwoCol>
            <Field label="Rótulo">
              <input className={inp} value={c.comoFunciona.eyebrow}
                onChange={(e) => update('comoFunciona', { eyebrow: e.target.value })} />
            </Field>
            <Field label="Título da seção">
              <input className={inp} value={c.comoFunciona.titulo}
                onChange={(e) => update('comoFunciona', { titulo: e.target.value })} />
            </Field>
          </TwoCol>
          <Field label="Texto do botão final">
            <input className={inp} value={c.comoFunciona.cta}
              onChange={(e) => update('comoFunciona', { cta: e.target.value })} />
          </Field>
          <CardListEditor
            items={c.comoFunciona.passos}
            onChange={(passos) => update('comoFunciona', { passos })}
            withDesc
            addLabel="Adicionar passo"
          />
        </Section>

        {/* DIFERENCIAIS */}
        <Section title="Diferenciais">
          <TwoCol>
            <Field label="Rótulo">
              <input className={inp} value={c.diferenciais.eyebrow}
                onChange={(e) => update('diferenciais', { eyebrow: e.target.value })} />
            </Field>
            <Field label="Título da seção">
              <input className={inp} value={c.diferenciais.titulo}
                onChange={(e) => update('diferenciais', { titulo: e.target.value })} />
            </Field>
          </TwoCol>
          <StringListEditor
            items={c.diferenciais.itens}
            onChange={(itens) => update('diferenciais', { itens })}
            addLabel="Adicionar diferencial"
          />
        </Section>

        {/* RESULTADOS */}
        <Section title="Resultados Esperados">
          <TwoCol>
            <Field label="Rótulo">
              <input className={inp} value={c.resultados.eyebrow}
                onChange={(e) => update('resultados', { eyebrow: e.target.value })} />
            </Field>
            <Field label="Título da seção">
              <input className={inp} value={c.resultados.titulo}
                onChange={(e) => update('resultados', { titulo: e.target.value })} />
            </Field>
          </TwoCol>
          <StringListEditor
            items={c.resultados.itens}
            onChange={(itens) => update('resultados', { itens })}
            addLabel="Adicionar resultado"
          />
          <Field label="Aviso ético (disclaimer)">
            <textarea rows={4} className={ta} value={c.resultados.disclaimer}
              onChange={(e) => update('resultados', { disclaimer: e.target.value })} />
          </Field>
        </Section>

        {/* CHAMADA FINAL */}
        <Section title="Chamada final (CTA)">
          <Field label="Título">
            <textarea rows={2} className={ta} value={c.cta.titulo}
              onChange={(e) => update('cta', { titulo: e.target.value })} />
          </Field>
          <Field label="Texto">
            <textarea rows={2} className={ta} value={c.cta.texto}
              onChange={(e) => update('cta', { texto: e.target.value })} />
          </Field>
          <Field label="Texto do botão">
            <input className={inp} value={c.cta.botao}
              onChange={(e) => update('cta', { botao: e.target.value })} />
          </Field>
        </Section>

        {/* RODAPÉ + CONTATO */}
        <Section title="Rodapé e contato">
          <Field label="Descrição do rodapé">
            <textarea rows={3} className={ta} value={c.footer.descricao}
              onChange={(e) => update('footer', { descricao: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp (exibição)">
              <input className={inp} value={c.contato.whatsappDisplay}
                onChange={(e) => update('contato', { whatsappDisplay: e.target.value })} />
            </Field>
            <Field label="WhatsApp (só números, com 55 e DDD)">
              <input className={inp} value={c.contato.whatsappNumber}
                onChange={(e) => update('contato', { whatsappNumber: e.target.value.replace(/\D/g, '') })} />
            </Field>
            <Field label="Endereço (rua e número)">
              <input className={inp} value={c.contato.enderecoRua}
                onChange={(e) => update('contato', { enderecoRua: e.target.value })} />
            </Field>
            <Field label="Bairro / complemento">
              <input className={inp} value={c.contato.enderecoBairro}
                onChange={(e) => update('contato', { enderecoBairro: e.target.value })} />
            </Field>
            <Field label="Instagram (@usuário)">
              <input className={inp} value={c.contato.instagramHandle}
                onChange={(e) => update('contato', { instagramHandle: e.target.value })} />
            </Field>
            <Field label="Link do Instagram">
              <input className={inp} value={c.contato.instagramUrl}
                onChange={(e) => update('contato', { instagramUrl: e.target.value })} />
            </Field>
          </div>
        </Section>

        {/* SALVAR */}
        <div className="sticky bottom-4 mt-8">
          <div className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-porcelain/95 p-4 shadow-lift backdrop-blur">
            <button onClick={handleSave} disabled={save === 'saving'}
              className="btn-primary flex-1 disabled:opacity-70">
              {save === 'saving' ? (<><Loader2 size={16} className="animate-spin" /> Salvando…</>)
                : save === 'saved' ? (<><Check size={16} /> Salvo!</>)
                : 'Salvar alterações'}
            </button>
          </div>
          {save === 'error' && <p className="mt-2 text-center text-sm text-red-700/90">{msg}</p>}
          {save === 'saved' && <p className="mt-2 text-center text-sm text-espresso-soft">As mudanças já estão no ar. Abra o site para conferir.</p>}
        </div>
      </div>
    </main>
  );
}

function linesToArr(v: string) { return v.split('\n').filter((l) => l.trim()); }

const inp = 'w-full rounded-xl border border-nude-deep/50 bg-white px-4 py-2.5 text-sm text-espresso focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25';
const ta = inp + ' resize-y leading-relaxed';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 rounded-2xl border border-gold/15 bg-white/60 p-6">
      <h2 className="font-display text-2xl text-espresso">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">{label}</span>
      {children}
    </label>
  );
}

function CardListEditor({ items, onChange, withDesc, addLabel }: {
  items: CardItem[];
  onChange: (items: CardItem[]) => void;
  withDesc?: boolean;
  addLabel: string;
}) {
  function set(i: number, patch: Partial<CardItem>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function add() { onChange([...items, { titulo: '', descricao: '' }]); }

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-nude-deep/40 bg-white/70 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.68rem] uppercase tracking-[0.14em] text-bronze">Item {i + 1}</span>
            <button onClick={() => remove(i)} className="text-espresso-soft hover:text-red-700" aria-label="Remover">
              <Trash2 size={15} />
            </button>
          </div>
          <input className={inp + ' mb-2'} placeholder="Título" value={it.titulo}
            onChange={(e) => set(i, { titulo: e.target.value })} />
          {withDesc && (
            <textarea rows={2} className={ta} placeholder="Descrição" value={it.descricao}
              onChange={(e) => set(i, { descricao: e.target.value })} />
          )}
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 text-xs text-espresso-soft hover:border-gold hover:text-espresso">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

function StringListEditor({ items, onChange, addLabel }: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
}) {
  function set(i: number, v: string) { onChange(items.map((it, idx) => (idx === i ? v : it))); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function add() { onChange([...items, '']); }

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input className={inp} value={it} onChange={(e) => set(i, e.target.value)} />
          <button onClick={() => remove(i)} className="shrink-0 text-espresso-soft hover:text-red-700" aria-label="Remover">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button onClick={add}
        className="flex items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 text-xs text-espresso-soft hover:border-gold hover:text-espresso">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

function ImageField({ label, hint, value, onUpload, onClear }: {
  label: string; hint: string; value: string;
  onUpload: (file: File) => void; onClear: () => void;
}) {
  const [busy, setBusy] = useState(false);
  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    await onUpload(file);
    setBusy(false);
    e.target.value = '';
  }
  return (
    <div>
      <span className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-nude-deep/40 bg-white">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (<ImageIcon size={24} className="text-nude-deep" />)}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label className="btn-ghost cursor-pointer px-4 py-2 text-xs">
              {busy ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              {value ? 'Trocar imagem' : 'Enviar imagem'}
              <input type="file" accept="image/*" onChange={onChange} className="hidden" />
            </label>
            {value && (
              <button onClick={onClear} className="text-xs text-espresso-soft underline hover:text-espresso">Remover</button>
            )}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-espresso-soft/80">{hint}</p>
        </div>
      </div>
    </div>
  );
}
