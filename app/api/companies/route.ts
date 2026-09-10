import { NextResponse } from "next/server";
import { getCompanySummaries } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export async function GET() {
    return NextResponse.json({ companies: getCompanySummaries(salaryRecords) });
}
