export const CERTIFICATE_TYPES = ["workshop-once", "pottery-course"] as const;

export type CertificateType = (typeof CERTIFICATE_TYPES)[number];

export type CertificateDraft = {
  type: CertificateType;
  recipientName: string;
  buyerEmail: string;
  /** 1 or 2 participants — price ×2 for two people. */
  participantCount: 1 | 2;
};

export const VOUCHER_COLORS = {
  paper: "#FAF7F0",
  ink: "#1B2B5A",
  clay: "#C4A882",
} as const;

export const certificateTypeMeta: Record<
  CertificateType,
  {
    template: string;
    titlePl: string[];
    titleEn: string[];
    detailPl: string;
    detailEn: string;
    pricePln: number;
    /** Voucher for two participants (price × 2). */
    pricePlnForTwo?: number;
    label: { pl: string; en: string };
  }
> = {
  "workshop-once": {
    template: "/images/vouchers/templates/workshop-once-template.png",
    titlePl: ["na jednorazowy warsztat", "z toczenia na kole", "garncarskim"],
    titleEn: ["for a one-time", "pottery wheel", "workshop"],
    detailPl: "( 2,5 godziny )",
    detailEn: "( 2.5 hours )",
    pricePln: 350,
    pricePlnForTwo: 700,
    label: { pl: "Warsztat jednorazowy", en: "One-time workshop" },
  },
  "pottery-course": {
    template: "/images/vouchers/templates/pottery-course-template.png",
    titlePl: ["na indywidualny kurs", "toczenia na kole", "garncarskim"],
    titleEn: ["for an individual", "pottery wheel", "course"],
    detailPl: "3 zajęcia (6 godz.)",
    detailEn: "3 classes (6 hrs)",
    pricePln: 850,
    pricePlnForTwo: 1700,
    label: { pl: "Kurs indywidualny", en: "Individual course" },
  },
};

export function certificateRecipientLine(
  draft: CertificateDraft,
  language: "en" | "pl"
): string {
  const name = draft.recipientName.trim();

  if (draft.participantCount === 2) {
    if (name && draft.type === "workshop-once") {
      return language === "pl" ? `dla ${name} · 2 osoby` : `for ${name} · 2 people`;
    }
    return language === "pl" ? "dla 2 osób" : "for 2 people";
  }

  if (name) {
    return language === "pl" ? `dla ${name}` : `for ${name}`;
  }

  return language === "pl" ? "dla 1 osoby" : "for 1 person";
}

export function getCertificatePrice(
  draft: Pick<CertificateDraft, "type" | "participantCount">,
  pricing?: Pick<typeof certificateTypeMeta[CertificateType], "pricePln" | "pricePlnForTwo">
): number {
  const meta = pricing ?? certificateTypeMeta[draft.type];
  if (draft.participantCount === 2) {
    return meta.pricePlnForTwo ?? meta.pricePln * 2;
  }
  return meta.pricePln;
}

export function certificateNominalNote(
  draft: Pick<CertificateDraft, "type" | "participantCount">,
  language: "en" | "pl",
  pricing?: Pick<typeof certificateTypeMeta[CertificateType], "pricePln" | "pricePlnForTwo">
): string | null {
  if (draft.participantCount !== 2) return null;
  const meta = pricing ?? certificateTypeMeta[draft.type];
  const total = meta.pricePlnForTwo ?? meta.pricePln * 2;
  return language === "pl"
    ? `${meta.pricePln} zł × 2 osoby = ${total} zł`
    : `${meta.pricePln} PLN × 2 people = ${total} PLN`;
}

export function formatNominalPln(value: number, language: "en" | "pl"): string {
  return new Intl.NumberFormat(language === "pl" ? "pl-PL" : "en-GB", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}

export type VoucherOverlayRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

/** Pixel-perfect overlays measured from client PDF exports (3496×2480). */
export const voucherTemplateLayout: Record<
  CertificateType,
  { src: string; recipient: VoucherOverlayRect; dateValue: VoucherOverlayRect }
> = {
  "workshop-once": {
    src: "/images/vouchers/templates/workshop-once-template.png",
    recipient: { top: 0.272, left: 0.405, width: 0.19, height: 0.038 },
    dateValue: { top: 0.928, left: 0.062, width: 0.12, height: 0.028 },
  },
  "pottery-course": {
    src: "/images/vouchers/templates/pottery-course-template.png",
    recipient: { top: 0.286, left: 0.405, width: 0.19, height: 0.038 },
    dateValue: { top: 0.928, left: 0.062, width: 0.12, height: 0.028 },
  },
};

function overlayToPx(rect: VoucherOverlayRect, width: number, height: number) {
  return {
    x: rect.left * width,
    y: rect.top * height,
    w: rect.width * width,
    h: rect.height * height,
  };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function spacedLine(text: string): string {
  return text.split("").join(" ");
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterGap: number
) {
  const chars = text.split("");
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((sum, w) => sum + w, 0) + letterGap * (chars.length - 1);
  let cursor = x - total / 2;
  for (let i = 0; i < chars.length; i += 1) {
    ctx.fillText(chars[i], cursor + widths[i] / 2, y);
    cursor += widths[i] + letterGap;
  }
}

export async function generateCertificatePng(
  draft: CertificateDraft,
  language: "en" | "pl",
  purchaseDate?: string | null
): Promise<Blob> {
  const layout = voucherTemplateLayout[draft.type];
  const width = 3496;
  const height = 2480;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const template = await loadImage(layout.src);
  ctx.drawImage(template, 0, 0, width, height);

  const recipientLine = certificateRecipientLine(draft, language);
  const recipientBox = overlayToPx(layout.recipient, width, height);

  ctx.fillStyle = VOUCHER_COLORS.paper;
  ctx.fillRect(recipientBox.x, recipientBox.y, recipientBox.w, recipientBox.h);

  ctx.fillStyle = VOUCHER_COLORS.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '600 58px "Segoe UI", Arial, sans-serif';
  drawSpacedText(
    ctx,
    spacedLine(recipientLine),
    recipientBox.x + recipientBox.w / 2,
    recipientBox.y + recipientBox.h / 2,
    8
  );

  const dateValue =
    purchaseDate?.trim() && !Number.isNaN(new Date(purchaseDate).getTime())
      ? new Intl.DateTimeFormat(language === "pl" ? "pl-PL" : "en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(purchaseDate))
      : null;

  if (dateValue) {
    const dateBox = overlayToPx(layout.dateValue, width, height);
    ctx.fillStyle = VOUCHER_COLORS.paper;
    ctx.fillRect(dateBox.x, dateBox.y, dateBox.w, dateBox.h);
    ctx.fillStyle = VOUCHER_COLORS.ink;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = '400 44px "Segoe UI", Arial, sans-serif';
    ctx.fillText(dateValue, dateBox.x, dateBox.y + dateBox.h / 2);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to export certificate"));
      },
      "image/png",
      1
    );
  });
}

export function certificateFilename(recipientName: string, type: CertificateType): string {
  const slug = recipientName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `pali-voucher-${type}-${slug || "gift"}.png`;
}
