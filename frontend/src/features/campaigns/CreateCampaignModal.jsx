import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, FileText, AlertCircle } from "lucide-react";
import { campaignsApi } from "../../api/campaigns.api";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function CreateCampaignModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const createMutation = useMutation({
    mutationFn: (payload) => campaignsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setName("");
      setDescription("");
      setErrorMsg("");
      onClose();
    },
    onError: (err) => {
      setErrorMsg(err.message || "Failed to create campaign.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setErrorMsg("Please enter a campaign name.");
      return;
    }
    createMutation.mutate({ name, description });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Campaign">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-accent-red/10 border border-accent-red/30 rounded-lg flex items-center space-x-2 text-xs text-accent-red font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Input
          label="Campaign Name *"
          placeholder="e.g. Q1 Product Launch 2026"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={FolderKanban}
          required
        />

        <Input
          label="Description (Optional)"
          placeholder="e.g. Omnichannel Q1 marketing campaign"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          icon={FileText}
        />

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border-subtle">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Create Campaign
          </Button>
        </div>
      </form>
    </Modal>
  );
}
