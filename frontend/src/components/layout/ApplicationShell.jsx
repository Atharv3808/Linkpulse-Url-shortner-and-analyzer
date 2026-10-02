import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { CreateLinkModal } from "../../features/links/CreateLinkModal";

export function ApplicationShell({ children, title }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-dark flex text-txt-primary">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopNav
          title={title}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateLinkModal={() => setIsCreateLinkOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Quick Create Link Modal */}
      <CreateLinkModal
        isOpen={isCreateLinkOpen}
        onClose={() => setIsCreateLinkOpen(false)}
      />
    </div>
  );
}
