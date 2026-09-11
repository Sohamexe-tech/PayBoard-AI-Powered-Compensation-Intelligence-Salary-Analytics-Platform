"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
    company: string;
    companyLevel: string;
    normalizedLevel: string;
    medianBase: number | null;
    medianBonus: number | null;
    medianStock: number | null;
    medianTotal: number | null;
    sampleSize: number;
};

const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
    "Adobe",
    "IBM",
    "TCS",
    "Infosys",
];

const levels = [
    "Intern",
    "Entry",
    "Junior",
    "Mid",
    "Senior",
    "Staff",
    "Principal",
    "Manager",
];

const money = (value: number | null) => {
    if (value === null || value === undefined) {
        return "Not available";
    }

    return `$${Math.round(value).toLocaleString()}`;
};

export default function ComparePage() {
    const [selectedCompanies, setSelectedCompanies] =
        useState<string[]>([
            "Google",
            "Microsoft",
        ]);

    const [role, setRole] = useState("");

    const [level, setLevel] =
        useState("Senior");

    const [location, setLocation] =
        useState("");

    const [rows, setRows] =
        useState<Row[]>([]);

    const [warning, setWarning] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [hasCompared, setHasCompared] =
        useState(false);

    const toggleCompany = (
        company: string
    ) => {
        setSelectedCompanies((current) => {
            if (current.includes(company)) {
                if (current.length <= 2) {
                    return current;
                }

                return current.filter(
                    (item) => item !== company
                );
            }

            if (current.length >= 4) {
                return current;
            }

            return [
                ...current,
                company,
            ];
        });
    };

    const runComparison = async () => {
        if (selectedCompanies.length < 2) {
            setError(
                "Please select at least two companies."
            );
            return;
        }

        setLoading(true);
        setError("");

        try {
            const query =
                new URLSearchParams();

            query.set(
                "companies",
                selectedCompanies.join(",")
            );

            query.set(
                "normalizedLevel",
                level
            );

            if (role.trim()) {
                query.set(
                    "role",
                    role.trim()
                );
            }

            if (location.trim()) {
                query.set(
                    "location",
                    location.trim()
                );
            }

            const response =
                await fetch(
                    `/api/compare?${query.toString()}`,
                    {
                        cache: "no-store",
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.error ||
                    "Unable to load comparison."
                );
            }

            setRows(
                Array.isArray(result.rows)
                    ? result.rows
                    : []
            );

            setWarning(
                result.warning ?? null
            );

            setHasCompared(true);
        } catch (err) {
            setRows([]);
            setWarning(null);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load comparison data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runComparison();
    }, []);

    const rowsWithData =
        rows.filter(
            (row) =>
                row.sampleSize > 0
        );

    const highestTotal =
        useMemo(() => {
            return rowsWithData
                .filter(
                    (row) =>
                        row.medianTotal !== null
                )
                .sort(
                    (a, b) =>
                        (b.medianTotal ?? 0) -
                        (a.medianTotal ?? 0)
                )[0];
        }, [rowsWithData]);

    const highestBase =
        useMemo(() => {
            return rowsWithData
                .filter(
                    (row) =>
                        row.medianBase !== null
                )
                .sort(
                    (a, b) =>
                        (b.medianBase ?? 0) -
                        (a.medianBase ?? 0)
                )[0];
        }, [rowsWithData]);

    const highestStock =
        useMemo(() => {
            return rowsWithData
                .filter(
                    (row) =>
                        row.medianStock !== null
                )
                .sort(
                    (a, b) =>
                        (b.medianStock ?? 0) -
                        (a.medianStock ?? 0)
                )[0];
        }, [rowsWithData]);

    const maxTotal =
        Math.max(
            ...rows.map(
                (row) =>
                    row.medianTotal ?? 0
            ),
            1
        );

    const maxBase =
        Math.max(
            ...rows.map(
                (row) =>
                    row.medianBase ?? 0
            ),
            1
        );

    const maxStock =
        Math.max(
            ...rows.map(
                (row) =>
                    row.medianStock ?? 0
            ),
            1
        );

    return (
        <main className="compare-page">
            {/* HEADER */}

            <section className="compare-header">
                <span className="eyebrow">
                    COMPANY COMPARISON
                </span>

                <h1>
                    Compare compensation
                </h1>

                <p>
                    Compare compensation between companies
                    using the same normalized career level,
                    role and location criteria.
                </p>
            </section>

            <section className="compare-layout">
                {/* SIDEBAR */}

                <aside className="compare-sidebar">
                    {/* COMPANIES */}

                    <div className="compare-panel">
                        <div className="panel-title">
                            <span>01</span>

                            <div>
                                <h2>
                                    Select companies
                                </h2>

                                <p>
                                    Choose 2–4 companies
                                </p>
                            </div>
                        </div>

                        <div className="company-selector">
                            {companies.map(
                                (company) => {
                                    const selected =
                                        selectedCompanies.includes(
                                            company
                                        );

                                    return (
                                        <button
                                            key={company}
                                            type="button"
                                            onClick={() =>
                                                toggleCompany(
                                                    company
                                                )
                                            }
                                            className={`company-option ${selected
                                                    ? "selected"
                                                    : ""
                                                }`}
                                        >
                                            <span className="company-option-logo">
                                                {company.charAt(0)}
                                            </span>

                                            <span>
                                                {company}
                                            </span>

                                            {selected && (
                                                <span className="checkmark">
                                                    ✓
                                                </span>
                                            )}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* FILTERS */}

                    <div className="compare-panel">
                        <div className="panel-title">
                            <span>02</span>

                            <div>
                                <h2>
                                    Comparison criteria
                                </h2>

                                <p>
                                    Keep criteria consistent
                                </p>
                            </div>
                        </div>

                        <label className="form-field">
                            <span>
                                Role
                            </span>

                            <input
                                value={role}
                                onChange={(event) =>
                                    setRole(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Software Engineer"
                            />
                        </label>

                        <label className="form-field">
                            <span>
                                Normalized level
                            </span>

                            <select
                                value={level}
                                onChange={(event) =>
                                    setLevel(
                                        event.target.value
                                    )
                                }
                            >
                                {levels.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>
                        </label>

                        <label className="form-field">
                            <span>
                                Location
                            </span>

                            <input
                                value={location}
                                onChange={(event) =>
                                    setLocation(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Mumbai or India"
                            />
                        </label>

                        <button
                            type="button"
                            onClick={
                                runComparison
                            }
                            disabled={loading}
                            className="compare-run-button"
                        >
                            {loading
                                ? "Comparing..."
                                : "Run comparison"}
                        </button>
                    </div>
                </aside>

                {/* RESULTS */}

                <section className="comparison-results">
                    <div className="results-header">
                        <div>
                            <span className="eyebrow">
                                RESULTS
                            </span>

                            <h2>
                                {hasCompared
                                    ? "Compensation comparison"
                                    : "Ready to compare"}
                            </h2>
                        </div>

                        {rowsWithData.length >
                            0 && (
                                <span className="result-count">
                                    {
                                        rowsWithData.length
                                    }{" "}
                                    companies
                                </span>
                            )}
                    </div>

                    {warning && (
                        <div className="compare-error">
                            {warning}
                        </div>
                    )}

                    {error && (
                        <div
                            role="alert"
                            className="compare-error"
                        >
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="empty-comparison">
                            <div className="loading-spinner" />

                            <h3>
                                Comparing compensation
                            </h3>

                            <p>
                                Analyzing approved records...
                            </p>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        rowsWithData.length === 0 && (
                            <div className="empty-comparison">
                                <div className="empty-icon">
                                    ⇄
                                </div>

                                <h3>
                                    No equivalent records found
                                </h3>

                                <p>
                                    Try another normalized
                                    level, role or location.
                                </p>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        rowsWithData.length >
                        0 && (
                            <>
                                {/* COMPANY CARDS */}

                                <div className="comparison-cards">
                                    {rowsWithData.map(
                                        (row) => (
                                            <article
                                                key={row.company}
                                                className="comparison-company-card"
                                            >
                                                <div className="comparison-company-header">
                                                    <div className="large-company-logo">
                                                        {row.company.charAt(
                                                            0
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h3>
                                                            {row.company}
                                                        </h3>

                                                        <span>
                                                            {
                                                                row.companyLevel
                                                            }{" "}
                                                            →{" "}
                                                            {
                                                                row.normalizedLevel
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="salary-highlight">
                                                    <span>
                                                        Median base
                                                    </span>

                                                    <strong>
                                                        {money(
                                                            row.medianBase
                                                        )}
                                                    </strong>
                                                </div>

                                                <div className="salary-highlight">
                                                    <span>
                                                        Median bonus
                                                    </span>

                                                    <strong>
                                                        {money(
                                                            row.medianBonus
                                                        )}
                                                    </strong>
                                                </div>

                                                <div className="salary-highlight">
                                                    <span>
                                                        Median stock
                                                    </span>

                                                    <strong>
                                                        {money(
                                                            row.medianStock
                                                        )}
                                                    </strong>
                                                </div>

                                                <div className="salary-highlight">
                                                    <span>
                                                        Median total
                                                    </span>

                                                    <strong>
                                                        {money(
                                                            row.medianTotal
                                                        )}
                                                    </strong>
                                                </div>

                                                <div className="salary-highlight">
                                                    <span>
                                                        Sample size
                                                    </span>

                                                    <strong>
                                                        {
                                                            row.sampleSize
                                                        }
                                                    </strong>
                                                </div>
                                            </article>
                                        )
                                    )}
                                </div>

                                {/* TOTAL COMPENSATION */}

                                <div className="comparison-panel-wide">
                                    <div className="chart-heading">
                                        <div>
                                            <span className="eyebrow">
                                                TOTAL COMPENSATION
                                            </span>

                                            <h2>
                                                Median total compensation
                                            </h2>
                                        </div>

                                        <span className="chart-unit">
                                            USD / year
                                        </span>
                                    </div>

                                    <div className="salary-bars">
                                        {rowsWithData.map(
                                            (row) => (
                                                <div
                                                    key={row.company}
                                                    className="salary-bar-row"
                                                >
                                                    <div className="bar-label">
                                                        <span>
                                                            {row.company}
                                                        </span>

                                                        <strong>
                                                            {money(
                                                                row.medianTotal
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <div className="bar-track">
                                                        <div
                                                            className="bar-fill"
                                                            style={{
                                                                width: `${((row.medianTotal ??
                                                                        0) /
                                                                        maxTotal) *
                                                                    100
                                                                    }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* BASE SALARY */}

                                <div className="comparison-panel-wide">
                                    <div className="chart-heading">
                                        <div>
                                            <span className="eyebrow">
                                                BASE SALARY
                                            </span>

                                            <h2>
                                                Median base salary
                                            </h2>
                                        </div>

                                        <span className="chart-unit">
                                            USD / year
                                        </span>
                                    </div>

                                    <div className="salary-bars">
                                        {rowsWithData.map(
                                            (row) => (
                                                <div
                                                    key={row.company}
                                                    className="salary-bar-row"
                                                >
                                                    <div className="bar-label">
                                                        <span>
                                                            {row.company}
                                                        </span>

                                                        <strong>
                                                            {money(
                                                                row.medianBase
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <div className="bar-track">
                                                        <div
                                                            className="bar-fill"
                                                            style={{
                                                                width: `${((row.medianBase ??
                                                                        0) /
                                                                        maxBase) *
                                                                    100
                                                                    }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* EQUITY */}

                                <div className="comparison-panel-wide">
                                    <div className="chart-heading">
                                        <div>
                                            <span className="eyebrow">
                                                EQUITY
                                            </span>

                                            <h2>
                                                Median stock compensation
                                            </h2>
                                        </div>

                                        <span className="chart-unit">
                                            USD / year
                                        </span>
                                    </div>

                                    <div className="salary-bars">
                                        {rowsWithData.map(
                                            (row) => (
                                                <div
                                                    key={row.company}
                                                    className="salary-bar-row"
                                                >
                                                    <div className="bar-label">
                                                        <span>
                                                            {row.company}
                                                        </span>

                                                        <strong>
                                                            {money(
                                                                row.medianStock
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <div className="bar-track">
                                                        <div
                                                            className="bar-fill total"
                                                            style={{
                                                                width: `${((row.medianStock ??
                                                                        0) /
                                                                        maxStock) *
                                                                    100
                                                                    }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* HIGHLIGHTS */}

                                <div className="comparison-panel-wide">
                                    <div className="chart-heading">
                                        <div>
                                            <span className="eyebrow">
                                                KEY FINDINGS
                                            </span>

                                            <h2>
                                                Comparison highlights
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="highlights-grid">
                                        <div className="highlight-item">
                                            <span>
                                                Highest median total
                                            </span>

                                            <strong>
                                                {highestTotal
                                                    ? highestTotal.company
                                                    : "Not available"}
                                            </strong>

                                            <small>
                                                {highestTotal
                                                    ? money(
                                                        highestTotal.medianTotal
                                                    )
                                                    : ""}
                                            </small>
                                        </div>

                                        <div className="highlight-item">
                                            <span>
                                                Highest median base
                                            </span>

                                            <strong>
                                                {highestBase
                                                    ? highestBase.company
                                                    : "Not available"}
                                            </strong>

                                            <small>
                                                {highestBase
                                                    ? money(
                                                        highestBase.medianBase
                                                    )
                                                    : ""}
                                            </small>
                                        </div>

                                        <div className="highlight-item">
                                            <span>
                                                Highest median equity
                                            </span>

                                            <strong>
                                                {highestStock
                                                    ? highestStock.company
                                                    : "Not available"}
                                            </strong>

                                            <small>
                                                {highestStock
                                                    ? money(
                                                        highestStock.medianStock
                                                    )
                                                    : ""}
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {/* TABLE */}

                                <div className="comparison-panel-wide">
                                    <div className="chart-heading">
                                        <div>
                                            <span className="eyebrow">
                                                DETAILED DATA
                                            </span>

                                            <h2>
                                                Side-by-side comparison
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="comparison-table-wrapper">
                                        <table className="comparison-table">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Company
                                                    </th>

                                                    <th>
                                                        Company Level
                                                    </th>

                                                    <th>
                                                        Normalized Level
                                                    </th>

                                                    <th>
                                                        Median Base
                                                    </th>

                                                    <th>
                                                        Median Bonus
                                                    </th>

                                                    <th>
                                                        Median Stock
                                                    </th>

                                                    <th>
                                                        Median Total
                                                    </th>

                                                    <th>
                                                        Samples
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {rows.map(
                                                    (row) => (
                                                        <tr
                                                            key={
                                                                row.company
                                                            }
                                                        >
                                                            <td>
                                                                <strong>
                                                                    {
                                                                        row.company
                                                                    }
                                                                </strong>
                                                            </td>

                                                            <td>
                                                                {
                                                                    row.companyLevel
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    row.normalizedLevel
                                                                }
                                                            </td>

                                                            <td>
                                                                {money(
                                                                    row.medianBase
                                                                )}
                                                            </td>

                                                            <td>
                                                                {money(
                                                                    row.medianBonus
                                                                )}
                                                            </td>

                                                            <td>
                                                                {money(
                                                                    row.medianStock
                                                                )}
                                                            </td>

                                                            <td>
                                                                <strong>
                                                                    {money(
                                                                        row.medianTotal
                                                                    )}
                                                                </strong>
                                                            </td>

                                                            <td>
                                                                {
                                                                    row.sampleSize
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                    <div className="demo-data-note">
                        <strong>
                            Demo dataset
                        </strong>

                        <span>
                            Compensation figures are based on
                            the current CompIQ dataset and are
                            intended for demonstration and
                            analysis.
                        </span>
                    </div>
                </section>
            </section>
        </main>
    );
}