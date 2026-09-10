import { describe, expect, it } from "vitest";
import { compareRecords, percentageDifference } from "@/lib/comparison";

describe("compensation comparison", () => {
    it("matches records by normalized company comparison group", () => {
        const rows = compareRecords([
            { company: "Google", companyLevel: "L4", normalizedLevel: "Senior", base: 180, bonus: 20, stock: 30, total: 230 },
            { company: "Google", companyLevel: "L4", normalizedLevel: "Senior", base: 200, bonus: 20, stock: 40, total: 260 },
            { company: "Amazon", companyLevel: "SDE II", normalizedLevel: "Senior", base: 190, bonus: 10, stock: 20, total: 220 },
        ], ["Google", "Amazon"]);
        expect(rows[0].medianTotal).toBe(245);
        expect(rows[0].sampleSize).toBe(2);
        expect(rows[1].medianBase).toBe(190);
    });

    it("handles missing components and insufficient samples", () => {
        const rows = compareRecords([{ company: "Meta", companyLevel: "E4", normalizedLevel: "Senior", base: 200, bonus: 0, stock: 0, total: 200 }], ["Meta", "Apple"]);
        expect(rows[0].medianBonus).toBe(0);
        expect(rows[1].medianTotal).toBeNull();
        expect(rows[1].sampleSize).toBe(0);
    });

    it("calculates percentage difference against a comparison baseline", () => {
        expect(percentageDifference(125, 100)).toBe(25);
        expect(percentageDifference(null, 100)).toBeNull();
        expect(percentageDifference(100, 0)).toBeNull();
    });
});
