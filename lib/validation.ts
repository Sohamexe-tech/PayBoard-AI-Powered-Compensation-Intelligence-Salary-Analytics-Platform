import { z } from "zod";
import { normalizeCompanyName, normalizeLevelName, normalizeRoleTitle } from "@/lib/company";

export const currencyEnum = z.enum(["USD", "INR", "EUR", "GBP"]);
export const sourceEnum = z.enum(["public", "internal", "partner", "estimated"]);

const nonNegativeNumber = z.coerce.number().finite().nonnegative("invalid numeric value").max(1_000_000_000, "value is unreasonably large");

export const compensationInputSchema = z.object({
    company: z.string().trim().min(2, "missing company").max(120, "invalid company"),
    role: z.string().trim().min(2, "missing role").max(120, "invalid role"),
    level: z.string().trim().min(1, "missing level when required").max(60, "invalid level"),
    location: z.string().trim().min(2, "missing location").max(160, "invalid location"),
    experience: z.coerce.number().int().min(0).max(50, "experience out of range"),
    baseSalary: nonNegativeNumber.refine((value) => value > 0, "invalid salary"),
    bonus: nonNegativeNumber.default(0),
    stock: nonNegativeNumber.optional(),
    equity: nonNegativeNumber.optional(),
    totalCompensation: nonNegativeNumber.optional(),
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

    const { baseSalary, bonus, stock, equity, totalCompensation: submittedTotal } = parsed.data;
    const resolvedStock = stock ?? equity ?? 0;
    const totalCompensation = baseSalary + bonus + resolvedStock;

    if (submittedTotal !== undefined && Math.abs(submittedTotal - totalCompensation) > 0.01) {
        return {
            success: false as const,
            error: { formErrors: ["total compensation must equal base + bonus + stock"], fieldErrors: {} },
        };
    }

    try {
        const normalizedCompany = normalizeCompanyName(parsed.data.company);
        if (normalizedCompany === "Unknown" || !/[a-z]/i.test(normalizedCompany)) throw new Error("invalid company");
        normalizeRoleTitle(parsed.data.role);
        normalizeLevelName(parsed.data.level);
    } catch (error) {
        return {
            success: false as const,
            error: { formErrors: [error instanceof Error ? error.message : "invalid compensation dimensions"], fieldErrors: {} },
        };
    }

    return {
        success: true as const,
        data: {
            ...parsed.data,
            company: normalizeCompanyName(parsed.data.company),
            role: normalizeRoleTitle(parsed.data.role),
            level: normalizeLevelName(parsed.data.level),
            bonus,
            stock: resolvedStock,
            totalCompensation,
        },
    };
}

export function calculateTotalCompensation(baseSalary: number, bonus: number, stock: number) {
    return baseSalary + bonus + stock;
}
