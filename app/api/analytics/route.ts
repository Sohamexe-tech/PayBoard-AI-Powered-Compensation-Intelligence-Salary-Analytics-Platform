import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/analytics";
import { salaryRecords } from "@/lib/data";

export async function GET() {
    return NextResponse.json({ summary: getAnalytics(salaryRecords) });
}
