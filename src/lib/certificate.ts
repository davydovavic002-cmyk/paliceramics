export const CERTIFICATE_TYPES = ["workshop-once", "pottery-course"] as const;

export type CertificateType = (typeof CERTIFICATE_TYPES)[number];

export type CertificateDraft = {
  type: CertificateType;
  recipientName: string;
  buyerEmail: string;
  /** One-time workshop voucher only — 1 or 2 participants. */
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
    /** One-time workshop voucher for two participants (price × 2). */
    pricePlnForTwo?: number;
    label: { pl: string; en: string };
  }
> = {
  "workshop-once": {
    template: "/images/vouchers/workshop-once.png",
    titlePl: ["na jednorazowy warsztat", "z toczenia na kole", "garncarskim"],
    titleEn: ["for a one-time", "pottery wheel", "workshop"],
    detailPl: "( 2,5 godziny )",
    detailEn: "( 2.5 hours )",
    pricePln: 350,
    pricePlnForTwo: 700,
    label: { pl: "Warsztat jednorazowy", en: "One-time workshop" },
  },
  "pottery-course": {
    template: "/images/vouchers/pottery-course.png",
    titlePl: ["na indywidualny kurs", "toczenia na kole", "garncarskim"],
    titleEn: ["for an individual", "pottery wheel", "course"],
    detailPl: "2 zajęcia (4 godz.)",
    detailEn: "2 classes (4 hrs)",
    pricePln: 850,
    label: { pl: "Kurs indywidualny", en: "Individual course" },
  },
};

export function certificateRecipientLine(
  draft: CertificateDraft,
  language: "en" | "pl"
): string {
  const name = draft.recipientName.trim();

  if (draft.type === "workshop-once" && draft.participantCount === 2) {
    if (name) {
      return language === "pl" ? `dla ${name} · 2 osoby` : `for ${name} · 2 people`;
    }
    return language === "pl" ? "dla 2 osób" : "for 2 people";
  }

  if (name) {
    return language === "pl" ? `dla ${name}` : `for ${name}`;
  }

  return language === "pl" ? "dla 1 osoby" : "for 1 person";
}

export function getCertificatePrice(draft: Pick<CertificateDraft, "type" | "participantCount">): number {
  const meta = certificateTypeMeta[draft.type];
  if (draft.type === "workshop-once" && draft.participantCount === 2) {
    return meta.pricePlnForTwo ?? meta.pricePln * 2;
  }
  return meta.pricePln;
}

export function certificateNominalNote(
  draft: Pick<CertificateDraft, "type" | "participantCount">,
  language: "en" | "pl"
): string | null {
  if (draft.type !== "workshop-once" || draft.participantCount !== 2) return null;
  const meta = certificateTypeMeta["workshop-once"];
  return language === "pl"
    ? `${meta.pricePln} zł × 2 osoby = ${meta.pricePlnForTwo ?? meta.pricePln * 2} zł`
    : `${meta.pricePln} PLN × 2 people = ${meta.pricePlnForTwo ?? meta.pricePln * 2} PLN`;
}

