import { describe, expect, it } from "vitest";
import { getCompanyIntelligence } from "@/lib/company-analytics";

const records = [100000, 150000, 200000, 250000, 300000].map((totalCompensation, index) => ({
    totalCompensation,
    baseSalary: totalCompensation - 10000,
    bonus: 5000,
    stock: 5000,
    role: index < 3 ? "Engineer" : "Manager",
    level: index < 2 ? "L3" : "L5",
    location: index < 3 ? "Seattle, WA, USA" : "New York, NY, USA",
    city: index < 3 ? "Seattle" : "New York",
    country: "USA",
}));

describe("company intelligence aggregation", () => {
    it("calculates sample-aware median, range, counts, and percentiles", () => {
        const result = getCompanyIntelligence(records);
        expect(result.recordCount).toBe(5);
        expect(result.medianTotalCompensation).toBe(200000);
        expect(result.lowestTotalCompensation).toBe(100000);
        expect(result.highestTotalCompensation).toBe(300000);
        expect(result.percentiles?.p25).toBe(150000);
        expect(result.commonRoles[0]).toEqual({ name: "Engineer", count: 3 });
    });

    it("does not show percentiles for tiny samples", () => {
        expect(getCompanyIntelligence(records.slice(0, 2)).percentiles).toBeNull();
    });
});
