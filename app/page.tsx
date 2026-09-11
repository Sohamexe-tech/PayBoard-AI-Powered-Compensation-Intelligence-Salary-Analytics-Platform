import Link from "next/link";

import { getAnalyticsDashboard } from "@/lib/analytics-service";
import { findCompanies } from "@/lib/company-repository";

export const dynamic = "force-dynamic";

const money = (value: number | null) => {
  if (value === null || value === undefined) {
    return "Not available";
  }

  return `$${Math.round(value).toLocaleString()}`;
};

export default async function HomePage() {
  let dashboard;
  let companies;

  try {
    [dashboard, companies] = await Promise.all([
      getAnalyticsDashboard(),
      findCompanies(),
    ]);
  } catch {
    dashboard = null;
    companies = [];
  }

  if (!dashboard) {
    return (
      <main className="dashboard-page">
        <div className="compare-error">
          <h1>CompIQ is unavailable</h1>

          <p>
            The database connection is unavailable.
            Check your DATABASE_URL and database status.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      {/* HERO */}

      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">
            COMPENSATION INTELLIGENCE
          </span>

          <h1>
            Understand the market.
            <br />
            Compare with confidence.
          </h1>

          <p>
            CompIQ helps you explore compensation data across
            companies, roles, experience levels and locations.
          </p>

          <div className="hero-actions">
            <Link
              href="/search"
              className="btn btn-primary"
            >
              Explore salaries
            </Link>

            <Link
              href="/compare"
              className="btn btn-secondary"
            >
              Compare companies
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-card">
          <span>MARKET OVERVIEW</span>

          <strong>
            {dashboard.sampleSize.toLocaleString()}
          </strong>

          <p>
            approved compensation records
          </p>

          <div className="hero-card-line" />

          <small>
            Public analytics are calculated from approved
            compensation records.
          </small>
        </div>
      </section>

      {/* MARKET SNAPSHOT */}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              MARKET SNAPSHOT
            </span>

            <h2>
              Compensation at a glance
            </h2>
          </div>

          <Link
            href="/analytics"
            className="text-link"
          >
            View analytics →
          </Link>
        </div>

        <div className="stats-grid">
          <Link
            href="/analytics"
            className="stat-card"
          >
            <span>
              Average Base Salary
            </span>

            <strong>
              {money(
                dashboard.summary.averageBase
              )}
            </strong>

            <p>
              Across approved records
            </p>
          </Link>

          <Link
            href="/analytics"
            className="stat-card"
          >
            <span>
              Median Total Compensation
            </span>

            <strong>
              {money(
                dashboard.summary.medianTotal
              )}
            </strong>

            <p>
              Base + bonus + stock
            </p>
          </Link>

          <Link
            href="/analytics"
            className="stat-card"
          >
            <span>
              Approved Records
            </span>

            <strong>
              {dashboard.sampleSize.toLocaleString()}
            </strong>

            <p>
              Available for analysis
            </p>
          </Link>

          <Link
            href="/companies"
            className="stat-card"
          >
            <span>
              Companies
            </span>

            <strong>
              {companies.length}
            </strong>

            <p>
              In the current dataset
            </p>
          </Link>
        </div>
      </section>

      {/* TOP COMPANIES */}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              MARKET LANDSCAPE
            </span>

            <h2>
              Compensation by company
            </h2>
          </div>

          <Link
            href="/companies"
            className="text-link"
          >
            View all companies →
          </Link>
        </div>

        <div className="company-grid">
          {dashboard.medianByCompany
            .slice(0, 8)
            .map((company) => (
              <Link
                key={company.name}
                href="/companies"
                className="company-card"
              >
                <div className="company-logo">
                  {company.name.charAt(0)}
                </div>

                <div>
                  <h3>
                    {company.name}
                  </h3>

                  <p>
                    {company.sampleSize} approved records
                  </p>
                </div>

                <span className="company-arrow">
                  →
                </span>
              </Link>
            ))}
        </div>
      </section>

      {/* MAIN TOOLS */}

      <section className="dashboard-feature-grid">
        <Link
          href="/search"
          className="feature-card"
        >
          <div className="feature-icon">
            $
          </div>

          <span className="eyebrow">
            SALARY SEARCH
          </span>

          <h2>
            Find salary benchmarks
          </h2>

          <p>
            Search compensation records using
            company, role, location and experience
            criteria.
          </p>

          <span className="feature-link">
            Search salaries →
          </span>
        </Link>

        <Link
          href="/compare"
          className="feature-card"
        >
          <div className="feature-icon">
            ⇄
          </div>

          <span className="eyebrow">
            COMPARISON
          </span>

          <h2>
            Compare companies
          </h2>

          <p>
            Compare companies using the same
            normalized career level and compensation
            criteria.
          </p>

          <span className="feature-link">
            Start comparison →
          </span>
        </Link>

        <Link
          href="/analytics"
          className="feature-card"
        >
          <div className="feature-icon">
            ◫
          </div>

          <span className="eyebrow">
            ANALYTICS
          </span>

          <h2>
            Explore compensation trends
          </h2>

          <p>
            Analyze compensation patterns across
            companies and the broader dataset.
          </p>

          <span className="feature-link">
            Open analytics →
          </span>
        </Link>
      </section>

      {/* CTA */}

      <section className="dashboard-cta">
        <div>
          <span className="eyebrow">
            MAKE BETTER DECISIONS
          </span>

          <h2>
            Know what the market says.
          </h2>

          <p>
            Search salaries or compare companies
            before making your next career decision.
          </p>
        </div>

        <Link
          href="/search"
          className="btn btn-secondary"
        >
          Explore the market
        </Link>
      </section>
    </main>
  );
}