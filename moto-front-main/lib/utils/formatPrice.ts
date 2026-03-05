export function formatPrice(amount: number, locale = "sv") {
  return new Intl.NumberFormat(locale === "sv" ? "sv-SE" : "en-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
