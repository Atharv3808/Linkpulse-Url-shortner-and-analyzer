import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { CreateLinkModal } from "../../features/links/CreateLinkModal";
import { CommandPalette } from "../ui/CommandPalette";
import { useThemeStore } from "../../store/useThemeStore";

export function ApplicationShell({ children, title }) {
  const { sidebarCollapsed, initTheme } = useThemeStore();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const cleanup = initTheme();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initTheme]);

  useEffect(() => {
    const handleOpenCommandPalette = () => setIsCommandPaletteOpen(true);
    window.addEventListener("open-command-palette", handleOpenCommandPalette);
    return () => window.removeEventListener("open-command-palette", handleOpenCommandPalette);
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark flex text-txt-primary transition-colors duration-150">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <TopNav
          title={title}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCreateLinkModal={() => setIsCreateLinkOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Quick Create Link Drawer / Modal */}
      <CreateLinkModal
        isOpen={isCreateLinkOpen}
        onClose={() => setIsCreateLinkOpen(false)}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onCreateLink={() => setIsCreateLinkOpen(true)}
      />
    </div>
  );
}
