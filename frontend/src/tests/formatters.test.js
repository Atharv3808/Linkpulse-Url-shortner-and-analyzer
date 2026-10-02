import { describe, it, expect } from "vitest";
import { formatNumber, truncateUrl, formatDate } from "../lib/formatters";

describe("Formatters Unit Tests", () => {
  it("formats numbers with comma separators", () => {
    expect(formatNumber(12842)).toBe("12,842");
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(null)).toBe("0");
  });

  it("truncates long URLs cleanly", () => {
    const longUrl = "https://example.com/very/long/path/name/to/truncate/here";
    expect(truncateUrl(longUrl, 25)).toBe("https://example.com/very/…");
    expect(truncateUrl("https://short.com", 25)).toBe("https://short.com");
  });

  it("formats ISO date strings", () => {
    const dateStr = "2026-10-01T20:00:00Z";
    expect(formatDate(dateStr)).toContain("2026");
  });
});
