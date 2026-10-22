# LOKESH

Software development and design portfolio of M. Lokesh — software developer, web developer and freelancer from Chennai. Built with Next.js 16 (App Router), React 19 and Tailwind CSS 4.

## Features

- Terminal bootloader home page with animated intro and custom cursor
- Smooth scrolling, scroll progress/reveal, parallax and animated backgrounds (stars, matrix, grid, video)
- Casual site with its own theme: advice, contact, fitness and gallery pages
- Pro mode with a games hub: memory, puzzle, snake, space and typing games
- Project showcase backed by Sanity CMS with dynamic `/project/[slug]` pages
- Live demos for BusBuddy, Kadal Thunai and Saira Tickets
- Contact form wired to Resend with zod validation and per-IP rate limiting

## Getting Started

Prerequisites: Node.js 20+ and npm.

```bash
npm install
npm run dev     # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                  # Next.js App Router routes
│   ├── ambition/         # ambition section
│   ├── casual/           # casual site: advice, contact, fitness, gallery
│   ├── demo/             # busbuddy, kadal-thunai, saira-tickets
│   ├── fun/              # fun zone
│   ├── games/            # memory, puzzle, snake, space, typing
│   ├── imprint/          # imprint page
│   ├── pro/              # pro site with games hub
│   ├── project/          # [slug], bus-tracker, kadal-thunai, saira-tickets
│   ├── showcase/         # project showcase
│   └── api/email/        # contact form endpoint (Resend)
├── components/           # layout, sections, casual/, pro/, demo/, project-showcase/, ui/
├── emails/               # Resend email templates
├── hooks/                # custom hooks
├── lib/                  # config, resend, sanity, send-email, utils, validations
├── styles/               # casual theme CSS
└── types/                # type declarations
```

## Environment Variables

All variables are optional and validated with `@t3-oss/env-nextjs` and zod (set `SKIP_ENV_VALIDATION=1` to skip validation). Create `.env.local` with any of:

```bash
# server
RESEND_API_KEY=                            # required to actually send emails

# client
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
```

## Contact Form

`POST /api/email` validates the submission with zod, caps request bodies at 20KB and rate-limits to 5 requests per minute per IP, then sends a confirmation email via Resend using templates from `src/emails/`.

## License

© 2026 M. Lokesh
