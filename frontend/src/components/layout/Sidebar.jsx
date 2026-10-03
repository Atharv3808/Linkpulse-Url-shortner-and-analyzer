import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  FolderKanban,
  Building2,
  Settings,
  Zap,
  LogOut,
  User,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";

export function Sidebar({ isOpen, onClose }) {
  const { user, activeWorkspace, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapsed } = useThemeStore();

  const primaryNav = [
    { name: "Overview", path: "/app/dashboard", icon: LayoutDashboard },
    { name: "Links", path: "/app/links", icon: Link2 },
    { name: "Campaigns", path: "/app/campaigns", icon: FolderKanban },
  ];

  const secondaryNav = [
    { name: "Workspace", path: "/app/workspaces", icon: Building2 },
    { name: "Settings", path: "/app/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-bg-sidebar border-r border-border-subtle flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "lg:w-16" : "lg:w-64"} w-64`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border-subtle shrink-0">
          <NavLink
            to="/app/dashboard"
            className="flex items-center space-x-2.5 group overflow-hidden"
          >
            <div className="w-7 h-7 rounded-md bg-accent-purple/10 border border-accent-purple/25 flex items-center justify-center text-accent-purple group-hover:border-accent-purple/50 transition-colors shrink-0">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-sm tracking-tight text-txt-primary">
                LinkPulse
              </span>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="hidden lg:flex p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-md transition-colors"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Workspace Quick Context */}
        {!sidebarCollapsed && (
          <div className="p-3 border-b border-border-subtle">
            <NavLink
              to="/app/workspaces"
              onClick={onClose}
              className="p-2.5 bg-bg-surface hover:bg-bg-elevated border border-border-subtle rounded-lg flex items-center justify-between transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-txt-muted">
                  Workspace
                </p>
                <p className="text-xs font-semibold text-txt-primary truncate mt-0.5">
                  {activeWorkspace?.name || "Personal Workspace"}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-txt-muted group-hover:text-txt-primary shrink-0 ml-1" />
            </NavLink>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main Workspace Section */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] font-semibold text-txt-muted uppercase tracking-wider mb-2">
                Workspace
              </p>
            )}
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 min-h-[36px] ${
                      sidebarCollapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-bg-elevated border border-border-subtle text-txt-primary font-semibold shadow-xs"
                        : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-txt-muted" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </div>

          {/* Management Section */}
          <div className="space-y-1 pt-2 border-t border-border-subtle">
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] font-semibold text-txt-muted uppercase tracking-wider mb-2">
                Management
              </p>
            )}
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 min-h-[36px] ${
                      sidebarCollapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-bg-elevated border border-border-subtle text-txt-primary font-semibold shadow-xs"
                        : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-txt-muted" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-border-subtle bg-bg-surface/50 shrink-0">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-accent-purple/15 text-accent-purple border border-accent-purple/30 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.first_name ? user.first_name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-txt-primary truncate">
                    {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "User Account"}
                  </p>
                  <p className="text-[10px] text-txt-muted truncate">{user?.email}</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={logout}
                title="Log out"
                className="p-1.5 text-txt-muted hover:text-accent-red hover:bg-accent-red/10 rounded-md transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
