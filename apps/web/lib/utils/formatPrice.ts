export function formatPrice(
  amountInCents: number,
  locale = "sv",
  currency: "SEK" | "EUR" = "SEK"
) {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat(locale === "sv" ? "sv-SE" : "en-SE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
