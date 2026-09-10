import { describe, expect, it } from "vitest";
import { calculateAnalyticsDashboard } from "@/lib/analytics-service";

const records = [
    { total: 100, base: 80, bonus: 10, stock: 10, experience: 1, company: "A", role: "Engineer", level: "L3", normalizedLevel: "Entry", location: "Seattle" },
    { total: 200, base: 150, bonus: 20, stock: 30, experience: 3, company: "A", role: "Engineer", level: "L4", normalizedLevel: "Mid", location: "Seattle" },
    { total: 300, base: 220, bonus: 30, stock: 50, experience: 5, company: "B", role: "Manager", level: "M1", normalizedLevel: "Manager", location: "New York" },
];

describe("analytics dashboard calculations", () => {
    it("calculates summary, distribution, and grouped medians", () => {
        const result = calculateAnalyticsDashboard(records);
        expect(result.sampleSize).toBe(3);
        expect(result.summary.medianTotal).toBe(200);
        expect(result.medianByCompany[0]).toEqual({ name: "B", median: 300, sampleSize: 1 });
        expect(result.distribution.find((item) => item.bucket === "$150k-$200k")?.count).toBe(0);
        expect(result.experience).toHaveLength(3);
    });

    it("handles empty analytics data without fabricated values", () => {
        const result = calculateAnalyticsDashboard([]);
        expect(result.sampleSize).toBe(0);
        expect(result.summary.medianTotal).toBeNull();
        expect(result.medianByCompany).toEqual([]);
        expect(result.composition[0].average).toBe(0);
    });
});
