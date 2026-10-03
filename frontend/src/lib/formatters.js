export function formatNumber(num) {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatCompactNumber(num) {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

export function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function truncateUrl(url, maxLength = 45) {
  if (!url) return "";
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "…";
}

export function formatShortUrl(shortUrl, shortCode) {
  const defaultBase = import.meta.env.VITE_PUBLIC_SHORT_URL_BASE || "https://linkpulse-api-iibx.onrender.com";
  const cleanBase = defaultBase.replace(/\/$/, "");

  if (shortUrl && !shortUrl.includes("localhost") && !shortUrl.includes("127.0.0.1")) {
    return shortUrl;
  }
  if (shortCode) {
    return `${cleanBase}/${shortCode}`;
  }
  return shortUrl || cleanBase;
}
