import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Copy,
  QrCode,
  BarChart2,
  ExternalLink,
  Trash2,
  Filter,
} from "lucide-react";
import { linksApi } from "../../api/links.api";
import { queryKeys } from "../../lib/queryKeys";
import { useCopy } from "../../hooks/useCopy";
import { formatNumber, formatDate, truncateUrl, formatShortUrl } from "../../lib/formatters";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/feedback/EmptyState";
import { CreateLinkModal } from "./CreateLinkModal";
import { QRCodeModal } from "./QRCodeModal";

export function LinksPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { copy } = useCopy();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQrLink, setSelectedQrLink] = useState(null);

  // Fetch Links List
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.links.all({ search, is_active: activeFilter }),
    queryFn: () =>
      linksApi.list({
        search: search || undefined,
        is_active: activeFilter !== "" ? activeFilter : undefined,
      }),
  });

  // Soft delete link mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => linksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  const links = data?.data?.results || [];

  return (
    <ApplicationShell title="Links">
      <div className="space-y-6">
        {/* Header & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
          <div>
            <h2 className="text-xl font-bold text-txt-primary tracking-tight">
              Links
            </h2>
            <p className="text-xs text-txt-secondary mt-1 leading-relaxed max-w-xl">
              Create, organize and monitor your short links and custom alias destinations.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
            size="sm"
            icon={Plus}
          >
            Create link
          </Button>
        </div>

        {/* Search & Toolbar Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by title, short code, or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-bg-secondary border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs text-txt-muted">
              <Filter className="w-3.5 h-3.5" />
              <span className="font-medium text-txt-secondary hidden sm:inline">Status:</span>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-transparent text-txt-primary focus:outline-none cursor-pointer"
              >
                <option value="">All status</option>
                <option value="true">Active</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Links Data Container */}
        <Card className="p-0 sm:p-0 overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={6} />
            </div>
          ) : links.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No links found"
                description={
                  search
                    ? "No short links match your current search query."
                    : "Create your first short link and start tracking clicks."
                }
                actionLabel="Create link"
                onAction={() => setIsCreateModalOpen(true)}
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-bg-elevated/40 text-txt-muted uppercase tracking-wider border-b border-border-subtle">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Short Link</th>
                      <th className="px-5 py-3 font-semibold">Destination URL</th>
                      <th className="px-5 py-3 font-semibold text-right">Clicks</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Created</th>
                      <th className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {links.map((link) => (
                      <tr key={link.id} className="hover:bg-bg-elevated/40 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-txt-primary">
                          <div className="space-y-0.5">
                            {link.title && (
                              <p className="font-semibold text-txt-primary truncate max-w-xs">
                                {link.title}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={() => navigate(`/app/links/${link.id}`)}
                              className="text-accent-purple font-semibold hover:underline"
                            >
                              /{link.short_code}
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-txt-secondary max-w-xs truncate">
                          <a
                            href={link.original_url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline hover:text-txt-primary inline-flex items-center space-x-1 truncate max-w-full"
                          >
                            <span className="truncate">{truncateUrl(link.original_url, 40)}</span>
                            <ExternalLink className="w-3 h-3 text-txt-muted shrink-0" />
                          </a>
                        </td>
                        <td className="px-5 py-3.5 text-right font-numeric font-semibold text-txt-primary">
                          {formatNumber(link.click_count)}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={link.is_active ? "active" : "inactive"}>
                            {link.is_active ? "Active" : "Disabled"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-txt-muted font-numeric">
                          {formatDate(link.created_at)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              type="button"
                              onClick={() => copy(formatShortUrl(link.short_url, link.short_code), "Short URL")}
                              title="Copy Short URL"
                              className="p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-md transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedQrLink(link)}
                              title="View QR Code"
                              className="p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-md transition-colors"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/app/links/${link.id}`)}
                              title="View Analytics"
                              className="p-1.5 text-accent-purple hover:bg-accent-purple/10 rounded-md transition-colors"
                            >
                              <BarChart2 className="w-3.5 h-3.5" />
                            </button>
                            {link.is_active && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm("Deactivate this short link?")) {
                                    deleteMutation.mutate(link.id);
                                  }
                                }}
                                title="Deactivate Link"
                                className="p-1.5 text-txt-muted hover:text-accent-red hover:bg-accent-red/10 rounded-md transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Structured Cards View */}
              <div className="block md:hidden divide-y divide-border-subtle">
                {links.map((link) => (
                  <div key={link.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        {link.title && (
                          <p className="text-xs font-semibold text-txt-primary">{link.title}</p>
                        )}
                        <span className="text-sm font-bold text-accent-purple">
                          /{link.short_code}
                        </span>
                      </div>
                      <Badge variant={link.is_active ? "active" : "inactive"}>
                        {link.is_active ? "Active" : "Disabled"}
                      </Badge>
                    </div>

                    <p className="text-xs text-txt-secondary truncate">
                      {link.original_url}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-border-subtle/50">
                      <span className="text-txt-muted font-numeric">
                        {formatNumber(link.click_count)} clicks
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => copy(formatShortUrl(link.short_url, link.short_code), "Short URL")}
                          className="px-2.5 py-1 text-[11px] font-medium bg-bg-elevated text-txt-primary rounded-md border border-border-subtle"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/app/links/${link.id}`)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-accent-purple/10 text-accent-purple rounded-md border border-accent-purple/20"
                        >
                          Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Modals */}
      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <QRCodeModal
        isOpen={!!selectedQrLink}
        onClose={() => setSelectedQrLink(null)}
        link={selectedQrLink}
      />
    </ApplicationShell>
  );
}
