import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "../ui/Button";

export function EmptyState({
  icon: Icon = FolderOpen,
  title = "NO DATA FOUND",
  description = "Get started by creating your first item.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-border-subtle rounded-none text-center bg-bg-surface">
      <div className="w-12 h-12 rounded-none bg-bg-elevated flex items-center justify-center text-txt-muted mb-4 border border-border-subtle">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h3 className="text-sm font-black uppercase tracking-tight text-txt-primary">{title}</h3>
      <p className="text-xs font-mono text-txt-muted mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
