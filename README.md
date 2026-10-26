# Maflô Cafeteria Conceito

Landing page da Maflô Cafeteria Conceito com um painel administrativo em `/admin` para agenda semanal, reservas de eventos, estoque, contas a pagar e configurações do site (contatos e horários).

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui (Base UI), Framer Motion, Lenis
- Drizzle ORM + Postgres (Neon)
- Clerk para autenticação do painel

## Rodando localmente

```bash
npm install
# crie .env.local com as variáveis abaixo
npm run dev
```

Outros comandos:

```bash
npm run build                  # build de produção
npm run start                  # serve o build
npx tsc --noEmit               # checagem de tipos
npx dotenv -e .env.local -- npx drizzle-kit push   # aplica o schema no banco
```

`scripts/seed-agenda.ts` insere uma agenda semanal de exemplo (rode com `tsx` ou equivalente, com `DATABASE_URL` definido).

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `DATABASE_URL` | Conexão Postgres usada pela aplicação |
| `DATABASE_URL_UNPOOLED` | Conexão direta, usada pelo `drizzle-kit` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Chave pública do Clerk |
| `CLERK_SECRET_KEY` | Chave secreta do Clerk |
| `ADMIN_ALLOWED_EMAILS` | E-mails (separados por vírgula) com acesso ao `/admin` |

WhatsApp, Instagram, mapa, link de avaliação e horários não são variáveis de ambiente: ficam na tabela `site_settings` e são editados em `/admin/configuracoes`.

## Estrutura

```
src/
├── app/
│   ├── page.tsx            # landing page
│   └── admin/              # painel (agenda, reservas, estoque, financeiro, configurações)
├── components/
│   ├── sections/           # seções da landing
│   ├── layout/             # navbar e footer
│   ├── shared/             # componentes reutilizáveis
│   └── ui/                 # componentes shadcn/ui
├── lib/
│   ├── actions/            # server actions do painel e do formulário de reserva
│   ├── db/                 # schema e cliente Drizzle
│   └── constants.ts        # depoimentos, galeria, links de navegação, endereço
└── proxy.ts                # proteção das rotas /admin
scripts/
└── seed-agenda.ts
```
