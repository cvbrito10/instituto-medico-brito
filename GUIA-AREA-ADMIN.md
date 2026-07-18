# Ativar a Área Admin — Instituto Médico Brito

Esta atualização adiciona um **painel de edição** ao site, acessível em
`/admin`, onde você edita textos, troca a logo e a foto dos médicos — sem mexer
em código. As alterações aparecem no site na hora.

Siga os 4 passos abaixo, na ordem.

---

## Passo 1 — Atualizar o código no GitHub

1. Baixe e descompacte o novo `instituto-medico-brito.zip`.
2. Abra o repositório no GitHub (`cvbrito10/instituto-medico-brito`).
3. Clique em **Add file → Upload files**.
4. Abra a pasta `brito`, selecione **tudo** que está dentro (`Ctrl+A`) e arraste
   para a área de upload. Os arquivos com o mesmo nome serão **substituídos**
   pelas versões novas, e os novos serão adicionados.
5. Role até o fim e clique em **Commit changes**.

A Netlify detecta o commit e republica o site sozinha (1 a 3 minutos).

> Novos arquivos desta versão: a pasta `src/app/admin`, o
> `src/app/api/admin/content`, o `middleware.ts`, o `src/lib/content.ts`,
> `src/components/ContentProvider.tsx`, `src/components/Logo.tsx`,
> `src/lib/supabase/ssr-server.ts` e `supabase/admin-schema.sql`.

---

## Passo 2 — Rodar o novo SQL no Supabase

1. Abra o Supabase → **SQL Editor → New query**.
2. Cole todo o conteúdo de `supabase/admin-schema.sql` e clique em **Run**.

Isso cria a tabela de conteúdo (`site_content`) e o local das imagens
(`site-assets`). Deve aparecer "Success".

---

## Passo 3 — Criar seu usuário de acesso ao painel

1. No Supabase, vá em **Authentication → Users → Add user → Create new user**.
2. Informe um **e-mail** e uma **senha** (esses serão seu login do painel).
3. Marque a opção de confirmar o e-mail automaticamente (**Auto Confirm User**),
   para poder entrar na hora.
4. Clique em **Create user**.

> Você pode criar mais de um usuário (ex.: um para cada médico).

---

## Passo 4 — Confirmar as variáveis de ambiente na Netlify

O painel precisa das 3 chaves do Supabase (as mesmas de antes). Confira em
**Netlify → Site configuration → Environment variables** se existem:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL`

Se você adicionar ou mudar alguma, refaça o deploy (**Deploys → Trigger
deploy → Deploy site**).

---

## Pronto! Como usar

1. Acesse `https://SEU-SITE.netlify.app/admin`
2. Entre com o e-mail e senha criados no Passo 3.
3. Edite os textos, envie a **logo** e a **foto dos médicos**, e clique em
   **Salvar alterações**.
4. Abra o site em outra aba para conferir. As mudanças já estarão no ar.

### O que dá para editar nesta versão
- Textos do topo (título, frases, selos)
- Textos de "Quem Somos"
- Nomes dos médicos
- Logo do site (troca o monograma pela sua imagem)
- Foto dos médicos (destaque do topo)
- Contato: WhatsApp, endereço e Instagram

Qualquer campo deixado em branco volta ao texto padrão — o site nunca fica
quebrado.

---

## Segurança
- O painel `/admin` exige login. Sem sessão válida, o acesso é bloqueado.
- A chave `service_role` continua só no servidor (Netlify), nunca no navegador.
- As imagens enviadas ficam no seu próprio Supabase.
