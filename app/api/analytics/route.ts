import { NextResponse } from "next/server";
import { getAnalyticsDashboard } from "@/lib/analytics-service";

export async function GET() {
    try {
        return NextResponse.json(await getAnalyticsDashboard());
    } catch {
        return NextResponse.json({ error: "Unable to load analytics" }, { status: 500 });
    }
}
