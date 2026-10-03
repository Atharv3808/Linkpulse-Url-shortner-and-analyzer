import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  MousePointerClick,
  Users,
  Link2,
  Bot,
  ExternalLink,
  Copy,
  QrCode,
  BarChart2,
  ArrowUpRight,
} from "lucide-react";
import { analyticsApi } from "../../api/analytics.api";
import { linksApi } from "../../api/links.api";
import { queryKeys } from "../../lib/queryKeys";
import { useAuthStore } from "../../store/useAuthStore";
import { useCopy } from "../../hooks/useCopy";
import { formatNumber, truncateUrl, formatShortUrl } from "../../lib/formatters";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { CardSkeleton, TableSkeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ClickTimelineChart } from "../../components/charts/ClickTimelineChart";
import { QRCodeModal } from "../links/QRCodeModal";

export function DashboardOverviewPage() {
  const navigate = useNavigate();
  const { activeWorkspace } = useAuthStore();
  const { copy } = useCopy();

  const [selectedQrLink, setSelectedQrLink] = useState(null);

  // Fetch Overview Stats
  const { data: overviewRes, isLoading: isOverviewLoading } = useQuery({
    queryKey: queryKeys.analytics.overview(activeWorkspace?.id),
    queryFn: () => analyticsApi.getOverview(activeWorkspace?.id),
  });

  // Fetch Recent Links List
  const { data: linksRes, isLoading: isLinksLoading } = useQuery({
    queryKey: queryKeys.links.all({ page_size: 5 }),
    queryFn: () => linksApi.list({ page_size: 5 }),
  });

  const overview = overviewRes?.data || {};
  const links = linksRes?.data?.results || [];

  const kpis = [
    {
      title: "TOTAL CLICKS",
      value: overview.total_clicks ?? 0,
      icon: MousePointerClick,
      subtitle: "LIFETIME RECORDED CLICKS",
    },
    {
      title: "UNIQUE VISITORS",
      value: overview.unique_visitors ?? 0,
      icon: Users,
      subtitle: "DISTINCT IP SIGNATURES",
    },
    {
      title: "ACTIVE LINKS",
      value: overview.active_links ?? 0,
      icon: Link2,
      subtitle: "LIVE SHORT LINKS",
    },
    {
      title: "BOT TRAFFIC",
      value: overview.bot_clicks ?? 0,
      icon: Bot,
      subtitle: "AUTOMATED CRAWLER CLICKS",
    },
  ];

  return (
    <ApplicationShell title="Overview">
      <div className="space-y-6">
        {/* Header with Title and Concise Description */}
        <div className="border-b border-border-subtle pb-5">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-txt-muted uppercase mb-1">
            <span className="w-2 h-2 bg-[#1351AA]"></span>
            <span>WORKSPACE SIGNAL</span>
          </div>
          <h2 className="text-2xl font-black text-txt-primary tracking-tight uppercase">
            OVERVIEW
          </h2>
          <p className="text-xs font-mono text-txt-secondary mt-1 max-w-xl leading-relaxed">
            Track your links, understand your audience, and measure what is working across your active workspace.
          </p>
        </div>

        {/* 4 Primary KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isOverviewLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : kpis.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <Card
                    key={idx}
                    className="relative border border-border-subtle hover:border-[#1351AA] transition-colors flex flex-col justify-between min-h-[120px] rounded-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-txt-muted uppercase tracking-widest">
                        {kpi.title}
                      </span>
                      <div className="p-1.5 bg-bg-elevated border border-border-subtle rounded-none text-txt-muted shrink-0">
                        <Icon className="w-4 h-4 stroke-[1.75]" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-black text-txt-primary font-numeric tracking-tight leading-none">
                        {formatNumber(kpi.value)}
                      </div>
                      <p className="text-[10px] font-mono text-txt-muted mt-2 tracking-wider uppercase">
                        {kpi.subtitle}
                      </p>
                    </div>
                  </Card>
                );
              })}
        </div>

        {/* Click Performance Timeline Chart */}
        <Card className="rounded-none">
          <CardHeader
            title="CLICK PERFORMANCE"
            description="Daily traffic volume and unique visitor trends"
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
        <Card className="rounded-none">
          <CardHeader
            title="RECENT LINKS"
            description="Manage recent short links and view quick click statistics"
            action={
              <Link
                to="/app/links"
                className="text-xs font-mono font-bold text-[#1351AA] hover:text-txt-primary uppercase tracking-wider inline-flex items-center space-x-1"
              >
                <span>VIEW ALL LINKS</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            }
          />

          {isLinksLoading ? (
            <TableSkeleton rows={4} />
          ) : links.length === 0 ? (
            <EmptyState
              title="NO LINKS YET"
              description="Create your first short link to start tracking click performance."
              actionLabel="CREATE SHORT LINK"
              onAction={() => navigate("/app/links")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-bg-elevated text-txt-muted uppercase tracking-wider border-b border-border-subtle font-bold text-[11px]">
                  <tr>
                    <th className="px-4 py-3">SHORT LINK</th>
                    <th className="px-4 py-3">DESTINATION URL</th>
                    <th className="px-4 py-3 text-right">CLICKS</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-bg-elevated/60 transition-colors">
                      <td className="px-4 py-3 font-bold text-txt-primary">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/app/links/${link.id}`}
                            className="text-[#1351AA] hover:underline font-bold"
                          >
                            /{link.short_code}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-txt-secondary font-sans text-xs">
                        <a
                          href={link.original_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline hover:text-txt-primary inline-flex items-center space-x-1 max-w-xs truncate"
                        >
                          <span>{truncateUrl(link.original_url, 40)}</span>
                          <ExternalLink className="w-3 h-3 text-txt-muted shrink-0" />
                        </a>
                      </td>
                      <td className="px-4 py-3 text-right font-numeric font-bold text-txt-primary">
                        {formatNumber(link.click_count)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={link.is_active ? "active" : "inactive"}>
                          {link.is_active ? "ACTIVE" : "DISABLED"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => copy(formatShortUrl(link.short_url, link.short_code), "Short URL")}
                            title="Copy Short URL"
                            className="p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-none transition-colors border border-transparent hover:border-border-subtle"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedQrLink(link)}
                            title="View QR Code"
                            className="p-1.5 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-none transition-colors border border-transparent hover:border-border-subtle"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/app/links/${link.id}`)}
                            title="View Link Analytics"
                            className="p-1.5 text-[#1351AA] hover:bg-bg-elevated rounded-none transition-colors border border-transparent hover:border-border-subtle"
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
