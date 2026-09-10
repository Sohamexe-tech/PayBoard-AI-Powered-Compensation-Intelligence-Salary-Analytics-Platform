import { redirect } from "next/navigation";
import { findCompanies } from "@/lib/company-repository";

export default async function LegacyCompanyRedirect({ params }: { params: Promise<{ company: string }> }) {
    const name = decodeURIComponent((await params).company);
    const company = (await findCompanies(name)).find((item) => item.normalizedName.toLowerCase() === name.toLowerCase() || item.name.toLowerCase() === name.toLowerCase());
    if (!company) redirect("/companies");
    redirect(`/companies/${company.id}`);
}
