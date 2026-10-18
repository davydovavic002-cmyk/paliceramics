import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
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
 * Password for file mode (no database). Set ADMIN_PASSWORD on the VPS;
 * until then the old demo password "pali" keeps working.
 */
function filePassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || "pali";
}

async function loginWithFilePassword(password: string): Promise<boolean> {
  if (!timingSafeEqual(digest(password), digest(filePassword()))) return false;
  await createAdminSession(FILE_ADMIN_ID);
  return true;
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
