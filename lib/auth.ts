import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const scrypt = promisify(nodeScrypt);
const SESSION_COOKIE = "compiq_session";
const SESSION_DAYS = 14;

function hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
}

async function hashPassword(password: string) {
    const salt = randomBytes(16);
    const derivedKey = await scrypt(password, salt, 64) as Buffer;
    return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string) {
    const [saltHex, keyHex] = storedHash.split(":");
    if (!saltHex || !keyHex) return false;
    const derivedKey = await scrypt(password, Buffer.from(saltHex, "hex"), 64) as Buffer;
    const expected = Buffer.from(keyHex, "hex");
    return expected.length === derivedKey.length && timingSafeEqual(expected, derivedKey);
}

export async function createUser(email: string, password: string) {
    return prisma.user.create({ data: { email: email.toLowerCase(), passwordHash: await hashPassword(password) }, select: { id: true, email: true } });
}

export async function authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
    return { id: user.id, email: user.email };
}

export async function createSession(userId: string) {
    const token = randomBytes(32).toString("base64url");
    await prisma.session.create({
        data: {
            userId,
            tokenHash: hashToken(token),
            expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
        },
    });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_DAYS * 24 * 60 * 60 });
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: { select: { id: true, email: true } } } });
    if (!session || session.expiresAt <= new Date()) return null;
    return session.user;
}

export async function deleteCurrentSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
    cookieStore.delete(SESSION_COOKIE);
}
