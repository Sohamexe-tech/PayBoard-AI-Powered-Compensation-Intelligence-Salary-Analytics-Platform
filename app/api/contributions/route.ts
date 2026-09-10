import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createContribution, getUserContributions } from "@/lib/contributions";
import { apiError } from "@/lib/api-errors";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return apiError("Authentication required", 401);
    return NextResponse.json({ contributions: await getUserContributions(user.id) });
}

export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user) return apiError("Authentication required", 401);
    let body: unknown;
    try { body = await request.json(); } catch { return apiError("Request body must be valid JSON", 400); }
    try {
        const contribution = await createContribution(user.id, body);
        return NextResponse.json({ contribution }, { status: 201 });
    } catch (error) {
        const status = error && typeof error === "object" && "status" in error && typeof error.status === "number" ? error.status : 500;
        if (status >= 500) console.error("Contribution submission failed", error);
        return apiError(status === 409 ? "This contribution already exists" : status === 400 ? "Invalid contribution" : "Unable to submit contribution", status, error && typeof error === "object" && "details" in error ? error.details : undefined);
    }
}
