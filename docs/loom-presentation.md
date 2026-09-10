# Loom presentation outline (5–10 minutes)

## 1. Problem

Explain why title-only salary lists produce weak comparisons and why levels, location, experience, and pay components matter.

## 2. Product

Show the CompIQ home page, Salary Explorer, Company Intelligence pages, Analytics, and Comparison workflow.

## 3. Architecture

Walk through Next.js route handlers, validation, service/repository functions, Prisma, and PostgreSQL.

## 4. Database

Show Company, Role, Level, NormalizedLevel, Location, Compensation, User, Session, and Contribution relationships.

## 5. Level normalization

Demonstrate a company-specific level such as Google L4 mapped to a project-defined normalized category such as Senior. Explain that mappings are explicit and not universal truth.

## 6. Compensation calculation

Show that the backend calculates:

```text
base + bonus + stock = total compensation
```

Mention missing bonus and stock defaults.

## 7. Search and filters

Demonstrate backend search, filters, sorting, URL state, pagination, loading, empty, and error states.

## 8. Comparison

Select 2–4 companies and compare equivalent normalized levels. Show median values and sample-size warnings.

## 9. Data validation

Show invalid salary rejection, currency validation, normalization, duplicate fingerprints, and structured API errors.

## 10. Edge cases

Mention zero records, one-record groups, insufficient percentiles, missing components, duplicate submissions, and database-unavailable states.

## 11. Tradeoffs

Explain explicit mapping over automatic inference, server-side aggregation, separate pending contributions, lightweight sessions, and no unnecessary chart dependency.

## 12. Deployment

Show `.env.example`, Prisma migrations, seed command, production build, and the final verification commands.
