import { z } from "zod";

export const currencyEnum = z.enum(["USD", "INR", "EUR", "GBP"]);
export const sourceEnum = z.enum(["public", "internal", "partner", "estimated"]);

export const compensationInputSchema = z.object({
    company: z.string().trim().min(1, "missing company"),
    role: z.string().trim().min(1, "missing role"),
    level: z.string().trim().min(1, "missing level when required"),
    location: z.string().trim().min(1, "missing location"),
    experience: z.number().int().min(0).max(50, "experience out of range"),
    baseSalary: z.number().positive("invalid salary"),
    bonus: z.number().min(0, "bonus cannot be negative").default(0),
    equity: z.number().min(0, "equity cannot be negative").default(0),
    currency: currencyEnum,
    source: sourceEnum.default("public"),
});

export function validateCompensationInput(input: unknown) {
    const parsed = compensationInputSchema.safeParse(input);

    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.flatten(),
        };
    }

    const { baseSalary, bonus, equity } = parsed.data;
    const totalCompensation = baseSalary + bonus + equity;

    return {
        success: true as const,
        data: {
            ...parsed.data,
            totalCompensation,
        },
    };
}

export function calculateTotalCompensation(baseSalary: number, bonus: number, equity: number) {
    return baseSalary + bonus + equity;
}
