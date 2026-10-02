import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Copy,
  QrCode,
  ExternalLink,
  Download,
  MousePointerClick,
  Users,
  Bot,
  UserCheck,
  Sparkles,
  Share2,
} from "lucide-react";
import { analyticsApi } from "../../api/analytics.api";
import { queryKeys } from "../../lib/queryKeys";
import { useCopy } from "../../hooks/useCopy";
import { formatNumber } from "../../lib/formatters";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/feedback/EmptyState";
import { ClickTimelineChart } from "../../components/charts/ClickTimelineChart";
import { CountryBarChart } from "../../components/charts/CountryBarChart";
import { DeviceDonutChart } from "../../components/charts/DeviceDonutChart";
import { QRCodeModal } from "./QRCodeModal";

export function LinkDetailPage() {
  const { id: linkId } = useParams();
  const navigate = useNavigate();
  const { copy } = useCopy();

  const [range, setRange] = useState("30d");
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch full link analytics breakdown
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.analytics.detail(linkId, range),
    queryFn: () => analyticsApi.getLinkDetail(linkId, range),
    enabled: !!linkId,
  });

  const responsePayload = data?.data || data || {};
  const link = responsePayload.link || {};
  const summary = responsePayload.summary || {};
  const timeline = responsePayload.timeline || [];
  const countries = responsePayload.countries || [];
  const devices = responsePayload.devices || {};
  const referrers = responsePayload.referrers || [];
  const insights = responsePayload.insights || [];

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const blob = await analyticsApi.exportCsv(linkId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `linkpulse_${link.short_code || "clicks"}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export CSV file.");
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <ApplicationShell title="Link analytics">
        <div className="py-12">
          <EmptyState
            title="Unable to load analytics"
            description={error.message || "We couldn't retrieve analytics data for this short link."}
            actionLabel="Back to links"
            onAction={() => navigate("/app/links")}
          />
        </div>
      </ApplicationShell>
    );
  }

  return (
    <ApplicationShell title="Link analytics">
      <div className="space-y-6">
        {/* Navigation & Period Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate("/app/links")}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-txt-secondary hover:text-txt-primary transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Links</span>
          </button>

          <div className="flex items-center space-x-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-bg-elevated border border-border-subtle text-txt-secondary text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-accent-purple/60 focus:ring-1 focus:ring-accent-purple/40 min-h-[36px]"
            >
              <option value="today">Today</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              isLoading={isExporting}
              icon={Download}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Link Overview Header Card */}
        {isLoading ? (
          <CardSkeleton />
        ) : (
          <Card className="bg-bg-surface border-l-2 border-l-accent-purple">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-txt-primary tracking-tight">
                    {link.title || link.short_code}
                  </h2>
                  {link.short_code && <Badge variant="purple">/{link.short_code}</Badge>}
                </div>
                <p className="text-xs text-txt-secondary truncate max-w-xl">
                  {link.original_url}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copy(link.short_url || `http://localhost:8000/${link.short_code}`, "Short URL")}
                  icon={Copy}
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsQrOpen(true)}
                  icon={QrCode}
                >
                  QR Code
                </Button>
                {link.original_url && (
                  <a
                    href={link.original_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-txt-muted hover:text-txt-primary hover:bg-bg-elevated rounded-lg transition-colors border border-border-subtle"
                    aria-label="Open destination URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Traffic Intelligence / Insights */}
        {insights.length > 0 && (
          <div className="bg-bg-elevated/60 border border-border-subtle rounded-xl p-4 flex items-start space-x-3 text-xs text-txt-primary">
            <Sparkles className="w-4 h-4 text-accent-purple shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-txt-primary">Traffic insights</p>
              <ul className="list-disc list-inside space-y-1 text-txt-secondary">
                {insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Key Summary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-txt-secondary">
                Total clicks
              </span>
              <MousePointerClick className="w-4 h-4 text-txt-muted" />
            </div>
            <p className="text-2xl font-bold text-txt-primary mt-2 font-numeric">
              {formatNumber(summary.total_clicks ?? 0)}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-txt-secondary">
                Unique visitors
              </span>
              <Users className="w-4 h-4 text-txt-muted" />
            </div>
            <p className="text-2xl font-bold text-txt-primary mt-2 font-numeric">
              {formatNumber(summary.unique_visitors ?? 0)}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-txt-secondary">
                Human visitors
              </span>
              <UserCheck className="w-4 h-4 text-txt-muted" />
            </div>
            <p className="text-2xl font-bold text-txt-primary mt-2 font-numeric">
              {formatNumber(summary.human_clicks ?? 0)}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-txt-secondary">
                Bot / Crawlers
              </span>
              <Bot className="w-4 h-4 text-txt-muted" />
            </div>
            <p className="text-2xl font-bold text-txt-primary mt-2 font-numeric">
              {formatNumber(summary.bot_clicks ?? 0)}
            </p>
          </Card>
        </div>

        {/* Click Volume Timeline */}
        <Card>
          <CardHeader
            title="Clicks over time"
            description="Daily click activity breakdown for selected period"
          />
          {isLoading ? <CardSkeleton /> : <ClickTimelineChart data={timeline} />}
        </Card>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Countries */}
          <Card>
            <CardHeader
              title="Top countries"
              description="Visitor geographic distribution"
            />
            {isLoading ? <CardSkeleton /> : <CountryBarChart countries={countries} />}
          </Card>

          {/* Devices */}
          <Card>
            <CardHeader
              title="Devices"
              description="Device types and user agents"
            />
            {isLoading ? <CardSkeleton /> : <DeviceDonutChart devices={devices} />}
          </Card>

          {/* Referrers */}
          <Card>
            <CardHeader
              title="Referrers"
              description="Top referring domains"
            />
            {isLoading ? (
              <CardSkeleton />
            ) : referrers.length === 0 ? (
              <p className="text-xs text-txt-muted text-center py-8">No referrer data recorded.</p>
            ) : (
              <div className="space-y-2">
                {referrers.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-bg-elevated/40 border border-border-subtle rounded-lg text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Share2 className="w-3.5 h-3.5 text-txt-muted shrink-0" />
                      <span className="font-medium text-txt-primary truncate">
                        {item.source}
                      </span>
                    </div>
                    <span className="font-semibold text-txt-primary font-numeric">
                      {formatNumber(item.clicks)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        link={{ id: linkId, short_code: link.short_code, original_url: link.original_url }}
      />
    </ApplicationShell>
  );
}
