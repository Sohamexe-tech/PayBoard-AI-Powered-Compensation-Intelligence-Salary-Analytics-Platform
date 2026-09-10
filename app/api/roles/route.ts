import { NextResponse } from "next/server";
import { salaryRecords } from "@/lib/data";

export async function GET() {
    const roles = [...new Set(salaryRecords.map((record) => record.role))].sort();
    return NextResponse.json({ roles });
}
