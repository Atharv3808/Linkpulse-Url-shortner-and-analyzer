import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link2, Globe, Tag, Calendar, AlertCircle } from "lucide-react";
import { linksApi } from "../../api/links.api";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useCopy } from "../../hooks/useCopy";

export function CreateLinkModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const { copy } = useCopy();

  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const createMutation = useMutation({
    mutationFn: (payload) => linksApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      const newLink = res.data;
      if (newLink?.short_url) {
        copy(newLink.short_url, "Short URL");
      }
      resetForm();
      onClose();
    },
    onError: (err) => {
      setErrorMsg(err.message || "Failed to create short link.");
    },
  });

  const resetForm = () => {
    setOriginalUrl("");
    setTitle("");
    setCustomAlias("");
    setExpiresAt("");
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!originalUrl) {
      setErrorMsg("Please enter a destination URL.");
      return;
    }

    createMutation.mutate({
      original_url: originalUrl,
      title: title || undefined,
      custom_alias: customAlias || undefined,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create short link">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg flex items-center space-x-2 text-xs text-accent-red font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Input
          label="Destination URL *"
          type="url"
          placeholder="https://example.com/long-page-url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          icon={Globe}
          required
        />

        <Input
          label="Title (Optional)"
          placeholder="e.g. Q1 Product Launch Page"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={Tag}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Custom alias (Optional)"
            placeholder="launch2026"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            icon={Link2}
            helperText="Use a custom alias if you want a memorable URL."
          />

          <Input
            label="Expiration date (Optional)"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            icon={Calendar}
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border-subtle">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={createMutation.isPending}>
            Create link
          </Button>
        </div>
      </form>
    </Modal>
  );
}
