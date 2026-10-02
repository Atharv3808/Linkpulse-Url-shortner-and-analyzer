import React, { useState } from "react";
import { User, Shield, Building, Palette, Key, Database, Check } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function SettingsPage() {
  const { user, activeWorkspace } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "workspace", label: "Workspace", icon: Building },
    { id: "security", label: "Security & API", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <ApplicationShell title="Settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-txt-primary tracking-tight">Settings</h2>
          <p className="text-xs text-txt-secondary mt-0.5">
            Manage your personal profile, active workspace settings, and preferences.
          </p>
        </div>

        {/* Desktop Left-Side Nav Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings Sub-Navigation */}
          <div className="w-full md:w-56 shrink-0 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? "bg-bg-elevated text-txt-primary border border-border-subtle font-semibold"
                      : "text-txt-secondary hover:text-txt-primary hover:bg-bg-surface"
                  }`}
                >
                  <Icon className="w-4 h-4 text-txt-muted shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Main Content Area */}
          <div className="flex-1 space-y-6">
            {activeTab === "profile" && (
              <Card>
                <CardHeader
                  title="Profile details"
                  description="Your account identity and communication details"
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
                    <span className="text-txt-muted uppercase text-[10px] font-medium tracking-wider">
                      Account Registered
                    </span>
                    <p className="font-numeric text-txt-primary text-xs mt-1">
                      {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "workspace" && (
              <Card>
                <CardHeader
                  title="Active Workspace Settings"
                  description="Configuration for your current workspace"
                />
                <div className="space-y-4 text-xs">
                  <Input
                    label="Workspace Name"
                    defaultValue={activeWorkspace?.name || "Personal Workspace"}
                    disabled
                  />
                  <div>
                    <span className="text-txt-muted uppercase text-[10px] font-medium tracking-wider">
                      Your Permission Role
                    </span>
                    <p className="font-semibold text-txt-primary text-xs mt-1">
                      {activeWorkspace?.role || "OWNER"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader
                  title="API & Integration Status"
                  description="Backend endpoint connectivity and environment config"
                />
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-bg-elevated/50 border border-border-subtle rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-txt-primary">API Base Endpoint</p>
                      <p className="text-txt-muted font-mono mt-0.5 text-[11px]">
                        {import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-accent-green/10 text-accent-green border border-accent-green/20 rounded text-[10px] font-medium">
                      Connected
                    </span>
                  </div>

                  <div className="p-3 bg-bg-elevated/50 border border-border-subtle rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-txt-primary">Public Redirect Base</p>
                      <p className="text-txt-muted font-mono mt-0.5 text-[11px]">
                        {import.meta.env.VITE_PUBLIC_SHORT_URL_BASE || "http://127.0.0.1:8000"}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 rounded text-[10px] font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader
                  title="Theme & Visual Appearance"
                  description="Theme choices and workspace presentation"
                />
                <div className="p-4 border border-border-subtle rounded-lg bg-bg-elevated/30 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-txt-primary">Dark Theme</p>
                    <p className="text-txt-secondary mt-0.5">High-contrast dark theme optimized for analytics readability</p>
                  </div>
                  <span className="text-xs font-semibold text-accent-purple flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Enabled</span>
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ApplicationShell>
  );
}
