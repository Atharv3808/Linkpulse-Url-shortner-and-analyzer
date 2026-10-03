import React, { useState } from "react";
import {
  User,
  Shield,
  Building2,
  Palette,
  Check,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function SettingsPage() {
  const { user, activeWorkspace } = useAuthStore();
  const { theme, setTheme, compactMode, setCompactMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General & Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security & API", icon: Shield },
    { id: "workspace", label: "Workspace", icon: Building2 },
  ];

  return (
    <ApplicationShell title="Settings">
      <div className="space-y-6">
        <div className="border-b border-border-subtle pb-5">
          <h2 className="text-xl font-bold text-txt-primary tracking-tight">
            Settings
          </h2>
          <p className="text-xs text-txt-secondary mt-1 max-w-xl leading-relaxed">
            Manage your personal account profile, appearance preferences, security, and active workspace settings.
          </p>
        </div>

        {/* Settings Navigation & Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sub-Navigation Sidebar */}
          <div className="w-full md:w-56 shrink-0 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                    isActive
                      ? "bg-bg-elevated text-txt-primary border border-border-subtle font-semibold shadow-xs"
                      : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                  }`}
                >
                  <Icon className="w-4 h-4 text-txt-muted shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Main Panel */}
          <div className="flex-1 space-y-6">
            {/* General & Profile */}
            {activeTab === "general" && (
              <Card>
                <CardHeader
                  title="Profile details"
                  description="Your account identity and communication preferences"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <Input
                    label="First Name"
                    defaultValue={user?.first_name || ""}
                    disabled
                  />
                  <Input
                    label="Last Name"
                    defaultValue={user?.last_name || ""}
                    disabled
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Email Address"
                      defaultValue={user?.email || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <span className="text-txt-muted uppercase text-[10px] font-semibold tracking-wider">
                      Account Registered
                    </span>
                    <p className="font-numeric text-txt-primary text-xs mt-1">
                      {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader
                    title="Theme Preference"
                    description="Choose your preferred color theme for the interface"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {/* System Option */}
                    <div
                      onClick={() => setTheme("system")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        theme === "system"
                          ? "bg-bg-elevated border-accent-purple/60 shadow-xs"
                          : "bg-bg-surface border-border-subtle hover:border-border-hover"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Laptop className="w-4 h-4 text-accent-purple" />
                          <span className="font-semibold text-xs text-txt-primary">System</span>
                        </div>
                        {theme === "system" && <Check className="w-4 h-4 text-accent-purple" />}
                      </div>
                      <p className="text-[11px] text-txt-secondary leading-relaxed">
                        Matches your operating system light/dark preference automatically.
                      </p>
                    </div>

                    {/* Light Option */}
                    <div
                      onClick={() => setTheme("light")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        theme === "light"
                          ? "bg-bg-elevated border-accent-purple/60 shadow-xs"
                          : "bg-bg-surface border-border-subtle hover:border-border-hover"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sun className="w-4 h-4 text-accent-yellow" />
                          <span className="font-semibold text-xs text-txt-primary">Light</span>
                        </div>
                        {theme === "light" && <Check className="w-4 h-4 text-accent-purple" />}
                      </div>
                      <p className="text-[11px] text-txt-secondary leading-relaxed">
                        Soft, clean high-contrast light theme.
                      </p>
                    </div>

                    {/* Dark Option */}
                    <div
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        theme === "dark"
                          ? "bg-bg-elevated border-accent-purple/60 shadow-xs"
                          : "bg-bg-surface border-border-subtle hover:border-border-hover"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Moon className="w-4 h-4 text-accent-purple" />
                          <span className="font-semibold text-xs text-txt-primary">Dark</span>
                        </div>
                        {theme === "dark" && <Check className="w-4 h-4 text-accent-purple" />}
                      </div>
                      <p className="text-[11px] text-txt-secondary leading-relaxed">
                        Deep charcoal dark mode optimized for data-dense analytics.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader
                    title="Interface Density"
                    description="Adjust the layout density of analytics metrics and tables"
                  />
                  <div className="flex items-center justify-between p-3 bg-bg-elevated/40 border border-border-subtle rounded-xl text-xs">
                    <div>
                      <p className="font-semibold text-txt-primary">Compact View</p>
                      <p className="text-txt-secondary mt-0.5">Use tighter padding for higher information density</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={compactMode}
                      onChange={(e) => setCompactMode(e.target.checked)}
                      className="w-4 h-4 rounded border-border-subtle text-accent-purple focus:ring-accent-purple/40 cursor-pointer"
                    />
                  </div>
                </Card>
              </div>
            )}

            {/* Security & API */}
            {activeTab === "security" && (
              <Card>
                <CardHeader
                  title="API & Integration Status"
                  description="Backend connectivity and deployment configuration details"
                />
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-bg-elevated/50 border border-border-subtle rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-txt-primary">API Base Endpoint</p>
                      <p className="text-txt-muted font-mono mt-0.5 text-[11px]">
                        {import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-accent-green/10 text-accent-green border border-accent-green/20 rounded-md text-[10px] font-semibold">
                      Connected
                    </span>
                  </div>

                  <div className="p-3.5 bg-bg-elevated/50 border border-border-subtle rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-txt-primary">Public Redirect Base</p>
                      <p className="text-txt-muted font-mono mt-0.5 text-[11px]">
                        {import.meta.env.VITE_PUBLIC_SHORT_URL_BASE || "http://127.0.0.1:8000"}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 rounded-md text-[10px] font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Workspace Settings */}
            {activeTab === "workspace" && (
              <Card>
                <CardHeader
                  title="Active Workspace Settings"
                  description="Metadata and configuration for your current workspace"
                />
                <div className="space-y-4 text-xs">
                  <Input
                    label="Workspace Name"
                    defaultValue={activeWorkspace?.name || "Personal Workspace"}
                    disabled
                  />
                  <div>
                    <span className="text-txt-muted uppercase text-[10px] font-semibold tracking-wider">
                      Your Permission Role
                    </span>
                    <p className="font-semibold text-txt-primary text-xs mt-1">
                      {activeWorkspace?.role || "OWNER"}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ApplicationShell>
  );
}
