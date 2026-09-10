import Link from "next/link";
import { getAnalytics, getCompanySummaries } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export default function HomePage() {
  const summary = getAnalytics(salaryRecords);
  const companies = getCompanySummaries(salaryRecords).slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Compensation Intelligence</p>
            <h1 className="mt-2 text-4xl font-bold">Salary benchmark dashboard</h1>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Compare companies
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Average base salary", value: `$${Math.round(summary.averageBaseSalary).toLocaleString()}` },
            { label: "Median base salary", value: `$${Math.round(summary.medianBaseSalary).toLocaleString()}` },
            { label: "Total records", value: summary.totalRecords.toString() },
            { label: "Top company", value: summary.topCompany },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Market snapshot</h2>
            <div className="mt-5 space-y-4">
              {companies.map((company) => (
                <div key={company.name} className="flex items-center justify-between rounded-xl bg-slate-800/80 p-4">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-slate-400">{company.recordCount} records</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Avg total</p>
                    <p className="font-semibold">${Math.round(company.averageTotalComp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li><Link href="/search" className="hover:text-white">Search salaries</Link></li>
              <li><Link href="/companies" className="hover:text-white">Company directory</Link></li>
              <li><Link href="/compare" className="hover:text-white">Compare compensation</Link></li>
              <li><Link href="/analytics" className="hover:text-white">Analytics</Link></li>
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
