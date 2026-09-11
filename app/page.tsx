import Link from "next/link";
import { getAnalyticsDashboard } from "@/lib/analytics-service";
import { findCompanies } from "@/lib/company-repository";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [analytics, companies] = await Promise.all([
    getAnalyticsDashboard(),
    findCompanies(),
  ]);

  const stats = analytics?.stats ?? analytics?.summary ?? {};

  const averageBase =
    stats.averageBaseSalary ??
    stats.avgBaseSalary ??
    analytics?.averageBaseSalary ??
    0;

  const medianTotal =
    stats.medianTotalCompensation ??
    stats.medianTotal ??
    analytics?.medianTotalCompensation ??
    0;

  const approvedRecords =
    stats.approvedRecords ??
    stats.totalRecords ??
    analytics?.approvedRecords ??
    0;

  const companyCount =
    stats.companyCount ??
    stats.companies ??
    companies?.length ??
    0;

  const topCompanies = Array.isArray(
    analytics?.topCompanies ?? analytics?.companies
  )
    ? analytics?.topCompanies ?? analytics?.companies
    : [];

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">COMPENSATION INTELLIGENCE</span>

          <h1>Welcome to CompIQ</h1>

          <p>
            Get a clear view of the compensation market, discover salary
            patterns, and make data-driven career decisions.
          </p>

          <div className="hero-actions">
            <Link href="/search" className="btn btn-primary">
              Explore salaries
            </Link>

            <Link href="/compare" className="btn btn-secondary">
              Compare companies
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-card">
          <span>Market overview</span>

          <strong>{approvedRecords.toLocaleString()}</strong>

          <p>approved compensation records</p>

          <div className="hero-card-line" />

          <small>
            Data is aggregated across companies, roles and experience levels.
          </small>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MARKET SNAPSHOT</span>
            <h2>Compensation at a glance</h2>
          </div>

          <Link href="/analytics" className="text-link">
            View analytics →
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Average Base Salary</span>
            <strong>{formatMoney(averageBase)}</strong>
            <p>Across approved records</p>
          </div>

          <div className="stat-card">
            <span>Median Total Compensation</span>
            <strong>{formatMoney(medianTotal)}</strong>
            <p>Base + bonus + equity</p>
          </div>

          <div className="stat-card">
            <span>Approved Records</span>
            <strong>{approvedRecords.toLocaleString()}</strong>
            <p>Available for analysis</p>
          </div>

          <div className="stat-card">
            <span>Companies</span>
            <strong>{companyCount}</strong>
            <p>Across the dataset</p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MARKET LANDSCAPE</span>
            <h2>Companies in the dataset</h2>
          </div>

          <Link href="/companies" className="text-link">
            View all companies →
          </Link>
        </div>

        <div className="company-grid">
          {companies?.slice(0, 8).map((company: any) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="company-card"
            >
              <div className="company-logo">
                {company.name?.charAt(0)}
              </div>

              <div>
                <h3>{company.name}</h3>

                <p>
                  {company.industry || "Technology & Services"}
                </p>
              </div>

              <span className="company-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-feature-grid">
        <Link href="/search" className="feature-card">
          <div className="feature-icon">⌕</div>

          <span className="eyebrow">SALARY SEARCH</span>

          <h2>Find the right salary range</h2>

          <p>
            Search compensation by company, role, experience level and
            location.
          </p>

          <span className="feature-link">Search salaries →</span>
        </Link>

        <Link href="/compare" className="feature-card">
          <div className="feature-icon">⇄</div>

          <span className="eyebrow">COMPANY COMPARISON</span>

          <h2>Compare companies</h2>

          <p>
            Put companies side-by-side and understand how compensation
            differs across the market.
          </p>

          <span className="feature-link">Start comparing →</span>
        </Link>

        <Link href="/analytics" className="feature-card">
          <div className="feature-icon">◫</div>

          <span className="eyebrow">ANALYTICS</span>

          <h2>Explore market trends</h2>

          <p>
            Analyze compensation patterns across roles, levels and
            organizations.
          </p>

          <span className="feature-link">Open analytics →</span>
        </Link>
      </section>

      <section className="dashboard-cta">
        <div>
          <span className="eyebrow">MAKE BETTER DECISIONS</span>

          <h2>Know what your skills are worth.</h2>

          <p>
            Use CompIQ to understand the market before negotiating your next
            opportunity.
          </p>
        </div>

        <Link href="/search" className="btn btn-primary">
          Explore the market
        </Link>
      </section>
    </main>
  );
}