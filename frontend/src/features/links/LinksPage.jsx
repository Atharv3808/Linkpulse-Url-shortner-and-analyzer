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
            <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-txt-muted uppercase mb-1">
              <span className="w-2 h-2 bg-[#1351AA]"></span>
              <span>MANAGEMENT</span>
            </div>
            <h2 className="text-2xl font-black text-txt-primary tracking-tight uppercase">
              LINKS
            </h2>
            <p className="text-xs font-mono text-txt-secondary mt-1 leading-relaxed max-w-xl">
              Create, organize and monitor your short links and custom alias destinations.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="primary"
            size="sm"
            icon={Plus}
          >
            CREATE LINK
          </Button>
        </div>

        {/* Search & Toolbar Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="SEARCH BY TITLE, SHORT CODE, OR URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-bg-secondary border border-border-subtle rounded-none px-3 py-2 text-xs font-mono">
              <Filter className="w-3.5 h-3.5 text-txt-muted" />
              <span className="font-bold text-txt-secondary uppercase hidden sm:inline">STATUS:</span>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-transparent text-txt-primary font-bold uppercase focus:outline-none cursor-pointer"
              >
                <option value="">ALL STATUS</option>
                <option value="true">ACTIVE</option>
                <option value="false">DISABLED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Links Data Container */}
        <Card className="p-0 sm:p-0 overflow-hidden rounded-none">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={6} />
            </div>
          ) : links.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="NO LINKS FOUND"
                description={
                  search
                    ? "No short links match your current search query."
                    : "Create your first short link and start tracking clicks."
                }
                actionLabel="CREATE LINK"
                onAction={() => setIsCreateModalOpen(true)}
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-bg-elevated text-txt-muted uppercase tracking-wider border-b border-border-subtle font-bold text-[11px]">
                    <tr>
                      <th className="px-5 py-3.5">SHORT LINK</th>
                      <th className="px-5 py-3.5">DESTINATION URL</th>
                      <th className="px-5 py-3.5 text-right">CLICKS</th>
                      <th className="px-5 py-3.5">STATUS</th>
                      <th className="px-5 py-3.5">CREATED</th>
                      <th className="px-5 py-3.5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {links.map((link) => (
                      <tr key={link.id} className="hover:bg-bg-elevated/60 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-txt-primary">
                          <div className="space-y-0.5">
                            {link.title && (
                              <p className="font-bold text-txt-primary truncate max-w-xs uppercase">
                                {link.title}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={() => navigate(`/app/links/${link.id}`)}
                              className="text-[#1351AA] font-bold hover:underline"
                            >
                              /{link.short_code}
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-txt-secondary font-sans text-xs max-w-xs truncate">
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
                        <td className="px-5 py-3.5 text-right font-numeric font-bold text-txt-primary">
                          {formatNumber(link.click_count)}
                        </td>
                        <td className="px-5 py-3.5">
                          {(() => {
                            const isExpired = link.expires_at && new Date(link.expires_at) <= new Date();
                            const variant = !link.is_active ? "inactive" : isExpired ? "expired" : "active";
                            const label = !link.is_active ? "DISABLED" : isExpired ? "EXPIRED" : "ACTIVE";
                            return <Badge variant={variant}>{label}</Badge>;
                          })()}
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
                              className="p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-none transition-colors border border-transparent hover:border-border-subtle"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedQrLink(link)}
                              title="View QR Code"
                              className="p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-none transition-colors border border-transparent hover:border-border-subtle"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/app/links/${link.id}`)}
                              title="View Analytics"
                              className="p-1.5 text-[#1351AA] hover:bg-bg-elevated rounded-none transition-colors border border-transparent hover:border-border-subtle"
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
                                className="p-1.5 text-txt-muted hover:text-red-700 hover:bg-bg-elevated rounded-none transition-colors border border-transparent hover:border-border-subtle"
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
              <div className="block md:hidden divide-y divide-border-subtle font-mono">
                {links.map((link) => (
                  <div key={link.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        {link.title && (
                          <p className="text-xs font-bold text-txt-primary uppercase">{link.title}</p>
                        )}
                        <span className="text-sm font-bold text-[#1351AA]">
                          /{link.short_code}
                        </span>
                      </div>
                      {(() => {
                        const isExpired = link.expires_at && new Date(link.expires_at) <= new Date();
                        const variant = !link.is_active ? "inactive" : isExpired ? "expired" : "active";
                        const label = !link.is_active ? "DISABLED" : isExpired ? "EXPIRED" : "ACTIVE";
                        return <Badge variant={variant}>{label}</Badge>;
                      })()}
                    </div>

                    <p className="text-xs text-txt-secondary font-sans truncate">
                      {link.original_url}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border-subtle/50">
                      <span className="text-txt-muted font-numeric">
                        {formatNumber(link.click_count)} clicks
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => copy(formatShortUrl(link.short_url, link.short_code), "Short URL")}
                          className="px-3 py-1.5 text-[11px] font-bold bg-bg-elevated text-txt-primary rounded-none border border-border-subtle uppercase"
                        >
                          COPY
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/app/links/${link.id}`)}
                          className="px-3 py-1.5 text-[11px] font-bold bg-[#1351AA] text-white rounded-none border border-[#1351AA] uppercase"
                        >
                          ANALYTICS
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
