import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "../ui/Button";

export function EmptyState({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "Get started by creating your first item.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed border-border-subtle rounded-xl text-center bg-bg-surface/30">
      <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center text-txt-muted mb-4 border border-border-subtle">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-txt-primary">{title}</h3>
      <p className="text-xs text-txt-secondary mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
