# Instituto Médico Brito — Landing Page

Landing page premium do **Instituto Médico Brito** — medicina personalizada para emagrecimento, saúde metabólica, reposição hormonal e longevidade.

Construída com foco em **conversão, sofisticação e performance**.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** (paleta e tipografia premium sob medida)
- **Framer Motion** (scroll reveal, parallax, micro-interações)
- **Lucide Icons** (ícones minimalistas)
- **Supabase** (captura e armazenamento das solicitações de agendamento)
- Deploy em **Vercel**

## Recursos

- Hero impactante com retrato dos médicos (placeholder pronto para troca)
- Seções: Quem Somos, Protocolos, Como Funciona, Diferenciais, Resultados, CTA
- **Modal de agendamento** que captura o lead no Supabase e encaminha ao WhatsApp
- Menu fixo com efeito glass, botão de WhatsApp flutuante, CTAs em toda a página
- SEO completo (metadata, Open Graph, JSON-LD `MedicalClinic`, sitemap, robots)
- Acessibilidade, foco de teclado, `prefers-reduced-motion`, mobile-first

---

## 1. Rodar localmente

Pré-requisito: **Node.js 18.17+**.

```bash
# instalar dependências
npm install

# copiar variáveis de ambiente
cp .env.example .env.local
# preencha .env.local (veja seção Supabase abaixo)

# ambiente de desenvolvimento
npm run dev
```

Abra <http://localhost:3000>.

> A página funciona mesmo sem Supabase configurado — nesse caso o lead não é
> persistido, mas o fluxo de agendamento pelo WhatsApp continua funcionando.

---

## 2. Supabase (banco de dados dos agendamentos)

1. Crie uma conta em <https://supabase.com> e um **novo projeto**.
2. No projeto, vá em **SQL Editor → New query**, cole todo o conteúdo de
   [`supabase/schema.sql`](./supabase/schema.sql) e clique em **Run**.
   Isso cria a tabela `leads` com Row Level Security ativado.
3. Vá em **Project Settings → API** e copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (secreta) → `SUPABASE_SERVICE_ROLE_KEY`
4. Cole esses valores no seu `.env.local` (local) e nas variáveis do Vercel (produção).

Para visualizar os agendamentos recebidos: **Table Editor → leads**.

> A `service_role` key é **secreta** e usada apenas no servidor (API route
> `/api/agendamento`). Nunca a exponha no cliente nem a prefixe com `NEXT_PUBLIC_`.

---

## 3. GitHub

```bash
git init
git add .
git commit -m "feat: landing page Instituto Médico Brito"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/instituto-medico-brito.git
git push -u origin main
```

> O `.gitignore` já ignora `node_modules`, `.next`, `.env*` e `.vercel`.
> **Nunca** faça commit do arquivo `.env.local`.

---

## 4. Deploy na Vercel

1. Acesse <https://vercel.com>, clique em **Add New → Project** e **importe**
   o repositório do GitHub.
2. A Vercel detecta o Next.js automaticamente (build: `next build`).
3. Em **Environment Variables**, adicione as chaves (Production + Preview):

   | Nome | Valor |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key (secreta) |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5569981206377` |
   | `NEXT_PUBLIC_SITE_URL` | `https://seu-dominio.com.br` |

4. Clique em **Deploy**. Pronto.
5. (Opcional) Em **Settings → Domains**, conecte seu domínio próprio.

---

## 5. Personalizações rápidas

| O quê | Onde |
|-------|------|
| Foto dos médicos | `src/components/Hero.tsx` — substitua o placeholder por `<Image src="/medicos.jpg" ... />` e coloque a imagem em `public/` |
| Telefone, endereço, Instagram | `src/lib/constants.ts` |
| Cores e tipografia | `tailwind.config.ts` |
| Textos das seções | componentes em `src/components/` |
| Mensagens do WhatsApp | `WHATSAPP_MESSAGES` em `src/lib/constants.ts` |

### Trocar o placeholder do retrato por foto real

Em `src/components/Hero.tsx`, dentro do bloco do retrato, troque o placeholder por:

```tsx
import Image from 'next/image';

<Image
  src="/medicos.jpg"
  alt="Dr. Claudio e Dra. Vanessa Brito"
  fill
  priority
  className="object-cover"
/>
```

E adicione a imagem em `public/medicos.jpg`.

---

## Scripts

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servir build de produção
npm run lint    # checagem de lint
```

---

## Aviso ético

O conteúdo desta página tem caráter informativo e não substitui a consulta
médica. Os resultados variam conforme fatores individuais; não há promessa nem
garantia de resultados específicos.

© Instituto Médico Brito — Evolução com saúde e bem-estar.
