import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const normalizedLevels = [
    "Intern",
    "Entry",
    "Junior",
    "Mid",
    "Senior",
    "Staff",
    "Principal",
    "Manager",
] as const;

async function main() {
    for (const name of normalizedLevels) {
        await prisma.normalizedLevel.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
}

main()
    .catch((error) => {
        console.error("Database seed failed", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
