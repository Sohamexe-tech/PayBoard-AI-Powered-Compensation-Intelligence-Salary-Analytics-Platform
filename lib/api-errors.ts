import { NextResponse } from "next/server";

export function apiError(message: string, status: number, details?: unknown) {
    return NextResponse.json({ error: { code: status === 400 ? "VALIDATION_ERROR" : status === 409 ? "DUPLICATE_RECORD" : "REQUEST_FAILED", message, ...(details ? { details } : {}) } }, { status });
}
