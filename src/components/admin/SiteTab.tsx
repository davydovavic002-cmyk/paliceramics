"use client";

import {
  HelpCircle,
  MapPin,
  MessageSquareQuote,
  Package,
  Sparkles,
  Type,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { BilingualField } from "./BilingualField";
import type {
  AdminAboutBlock,
  AdminFaqItem,
  AdminReview,
  AdminSectionCopy,
} from "@/lib/adminTypes";

const inputCls = "admin-input w-full rounded-lg px-3 py-2 text-sm";

export function SiteTab() {
  const {
    siteCopy,
    updateSectionCopy,
    updateHeroTag,
    faq,
    setFaq,
    reviews,
    setReviews,
    contacts,
    updateContacts,
    delivery,
    updateDelivery,
    aboutBlocks,
    setAboutBlocks,
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

  const addReview = () => {
    setReviews((prev) => [
      ...prev,
      {
        id: `rev-${Date.now().toString(36)}`,
        author: "Guest",
        text: { en: "Review text…", pl: "Tekst opinii…" },
        visible: true,
      },
    ]);
  };

  const addAboutBlock = () => {
    setAboutBlocks((prev) => [
      ...prev,
      {
        id: `about-${Date.now().toString(36)}`,
        title: { en: "Block title", pl: "Tytuł bloku" },
        body: { en: "Body text…", pl: "Treść…" },
      },
    ]);
  };

  return (
    <div className="space-y-8">
      <GroupHeading
        title="Headlines"
        detail="Hero tagline and section titles on the homepage."
      />

      <section className="admin-section p-3 sm:p-4">
        <div className="mb-5 flex items-center gap-2">
          <Type className="h-4 w-4 text-admin-muted" strokeWidth={1.5} />
          <div>
            <h2 className="text-base font-semibold text-admin-heading">Section headlines</h2>
            <p className="text-sm text-admin-muted">
              Eyebrow, title, and subtitle for homepage sections — EN and PL.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-admin-input bg-admin-card-muted p-4">
            <h3 className="text-sm font-medium text-admin-label">Hero tagline</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="English">
                <input
                  value={siteCopy.heroTag.en}
                  onChange={(e) => updateHeroTag("en", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Polski">
                <input
                  value={siteCopy.heroTag.pl}
                  onChange={(e) => updateHeroTag("pl", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          <SectionEditor
            title="Gallery / Collection"
            copy={siteCopy.gallery}
            onChange={(field, lang, value) => updateSectionCopy("gallery", field, lang, value)}
          />
          <SectionEditor
            title="Workshops"
            copy={siteCopy.workshops}
            onChange={(field, lang, value) => updateSectionCopy("workshops", field, lang, value)}
          />
          <SectionEditor
            title="About"
            copy={siteCopy.about}
            onChange={(field, lang, value) => updateSectionCopy("about", field, lang, value)}
          />
        </div>
      </section>

      <GroupHeading
        title="Page content"
        detail="FAQ, reviews, delivery info, contacts, and about text blocks."
      />

      <section className="admin-section p-3 sm:p-4">
        <SectionHeading
          icon={<HelpCircle className="h-4 w-4" strokeWidth={1.5} />}
          title="FAQ"
          detail="Questions & answers — shown in the FAQ section on the homepage."
        />
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

      <section className="admin-section p-3 sm:p-4">
        <SectionHeading
          icon={<MessageSquareQuote className="h-4 w-4" strokeWidth={1.5} />}
          title="Reviews"
          detail="Guest quotes — toggle visibility per card."
        />
        <div className="mt-4 space-y-4">
          {reviews.map((item, index) => (
            <ReviewEditor
              key={item.id}
              item={item}
              onChange={(next) =>
                setReviews((prev) => prev.map((r) => (r.id === item.id ? next : r)))
              }
              onRemove={() => setReviews((prev) => prev.filter((r) => r.id !== item.id))}
              canRemove={reviews.length > 1}
              index={index + 1}
            />
          ))}
          <button
            type="button"
            onClick={addReview}
            className="rounded-lg border border-dashed border-admin-input px-4 py-2 text-sm text-admin-muted hover:border-admin-accent hover:text-admin-label"
          >
            + Add review
          </button>
        </div>
      </section>

      <section className="admin-section p-3 sm:p-4">
        <SectionHeading
          icon={<Package className="h-4 w-4" strokeWidth={1.5} />}
          title="Delivery & pickup"
          detail="Studio pickup and shipping copy for Poland."
        />
        <div className="mt-4 space-y-4">
          <BilingualField
            label="Pickup title"
            en={delivery.pickupTitle.en}
            pl={delivery.pickupTitle.pl}
            onEn={(v) =>
              updateDelivery({ pickupTitle: { ...delivery.pickupTitle, en: v } })
            }
            onPl={(v) =>
              updateDelivery({ pickupTitle: { ...delivery.pickupTitle, pl: v } })
            }
          />
          <BilingualField
            label="Pickup body"
            en={delivery.pickupBody.en}
            pl={delivery.pickupBody.pl}
            onEn={(v) =>
              updateDelivery({ pickupBody: { ...delivery.pickupBody, en: v } })
            }
            onPl={(v) =>
              updateDelivery({ pickupBody: { ...delivery.pickupBody, pl: v } })
            }
            multiline
          />
          <BilingualField
            label="Shipping title"
            en={delivery.shippingTitle.en}
            pl={delivery.shippingTitle.pl}
            onEn={(v) =>
              updateDelivery({ shippingTitle: { ...delivery.shippingTitle, en: v } })
            }
            onPl={(v) =>
              updateDelivery({ shippingTitle: { ...delivery.shippingTitle, pl: v } })
            }
          />
          <BilingualField
            label="Shipping body"
            en={delivery.shippingBody.en}
            pl={delivery.shippingBody.pl}
            onEn={(v) =>
              updateDelivery({ shippingBody: { ...delivery.shippingBody, en: v } })
            }
            onPl={(v) =>
              updateDelivery({ shippingBody: { ...delivery.shippingBody, pl: v } })
            }
            multiline
          />
        </div>
      </section>

      <section className="admin-section p-3 sm:p-4">
        <SectionHeading
          icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}
          title="Contacts"
          detail="Address, hours, and links — map embed URL for Google Maps iframe."
        />
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

      <section className="admin-section p-3 sm:p-4">
        <SectionHeading
          icon={<Sparkles className="h-4 w-4" strokeWidth={1.5} />}
          title="About blocks"
          detail="Short philosophy snippets below the scrapbook collage."
        />
        <div className="mt-4 space-y-4">
          {aboutBlocks.map((item, index) => (
            <AboutBlockEditor
              key={item.id}
              item={item}
              onChange={(next) =>
                setAboutBlocks((prev) => prev.map((b) => (b.id === item.id ? next : b)))
              }
              onRemove={() =>
                setAboutBlocks((prev) => prev.filter((b) => b.id !== item.id))
              }
              canRemove={aboutBlocks.length > 1}
              index={index + 1}
            />
          ))}
          <button
            type="button"
            onClick={addAboutBlock}
            className="rounded-lg border border-dashed border-admin-input px-4 py-2 text-sm text-admin-muted hover:border-admin-accent hover:text-admin-label"
          >
            + Add block
          </button>
        </div>
      </section>
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

function SectionHeading({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-admin-muted">{icon}</span>
      <div>
        <h2 className="text-base font-semibold text-admin-heading">{title}</h2>
        <p className="text-sm text-admin-muted">{detail}</p>
      </div>
    </div>
  );
}

function SectionEditor({
  title,
  copy,
  onChange,
}: {
  title: string;
  copy: AdminSectionCopy;
  onChange: (
    field: keyof AdminSectionCopy,
    lang: "en" | "pl",
    value: string
  ) => void;
}) {
  return (
    <details className="group rounded-lg border border-admin-input bg-admin-card-muted">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-admin-label marker:content-none [&::-webkit-details-marker]:hidden">
        {title}
        <span className="ml-2 text-xs text-admin-dim group-open:hidden">— tap to expand</span>
      </summary>
      <div className="space-y-4 border-t border-admin-input px-4 py-4">
        {(["eyebrow", "title", "subtitle"] as const).map((field) => (
          <BilingualField
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            en={copy[field].en}
            pl={copy[field].pl}
            onEn={(v) => onChange(field, "en", v)}
            onPl={(v) => onChange(field, "pl", v)}
            multiline={field === "subtitle"}
          />
        ))}
      </div>
    </details>
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

function ReviewEditor({
  item,
  onChange,
  onRemove,
  canRemove,
  index,
}: {
  item: AdminReview;
  onChange: (next: AdminReview) => void;
  onRemove: () => void;
  canRemove: boolean;
  index: number;
}) {
  return (
    <details className="group relative rounded-lg border border-admin-input bg-admin-card-muted">
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
          #{index} {item.author}
          {!item.visible ? (
            <span className="ml-2 text-xs text-admin-dim">(hidden)</span>
          ) : null}
        </span>
      </summary>
      <div className="space-y-4 border-t border-admin-input px-4 py-4">
        <Field label="Author">
          <input
            value={item.author}
            onChange={(e) => onChange({ ...item, author: e.target.value })}
            className={inputCls}
          />
        </Field>
        <BilingualField
          label="Quote"
          en={item.text.en}
          pl={item.text.pl}
          onEn={(v) => onChange({ ...item, text: { ...item.text, en: v } })}
          onPl={(v) => onChange({ ...item, text: { ...item.text, pl: v } })}
          multiline
        />
        <Toggle
          label="Visible on site"
          checked={item.visible}
          onChange={(visible) => onChange({ ...item, visible })}
        />
      </div>
    </details>
  );
}

function AboutBlockEditor({
  item,
  onChange,
  onRemove,
  canRemove,
  index,
}: {
  item: AdminAboutBlock;
  onChange: (next: AdminAboutBlock) => void;
  onRemove: () => void;
  canRemove: boolean;
  index: number;
}) {
  return (
    <details className="group relative rounded-lg border border-admin-input bg-admin-card-muted">
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
          Block {index}: {item.title.en || item.title.pl}
        </span>
      </summary>
      <div className="space-y-4 border-t border-admin-input px-4 py-4">
        <BilingualField
          label="Title"
          en={item.title.en}
          pl={item.title.pl}
          onEn={(v) => onChange({ ...item, title: { ...item.title, en: v } })}
          onPl={(v) => onChange({ ...item, title: { ...item.title, pl: v } })}
        />
        <BilingualField
          label="Body"
          en={item.body.en}
          pl={item.body.pl}
          onEn={(v) => onChange({ ...item, body: { ...item.body, en: v } })}
          onPl={(v) => onChange({ ...item, body: { ...item.body, pl: v } })}
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        checked
          ? "border-[color:var(--admin-success-border)] bg-[color:var(--admin-success-bg)] text-[color:var(--admin-success-text)]"
          : "border-admin-input text-admin-muted hover:border-admin-accent",
      ].join(" ")}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          checked ? "bg-[color:var(--admin-success-text)]" : "bg-admin-dim",
        ].join(" ")}
      />
      {label}
    </button>
  );
}
