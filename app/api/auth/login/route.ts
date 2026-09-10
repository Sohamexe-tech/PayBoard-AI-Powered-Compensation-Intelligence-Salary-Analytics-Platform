import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser, createSession } from "@/lib/auth";
import { apiError } from "@/lib/api-errors";

const schema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(128) });

export async function POST(request: Request) {
    let body: unknown;
    try { body = await request.json(); } catch { return apiError("Request body must be valid JSON", 400); }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return apiError("Invalid login details", 400);
    const user = await authenticateUser(parsed.data.email, parsed.data.password);
    if (!user) return apiError("Invalid email or password", 401);
    await createSession(user.id);
    return NextResponse.json({ user });
}
