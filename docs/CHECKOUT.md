# Checkout & delivery — spec (future)

> **Status:** not implemented yet. Current site uses request forms (inbox) without cart or payment.

## Goals

1. Cart → checkout with country selection.
2. **Poland:** InPost delivery at checkout; auto-calculate shipping.
3. **Outside Poland:** no automatic payment — collect address, show modal, reply by email with quote.
4. Studio fulfills ceramics orders manually until payment provider is live.

---

## Flows without payment (current / interim)

### Ceramics (shop)

1. Customer adds products to cart and submits checkout **or** sends a purchase request.
2. Order appears in admin inbox.
3. Studio emails customer about **pickup** (Warsaw, free) or **InPost delivery**.

### Workshops

1. Customer picks workshop, date/time, email.
2. Success: *«Zapytanie przyjęte. Odpiszemy w ciągu 24–48 godzin.»*
3. Studio confirms or proposes alternative slot by email.

### Workshop with voucher

- Checkbox: *«Mam voucher»* on the booking form (step 3)
- Field: voucher / certificate number (required when checked)
- Reminder: bring voucher (paper or digital) to the session

### Gift voucher purchase

- Same as workshop request flow; preview + inbox; studio replies with payment steps and final PNG.

---

## Delivery rules (Poland)

| Option | Rule |
|--------|------|
| **Studio pickup** | Warsaw, free — time agreed by email after order |
| **InPost (Poland)** | Fixed **18,45 PLN** |
| **Free shipping** | Orders **≥ 500 PLN** |

Implementation notes:

- Add `shippingPln: 18.45` constant.
- At checkout: if `country === 'PL'` and `subtotal < 500` → add 18.45 PLN to total.
- If `subtotal >= 500` → shipping line shows *Darmowa dostawa* / *Free shipping*.

---

## International delivery

- Country dropdown: full country list (ISO names).
- If `country !== 'PL'`:
  - **Block** card payment / auto-checkout (even after payment gateway is added).
  - Show modal, e.g.:

    **PL:** *«Koszt wysyłki za granicę wyceniamy indywidualnie. Podaj adres dostawy — wrócimy mailowo z opcjami i ceną.»*

    **EN:** *«International shipping is quoted individually. Enter your delivery address — we'll reply by email with options and pricing.»*

  - Collect: name, email, full address, cart summary.
  - Submit as `inbox` type `international-shipping-quote` (or extend order draft).
  - Success: *«Odpiszemy w ciągu 24–48 godzin.»*

No fixed price table abroad — US can be $30–$100+ depending on carrier.

---

## Checkout UI (planned)

```
Cart
  └─ Checkout
       ├─ Contact (email, phone optional)
       ├─ Delivery country [select]
       ├─ If PL:
       │    ├─ Pickup | InPost locker
       │    └─ Shipping line (0 or 18,45 zł)
       ├─ If not PL:
       │    └─ Modal + address form (no pay button)
       └─ Payment (PL only, when gateway ready)
```

### Payment gateway (later)

- PL only at first.
- Stripe / PayU / Przelewy24 — TBD with client.
- Order status: `pending_payment` → `paid` → `shipped`.

---

## Data model sketch

```ts
type CheckoutDraft = {
  items: { sku: string; qty: number; pricePln: number }[];
  email: string;
  country: string; // ISO 3166-1 alpha-2
  deliveryMethod?: "pickup" | "inpost";
  address?: { line1: string; city: string; postalCode: string };
  shippingPln: number;
  subtotalPln: number;
  totalPln: number;
};
```

---

## Copy tokens (reuse site-wide)

- Success reply: **PL** *«Odpiszemy w ciągu 24–48 godzin.»* / **EN** *«We'll reply within 24–48 hours.»*
- No «Palina will contact you» — neutral *we* voice.

---

## Open items for client

- [ ] Payment provider for Poland
- [ ] Exact InPost integration (locker picker widget vs manual PACZKOMAT code)
- [ ] Invoice / receipt requirements
- [ ] Which EU/non-EU countries to highlight in FAQ
