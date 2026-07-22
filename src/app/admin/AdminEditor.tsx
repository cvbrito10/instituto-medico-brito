'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2, Check, LogOut, UploadCloud, ExternalLink,
  Image as ImageIcon, Plus, Trash2, BarChart3,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SiteContent, CardItem, CampoConfig } from '@/lib/content';
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

  /** Upload genérico para arquivos avulsos (fotos de depoimentos, galeria, PDF do material). */
  async function uploadGeneric(file: File, prefix: string): Promise<string | null> {
    const supabase = createSupabaseBrowserClient();
    const ext = file.name.split('.').pop() ?? 'bin';
    const path = `${prefix}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('site-assets')
      .upload(path, file, { upsert: true, cacheControl: '3600' });
    if (error) {
      setSave('error');
      setMsg('Falha no upload: ' + error.message);
      return null;
    }
    const { data } = supabase.storage.from('site-assets').getPublicUrl(path);
    return data.publicUrl;
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
            <a href="/admin/marketing"
              className="flex items-center gap-1.5 rounded-full border border-gold/30 px-4 py-2 text-sm text-espresso-soft hover:text-espresso">
              <BarChart3 size={15} /> Marketing
            </a>
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
          <Field label="Selo acima do título">
            <input className={inp} value={c.hero.selo}
              onChange={(e) => update('hero', { selo: e.target.value })} />
          </Field>
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

        {/* MENU DE VITALIDADE */}
        <Section title="Menu de Vitalidade">
          <p className="-mt-1 text-xs text-espresso-soft">
            Essas mesmas categorias abastecem também o menu "Objetivo" do
            formulário de agendamento — edite aqui e os dois lugares
            atualizam juntos.
          </p>
          <TwoCol>
            <Field label="Rótulo">
              <input className={inp} value={c.menuVitalidade.eyebrow}
                onChange={(e) => update('menuVitalidade', { eyebrow: e.target.value })} />
            </Field>
            <Field label="Título da seção">
              <input className={inp} value={c.menuVitalidade.titulo}
                onChange={(e) => update('menuVitalidade', { titulo: e.target.value })} />
            </Field>
          </TwoCol>
          <Field label="Subtítulo">
            <textarea rows={2} className={ta} value={c.menuVitalidade.subtitulo}
              onChange={(e) => update('menuVitalidade', { subtitulo: e.target.value })} />
          </Field>
          <CategoriaListEditor
            items={c.menuVitalidade.categorias}
            onChange={(categorias) => update('menuVitalidade', { categorias })}
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

        {/* VÍDEOS */}
        <Section title="Vídeos — Tire suas dúvidas (YouTube)">
          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={c.videos.ativo}
              onChange={(e) => update('videos', { ativo: e.target.checked })}
              className="h-4 w-4 accent-[#C9A66B]" />
            <span className="text-sm text-espresso">Seção ativa na landing</span>
          </label>
          <TwoCol>
            <Field label="Rótulo">
              <input className={inp} value={c.videos.eyebrow}
                onChange={(e) => update('videos', { eyebrow: e.target.value })} />
            </Field>
            <Field label="Título da seção">
              <input className={inp} value={c.videos.titulo}
                onChange={(e) => update('videos', { titulo: e.target.value })} />
            </Field>
          </TwoCol>
          <Field label="Subtítulo">
            <textarea rows={2} className={ta} value={c.videos.subtitulo}
              onChange={(e) => update('videos', { subtitulo: e.target.value })} />
          </Field>
          <VideoListEditor
            items={c.videos.itens}
            onChange={(itens) => update('videos', { itens })}
            onUpload={uploadGeneric}
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

        {/* GALERIA */}
        <Section title="Mural de Congressos e Treinamentos">
          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={c.galeria.ativo}
              onChange={(e) => update('galeria', { ativo: e.target.checked })}
              className="h-4 w-4 accent-[#C9A66B]" />
            <span className="text-sm text-espresso">Seção ativa na landing</span>
          </label>
          <TwoCol>
            <Field label="Rótulo">
              <input className={inp} value={c.galeria.eyebrow}
                onChange={(e) => update('galeria', { eyebrow: e.target.value })} />
            </Field>
            <Field label="Título da seção">
              <input className={inp} value={c.galeria.titulo}
                onChange={(e) => update('galeria', { titulo: e.target.value })} />
            </Field>
          </TwoCol>
          <Field label="Subtítulo">
            <textarea rows={2} className={ta} value={c.galeria.subtitulo}
              onChange={(e) => update('galeria', { subtitulo: e.target.value })} />
          </Field>
          <GaleriaListEditor
            items={c.galeria.itens}
            onChange={(itens) => update('galeria', { itens })}
            onUpload={uploadGeneric}
          />
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

        {/* MATERIAL GRATUITO */}
        <Section title="Material Gratuito (funil de captura)">
          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={c.material.ativo}
              onChange={(e) => update('material', { ativo: e.target.checked })}
              className="h-4 w-4 accent-[#C9A66B]" />
            <span className="text-sm text-espresso">
              Seção ativa na landing (precisa de um PDF enviado abaixo)
            </span>
          </label>
          <Field label="Título">
            <input className={inp} value={c.material.titulo}
              onChange={(e) => update('material', { titulo: e.target.value })} />
          </Field>
          <Field label="Descrição">
            <textarea rows={3} className={ta} value={c.material.descricao}
              onChange={(e) => update('material', { descricao: e.target.value })} />
          </Field>
          <Field label="Texto do botão">
            <input className={inp} value={c.material.textoBotao}
              onChange={(e) => update('material', { textoBotao: e.target.value })} />
          </Field>
          <ImageField
            label="Imagem de capa do material (opcional)"
            hint="Ex.: capa do e-book/guia. Formatos JPG ou PNG."
            value={c.material.imagemUrl}
            onUpload={async (f) => {
              const url = await uploadGeneric(f, 'material-capa');
              if (url) update('material', { imagemUrl: url });
            }}
            onClear={() => update('material', { imagemUrl: '' })}
          />
          <PdfField
            value={c.material.pdfUrl}
            onUpload={async (f) => {
              const url = await uploadGeneric(f, 'material-pdf');
              if (url) update('material', { pdfUrl: url });
            }}
            onClear={() => update('material', { pdfUrl: '' })}
          />
        </Section>

        {/* DEPOIMENTOS */}
        <Section title="Depoimentos (fotos de pacientes)">
          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={c.depoimentos.ativo}
              onChange={(e) => update('depoimentos', { ativo: e.target.checked })}
              className="h-4 w-4 accent-[#C9A66B]" />
            <span className="text-sm text-espresso">
              Seção ativa perto do rodapé (fotos alternam a cada 20 segundos)
            </span>
          </label>
          <DepoimentoListEditor
            items={c.depoimentos.itens}
            onChange={(itens) => update('depoimentos', { itens })}
            onUpload={uploadGeneric}
          />
        </Section>

        {/* PRÉ-CONSULTA */}
        <Section title="Formulário de Pré-Consulta (aba oculta)">
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={c.preconsulta.ativo}
              onChange={(e) => update('preconsulta', { ativo: e.target.checked })}
              className="h-4 w-4 accent-[#C9A66B]"
            />
            <span className="text-sm text-espresso">
              Formulário ativo (desmarque para pausar a página <code>/preconsulta</code>)
            </span>
          </label>

          <TwoCol>
            <Field label="Assinatura (nomes dos médicos)">
              <input className={inp} value={c.preconsulta.eyebrow}
                onChange={(e) => update('preconsulta', { eyebrow: e.target.value })} />
            </Field>
            <Field label="WhatsApp que recebe as respostas (só números, com 55 e DDD)">
              <input className={inp} value={c.preconsulta.whatsappNumero}
                onChange={(e) => update('preconsulta', { whatsappNumero: e.target.value.replace(/\D/g, '') })} />
            </Field>
          </TwoCol>
          <Field label="Título">
            <input className={inp} value={c.preconsulta.titulo}
              onChange={(e) => update('preconsulta', { titulo: e.target.value })} />
          </Field>
          <Field label="Subtítulo (abertura)">
            <textarea rows={2} className={ta} value={c.preconsulta.subtitulo}
              onChange={(e) => update('preconsulta', { subtitulo: e.target.value })} />
          </Field>
          <Field label="Mensagem de fechamento (após enviar)">
            <textarea rows={2} className={ta} value={c.preconsulta.mensagemFechamento}
              onChange={(e) => update('preconsulta', { mensagemFechamento: e.target.value })} />
          </Field>

          <div className="mt-2 border-t border-nude-deep/30 pt-4">
            <h3 className="mb-3 font-display text-lg text-espresso">Etapa: Dados Pessoais</h3>
            <CampoListEditor
              items={c.preconsulta.camposDadosPessoais}
              onChange={(campos) => update('preconsulta', { camposDadosPessoais: campos })}
            />
          </div>

          <div className="mt-2 border-t border-nude-deep/30 pt-4">
            <h3 className="mb-3 font-display text-lg text-espresso">Etapa: Histórico Ginecológico</h3>
            <CampoListEditor
              items={c.preconsulta.camposHistorico}
              onChange={(campos) => update('preconsulta', { camposHistorico: campos })}
            />
          </div>

          <div className="mt-2 border-t border-nude-deep/30 pt-4">
            <h3 className="mb-3 font-display text-lg text-espresso">Etapa: Saúde Geral</h3>
            <CampoListEditor
              items={c.preconsulta.camposSaudeGeral}
              onChange={(campos) => update('preconsulta', { camposSaudeGeral: campos })}
            />
          </div>

          <div className="mt-2 border-t border-nude-deep/30 pt-4">
            <h3 className="mb-3 font-display text-lg text-espresso">Etapa: Seus Objetivos</h3>
            <TwoCol>
              <Field label="Rótulo da pergunta">
                <input className={inp} value={c.preconsulta.objetivosLabel}
                  onChange={(e) => update('preconsulta', { objetivosLabel: e.target.value })} />
              </Field>
              <Field label="Texto de ajuda">
                <input className={inp} value={c.preconsulta.objetivosAjuda}
                  onChange={(e) => update('preconsulta', { objetivosAjuda: e.target.value })} />
              </Field>
            </TwoCol>
            <CampoListEditor
              items={c.preconsulta.camposObjetivos}
              onChange={(campos) => update('preconsulta', { camposObjetivos: campos })}
              somentePlaceholder
            />
          </div>
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

function CategoriaListEditor({ items, onChange }: {
  items: { titulo: string; itens: string[] }[];
  onChange: (items: { titulo: string; itens: string[] }[]) => void;
}) {
  function setTitulo(i: number, titulo: string) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, titulo } : it)));
  }
  function setItensTexto(i: number, texto: string) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, itens: linesToArr(texto) } : it)));
  }

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-nude-deep/40 bg-white/70 p-4">
          <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.14em] text-bronze">
            Categoria {i + 1}
          </span>
          <input className={inp + ' mb-2'} placeholder="Título da categoria" value={it.titulo}
            onChange={(e) => setTitulo(i, e.target.value)} />
          <span className="mb-1 block text-[0.68rem] text-espresso-soft">
            Itens (um por linha)
          </span>
          <textarea rows={4} className={ta} value={it.itens.join('\n')}
            onChange={(e) => setItensTexto(i, e.target.value)} />
        </div>
      ))}
    </div>
  );
}

function CampoListEditor({ items, onChange, somentePlaceholder }: {
  items: CampoConfig[];
  onChange: (items: CampoConfig[]) => void;
  somentePlaceholder?: boolean;
}) {
  function set(i: number, patch: Partial<CampoConfig>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  return (
    <div className="space-y-2.5">
      {items.map((it, i) => (
        <div key={it.key} className="grid gap-2 rounded-xl border border-nude-deep/40 bg-white/70 p-3 sm:grid-cols-2">
          {!somentePlaceholder && (
            <input className={inp} placeholder="Rótulo (pergunta)" value={it.label}
              onChange={(e) => set(i, { label: e.target.value })} />
          )}
          <input
            className={inp + (somentePlaceholder ? ' sm:col-span-2' : '')}
            placeholder="Texto de exemplo (placeholder)"
            value={it.placeholder}
            onChange={(e) => set(i, { placeholder: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

function VideoListEditor({ items, onChange, onUpload }: {
  items: {
    pergunta: string; medico: string; tipo: 'youtube' | 'upload' | 'instagram';
    youtubeId: string; videoUrl: string; instagramUrl: string; capaUrl: string;
  }[];
  onChange: (items: {
    pergunta: string; medico: string; tipo: 'youtube' | 'upload' | 'instagram';
    youtubeId: string; videoUrl: string; instagramUrl: string; capaUrl: string;
  }[]) => void;
  onUpload: (file: File, prefix: string) => Promise<string | null>;
}) {
  function set(i: number, patch: Partial<(typeof items)[number]>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, { pergunta: '', medico: '', tipo: 'youtube', youtubeId: '', videoUrl: '', instagramUrl: '', capaUrl: '' }]);
  }

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-nude-deep/40 bg-white/70 p-4">
          <input className={inp} placeholder="Pergunta (ex.: Tem dúvidas sobre Menopausa?)"
            value={it.pergunta} onChange={(e) => set(i, { pergunta: e.target.value })} />
          <input className={inp} placeholder="Médico(a) (ex.: Dra. Vanessa Brito)"
            value={it.medico} onChange={(e) => set(i, { medico: e.target.value })} />

          <div className="flex flex-wrap gap-2">
            {(['youtube', 'upload', 'instagram'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set(i, { tipo: t })}
                className={
                  it.tipo === t
                    ? 'rounded-full border border-gold bg-gold-fade px-3 py-1 text-xs text-porcelain'
                    : 'rounded-full border border-nude-deep/50 px-3 py-1 text-xs text-espresso-soft'
                }
              >
                {t === 'youtube' ? 'YouTube' : t === 'upload' ? 'Enviar vídeo' : 'Link do Instagram'}
              </button>
            ))}
          </div>

          {it.tipo === 'youtube' && (
            <input className={inp} placeholder="ID do vídeo no YouTube (ex.: dQw4w9WgXcQ)"
              value={it.youtubeId} onChange={(e) => set(i, { youtubeId: e.target.value })} />
          )}

          {it.tipo === 'instagram' && (
            <input className={inp} placeholder="Link do post/reel do Instagram (o post precisa ser público)"
              value={it.instagramUrl} onChange={(e) => set(i, { instagramUrl: e.target.value })} />
          )}

          {it.tipo === 'upload' && (
            <div className="space-y-1.5">
              {it.videoUrl && (
                <a href={it.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-bronze hover:underline">
                  Ver vídeo enviado
                </a>
              )}
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="block w-full text-xs text-espresso-soft file:mr-3 file:rounded-full file:border-0 file:bg-nude file:px-3 file:py-1.5 file:text-xs file:text-espresso"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await onUpload(f, 'video');
                  if (url) set(i, { videoUrl: url });
                }}
              />
              <p className="text-[0.68rem] text-espresso-soft">
                Envie o arquivo do vídeo (mp4). Arquivos grandes podem demorar para enviar.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-lg border border-dashed border-nude-deep/50 p-2.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gold/20 bg-porcelain">
              {it.capaUrl ? (
                <img src={it.capaUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[0.55rem] text-espresso-soft">sem capa</span>
              )}
            </span>
            <div className="flex-1">
              <span className="mb-1 block text-[0.68rem] text-espresso-soft">
                Capa personalizada (opcional — se não enviar, usamos a miniatura automática)
              </span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-espresso-soft file:mr-3 file:rounded-full file:border-0 file:bg-nude file:px-3 file:py-1.5 file:text-xs file:text-espresso"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await onUpload(f, 'video-capa');
                  if (url) set(i, { capaUrl: url });
                }}
              />
            </div>
            {it.capaUrl && (
              <button onClick={() => set(i, { capaUrl: '' })} className="text-xs text-red-700 hover:underline">
                Remover
              </button>
            )}
          </div>

          <button onClick={() => remove(i)} className="text-xs text-red-700 hover:underline">
            Remover vídeo
          </button>
        </div>
      ))}
      <button onClick={add} className="text-sm text-bronze hover:underline">
        + Adicionar vídeo
      </button>
    </div>
  );
}

function GaleriaListEditor({ items, onChange, onUpload }: {
  items: { fotoUrl: string; legenda: string }[];
  onChange: (items: { fotoUrl: string; legenda: string }[]) => void;
  onUpload: (file: File, prefix: string) => Promise<string | null>;
}) {
  function set(i: number, patch: Partial<{ fotoUrl: string; legenda: string }>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, { fotoUrl: '', legenda: '' }]);
  }

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-nude-deep/40 bg-white/70 p-4 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gold/20 bg-porcelain">
            {it.fotoUrl ? (
              <img src={it.fotoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[0.6rem] text-espresso-soft">sem foto</span>
            )}
          </span>
          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-xs text-espresso-soft file:mr-3 file:rounded-full file:border-0 file:bg-nude file:px-3 file:py-1.5 file:text-xs file:text-espresso"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await onUpload(f, 'galeria');
                if (url) set(i, { fotoUrl: url });
              }}
            />
            <input className={inp} placeholder="Legenda (ex.: Congresso Brasileiro de Longevidade — 2025)"
              value={it.legenda} onChange={(e) => set(i, { legenda: e.target.value })} />
          </div>
          <button onClick={() => remove(i)} className="text-xs text-red-700 hover:underline">
            Remover
          </button>
        </div>
      ))}
      <button onClick={add} className="text-sm text-bronze hover:underline">
        + Adicionar foto
      </button>
    </div>
  );
}

function DepoimentoListEditor({ items, onChange, onUpload }: {
  items: { fotoUrl: string; nome: string; texto: string; posicao: 'top' | 'center' | 'bottom' }[];
  onChange: (items: { fotoUrl: string; nome: string; texto: string; posicao: 'top' | 'center' | 'bottom' }[]) => void;
  onUpload: (file: File, prefix: string) => Promise<string | null>;
}) {
  function set(i: number, patch: Partial<(typeof items)[number]>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, { fotoUrl: '', nome: '', texto: '', posicao: 'center' }]);
  }

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-nude-deep/40 bg-white/70 p-4 sm:flex-row">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/20 bg-porcelain">
            {it.fotoUrl ? (
              <img
                src={it.fotoUrl}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: it.posicao === 'top' ? 'center top' : it.posicao === 'bottom' ? 'center bottom' : 'center center' }}
              />
            ) : (
              <span className="text-[0.6rem] text-espresso-soft">sem foto</span>
            )}
          </span>
          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-xs text-espresso-soft file:mr-3 file:rounded-full file:border-0 file:bg-nude file:px-3 file:py-1.5 file:text-xs file:text-espresso"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await onUpload(f, 'depoimento');
                if (url) set(i, { fotoUrl: url });
              }}
            />
            {it.fotoUrl && (
              <div className="flex items-center gap-2">
                <span className="text-[0.68rem] text-espresso-soft">Posição da foto:</span>
                {(['top', 'center', 'bottom'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set(i, { posicao: p })}
                    className={
                      it.posicao === p
                        ? 'rounded-full border border-gold bg-gold-fade px-2.5 py-0.5 text-[0.68rem] text-porcelain'
                        : 'rounded-full border border-nude-deep/50 px-2.5 py-0.5 text-[0.68rem] text-espresso-soft'
                    }
                  >
                    {p === 'top' ? 'Topo' : p === 'center' ? 'Centro' : 'Base'}
                  </button>
                ))}
              </div>
            )}
            <input className={inp} placeholder="Nome do paciente (ex.: Andressa Pena — Cacoal)"
              value={it.nome} onChange={(e) => set(i, { nome: e.target.value })} />
            <textarea rows={2} className={ta} placeholder="Texto do depoimento"
              value={it.texto} onChange={(e) => set(i, { texto: e.target.value })} />
          </div>
          <button onClick={() => remove(i)} className="text-xs text-red-700 hover:underline">
            Remover
          </button>
        </div>
      ))}
      <button onClick={add} className="text-sm text-bronze hover:underline">
        + Adicionar depoimento
      </button>
    </div>
  );
}

function PdfField({ value, onUpload, onClear }: {
  value: string;
  onUpload: (file: File) => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-xl border border-nude-deep/40 bg-white/70 p-4">
      <span className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bronze">
        Arquivo PDF do material
      </span>
      {value ? (
        <div className="mb-2 flex items-center gap-3 text-sm">
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-bronze hover:underline">
            Ver PDF atual
          </a>
          <button onClick={onClear} className="text-xs text-red-700 hover:underline">
            Remover
          </button>
        </div>
      ) : (
        <p className="mb-2 text-xs text-espresso-soft">Nenhum PDF enviado ainda.</p>
      )}
      <input
        type="file"
        accept="application/pdf"
        className="block w-full text-xs text-espresso-soft file:mr-3 file:rounded-full file:border-0 file:bg-nude file:px-3 file:py-1.5 file:text-xs file:text-espresso"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
        }}
      />
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
