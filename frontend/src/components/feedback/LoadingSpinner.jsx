import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ text = "LOADING SIGNAL..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
      <Loader2 className="w-8 h-8 text-[#1351AA] animate-spin" />
      {text && <p className="text-xs font-mono font-bold tracking-widest text-txt-muted uppercase">{text}</p>}
    </div>
  );
}
