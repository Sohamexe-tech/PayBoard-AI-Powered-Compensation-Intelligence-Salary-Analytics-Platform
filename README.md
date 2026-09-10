# CompIQ — Compensation Intelligence Platform

CompIQ is an internship-evaluation MVP for structured compensation intelligence. It helps users compare compensation using **company, role, company-specific level, normalized career level, location, experience, base salary, bonus, stock, and total compensation**.

## The problem

Salary websites often make records look comparable because their job titles are similar. That can produce misleading comparisons:

- Google L4 is not literally the same label as Microsoft 62.
- Amazon SDE II and Meta E4 use different company-specific systems.
- Location and experience can materially change compensation.
- Total compensation is not just base salary.
- User-submitted records need validation and review before becoming public data.

## The solution

CompIQ stores compensation as structured relational data and exposes:

- Salary search with backend filtering, sorting, and pagination
- Company intelligence pages
- Comparison across companies using an explicit normalized-level model
- Analytics based on approved database records
- Authenticated contribution submissions with `PENDING`, `APPROVED`, and `REJECTED` status
- Validation, normalization, duplicate fingerprints, and database constraints

## Why this is not a salary listing website

CompIQ is not primarily a list of salary cards. The core product is the comparison model behind the records:

1. Preserve the original company-specific level.
2. Map it to a project-defined normalized level.
3. Compare equivalent normalized groups.
4. Keep role, location, experience, and pay components visible.
5. Show sample sizes and avoid unsupported statistics.

The normalized-level mapping is an explicit project model, not a claim that companies' leveling systems are universally equivalent.

## Levels-first approach

The database stores:

```text
Company-specific Level
        ↓
NormalizedLevel
        ↓
Comparison group
```

Examples can include:

```text
Google L4     → Senior
Microsoft 62  → Senior
Amazon SDE II → Senior
Meta E4       → Senior
```

These mappings are stored through the `Level.normalizedLevelId` relation and are used by `/api/compare`.

## Architecture

```text
Next.js page or client component
        ↓
Next.js route handler
        ↓
Zod validation
        ↓
Service/repository layer
        ↓
Prisma Client
        ↓
PostgreSQL
```

Business logic is kept outside UI components:

- `lib/salary-repository.ts` handles salary search queries.
- `lib/company-repository.ts` handles company data.
- `lib/comparison-repository.ts` handles normalized-level comparisons.
- `lib/analytics-service.ts` handles analytics aggregation.
- `lib/ingestion.ts` handles contribution ingestion.
- `lib/validation.ts`, `lib/company.ts`, and `lib/db.ts` handle validation, normalization, and fingerprints.

## Technology stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Node.js APIs through Next.js route handlers
- PostgreSQL
- Prisma 6
- Zod
- Vitest

No additional charting framework, Redis layer, microservices, or authentication framework was added.

## Database

Prisma models include:

- `Company`
- `Role`
- `NormalizedLevel`
- `Level`
- `Location`
- `Compensation`
- `User`
- `Session`
- `Contribution`

Money fields use PostgreSQL `Decimal(18, 2)`.

Public analytics and discovery queries explicitly use only compensation records with `status = APPROVED`. New authenticated contributions are stored separately as `PENDING` contributions and are not automatically promoted into public compensation.

## Compensation calculation

The backend calculates:

```text
totalCompensation = baseSalary + bonus + stock
```

Missing values are normalized:

```text
missing bonus → 0
missing stock → 0
```

Client-provided totals are not trusted. If a submitted total is provided, it must match the backend calculation.

## Normalization

Company names use deterministic aliases and token cleanup:

```text
Google LLC  → Google
Google Inc. → Google
Meta Platforms → Meta
```

Role titles are trimmed, whitespace-normalized, and length-validated. Level names are validated and selected aliases are normalized. Normalization does not merge arbitrary similar names without an explicit rule.

## Duplicate handling

Compensation records and user contributions receive a SHA-256 fingerprint based on:

- Company
- Role
- Level
- Location
- Experience
- Base salary
- Bonus
- Stock
- Currency

Duplicate protection exists in both application logic and PostgreSQL through a unique fingerprint constraint. Duplicate submissions return a conflict response instead of silently deleting or overwriting data.

## Validation and review

The ingestion pipeline is:

```text
raw input
→ Zod validation
→ company/role/level normalization
→ total compensation calculation
→ duplicate fingerprint
→ database persistence
```

It rejects negative, zero, malformed, inconsistent, unreasonably large, or incomplete required values. Authenticated contributions are marked `PENDING`; the current MVP does not include a full admin approval console.

## Main routes

Pages:

- `/`
- `/search`
- `/companies`
- `/companies/[id]`
- `/compare`
- `/analytics`
- `/login`
- `/signup`
- `/contribute`

API routes:

- `GET /api/salaries`
- `GET /api/companies`
- `GET /api/companies/[id]`
- `GET /api/compare`
- `GET /api/analytics`
- `POST /api/contributions`
- `GET /api/contributions`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Screenshots and demo placeholders

The submission can include screenshots or a Loom recording at these points:

```text
![Salary Explorer](docs/screenshots/search.png)
![Company Intelligence](docs/screenshots/company.png)
![Normalized Comparison](docs/screenshots/compare.png)
![Analytics Dashboard](docs/screenshots/analytics.png)
![Contribution Workflow](docs/screenshots/contribute.png)
```

These paths are documentation placeholders; screenshots are not generated or committed by the application.

## Local setup

Requirements:

- Node.js 20+
- PostgreSQL 14+
- npm

```bash
npm install
copy .env.example .env
npm run prisma:generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

For a local development migration instead of applying existing migrations:

```bash
npx prisma migrate dev --name local-schema-change
```

## Environment variables

Copy [.env.example](./.env.example):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/compensation_intelligence?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Never commit `.env` or database credentials.

## Deployment

For Vercel or another Node-compatible host:

1. Configure `DATABASE_URL` using a production PostgreSQL provider.
2. Configure `NEXT_PUBLIC_APP_URL` with the HTTPS application URL.
3. Run `npx prisma migrate deploy` in the release/CI step.
4. Run `npm run db:seed` once for normalized-level reference rows.
5. Run `npm run build`.
6. Start with `npm run start` where the host requires a standalone process.

Use pooled database connections for serverless deployments and configure PostgreSQL backups and monitoring.

## Testing

```bash
npm test
npm run lint
npm run build
```

The test suite covers validation, duplicate fingerprints, analytics calculations, company aggregation, comparison calculations, missing compensation components, and small-sample behavior.

See [docs/testing.md](./docs/testing.md) for the test strategy.

## Submission documentation

- [Architecture](./docs/architecture.md)
- [Research](./docs/research.md)
- [Competitor comparison](./docs/competitor-comparison.md)
- [API reference](./docs/api.md)
- [Data model](./docs/data-model.md)
- [Tradeoffs](./docs/tradeoffs.md)
- [Testing](./docs/testing.md)
- [Loom presentation outline](./docs/loom-presentation.md)
