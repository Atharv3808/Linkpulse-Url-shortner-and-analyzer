import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link2, Globe, Tag, Calendar, AlertCircle } from "lucide-react";
import { linksApi } from "../../api/links.api";
import { Drawer } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useCopy } from "../../hooks/useCopy";
import { formatShortUrl } from "../../lib/formatters";

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
      if (newLink) {
        copy(formatShortUrl(newLink.short_url, newLink.short_code), "Short URL");
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
      setErrorMsg("Please enter a valid destination URL.");
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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="CREATE SHORT LINK"
      description="Shorten long URLs, track clicks, and customize destination behavior."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-4 border border-[#141414] bg-[#E3E2DE] text-[#141414] text-xs font-mono space-y-1">
            <div className="font-bold uppercase tracking-wider text-red-700 flex items-center justify-between">
              <span>UNABLE TO CREATE LINK</span>
              <span>[ERROR]</span>
            </div>
            <p className="text-[#444343] font-sans text-xs">{errorMsg}</p>
          </div>
        )}

        <Input
          label="DESTINATION URL *"
          type="url"
          placeholder="https://example.com/long-campaign-url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          icon={Globe}
          required
          helperText="The long web destination where visitors will be redirected."
        />

        <Input
          label="TITLE (OPTIONAL)"
          placeholder="e.g. Q4 Marketing Campaign"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={Tag}
          helperText="An internal title to help identify this link."
        />

        <Input
          label="CUSTOM ALIAS (OPTIONAL)"
          placeholder="e.g. launch2026"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          icon={Link2}
          helperText="Custom path identifier (e.g. linkpulse/.../launch2026)."
        />

        <Input
          label="EXPIRATION DATE (OPTIONAL)"
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          icon={Calendar}
          helperText="Set an automatic deactivation date for this link."
        />

        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border-subtle mt-8">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            CANCEL
          </Button>
          <Button type="submit" size="sm" isLoading={createMutation.isPending}>
            CREATE LINK
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
