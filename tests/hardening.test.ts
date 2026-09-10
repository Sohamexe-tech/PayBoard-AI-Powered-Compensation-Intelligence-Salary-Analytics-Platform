import { describe, expect, it } from "vitest";
import { validateCompensationInput } from "@/lib/validation";

const validInput = {
    company: "Google LLC",
    role: "Software Engineer",
    level: "L4",
    location: "Seattle, WA, USA",
    experience: 4,
    baseSalary: 180000,
    bonus: 15000,
    stock: 40000,
    currency: "USD",
    source: "public",
};

describe("compensation ingestion hardening", () => {
    it("rejects negative, zero, and unreasonable salary values", () => {
        expect(validateCompensationInput({ ...validInput, baseSalary: -1 }).success).toBe(false);
        expect(validateCompensationInput({ ...validInput, baseSalary: 0 }).success).toBe(false);
        expect(validateCompensationInput({ ...validInput, baseSalary: 1_000_000_001 }).success).toBe(false);
    });

    it("defaults missing bonus and stock to zero", () => {
        const result = validateCompensationInput({ ...validInput, bonus: undefined, stock: undefined });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.bonus).toBe(0);
            expect(result.data.stock).toBe(0);
            expect(result.data.totalCompensation).toBe(180000);
        }
    });

    it("rejects an inconsistent client-provided total", () => {
        expect(validateCompensationInput({ ...validInput, totalCompensation: 1 }).success).toBe(false);
    });

    it("rejects invalid company, role, level, and currency values", () => {
        expect(validateCompensationInput({ ...validInput, company: "!!!" }).success).toBe(false);
        expect(validateCompensationInput({ ...validInput, role: "!" }).success).toBe(false);
        expect(validateCompensationInput({ ...validInput, level: "" }).success).toBe(false);
        expect(validateCompensationInput({ ...validInput, currency: "CAD" }).success).toBe(false);
    });
});
