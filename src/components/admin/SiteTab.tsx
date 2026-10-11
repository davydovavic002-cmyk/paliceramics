"use client";

import { useAdminData } from "@/context/AdminDataContext";
import { BilingualField } from "./BilingualField";
import { PalinaStoryAdminSection } from "./PalinaStoryAdminSection";
import { VoucherContentAdminSection } from "./VoucherContentAdminSection";
import { SiteTextsAdminSection } from "./SiteTextsAdminSection";
import { LegalAdminSection } from "./LegalAdminSection";
import type {
  AdminFaqItem,
} from "@/lib/adminTypes";

const BLOCKS = [
  { id: "collections", label: "Collections" },
  { id: "madeToOrder", label: "Made to order" },
  { id: "vouchers", label: "Vouchers" },
  { id: "about", label: "About me" },
  { id: "faq", label: "Q&A" },
  { id: "contacts", label: "Contacts" },
  { id: "menuFooter", label: "Menu & footer" },
  { id: "legal", label: "Legal" },
];

const inputCls = "admin-input w-full rounded-lg px-3 py-2 text-sm";

export function SiteTab() {
  const {
    faq,
    setFaq,
    contacts,
    updateContacts,
    palinaStory,
    setPalinaStory,
    voucherContent,
    setVoucherContent,
    siteTexts,
    setSiteTexts,
    legal,
    setLegal,
  } = useAdminData();

  const addFaq = () => {
    setFaq((prev) => [
      ...prev,
      {
        id: `faq-${Date.now().toString(36)}`,
        question: { en: "New question", pl: "Nowe pytanie" },
        answer: { en: "Answer…", pl: "Odpowiedź…" },
      },
    ]);
  };

  return (
    <div className="space-y-8">
      <nav
        className="sticky top-0 z-10 -mx-1 flex flex-wrap gap-1.5 rounded-xl border border-admin bg-admin-card-muted/90 px-2 py-2 backdrop-blur"
        aria-label="Jump to a block of the page"
      >
        {BLOCKS.map((block, index) => (
          <button
            key={block.id}
            type="button"
            onClick={() =>
              document.getElementById(`site-${block.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="admin-toolbar-btn"
          >
            {index + 1}. {block.label}
          </button>
        ))}
      </nav>

      <p className="text-[12px] text-admin-muted">
        Blocks follow the order of the homepage, top to bottom. The Workshops block is in the Workshops tab; the hero (first screen) is edited in code.
      </p>

      <div id="site-collections" className="scroll-mt-16 space-y-4">
        <GroupHeading title="1. Collections" detail="Block under the hero. Collection tiles themselves are edited in the Catalog tab." />
        <SiteTextsAdminSection group="collections" texts={siteTexts} onChange={setSiteTexts} />
      </div>

      <div id="site-madeToOrder" className="scroll-mt-16 space-y-4">
        <GroupHeading title="2. Made to order" detail="Strip under the collections and its own page." />
        <SiteTextsAdminSection group="madeToOrder" texts={siteTexts} onChange={setSiteTexts} />
      </div>

      <div id="site-vouchers" className="scroll-mt-16 space-y-4">
        <GroupHeading title="3. Gift vouchers" detail="Voucher section — form texts and prices. The PDF layout stays fixed." />
        <VoucherContentAdminSection content={voucherContent} onChange={setVoucherContent} />
      </div>

      <div id="site-about" className="scroll-mt-16 space-y-4">
        <GroupHeading title="4. About me" detail="Three cards with photos. Wrap a phrase in **double asterisks** to make it bold." />
        <PalinaStoryAdminSection story={palinaStory} onChange={setPalinaStory} />
      </div>

      <div id="site-faq" className="scroll-mt-16 space-y-4">
        <GroupHeading title="5. Questions & answers" detail="Heading and the list of questions." />
        <SiteTextsAdminSection group="faq" texts={siteTexts} onChange={setSiteTexts} />
      <section className="admin-section p-3 sm:p-4">
        <div className="mt-4 space-y-4">
          {faq.map((item, index) => (
            <FaqEditor
              key={item.id}
              item={item}
              onChange={(next) =>
                setFaq((prev) => prev.map((f) => (f.id === item.id ? next : f)))
              }
              onRemove={() => setFaq((prev) => prev.filter((f) => f.id !== item.id))}
              canRemove={faq.length > 1}
              index={index + 1}
            />
          ))}
          <button
            type="button"
            onClick={addFaq}
            className="rounded-lg border border-dashed border-admin-input px-4 py-2 text-sm text-admin-muted hover:border-admin-accent hover:text-admin-label"
          >
            + Add question
          </button>
        </div>
      </section>
      </div>

      <div id="site-contacts" className="scroll-mt-16 space-y-4">
        <GroupHeading title="6. Contacts" detail="Address, hours and links used on the site and in the footer." />
      <section className="admin-section p-3 sm:p-4">
        <div className="mt-4 space-y-4">
          <BilingualField
            label="Address"
            en={contacts.address.en}
            pl={contacts.address.pl}
            onEn={(v) => updateContacts({ address: { ...contacts.address, en: v } })}
            onPl={(v) => updateContacts({ address: { ...contacts.address, pl: v } })}
            multiline
          />
          <BilingualField
            label="Hours"
            en={contacts.hours.en}
            pl={contacts.hours.pl}
            onEn={(v) => updateContacts({ hours: { ...contacts.hours, en: v } })}
            onPl={(v) => updateContacts({ hours: { ...contacts.hours, pl: v } })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input
                type="email"
                value={contacts.email}
                onChange={(e) => updateContacts({ email: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Instagram (handle or URL)">
              <input
                value={contacts.instagram}
                onChange={(e) => updateContacts({ instagram: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Facebook (URL)">
              <input
                value={contacts.facebook}
                onChange={(e) => updateContacts({ facebook: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="WhatsApp (number or link)">
              <input
                value={contacts.whatsapp}
                onChange={(e) => updateContacts({ whatsapp: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Map embed URL">
              <input
                value={contacts.mapEmbedUrl}
                onChange={(e) => updateContacts({ mapEmbedUrl: e.target.value })}
                className={inputCls}
                placeholder="https://maps.google.com/…&output=embed"
              />
            </Field>
          </div>
        </div>
      </section>
      </div>

      <div id="site-menuFooter" className="scroll-mt-16 space-y-4">
        <GroupHeading title="7. Menu & footer" detail="Labels of the menu and the texts at the bottom of every page." />
        <SiteTextsAdminSection group="menuFooter" texts={siteTexts} onChange={setSiteTexts} />
      </div>

      <div id="site-legal" className="scroll-mt-16 space-y-4">
        <GroupHeading title="8. Legal pages" detail="Privacy policy and shop terms (linked from the footer)." />
        <LegalAdminSection legal={legal} onChange={setLegal} />
      </div>
    </div>
  );
}

function GroupHeading({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-b border-admin pb-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-admin-label">{title}</h2>
      <p className="mt-0.5 text-sm text-admin-muted">{detail}</p>
    </div>
  );
}

function FaqEditor({
  item,
  onChange,
  onRemove,
  canRemove,
  index,
}: {
  item: AdminFaqItem;
  onChange: (next: AdminFaqItem) => void;
  onRemove: () => void;
  canRemove: boolean;
  index: number;
}) {
  return (
    <details className="group relative rounded-lg border border-admin-input bg-admin-card-muted" open>
      {canRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-3 top-3 z-10 text-xs text-admin-dim hover:text-red-400"
        >
          Remove
        </button>
      ) : null}
      <summary className="cursor-pointer list-none px-4 py-3 pr-16 text-sm font-medium text-admin-label marker:content-none [&::-webkit-details-marker]:hidden">
        <span>
          Q{index}: {item.question.en || item.question.pl || "Untitled"}
        </span>
      </summary>
      <div className="space-y-4 border-t border-admin-input px-4 py-4">
        <BilingualField
          label="Question"
          en={item.question.en}
          pl={item.question.pl}
          onEn={(v) => onChange({ ...item, question: { ...item.question, en: v } })}
          onPl={(v) => onChange({ ...item, question: { ...item.question, pl: v } })}
        />
        <BilingualField
          label="Answer"
          en={item.answer.en}
          pl={item.answer.pl}
          onEn={(v) => onChange({ ...item, answer: { ...item.answer, en: v } })}
          onPl={(v) => onChange({ ...item, answer: { ...item.answer, pl: v } })}
          multiline
        />
      </div>
    </details>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-admin-faint">{label}</span>
      {children}
    </label>
  );
}
