# Data model

## Core entities

### Company

Stores the display name and deterministic normalized name.

### Role

Stores display title and normalized title.

### NormalizedLevel

Stores project-defined comparison categories such as `Senior` or `Staff`.

### Level

Stores company-specific labels and optionally points to a `NormalizedLevel`.

### Location

Stores city, optional state, country, and currency.

### Compensation

Stores approved/public compensation rows:

- Foreign keys to company, role, level, and location
- Decimal base, bonus, stock, and total
- Experience
- Source
- Duplicate fingerprint
- Status
- Timestamps

### User and Session

Users have password hashes. Sessions have hashed tokens and expiration timestamps.

### Contribution

Stores user-submitted data separately from public compensation. Its status is `PENDING`, `APPROVED`, or `REJECTED`.

## Constraints and indexes

- Unique company normalized names
- Unique role title/normalized-title pairs
- Unique normalized levels
- Unique locations by city/state/country/currency
- Unique compensation and contribution fingerprints
- Foreign-key relationships
- Indexes for status, compensation values, experience, dimensions, and session expiration

## Total compensation strategy

The database stores `totalCompensation` as a Decimal for query and display efficiency, but it is only written after backend calculation from base, bonus, and stock. Client totals are not trusted.
