import { z } from "zod";

export const currencyEnum = z.enum(["USD", "INR", "EUR", "GBP"]);
export const sourceEnum = z.enum(["public", "internal", "partner", "estimated"]);

const nullableNumber = z.union([
    z.number(),
    z.string().transform((value) => Number(value)),
]).refine((value) => Number.isFinite(value) && value >= 0, "invalid numeric value");

export const compensationInputSchema = z.object({
    company: z.string().trim().min(1, "missing company"),
    role: z.string().trim().min(1, "missing role"),
    level: z.string().trim().min(1, "missing level when required"),
    location: z.string().trim().min(1, "missing location"),
    experience: z.number().int().min(0).max(50, "experience out of range"),
    baseSalary: nullableNumber.refine((value) => value > 0, "invalid salary"),
    bonus: nullableNumber.default(0),
    stock: nullableNumber.optional(),
    equity: nullableNumber.optional(),
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

    const { baseSalary, bonus, stock, equity } = parsed.data;
    const resolvedStock = stock ?? equity ?? 0;
    const totalCompensation = baseSalary + bonus + resolvedStock;

    if (baseSalary <= 0 || bonus < 0 || resolvedStock < 0 || totalCompensation <= 0) {
        return {
            success: false as const,
            error: {
                formErrors: ["invalid compensation values"],
                fieldErrors: {},
            },
        };
    }

    return {
        success: true as const,
        data: {
            ...parsed.data,
            bonus,
            stock: resolvedStock,
            totalCompensation,
        },
    };
}

export function calculateTotalCompensation(baseSalary: number, bonus: number, stock: number) {
    return baseSalary + bonus + stock;
}
