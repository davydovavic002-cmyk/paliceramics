import type { Language } from "@/types";
import type { CertificateType } from "@/lib/certificate";
import { certificateTypeMeta } from "@/lib/certificate";
import type {
  AdminPalinaStory,
  AdminVoucherContent,
  AdminWorkshopFormatCopy,
  AdminWorkshopBookingCopy,
} from "@/lib/adminContentSeeds";
import type { AdminWorkshopType } from "@/lib/adminTypes";
import type { WorkshopMkCopyBlock } from "@/lib/workshopMkCopy";
import { workshopMkFormats } from "@/lib/workshopMkCopy";
import { pickBilingual } from "@/lib/adminTypes";

export type ResolvedCertificateTypeMeta = {
  label: { pl: string; en: string };
  detailPl: string;
  detailEn: string;
  pricePln: number;
  pricePlnForTwo: number;
};

export function resolveCertificateTypes(
  voucher: AdminVoucherContent
): Record<CertificateType, ResolvedCertificateTypeMeta> {
  const fallback = certificateTypeMeta;
  const out = {} as Record<CertificateType, ResolvedCertificateTypeMeta>;

  for (const id of ["workshop-once", "pottery-course"] as CertificateType[]) {
    const admin = voucher.types.find((item) => item.id === id);
    const base = fallback[id];
    out[id] = {
      label: {
        en: admin?.label.en ?? base.label.en,
        pl: admin?.label.pl ?? base.label.pl,
      },
      detailPl: admin?.detail.pl ?? base.detailPl,
      detailEn: admin?.detail.en ?? base.detailEn,
      pricePln: admin?.pricePln ?? base.pricePln,
      pricePlnForTwo: admin?.pricePlnForTwo ?? base.pricePlnForTwo ?? base.pricePln * 2,
    };
  }

  return out;
}

export function resolveWorkshopMkFormats(
  formats: AdminWorkshopFormatCopy[],
  workshopTypes: AdminWorkshopType[]
): WorkshopMkCopyBlock[] {
  return formats.map((format) => {
    const fallback = workshopMkFormats.find((item) => item.id === format.id);
    const type = workshopTypes.find((item) => item.id === format.id);
    const pricePln = type?.pricePln ?? fallback?.pricePln ?? 0;

    return {
      id: format.id,
      title: format.title,
      teaser: format.teaser,
      paragraphs: format.paragraphs,
      priceLine: format.priceLine,
      pricePln,
    };
  });
}

export function getResolvedWorkshopMkFormat(
  id: WorkshopMkCopyBlock["id"],
  formats: AdminWorkshopFormatCopy[],
  workshopTypes: AdminWorkshopType[]
) {
  return resolveWorkshopMkFormats(formats, workshopTypes).find((format) => format.id === id);
}

export function palinaStoryForLanguage(story: AdminPalinaStory, language: Language) {
  return {
    lead: pickBilingual(story.lead, story.lead, language),
    origin: pickBilingual(story.origin, story.origin, language),
    brand: pickBilingual(story.brand, story.brand, language),
    workshops: pickBilingual(story.workshops, story.workshops, language),
    craft: pickBilingual(story.craft, story.craft, language),
    closing: pickBilingual(story.closing, story.closing, language),
    sectionLabel: pickBilingual(story.sectionLabel, story.sectionLabel, language),
    images: Object.fromEntries(
      story.images.map((img) => [
        img.id,
        {
          src: img.src,
          alt: pickBilingual(img.alt, img.alt, language),
        },
      ])
    ) as Record<
      AdminPalinaStory["images"][number]["id"],
      { src: string; alt: string }
    >,
  };
}

export function voucherSectionCopyForLanguage(
  section: AdminVoucherContent["section"],
  language: Language
) {
  return {
    eyebrow: pickBilingual(section.eyebrow, section.eyebrow, language),
    title: pickBilingual(section.title, section.title, language),
    subtitle: pickBilingual(section.subtitle, section.subtitle, language),
    recipient: pickBilingual(section.recipient, section.recipient, language),
    buyerEmail: pickBilingual(section.buyerEmail, section.buyerEmail, language),
    typeLabel: pickBilingual(section.typeLabel, section.typeLabel, language),
    participants: pickBilingual(section.participants, section.participants, language),
    participantsHint: pickBilingual(section.participantsHint, section.participantsHint, language),
    onePerson: pickBilingual(section.onePerson, section.onePerson, language),
    twoPeople: pickBilingual(section.twoPeople, section.twoPeople, language),
    submit: pickBilingual(section.submit, section.submit, language),
    flowNote: pickBilingual(section.flowNote, section.flowNote, language),
    success: pickBilingual(section.success, section.success, language),
    errRecipient: pickBilingual(section.errRecipient, section.errRecipient, language),
    errEmail: pickBilingual(section.errEmail, section.errEmail, language),
    errConsent: pickBilingual(section.errConsent, section.errConsent, language),
  };
}

export function workshopBookingCopyForLanguage(
  copy: AdminWorkshopBookingCopy,
  language: Language
) {
  return {
    sent: pickBilingual(copy.sent, copy.sent, language),
    hasVoucher: pickBilingual(copy.hasVoucher, copy.hasVoucher, language),
    voucherNumber: pickBilingual(copy.voucherNumber, copy.voucherNumber, language),
    voucherBring: pickBilingual(copy.voucherBring, copy.voucherBring, language),
    errVoucherNumber: pickBilingual(copy.errVoucherNumber, copy.errVoucherNumber, language),
  };
}
