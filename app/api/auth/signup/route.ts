import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, createUser } from "@/lib/auth";
import { apiError } from "@/lib/api-errors";

const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(10).max(128) });

export async function POST(request: Request) {
    let body: unknown;
    try { body = await request.json(); } catch { return apiError("Request body must be valid JSON", 400); }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return apiError("Invalid signup details", 400, parsed.error.flatten());
    try {
        const user = await createUser(parsed.data.email, parsed.data.password);
        await createSession(user.id);
        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") return apiError("An account with this email already exists", 409);
        console.error("Signup failed", error);
        return apiError("Unable to create account", 500);
    }
}
