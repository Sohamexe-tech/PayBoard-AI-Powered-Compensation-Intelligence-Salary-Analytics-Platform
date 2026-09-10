# CompIQ

CompIQ is a Next.js compensation intelligence application backed by PostgreSQL and Prisma.

## Requirements

- Node.js 20+
- PostgreSQL 14+
- npm

## Environment variables

Copy `.env.example` to `.env` and replace the placeholders:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/compensation_intelligence?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Never commit `.env` or database credentials.

## Database setup

Install dependencies and generate Prisma Client:

```bash
npm install
npm run prisma:generate
```

Apply checked-in migrations:

```bash
npx prisma migrate deploy
```

Seed only the normalized-level reference data:

```bash
npm run db:seed
```

The seed is idempotent and does not insert fake compensation records.

## Development

```bash
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm run start
```

Configure `DATABASE_URL` and `NEXT_PUBLIC_APP_URL` in the hosting provider. Run `npx prisma migrate deploy` from CI or a release job before routing traffic to a new deployment.

## Verification

```bash
npm test
npm run lint
npm run build
```

## Production checklist

- Use a pooled PostgreSQL connection string for serverless deployments.
- Run `npx prisma migrate deploy` before startup.
- Run `npm run db:seed` for normalized-level reference rows.
- Configure HTTPS so authentication cookies use the secure flag.
- Keep `.env` and credentials out of source control.
- Configure PostgreSQL backups, connection limits, and monitoring.
- Review pending contributions before approval.
- Run tests, lint, and build in CI.
