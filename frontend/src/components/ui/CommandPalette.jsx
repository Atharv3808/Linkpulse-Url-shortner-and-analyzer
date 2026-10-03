import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  Link2,
  FolderKanban,
  Building2,
  Settings,
  Plus,
  Sun,
  Moon,
  Laptop,
  Command,
  X,
} from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

export function CommandPalette({ isOpen, onClose, onCreateLink }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via document event or parent handler
          window.dispatchEvent(new CustomEvent("open-command-palette"));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    {
      group: "Navigation",
      options: [
        {
          id: "nav-overview",
          title: "Go to Overview",
          icon: LayoutDashboard,
          action: () => {
            navigate("/app/dashboard");
            onClose();
          },
        },
        {
          id: "nav-links",
          title: "Go to Links",
          icon: Link2,
          action: () => {
            navigate("/app/links");
            onClose();
          },
        },
        {
          id: "nav-campaigns",
          title: "Go to Campaigns",
          icon: FolderKanban,
          action: () => {
            navigate("/app/campaigns");
            onClose();
          },
        },
        {
          id: "nav-workspaces",
          title: "Go to Workspaces",
          icon: Building2,
          action: () => {
            navigate("/app/workspaces");
            onClose();
          },
        },
        {
          id: "nav-settings",
          title: "Go to Settings",
          icon: Settings,
          action: () => {
            navigate("/app/settings");
            onClose();
          },
        },
      ],
    },
    {
      group: "Actions",
      options: [
        {
          id: "action-create-link",
          title: "Create Short Link",
          icon: Plus,
          action: () => {
            onClose();
            if (onCreateLink) onCreateLink();
          },
        },
      ],
    },
    {
      group: "Appearance",
      options: [
        {
          id: "theme-system",
          title: "Use System Theme",
          icon: Laptop,
          action: () => {
            setTheme("system");
            onClose();
          },
        },
        {
          id: "theme-light",
          title: "Switch to Light Theme",
          icon: Sun,
          action: () => {
            setTheme("light");
            onClose();
          },
        },
        {
          id: "theme-dark",
          title: "Switch to Dark Theme",
          icon: Moon,
          action: () => {
            setTheme("dark");
            onClose();
          },
        },
      ],
    },
  ];

  const filteredGroups = items
    .map((group) => ({
      ...group,
      options: group.options.filter((opt) =>
        opt.title.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((group) => group.options.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-bg-surface border border-border-subtle rounded-xl shadow-popover overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-border-subtle">
          <Search className="w-4 h-4 text-txt-muted mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-txt-primary text-xs focus:outline-none placeholder:text-txt-muted"
          />
          <span className="text-[10px] font-mono text-txt-muted bg-bg-elevated border border-border-subtle px-1.5 py-0.5 rounded mr-2">
            ESC
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-txt-muted hover:text-txt-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {filteredGroups.length === 0 ? (
            <p className="text-xs text-txt-muted text-center py-6">
              No matching commands found.
            </p>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="text-[10px] font-semibold text-txt-muted uppercase tracking-wider px-2 py-1">
                  {group.group}
                </div>
                {group.options.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={opt.action}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-xs rounded-lg text-txt-secondary hover:text-txt-primary hover:bg-bg-elevated transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-txt-muted shrink-0" />
                      <span className="flex-1 font-medium">{opt.title}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
