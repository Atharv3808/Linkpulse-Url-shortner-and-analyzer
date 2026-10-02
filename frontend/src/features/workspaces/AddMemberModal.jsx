import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Shield, AlertCircle } from "lucide-react";
import { workspacesApi } from "../../api/workspaces.api";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function AddMemberModal({ isOpen, onClose, workspaceId }) {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [errorMsg, setErrorMsg] = useState("");

  const addMutation = useMutation({
    mutationFn: (payload) => workspacesApi.addMember(workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setEmail("");
      setRole("MEMBER");
      setErrorMsg("");
      onClose();
    },
    onError: (err) => {
      setErrorMsg(err.message || "Failed to add member to workspace.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter an email address.");
      return;
    }
    addMutation.mutate({ email, role });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Workspace Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-accent-red/10 border border-accent-red/30 rounded-lg flex items-center space-x-2 text-xs text-accent-red font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Input
          label="User Email Address *"
          type="email"
          placeholder="colleague@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-txt-secondary uppercase tracking-wider">
            Role Permission *
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-bg-elevated border border-border-subtle text-txt-primary text-sm rounded-lg p-2.5 focus:outline-none focus:border-accent-purple"
          >
            <option value="MEMBER">Member (View & Create Links)</option>
            <option value="ADMIN">Admin (Full Access & Add Members)</option>
          </select>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border-subtle">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={addMutation.isPending}>
            Add Member
          </Button>
        </div>
      </form>
    </Modal>
  );
}
