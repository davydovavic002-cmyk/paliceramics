import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { dataDir } from "@/lib/contentStore";
import { prisma, isDatabaseConfigured, isDatabaseReachable } from "@/lib/db";

const COOKIE_NAME = "pali_admin_session";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7;
const FILE_ADMIN_ID = "file-admin";

export function isSessionConfigured(): boolean {
  return Boolean(process.env.SESSION_SECRET?.trim());
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(adminId: string): Promise<void> {
  const token = await new SignJWT({ sub: adminId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SEC}s`)
    .sign(sessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/** Works with or without a database — the cookie is a signed JWT. */
export async function getAdminSession(): Promise<{ adminId: string } | null> {
  if (!isSessionConfigured()) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    const adminId = payload.sub;
    if (!adminId || typeof adminId !== "string") return null;
    if (adminId === FILE_ADMIN_ID) {
      const auth = await readFileAuth();
      if (auth.sessionsValidFrom && (payload.iat ?? 0) < auth.sessionsValidFrom) return null;
    }
    return { adminId };
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<{ adminId: string }> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/**
 * File mode (no database). The password lives in data/admin-auth.json once the owner changes it
 * inside the admin; until then ADMIN_PASSWORD from .env.local is used (no default in production).
 */
type FileAuth = { passwordHash?: string; sessionsValidFrom?: number };
const authFile = () => path.join(dataDir(), "admin-auth.json");

async function readFileAuth(): Promise<FileAuth> {
  try {
    const parsed = JSON.parse(await fs.readFile(authFile(), "utf8")) as FileAuth;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeFileAuth(next: FileAuth) {
  await fs.mkdir(dataDir(), { recursive: true });
  const tmp = `${authFile()}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next), { encoding: "utf8", mode: 0o600 });
  await fs.rename(tmp, authFile());
}

function envPassword(): string | null {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (configured) return configured;
  // In production there is no default password: set ADMIN_PASSWORD in .env.local.
  return process.env.NODE_ENV === "production" ? null : "pali";
}

async function checkFilePassword(password: string): Promise<boolean> {
  const auth = await readFileAuth();
  if (auth.passwordHash) return verifyPassword(password, auth.passwordHash);
  const expected = envPassword();
  if (!expected) return false;
  return timingSafeEqual(digest(password), digest(expected));
}

async function loginWithFilePassword(password: string): Promise<boolean> {
  if (!(await checkFilePassword(password))) return false;
  await createAdminSession(FILE_ADMIN_ID);
  return true;
}

/** Everyone who logged in before now has to log in again; this device stays logged in. */
export async function signOutEverywhere(): Promise<void> {
  const auth = await readFileAuth();
  await writeFileAuth({ ...auth, sessionsValidFrom: Math.floor(Date.now() / 1000) });
  await createAdminSession(FILE_ADMIN_ID);
}

export async function changeFilePassword(
  currentPassword: string,
  nextPassword: string
): Promise<{ ok: boolean; error?: string }> {
  if (nextPassword.length < 8) return { ok: false, error: "PASSWORD_TOO_SHORT" };
  if (!(await checkFilePassword(currentPassword))) return { ok: false, error: "INVALID_CURRENT" };
  await writeFileAuth({
    passwordHash: await hashPassword(nextPassword),
    sessionsValidFrom: Math.floor(Date.now() / 1000),
  });
  await createAdminSession(FILE_ADMIN_ID);
  return { ok: true };
}

export async function loginAdmin(password: string): Promise<boolean> {
  if (!isSessionConfigured()) throw new Error("SESSION_SECRET is not configured");

  if (isDatabaseConfigured() && (await isDatabaseReachable())) {
    const admin = await prisma.adminUser.findFirst({ orderBy: { createdAt: "asc" } });
    if (admin) {
      const ok = await verifyPassword(password, admin.passwordHash);
      if (!ok) return false;
      await createAdminSession(admin.id);
      return true;
    }
  }

  return loginWithFilePassword(password);
}

export async function changeAdminPassword(
  adminId: string,
  currentPassword: string,
  nextPassword: string
): Promise<{ ok: boolean; error?: string }> {
  if (nextPassword.length < 8) {
    return { ok: false, error: "PASSWORD_TOO_SHORT" };
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!admin) return { ok: false, error: "NOT_FOUND" };

  const ok = await verifyPassword(currentPassword, admin.passwordHash);
  if (!ok) return { ok: false, error: "INVALID_CURRENT" };

  await prisma.adminUser.update({
    where: { id: adminId },
    data: { passwordHash: await hashPassword(nextPassword) },
  });

  return { ok: true };
}
