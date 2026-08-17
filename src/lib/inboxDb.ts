import type { InboxSubmitBody } from "@/lib/inboxServer";
import { prisma } from "@/lib/db";
import { generateVoucherCode } from "@/lib/voucherCode";

export class InboxPersistError extends Error {
  code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
  }
}

async function uniqueVoucherCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateVoucherCode();
    const exists = await prisma.inboxMessage.findUnique({ where: { voucherCode: code } });
    if (!exists) return code;
  }
  throw new InboxPersistError("VOUCHER_CODE_FAILED");
}

export async function persistInboxMessage(message: InboxSubmitBody) {
  if (message.type === "booking") {
    const slotId = message.payload.slotId?.trim();
    if (!slotId) throw new InboxPersistError("SLOT_REQUIRED");

    return prisma.$transaction(async (tx) => {
      const slot = await tx.workshopSlot.findUnique({ where: { id: slotId } });
      if (!slot || !slot.available || slot.spots <= 0) {
        throw new InboxPersistError("SLOT_UNAVAILABLE");
      }

      const nextSpots = slot.spots - 1;
      await tx.workshopSlot.update({
        where: { id: slotId },
        data: {
          spots: nextSpots,
          available: nextSpots > 0,
        },
      });

      const record = await tx.inboxMessage.create({
        data: {
          type: message.type,
          payload: message.payload,
          status: "pending",
        },
      });

      return { id: record.id, voucherCode: null as string | null };
    });
  }

  let voucherCode: string | null = null;
  if (message.type === "certificate") {
    voucherCode = await uniqueVoucherCode();
  }

  const record = await prisma.inboxMessage.create({
    data: {
      type: message.type,
      payload: message.payload,
      voucherCode,
      status: "pending",
    },
  });

  return { id: record.id, voucherCode };
}

export async function listInboxMessages() {
  return prisma.inboxMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function updateInboxMessage(
  id: string,
  data: { read?: boolean; status?: string }
) {
  return prisma.inboxMessage.update({
    where: { id },
    data,
  });
}
