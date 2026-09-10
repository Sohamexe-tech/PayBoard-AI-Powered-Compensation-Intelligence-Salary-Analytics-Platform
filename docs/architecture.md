# Architecture

## Overview

CompIQ uses a modular Next.js application with PostgreSQL as the source of truth.

```text
Browser
  → Server-rendered pages / client interactions
  → Next.js route handlers
  → Zod schemas
  → repositories and services
  → Prisma
  → PostgreSQL
```

## Responsibilities

### Routes and pages

Pages provide layout, navigation, loading/error/empty states, and user interactions. They do not query Prisma directly.

### API route handlers

Route handlers validate request parameters, enforce authentication where needed, call services, and return status-aware JSON responses.

### Services and repositories

- Salary repository: filters, sorting, pagination, and approved-record queries.
- Company repository: normalized company summaries and company details.
- Comparison repository: normalized-level comparison queries.
- Analytics service: server-side aggregation.
- Ingestion service: validation, normalization, fingerprinting, and persistence.
- Auth service: password hashing and session lifecycle.

### PostgreSQL and Prisma

PostgreSQL stores normalized relational entities, decimal money values, foreign keys, unique constraints, and query indexes. Prisma provides typed data access.

## Public data boundary

Public salary, company, comparison, and analytics queries filter compensation records by `APPROVED`. Contributions are separate records with `PENDING`, `APPROVED`, or `REJECTED` status.

## Security boundary

Authentication uses password hashes and hashed session tokens in HTTP-only cookies. Contribution endpoints require a valid session. Public pages never receive passwords, password hashes, session tokens, or raw database credentials.
