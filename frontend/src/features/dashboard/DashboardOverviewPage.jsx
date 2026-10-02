import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  MousePointerClick,
  Users,
  Link2,
  Bot,
  TrendingUp,
  ExternalLink,
  Copy,
  QrCode,
  BarChart2,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { analyticsApi } from "../../api/analytics.api";
import { linksApi } from "../../api/links.api";
import { queryKeys } from "../../lib/queryKeys";
import { useAuthStore } from "../../store/useAuthStore";
import { useCopy } from "../../hooks/useCopy";
import { formatNumber, formatDate, truncateUrl } from "../../lib/formatters";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { CardSkeleton, TableSkeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ClickTimelineChart } from "../../components/charts/ClickTimelineChart";
import { QRCodeModal } from "../links/QRCodeModal";

export function DashboardOverviewPage() {
  const navigate = useNavigate();
  const { activeWorkspace, user } = useAuthStore();
  const { copy } = useCopy();

  const [selectedQrLink, setSelectedQrLink] = useState(null);

  // Fetch Overview Stats
  const { data: overviewRes, isLoading: isOverviewLoading } = useQuery({
    queryKey: queryKeys.analytics.overview(activeWorkspace?.id),
    queryFn: () => analyticsApi.getOverview(activeWorkspace?.id),
  });

  // Fetch Links List for table preview
  const { data: linksRes, isLoading: isLinksLoading } = useQuery({
    queryKey: queryKeys.links.all({ page_size: 5 }),
    queryFn: () => linksApi.list({ page_size: 5 }),
  });

  const overview = overviewRes?.data || {};
  const links = linksRes?.data?.results || [];

  const kpis = [
    {
      title: "Total clicks",
      value: overview.total_clicks ?? 0,
      icon: MousePointerClick,
      subtitle: "Lifetime recorded clicks",
    },
    {
      title: "Unique visitors",
      value: overview.unique_visitors ?? 0,
      icon: Users,
      subtitle: "Distinct IP signatures",
    },
    {
      title: "Active links",
      value: overview.active_links ?? 0,
      icon: Link2,
      subtitle: "Live short links",
    },
    {
      title: "Bot traffic",
      value: overview.bot_clicks ?? 0,
      icon: Bot,
      subtitle: "Automated crawler clicks",
    },
  ];

  return (
    <ApplicationShell title="Overview">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-txt-primary tracking-tight">
              Overview
            </h2>
            <p className="text-xs text-txt-secondary mt-0.5">
              Track how your links are performing across your active workspace.
            </p>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isOverviewLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : kpis.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <Card key={idx} className="relative flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-txt-secondary">
                        {kpi.title}
                      </span>
                      <Icon className="w-4 h-4 text-txt-muted shrink-0" />
                    </div>
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-txt-primary font-numeric">
                        {formatNumber(kpi.value)}
                      </span>
                      <p className="text-[11px] text-txt-muted mt-1">{kpi.subtitle}</p>
                    </div>
                  </Card>
                );
              })}
        </div>

        {/* Clicks Timeline Chart */}
        <Card>
          <CardHeader
            title="Click timeline"
            description="Aggregated daily traffic volume over time"
          />
          {isOverviewLoading ? (
            <div className="h-64 flex items-center justify-center">
              <CardSkeleton />
            </div>
          ) : (
            <ClickTimelineChart data={overview.timeline || []} />
          )}
        </Card>

        {/* Recent Links Table */}
        <Card>
          <CardHeader
            title="Recent links"
            description="Manage recent short link destinations and click stats"
            action={
              <Link
                to="/app/links"
                className="text-xs font-semibold text-accent-purple hover:underline inline-flex items-center space-x-1"
              >
                <span>View all links</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            }
          />

          {isLinksLoading ? (
            <TableSkeleton rows={4} />
          ) : links.length === 0 ? (
            <EmptyState
              title="No links yet"
              description="Create your first short link to start tracking traffic."
              actionLabel="Create short link"
              onAction={() => navigate("/app/links")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-bg-elevated/40 text-txt-muted uppercase tracking-wider border-b border-border-subtle">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Short Link</th>
                    <th className="px-4 py-3 font-semibold">Destination URL</th>
                    <th className="px-4 py-3 font-semibold text-right">Clicks</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-bg-elevated/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-txt-primary">
                        <span className="text-accent-purple font-semibold">
                          /{link.short_code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-txt-secondary">
                        <a
                          href={link.original_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline hover:text-txt-primary inline-flex items-center space-x-1 max-w-xs truncate"
                        >
                          <span>{truncateUrl(link.original_url, 35)}</span>
                          <ExternalLink className="w-3 h-3 text-txt-muted shrink-0" />
                        </a>
                      </td>
                      <td className="px-4 py-3 text-right font-numeric font-semibold text-txt-primary">
                        {formatNumber(link.click_count)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={link.is_active ? "active" : "inactive"}>
                          {link.is_active ? "Active" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => copy(link.short_url, "Short URL")}
                            title="Copy Short URL"
                            className="p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-md"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedQrLink(link)}
                            title="View QR Code"
                            className="p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-md"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/app/links/${link.id}`)}
                            title="View Link Analytics"
                            className="p-1.5 text-accent-purple hover:bg-accent-purple/10 rounded-md"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={!!selectedQrLink}
        onClose={() => setSelectedQrLink(null)}
        link={selectedQrLink}
      />
    </ApplicationShell>
  );
}
