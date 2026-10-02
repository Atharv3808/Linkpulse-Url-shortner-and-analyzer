import React from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "../ui/Button";

export function TopNav({ onOpenMobileSidebar, onOpenCreateLinkModal, title }) {
  return (
    <header className="h-14 bg-bg-sidebar/90 backdrop-blur-md border-b border-border-subtle sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-1.5 text-txt-secondary hover:text-txt-primary lg:hidden rounded-md hover:bg-bg-elevated"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-sm font-semibold text-txt-primary tracking-tight">
          {title || "Overview"}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          onClick={onOpenCreateLinkModal}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Create link
        </Button>
      </div>
    </header>
  );
}
