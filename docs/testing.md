# Testing

## Commands

```bash
npm test
npm run lint
npm run build
```

## Current test coverage

The Vitest suite covers:

- Total compensation calculation
- Missing bonus and stock defaults
- Negative and zero salary rejection
- Invalid company, role, level, and currency input
- Inconsistent submitted totals
- Duplicate fingerprints
- Company aggregation
- Small-sample percentile handling
- Analytics summaries and grouped medians
- Normalized-level comparison
- Median comparison values
- Missing comparison components
- Percentage differences

## What is not covered yet

- Full browser end-to-end tests
- Live PostgreSQL integration tests in CI
- Password/session integration tests against a real database
- An approval operation for changing contributions from `PENDING` to `APPROVED`

Those are known follow-up areas rather than claims of completed functionality.
