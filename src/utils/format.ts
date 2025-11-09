/**
 * Formats a number as currency using Intl.NumberFormat
 * Falls back to a simple format if Intl fails
 */

const getLocaleByCurrency = (currency?: string | null): string => {
  switch (currency) {
    case "KHR":
      return "km-KH";
    case "USD":
      return "en-US";
    case "EUR":
      return "de-DE";
    case "JPY":
      return "ja-JP";
    default:
      return "en-US";
  }
};

export const formatCurrency = (
  amount: number,
  currency?: string | null,
  locale?: string
): string => {
  try {
    const _locale = locale ?? getLocaleByCurrency(currency);
    return new Intl.NumberFormat(_locale, {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  } catch {
    return `${currency || "USD"} ${amount.toFixed(2)}`;
  }
};
