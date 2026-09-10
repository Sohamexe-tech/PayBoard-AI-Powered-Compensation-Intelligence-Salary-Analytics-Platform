import { describe, expect, it } from "vitest";
import { validateCompensationInput } from "@/lib/validation";

describe("compensation validation", () => {
    it("calculates total compensation from base salary, bonus, and equity", () => {
        const result = validateCompensationInput({
            company: "Google LLC",
            role: "Software Engineer",
            level: "L3",
            location: "Seattle, WA",
            experience: 2,
            baseSalary: 180000,
            bonus: 15000,
            equity: 40000,
            currency: "USD",
            source: "public",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.totalCompensation).toBe(235000);
        }
    });

    it("rejects missing company or role", () => {
        const invalid = validateCompensationInput({
            company: "",
            role: "",
            level: "L3",
            location: "Seattle, WA",
            experience: 2,
            baseSalary: 180000,
            bonus: 15000,
            equity: 40000,
            currency: "USD",
        });

        expect(invalid.success).toBe(false);
    });
});
