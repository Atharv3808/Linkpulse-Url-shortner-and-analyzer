import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
      <Loader2 className="w-8 h-8 text-accent-purple animate-spin" />
      {text && <p className="text-xs font-medium text-txt-secondary">{text}</p>}
    </div>
  );
}
