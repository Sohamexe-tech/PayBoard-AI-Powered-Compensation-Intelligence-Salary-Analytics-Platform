import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-errors";
import { getCurrentUser } from "@/lib/auth";
import { createContribution } from "@/lib/contributions";
import { normalizeLevelName } from "@/lib/company";

export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user) return apiError("Authentication required; submit through the contribution workflow", 401);
    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return apiError("Request body must be valid JSON", 400);
    }

    try {
        const input = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
        const contribution = await createContribution(user.id, {
            ...input,
            normalizedLevel: typeof input.normalizedLevel === "string" ? input.normalizedLevel : normalizeLevelName(String(input.level ?? "")),
        });
        return NextResponse.json({ contribution }, { status: 201 });
    } catch (error) {
        const status = error && typeof error === "object" && "status" in error && typeof error.status === "number" ? error.status : 500;
        const details = error && typeof error === "object" && "details" in error ? error.details : undefined;
        if (status >= 500) console.error("Compensation ingestion failed", error);
        return apiError(status === 409 ? "Compensation record already exists" : status === 400 ? "Invalid compensation payload" : "Unable to persist compensation record", status, details);
    }
}