export function formatNominalPln(value: number, language: "en" | "pl"): string {
  return new Intl.NumberFormat(language === "pl" ? "pl-PL" : "en-GB", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
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

function drawWrappedLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number
) {
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateCertificatePng(
  draft: CertificateDraft,
  language: "en" | "pl",
  purchaseDate?: string | null
): Promise<Blob> {
  const meta = certificateTypeMeta[draft.type];
  const width = 1748;
  const height = 1240;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.fillStyle = VOUCHER_COLORS.paper;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = VOUCHER_COLORS.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(72, height - 72);
  ctx.lineTo(width - 72, height - 72);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = VOUCHER_COLORS.ink;

  ctx.font = '400 22px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = "left";
  ctx.fillText("@pali.ceramics", 72, 88);

  ctx.textAlign = "center";
  ctx.font = '400 34px Georgia, "Times New Roman", serif';
  ctx.fillText("[ V O U C H E R ]", width / 2, 92);

  try {
    const logo = await loadImage("/images/brand/pali-logo-circle.png");
    const logoSize = 92;
    ctx.drawImage(logo, width - 72 - logoSize, 44, logoSize, logoSize);
  } catch {
    ctx.beginPath();
    ctx.arc(width - 116, 90, 46, 0, Math.PI * 2);
    ctx.fillStyle = VOUCHER_COLORS.ink;
    ctx.fill();
  }

  const titleLines = language === "pl" ? meta.titlePl : meta.titleEn;
  ctx.font = '400 28px "Segoe UI", Arial, sans-serif';
  let titleY = 200;
  for (const line of titleLines) {
    drawSpacedText(ctx, spacedLine(line), width / 2, titleY, 5);
    titleY += 52;
  }

  ctx.font = '400 24px "Segoe UI", Arial, sans-serif';
  const detail = language === "pl" ? meta.detailPl : meta.detailEn;
  drawSpacedText(ctx, spacedLine(detail), width / 2, titleY + 20, 4);

  const recipientLine = certificateRecipientLine(draft, language);

  ctx.font = '600 30px "Segoe UI", Arial, sans-serif';
  drawSpacedText(ctx, spacedLine(recipientLine), width / 2, titleY + 86, 5);

  const artTop = titleY + 150;
  const artW = 300;

  try {
    const art = await loadImage("/images/hero/ceramics-collage-cutout.png");
    const artH = (art.height / art.width) * artW;
    ctx.drawImage(art, width / 2 - artW / 2, artTop, artW, artH);

    try {
      const qr = await loadImage("/images/vouchers/instagram-qr.png");
      const qrSize = 132;
      const qrY = artTop + artH / 2 - qrSize / 2 - 28;
      ctx.drawImage(qr, 72, qrY, qrSize, qrSize);
    } catch {
      /* qr optional */
    }
  } catch {
    try {
      const qr = await loadImage("/images/vouchers/instagram-qr.png");
      ctx.drawImage(qr, 72, artTop, 132, 132);
    } catch {
      /* qr optional */
    }
  }

  const footerTop = height - 250;
  const leftX = 72;
  const rightX = width * 0.52;
  const rightMaxWidth = width - rightX - 72;

  ctx.textAlign = "left";
  ctx.fillStyle = VOUCHER_COLORS.ink;

  const dateLabel = language === "pl" ? "data zakupu:" : "purchase date:";
  const dateValue =
    purchaseDate?.trim() && !Number.isNaN(new Date(purchaseDate).getTime())
      ? new Intl.DateTimeFormat(language === "pl" ? "pl-PL" : "en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(purchaseDate))
      : "[ DD / MM / YYYY ]";

  ctx.font = '400 16px "Segoe UI", Arial, sans-serif';
  ctx.fillText(dateLabel, leftX, footerTop);
  ctx.font = '400 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText(dateValue, leftX, footerTop + 30);

  ctx.font = '400 15px "Segoe UI", Arial, sans-serif';
  const terms =
    language === "pl"
      ? [
          "• voucher jest ważny przez 3 miesięcy od daty zakupu.",
          "• umówienie się na zajęcia przez maila:",
          "palipali.ceramic@gmail.com",
          "lub poprzez DM na instagramie",
          "@pali.ceramics",
        ]
      : [
          "• voucher is valid for 3 months from the purchase date.",
          "• book a session by email:",
          "palipali.ceramic@gmail.com",
          "or via Instagram DM",
          "@pali.ceramics",
        ];

  let termsY = footerTop;
  for (const paragraph of terms) {
    const wrapped = wrapText(ctx, paragraph, rightMaxWidth);
    drawWrappedLines(ctx, wrapped, rightX, termsY, 22);
    termsY += wrapped.length * 22 + 8;
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
