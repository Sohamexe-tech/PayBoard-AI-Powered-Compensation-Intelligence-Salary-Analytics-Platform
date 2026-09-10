import Link from "next/link";
import { getAnalyticsDashboard } from "@/lib/analytics-service";
import { findCompanies } from "@/lib/company-repository";

export const dynamic = "force-dynamic";

const money = (value: number | null) => value === null ? "Not available" : `$${Math.round(value).toLocaleString()}`;

export default async function HomePage() {
  let dashboard;
  let companies;
  try {
    [dashboard, companies] = await Promise.all([getAnalyticsDashboard(), findCompanies()]);
  } catch {
    dashboard = null;
    companies = [];
  }

  if (!dashboard) {
    return <main className="mx-auto max-w-5xl px-6 py-12"><div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"><h1 className="text-xl font-semibold">CompIQ is unavailable</h1><p className="mt-2 text-sm">The database connection is unavailable. Check the production DATABASE_URL and database status.</p></div></main>;
  }

  return (
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <header className="mb-8 border-b border-gray-200 pb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">CompIQ compensation intelligence</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">Compensation dashboard</h1>
              <Link href="/compare" className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">Compare</Link>
            </div>
          </header>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[["Average base", money(dashboard.summary.averageBase)], ["Median TC", money(dashboard.summary.medianTotal)], ["Approved records", dashboard.sampleSize.toString()], ["Companies", companies.length.toString()]].map(([label, value]) => <Link href="/analytics" key={label} className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></Link>)}
          </section>
          <section className="mt-8 grid gap-6 md:grid-cols-[1.5fr_1fr]">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Top companies by median total compensation</h2><div className="mt-4 space-y-3">{dashboard.medianByCompany.slice(0, 5).map((company) => <Link key={company.name} href="/companies" className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0 last:pb-0 hover:text-black"><span><span className="block font-medium">{company.name}</span><span className="text-sm text-gray-500">{company.sampleSize} approved records</span></span><span className="font-semibold">{money(company.median)}</span></Link>)}</div></div>
            <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Pages</h2><ul className="mt-4 space-y-2 text-sm text-gray-700"><li><Link href="/search" className="hover:font-medium">Search salaries</Link></li><li><Link href="/companies" className="hover:font-medium">Company intelligence</Link></li><li><Link href="/compare" className="hover:font-medium">Compare pay</Link></li><li><Link href="/analytics" className="hover:font-medium">Analytics</Link></li><li><Link href="/contribute" className="hover:font-medium">Contribute data</Link></li></ul></aside>
          </section>
        </div>
      </main>
    );
}
