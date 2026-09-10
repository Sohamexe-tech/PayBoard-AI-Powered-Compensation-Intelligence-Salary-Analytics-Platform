# API reference

## Response errors

Errors use this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid search parameters",
    "details": {}
  }
}
```

## Salary search

`GET /api/salaries`

Query parameters:

- `search`
- `company`
- `role`
- `level`
- `country`
- `city`
- `minTotalCompensation`
- `maxTotalCompensation`
- `sort`: `total-asc`, `total-desc`, `base-asc`, `base-desc`, `experience`, `company`, `level`
- `page`
- `pageSize` from 1 to 100

Filtering, sorting, counting, and pagination run in Prisma. Only approved records are returned.

## Companies

- `GET /api/companies?search=google`
- `GET /api/companies/[id]`

Company intelligence is calculated from approved compensation records.

## Comparison

`GET /api/compare?companies=Google,Microsoft&normalizedLevel=Senior`

Optional parameters:

- `role`
- `location`

Comparison requires 2–4 companies and uses records mapped to the selected normalized level.

## Analytics

`GET /api/analytics`

Returns server-calculated summaries, distributions, grouped medians, composition, and experience groups for approved records.

## Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Sessions are represented by an HTTP-only cookie.

## Contributions

- `GET /api/contributions`
- `POST /api/contributions`

Both require authentication. New contributions are validated and stored as `PENDING`.
