import { NextResponse } from "next/server";
import { z } from "zod";

import { findComparison } from "@/lib/comparison-repository";

const querySchema = z.object({
    companies: z
        .string()
        .transform((value) =>
            value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
        )
        .refine(
            (value) => value.length >= 2 && value.length <= 4,
            "Choose 2 to 4 companies"
        ),

    role: z.string().optional(),

    normalizedLevel: z.string().trim().min(1),

    location: z.string().optional(),
});

export async function GET(request: Request) {
    const parsed = querySchema.safeParse(
        Object.fromEntries(new URL(request.url).searchParams)
    );

    if (!parsed.success) {
        return NextResponse.json(
            {
                error: parsed.error.flatten(),
            },
            { status: 400 }
        );
    }

    try {
        const result = await findComparison(parsed.data);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Comparison failed:", error);

        return NextResponse.json(
            {
                error: "Unable to compare compensation",
            },
            { status: 500 }
        );
    }
}