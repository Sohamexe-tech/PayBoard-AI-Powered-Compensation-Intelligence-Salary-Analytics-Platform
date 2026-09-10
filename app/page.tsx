import Link from "next/link";
import { getAnalytics, getCompanySummaries } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export default function HomePage() {
  const summary = getAnalytics(salaryRecords);
  const companies = getCompanySummaries(salaryRecords).slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Simple salary tracker</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Compensation dashboard</h1>
            <Link href="/compare" className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
              Compare
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Average base", value: `$${Math.round(summary.averageBaseSalary).toLocaleString()}` },
            { label: "Median base", value: `$${Math.round(summary.medianBaseSalary).toLocaleString()}` },
            { label: "Records", value: summary.totalRecords.toString() },
            { label: "Top company", value: summary.topCompany },
          ].map((item) => (
            <Link href="/analytics" key={item.label} className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Top companies</h2>
            <div className="mt-4 space-y-3">
              {companies.map((company) => (
                <Link key={company.name} href={`/company/${encodeURIComponent(company.name)}`} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 hover:text-black">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-gray-500">{company.recordCount} entries</p>
                  </div>
                  <p className="font-semibold">${Math.round(company.averageTotalComp).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Pages</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li><Link href="/search" className="hover:font-medium">Search salaries</Link></li>
              <li><Link href="/companies" className="hover:font-medium">Company list</Link></li>
              <li><Link href="/compare" className="hover:font-medium">Compare pay</Link></li>
              <li><Link href="/analytics" className="hover:font-medium">Analytics</Link></li>
              <li><Link href="/insights" className="hover:font-medium">Insights</Link></li>
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
