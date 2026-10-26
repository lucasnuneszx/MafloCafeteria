# Maflô Cafeteria Conceito — Landing Page

Landing page institucional premium construída com Next.js 15, TypeScript, TailwindCSS v4, Framer Motion e shadcn/ui.

## Comandos

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm run start

# Verificação TypeScript
npx tsc --noEmit
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com os dados reais:

```bash
cp .env.example .env.local
```

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número do WhatsApp (ex: `5511999999999`) |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | URL do embed do Google Maps |
| `NEXT_PUBLIC_INSTAGRAM_URL` | URL do perfil no Instagram |
| `NEXT_PUBLIC_GOOGLE_REVIEW_URL` | Link para avaliação no Google (Google Maps / Perfil da Empresa) |
| `NEXT_PUBLIC_GA_ID` | ID do Google Analytics 4 (opcional) |

## Estrutura de pastas

```
src/
├── app/
│   ├── layout.tsx          # Fontes, metadata, JSON-LD
│   ├── page.tsx            # Composição da landing page
│   ├── globals.css         # Design system, tokens, utilitários
│   ├── sitemap.ts          # Sitemap automático
│   ├── robots.ts           # robots.txt
│   └── not-found.tsx       # Página 404 com identidade visual
├── components/
│   ├── layout/
│   │   ├── navbar.tsx      # Navbar fixa com transição de scroll
│   │   └── footer.tsx      # Footer escuro com nav e social links
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── concept-section.tsx
│   │   ├── experience-section.tsx
│   │   ├── gallery-section.tsx
│   │   ├── event-booking-section.tsx  # Formulário de reserva de eventos → WhatsApp
│   │   ├── testimonials-section.tsx
│   │   ├── google-review-section.tsx  # CTA de avaliação no Google
│   │   ├── instagram-section.tsx
│   │   └── location-section.tsx
│   ├── shared/
│   │   ├── reveal.tsx              # Wrapper animação scroll-triggered
│   │   ├── section-title.tsx
│   │   ├── section-divider.tsx     # Divisor SVG floral
│   │   ├── testimonial-card.tsx
│   │   └── cookie-banner.tsx       # Banner LGPD
│   └── icons/
│       ├── logo.tsx
│       └── instagram-icon.tsx
├── lib/
│   ├── constants.ts        # Dados: depoimentos, galeria, horários, ocasiões de evento
│   ├── motion-variants.ts  # Variantes Framer Motion
│   └── utils.ts
└── types/
    └── index.ts
```

## Checklist de assets pendentes (cliente)

- [ ] Imagem/vídeo do hero → substituir `public/images/hero-bg.jpg`
- [ ] Fotos reais restantes do espaço/produtos → substituir `public/images/concept-photo.png`, `experience-photo.png`, `gallery-01.png`, `gallery-02.png`, `gallery-03.png`, `gallery-05.png`, `gallery-06.png` (as demais já são fotos reais)
- [ ] Endereço, WhatsApp, Instagram, Maps, link de avaliação no Google → preencher `.env.local`
- [ ] Textos definitivos → editar `src/lib/constants.ts`

## Deploy recomendado: Vercel

```bash
npm i -g vercel && vercel
```
