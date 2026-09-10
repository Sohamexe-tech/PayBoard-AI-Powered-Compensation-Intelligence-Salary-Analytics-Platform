import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ContributionForm from "./contribution-form";

export default async function ContributePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login?next=/contribute");
    return <main className="mx-auto max-w-3xl px-4 py-10"><div className="flex items-end justify-between"><div><p className="text-sm text-blue-700">Signed in as {user.email}</p><h1 className="text-3xl font-bold">Contribute compensation data</h1><p className="mt-1 text-sm text-gray-600">Submissions are reviewed before appearing publicly.</p></div><Link href="/" className="text-sm text-blue-700 underline">Home</Link></div><ContributionForm /></main>;
}
