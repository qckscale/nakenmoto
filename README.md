# NakenMoto

Monorepo for the NakenMoto streetwear webshop — clothing designed for naked bike riders with a Swedish minimalist aesthetic.

## Structure

```
apps/web/       Next.js 14+ frontend (App Router, SCSS Modules)
apps/studio/    Sanity CMS studio
scripts/        Tooling (Notion-to-Sanity sync, seed data)
```

## Setup

```bash
npm install
cp apps/web/.env.local.example apps/web/.env.local   # fill in values
```

## Environment variables

The following env vars are required in `apps/web/.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (default: `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version |
| `SANITY_API_TOKEN` | Sanity write token |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `RESEND_API_KEY` | Resend API key (transactional email) |

For the Notion-to-Sanity sync (GitHub Action secrets):

| Secret | Description |
|--------|-------------|
| `NOTION_API_KEY` | Notion integration token |
| `SANITY_PROJECT_ID` | Sanity project ID |
| `SANITY_DATASET` | Sanity dataset |
| `SANITY_API_TOKEN` | Sanity write token |

## Development

```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run studio:dev   # Start Sanity Studio dev server
```

## Deployment

- **Frontend:** Vercel (auto-deploy from `main` branch)
- **CMS:** Sanity hosted studio (`npm run studio:deploy`)
- **Content sync:** GitHub Action triggered by Notion automation or manual dispatch

## Tech stack

- Next.js 14+ (App Router) / TypeScript / SCSS Modules
- Sanity CMS
- Supabase (orders database)
- Resend (transactional email)
- Klarna Payments (planned)
