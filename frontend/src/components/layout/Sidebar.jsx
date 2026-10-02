import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Link as LinkIcon,
  FolderKanban,
  Building,
  Settings,
  Zap,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export function Sidebar({ isOpen, onClose }) {
  const { user, activeWorkspace, logout } = useAuthStore();

  const primaryNav = [
    { name: "Overview", path: "/app/dashboard", icon: LayoutDashboard },
    { name: "Links", path: "/app/links", icon: LinkIcon },
    { name: "Campaigns", path: "/app/campaigns", icon: FolderKanban },
  ];

  const secondaryNav = [
    { name: "Workspace", path: "/app/workspaces", icon: Building },
    { name: "Settings", path: "/app/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-bg-sidebar border-r border-border-subtle flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-border-subtle">
          <NavLink to="/app/dashboard" className="flex items-center space-x-2.5 group">
            <div className="w-7 h-7 rounded-md bg-accent-purple/15 border border-accent-purple/30 flex items-center justify-center text-accent-purple group-hover:border-accent-purple/50 transition-colors">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-txt-primary">
              LinkPulse
            </span>
          </NavLink>
        </div>

        {/* Workspace Quick Context */}
        <div className="p-3 border-b border-border-subtle">
          <NavLink
            to="/app/workspaces"
            onClick={onClose}
            className="p-2 bg-bg-surface hover:bg-bg-elevated border border-border-subtle rounded-lg flex items-center justify-between transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider font-medium text-txt-muted">
                Active Workspace
              </p>
              <p className="text-xs font-semibold text-txt-primary truncate">
                {activeWorkspace?.name || "Personal Workspace"}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-txt-muted group-hover:text-txt-primary shrink-0 ml-1" />
          </NavLink>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-medium text-txt-muted uppercase tracking-wider mb-2">
              Main Menu
            </p>
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-colors min-h-[36px] ${
                      isActive
                        ? "bg-bg-elevated border border-border-subtle text-txt-primary font-semibold"
                        : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-txt-muted" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="space-y-1 pt-2 border-t border-border-subtle">
            <p className="px-3 text-[10px] font-medium text-txt-muted uppercase tracking-wider mb-2">
              Management
            </p>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-colors min-h-[36px] ${
                      isActive
                        ? "bg-bg-elevated border border-border-subtle text-txt-primary font-semibold"
                        : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-txt-muted" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-border-subtle bg-bg-surface/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-bg-elevated border border-border-subtle flex items-center justify-center text-txt-secondary font-semibold text-xs">
                {user?.first_name ? user.first_name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-txt-primary truncate">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "User Account"}
                </p>
                <p className="text-[10px] text-txt-muted truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 text-txt-muted hover:text-accent-red hover:bg-accent-red/10 rounded-md transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
