# Tradeoffs

## Explicit level mapping instead of automatic inference

Automatic equivalence between company levels would be convenient but misleading. CompIQ stores a project-defined mapping and keeps unmapped or company-specific labels visible.

## Decimal database values and numeric API values

Money is stored as PostgreSQL Decimal. API responses convert selected values to numbers for the current UI. A production financial system could use formatted decimal strings end-to-end to avoid JavaScript precision concerns for unusually large values.

## Database aggregation versus browser aggregation

Analytics and search use server-side Prisma queries so the browser does not receive the entire database. Pure calculation helpers remain separately testable.

## Separate contributions table

Keeping pending contributions separate from public compensation makes the approval boundary explicit. The tradeoff is that a later approval action must copy/promote a contribution into the public model; this MVP does not include a full moderation console.

## Lightweight sessions

Database-backed sessions avoid adding an authentication framework. The tradeoff is that session cleanup and operational monitoring need to be handled by a later production hardening pass.

## No chart library

The project uses accessible CSS bars and simple data blocks because no chart library was already installed. This avoids unnecessary dependencies for the MVP.
