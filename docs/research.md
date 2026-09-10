# Research notes

## Problem research

Compensation comparisons are difficult because:

- Titles are inconsistent across companies.
- Company leveling systems use different labels.
- Location and experience affect compensation.
- Base, bonus, stock, and total compensation answer different questions.
- Self-reported data varies in reliability.

The product therefore prioritizes structured records and comparable levels over a large unstructured salary list.

## Research-informed product decisions

1. Preserve company-specific levels rather than replacing them.
2. Add an explicit normalized-level mapping for comparison.
3. Show sample size beside aggregates.
4. Avoid percentile output for very small samples.
5. Keep pending contributions out of public analytics.
6. Calculate total compensation on the backend.

## Scope

This is an MVP research implementation. It does not claim that the project-defined normalized level mappings are authoritative market truth. It also does not attempt to provide compensation advice or guarantee the accuracy of any individual report.
