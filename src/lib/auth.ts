import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma, isDatabaseConfigured } from "@/lib/db";

const COOKIE_NAME = "pali_admin_session";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7;

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

export async function getAdminSession(): Promise<{ adminId: string } | null> {
  if (!isDatabaseConfigured()) return null;

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

export async function loginAdmin(password: string): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;

  const admin = await prisma.adminUser.findFirst({ orderBy: { createdAt: "asc" } });
  if (!admin) return false;

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return false;

  await createAdminSession(admin.id);
  return true;
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
