import { NextResponse } from "next/server";
import { compareCompanies } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const companyA = searchParams.get("companyA") ?? "Google";
    const companyB = searchParams.get("companyB") ?? "Microsoft";

    return NextResponse.json({ result: compareCompanies(salaryRecords, companyA, companyB) });
}
