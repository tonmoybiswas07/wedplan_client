export function stripeMoney(amount: number, currency: string) {
  const format = new Intl.NumberFormat("en-BD", { style: "currency", currency, currencyDisplay: "code" });
  // Stripe represents ISK and UGX charges in two-decimal units for compatibility.
  const units = ["isk", "ugx"].includes(currency.toLowerCase()) ? 2 : format.resolvedOptions().maximumFractionDigits ?? 2;
  return format.format(amount / 10 ** units);
}
