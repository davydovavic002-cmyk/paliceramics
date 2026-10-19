import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";

/**
 * File-based storage for admin content on the VPS (no database needed).
 * Lives OUTSIDE .next, so redeploys never wipe it. Override with PALI_DATA_DIR.
 */
export function dataDir(): string {
  const custom = process.env.PALI_DATA_DIR?.trim();
  return custom ? path.resolve(custom) : path.join(process.cwd(), "data");
}

const contentFile = () => path.join(dataDir(), "admin-data.json");
const uploadsDir = () => path.join(dataDir(), "uploads");

export const MAX_CONTENT_BYTES = 3_000_000;
export const MAX_UPLOAD_BYTES = 6_000_000;

export type StoredContent = {
  data: Record<string, unknown>;
  updatedAt: string;
};

export async function readContent(): Promise<StoredContent | null> {
  try {
    const raw = await fs.readFile(contentFile(), "utf8");
    const parsed = JSON.parse(raw) as StoredContent;
    if (!parsed || typeof parsed !== "object" || typeof parsed.data !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function writeContent(data: Record<string, unknown>): Promise<StoredContent> {
  await fs.mkdir(dataDir(), { recursive: true });
  const stored: StoredContent = { data, updatedAt: new Date().toISOString() };
  const tmp = `${contentFile()}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(stored), "utf8");
  await fs.rename(tmp, contentFile());
  return stored;
}

export class ContentConflictError extends Error {
  constructor() {
    super("CONFLICT");
  }
}

/** One content write at a time, so the check below and the write cannot interleave. */
let writeQueue: Promise<unknown> = Promise.resolve();

/**
 * Saves the content only if the caller saw the latest version.
 * baseUpdatedAt: "" = the caller saw no file yet, undefined = no check (old clients).
 */
export function writeContentChecked(
  data: Record<string, unknown>,
  baseUpdatedAt: string | undefined
): Promise<StoredContent> {
  const job = async () => {
    if (baseUpdatedAt !== undefined) {
      const current = await readContent();
      if ((current?.updatedAt ?? "") !== baseUpdatedAt) throw new ContentConflictError();
    }
    return writeContent(data);
  };
  const run = writeQueue.then(job, job);
  writeQueue = run.catch(() => undefined);
  return run;
}

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export function extForMime(mime: string): string | null {
  return EXT_BY_MIME[mime.toLowerCase()] ?? null;
}

export async function saveUpload(bytes: Buffer, ext: string): Promise<string> {
  await fs.mkdir(uploadsDir(), { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(5).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(uploadsDir(), name), bytes);
  return name;
}

const SAFE_NAME = /^[a-z0-9-]+\.(jpg|png|webp|gif)$/;

export async function readUpload(
  name: string
): Promise<{ bytes: Buffer; mime: string } | null> {
  if (!SAFE_NAME.test(name)) return null;
  try {
    const bytes = await fs.readFile(path.join(uploadsDir(), name));
    const ext = name.split(".").pop() ?? "";
    return { bytes, mime: MIME_BY_EXT[ext] ?? "application/octet-stream" };
  } catch {
    return null;
  }
}

/** Public copy of content: customer messages never leave the admin. */
export function publicContent(data: Record<string, unknown>): Record<string, unknown> {
  const { inbox: _inbox, ...rest } = data;
  void _inbox;
  return { ...rest, inbox: [] };
}
