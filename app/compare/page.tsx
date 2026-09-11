"use client";

import { useEffect, useMemo, useState } from "react";

type Company = {
    id: string;
    name: string;
};

type ComparisonResult = {
    companyId: string;
    companyName: string;
    sampleSize: number;
    averageBaseSalary: number;
    medianBaseSalary: number;
    averageTotalCompensation: number;
    medianTotalCompensation: number;
};

const companiesList: Company[] = [
    { id: "google", name: "Google" },
    { id: "microsoft", name: "Microsoft" },
    { id: "amazon", name: "Amazon" },
    { id: "meta", name: "Meta" },
    { id: "apple", name: "Apple" },
    { id: "netflix", name: "Netflix" },
    { id: "adobe", name: "Adobe" },
    { id: "ibm", name: "IBM" },
    { id: "tcs", name: "TCS" },
    { id: "infosys", name: "Infosys" },
];

export default function ComparePage() {
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([
        "google",
        "microsoft",
    ]);

    const [role, setRole] = useState("");
    const [level, setLevel] = useState("Senior");
    const [location, setLocation] = useState("All locations");

    const [results, setResults] = useState<ComparisonResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const toggleCompany = (id: string) => {
        setSelectedCompanies((current) => {
            if (current.includes(id)) {
                return current.filter((companyId) => companyId !== id);
            }

            if (current.length >= 4) {
                return current;
            }

            return [...current, id];
        });
    };

    const runComparison = async () => {
        if (selectedCompanies.length < 2) {
            setError("Select at least two companies.");
            return;
        }

        setLoading(true);
        setError("");
        setSearched(true);

        try {
            const params = new URLSearchParams();

            params.set("companies", selectedCompanies.join(","));

            if (role.trim()) {
                params.set("role", role.trim());
            }

            if (level) {
                params.set("level", level);
            }

            if (location !== "All locations") {
                params.set("location", location);
            }

            const response = await fetch(`/api/compare?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Unable to load comparison.");
            }

            const data = await response.json();

            setResults(
                data.results ??
                data.comparisons ??
                data.data ??
                []
            );
        } catch (err) {
            setResults([]);
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runComparison();
    }, []);

    const maxBaseSalary = useMemo(() => {
        return Math.max(
            ...results.map((item) => item.averageBaseSalary || 0),
            1
        );
    }, [results]);

    const maxTotalCompensation = useMemo(() => {
        return Math.max(
            ...results.map(
                (item) => item.averageTotalCompensation || 0
            ),
            1
        );
    }, [results]);

    const formatMoney = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value || 0);

    return (
        <main className="compare-page">
            <section className="compare-header">
                <div>
                    <span className="eyebrow">COMPANY COMPARISON</span>

                    <h1>Compare compensation</h1>

                    <p>
                        Compare salary levels across companies using the same role,
                        experience level and location criteria.
                    </p>
                </div>
            </section>

            <section className="compare-layout">
                <aside className="compare-sidebar">
                    <div className="compare-panel">
                        <div className="panel-title">
                            <span>01</span>
                            <div>
                                <h2>Select companies</h2>
                                <p>Choose 2–4 companies</p>
                            </div>
                        </div>

                        <div className="company-selector">
                            {companiesList.map((company) => {
                                const selected = selectedCompanies.includes(company.id);

                                return (
                                    <button
                                        key={company.id}
                                        type="button"
                                        onClick={() => toggleCompany(company.id)}
                                        className={`company-option ${selected ? "selected" : ""
                                            }`}
                                    >
                                        <span className="company-option-logo">
                                            {company.name.charAt(0)}
                                        </span>

                                        <span>{company.name}</span>

                                        {selected && (
                                            <span className="checkmark">✓</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="compare-panel">
                        <div className="panel-title">
                            <span>02</span>

                            <div>
                                <h2>Comparison criteria</h2>
                                <p>Keep the criteria consistent</p>
                            </div>
                        </div>

                        <label className="form-field">
                            <span>Role</span>

                            <input
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                placeholder="e.g. Software Engineer"
                            />
                        </label>

                        <label className="form-field">
                            <span>Experience level</span>

                            <select
                                value={level}
                                onChange={(event) => setLevel(event.target.value)}
                            >
                                <option value="">All levels</option>
                                <option value="Intern">Intern</option>
                                <option value="Entry">Entry</option>
                                <option value="Junior">Junior</option>
                                <option value="Mid">Mid</option>
                                <option value="Senior">Senior</option>
                                <option value="Staff">Staff</option>
                                <option value="Principal">Principal</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </label>

                        <label className="form-field">
                            <span>Location</span>

                            <select
                                value={location}
                                onChange={(event) =>
                                    setLocation(event.target.value)
                                }
                            >
                                <option>All locations</option>
                                <option>United States</option>
                                <option>India</option>
                            </select>
                        </label>

                        <button
                            type="button"
                            onClick={runComparison}
                            disabled={loading}
                            className="compare-run-button"
                        >
                            {loading ? "Comparing..." : "Run comparison"}
                        </button>
                    </div>
                </aside>

                <section className="comparison-results">
                    <div className="results-header">
                        <div>
                            <span className="eyebrow">RESULTS</span>

                            <h2>
                                {searched
                                    ? "Compensation comparison"
                                    : "Ready to compare"}
                            </h2>
                        </div>

                        {results.length > 0 && (
                            <span className="result-count">
                                {results.length} companies
                            </span>
                        )}
                    </div>

                    {error && (
                        <div className="compare-error">
                            {error}
                        </div>
                    )}

                    {!loading && results.length === 0 && !error && (
                        <div className="empty-comparison">
                            <div className="empty-icon">⇄</div>

                            <h3>No comparison data found</h3>

                            <p>
                                Try changing the role, experience level or location.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="empty-comparison">
                            <div className="loading-spinner" />

                            <h3>Analyzing compensation data</h3>

                            <p>
                                Comparing the selected companies...
                            </p>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <>
                            <div className="comparison-cards">
                                {results.map((item) => (
                                    <article
                                        key={item.companyId}
                                        className="comparison-company-card"
                                    >
                                        <div className="comparison-company-header">
                                            <div className="large-company-logo">
                                                {item.companyName.charAt(0)}
                                            </div>

                                            <div>
                                                <h3>{item.companyName}</h3>

                                                <span>
                                                    {item.sampleSize} matching records
                                                </span>
                                            </div>
                                        </div>

                                        <div className="salary-highlight">
                                            <span>Average base</span>

                                            <strong>
                                                {formatMoney(item.averageBaseSalary)}
                                            </strong>
                                        </div>

                                        <div className="salary-highlight">
                                            <span>Average total compensation</span>

                                            <strong>
                                                {formatMoney(
                                                    item.averageTotalCompensation
                                                )}
                                            </strong>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="comparison-panel-wide">
                                <div className="chart-heading">
                                    <div>
                                        <span className="eyebrow">BASE SALARY</span>
                                        <h2>Average base salary</h2>
                                    </div>

                                    <span className="chart-unit">USD / year</span>
                                </div>

                                <div className="salary-bars">
                                    {results.map((item) => (
                                        <div
                                            className="salary-bar-row"
                                            key={item.companyId}
                                        >
                                            <div className="bar-label">
                                                <span>{item.companyName}</span>

                                                <strong>
                                                    {formatMoney(item.averageBaseSalary)}
                                                </strong>
                                            </div>

                                            <div className="bar-track">
                                                <div
                                                    className="bar-fill"
                                                    style={{
                                                        width: `${(item.averageBaseSalary /
                                                            maxBaseSalary) *
                                                            100
                                                            }%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="comparison-panel-wide">
                                <div className="chart-heading">
                                    <div>
                                        <span className="eyebrow">TOTAL COMPENSATION</span>
                                        <h2>Average total compensation</h2>
                                    </div>

                                    <span className="chart-unit">USD / year</span>
                                </div>

                                <div className="salary-bars">
                                    {results.map((item) => (
                                        <div
                                            className="salary-bar-row"
                                            key={item.companyId}
                                        >
                                            <div className="bar-label">
                                                <span>{item.companyName}</span>

                                                <strong>
                                                    {formatMoney(
                                                        item.averageTotalCompensation
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="bar-track">
                                                <div
                                                    className="bar-fill total"
                                                    style={{
                                                        width: `${(item.averageTotalCompensation /
                                                            maxTotalCompensation) *
                                                            100
                                                            }%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="comparison-panel-wide">
                                <div className="chart-heading">
                                    <div>
                                        <span className="eyebrow">DETAILED VIEW</span>
                                        <h2>Company comparison</h2>
                                    </div>
                                </div>

                                <div className="comparison-table-wrapper">
                                    <table className="comparison-table">
                                        <thead>
                                            <tr>
                                                <th>Company</th>
                                                <th>Records</th>
                                                <th>Avg. Base</th>
                                                <th>Median Base</th>
                                                <th>Avg. Total</th>
                                                <th>Median Total</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {results.map((item) => (
                                                <tr key={item.companyId}>
                                                    <td>
                                                        <strong>{item.companyName}</strong>
                                                    </td>

                                                    <td>{item.sampleSize}</td>

                                                    <td>
                                                        {formatMoney(
                                                            item.averageBaseSalary
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatMoney(
                                                            item.medianBaseSalary
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatMoney(
                                                            item.averageTotalCompensation
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatMoney(
                                                            item.medianTotalCompensation
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="demo-data-note">
                        <strong>Demo dataset</strong>

                        <span>
                            Salary figures are based on the current CompIQ dataset and
                            are intended for demonstration and analysis.
                        </span>
                    </div>
                </section>
            </section>
        </main>
    );
}