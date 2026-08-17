const VOUCHER_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateVoucherCode(): string {
  const year = new Date().getFullYear();
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += VOUCHER_ALPHABET[Math.floor(Math.random() * VOUCHER_ALPHABET.length)];
  }
  return `PALI-${suffix}-${year}`;
}
