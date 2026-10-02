import { useState } from "react";
import { toast } from "sonner";

export function useCopy() {
  const [copiedText, setCopiedText] = useState(null);

  const copy = async (text, label = "Short URL") => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedText(null), 2000);
      return true;
    } catch (err) {
      toast.error("Failed to copy to clipboard.");
      return false;
    }
  };

  return { copy, copiedText };
}
