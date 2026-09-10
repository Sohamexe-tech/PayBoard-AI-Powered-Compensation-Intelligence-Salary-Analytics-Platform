import { describe, expect, it } from "vitest";
import { createDuplicateFingerprint } from "@/lib/db";

describe("database layer contract", () => {
    it("builds a stable duplicate fingerprint for compensation rows", () => {
        const fingerprintA = createDuplicateFingerprint({
            company: "Google LLC",
            role: "Software Engineer",
            level: "L3",
            location: "Seattle, WA",
            experience: 2,
            baseSalary: 185000,
            bonus: 18000,
            equity: 42000,
            currency: "USD",
        });

        const fingerprintB = createDuplicateFingerprint({
            company: "google inc.",
            role: "Software Engineer",
            level: "L3",
            location: "Seattle, WA",
            experience: 2,
            baseSalary: 185000,
            bonus: 18000,
            equity: 42000,
            currency: "USD",
        });

        expect(fingerprintA).toBe(fingerprintB);
        expect(fingerprintA.length).toBeGreaterThan(16);
    });

    it("rejects a duplicate duplicate fingerprint when price values and normalized fields match", () => {
        const fingerprintA = createDuplicateFingerprint({
            company: "Google LLC",
            role: "Software Engineer",
            level: "L3",
            location: "Seattle, WA",
            experience: 2,
            baseSalary: 185000,
            bonus: 18000,
            equity: 42000,
            currency: "USD",
        });

        const fingerprintB = createDuplicateFingerprint({
            company: "Google LLC",
            role: "Software Engineer",
            level: "L3",
            location: "Seattle, WA",
            experience: 2,
            baseSalary: 185001,
            bonus: 18000,
            equity: 42000,
            currency: "USD",
        });

        expect(fingerprintA).not.toBe(fingerprintB);
    });
});
