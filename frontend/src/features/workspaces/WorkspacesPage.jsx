import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Users, Trash2, UserPlus, Check } from "lucide-react";
import { workspacesApi } from "../../api/workspaces.api";
import { queryKeys } from "../../lib/queryKeys";
import { useAuthStore } from "../../store/useAuthStore";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { CardSkeleton, TableSkeleton } from "../../components/ui/Skeleton";
import { AddMemberModal } from "./AddMemberModal";

export function WorkspacesPage() {
  const queryClient = useQueryClient();
  const { activeWorkspace, setActiveWorkspace } = useAuthStore();
  const [selectedWsForMember, setSelectedWsForMember] = useState(null);

  const { data: workspacesRes, isLoading: isWsLoading } = useQuery({
    queryKey: queryKeys.workspaces.all(),
    queryFn: () => workspacesApi.list(),
  });

  const activeWsId = activeWorkspace?.id || workspacesRes?.data?.results?.[0]?.id;

  const { data: membersRes, isLoading: isMembersLoading } = useQuery({
    queryKey: queryKeys.workspaces.members(activeWsId),
    queryFn: () => workspacesApi.getMembers(activeWsId),
    enabled: !!activeWsId,
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ wsId, memberId }) => workspacesApi.removeMember(wsId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });

  const workspaces = workspacesRes?.data?.results || [];
  const members = membersRes?.data || [];

  return (
    <ApplicationShell title="Workspace">
      <div className="space-y-6">
        <div className="border-b border-border-subtle pb-5">
          <h2 className="text-xl font-bold text-txt-primary tracking-tight">
            Workspaces & Team
          </h2>
          <p className="text-xs text-txt-secondary mt-1 max-w-xl leading-relaxed">
            Switch active workspace context or manage team member access and permissions.
          </p>
        </div>

        {/* Workspace Selector Grid */}
        <Card>
          <CardHeader
            title="Available workspaces"
            description="Select a workspace to switch active data context"
          />
          {isWsLoading ? (
            <CardSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {workspaces.map((ws) => {
                const isSelected = activeWorkspace?.id === ws.id;
                return (
                  <div
                    key={ws.id}
                    onClick={() => setActiveWorkspace(ws)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-bg-elevated border-accent-purple/60 shadow-xs"
                        : "bg-bg-surface border-border-subtle hover:border-border-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <Building2 className={`w-4 h-4 ${isSelected ? "text-accent-purple" : "text-txt-muted"}`} />
                        <h4 className="font-semibold text-xs text-txt-primary">{ws.name}</h4>
                      </div>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <Badge variant={ws.role === "OWNER" ? "purple" : "default"}>
                        {ws.role}
                      </Badge>
                      <span className="text-txt-muted font-numeric">
                        {ws.member_count} {ws.member_count === 1 ? "member" : "members"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Members Management Table */}
        {activeWsId && (
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-txt-primary">
                  Members in {activeWorkspace?.name || "Workspace"}
                </h3>
                <p className="text-xs text-txt-secondary mt-0.5">
                  Manage team roles and invitations
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setSelectedWsForMember(activeWsId)}
                icon={UserPlus}
              >
                Add member
              </Button>
            </div>

            {isMembersLoading ? (
              <div className="p-5">
                <TableSkeleton rows={4} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-bg-elevated/40 text-txt-muted uppercase tracking-wider border-b border-border-subtle">
                    <tr>
                      <th className="px-5 py-3 font-semibold">User</th>
                      <th className="px-5 py-3 font-semibold">Email</th>
                      <th className="px-5 py-3 font-semibold">Role</th>
                      <th className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-bg-elevated/40 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-txt-primary">
                          {m.user?.first_name ? `${m.user.first_name} ${m.user.last_name || ""}` : m.user?.email}
                        </td>
                        <td className="px-5 py-3.5 text-txt-secondary">{m.user?.email}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant={m.role === "OWNER" ? "purple" : "default"}>
                            {m.role}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {m.role !== "OWNER" && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Remove member from workspace?")) {
                                  removeMemberMutation.mutate({ wsId: activeWsId, memberId: m.id });
                                }
                              }}
                              className="p-1.5 text-txt-muted hover:text-accent-red hover:bg-accent-red/10 rounded-md transition-colors"
                              title="Remove member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>

      <AddMemberModal
        isOpen={!!selectedWsForMember}
        onClose={() => setSelectedWsForMember(null)}
        workspaceId={selectedWsForMember}
      />
    </ApplicationShell>
  );
}
