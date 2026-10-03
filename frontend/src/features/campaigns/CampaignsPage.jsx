import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Plus, Link2, MousePointerClick, Calendar } from "lucide-react";
import { campaignsApi } from "../../api/campaigns.api";
import { queryKeys } from "../../lib/queryKeys";
import { formatNumber, formatDate } from "../../lib/formatters";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { CardSkeleton, TableSkeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/feedback/EmptyState";
import { CreateCampaignModal } from "./CreateCampaignModal";

export function CampaignsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.campaigns.all(),
    queryFn: () => campaignsApi.list(),
  });

  const campaigns = data?.data?.results || [];

  return (
    <ApplicationShell title="Campaigns">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
          <div>
            <h2 className="text-xl font-bold text-txt-primary tracking-tight">Campaigns</h2>
            <p className="text-xs text-txt-secondary mt-1 max-w-xl leading-relaxed">
              Group your links and measure campaign performance across marketing channels.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} variant="primary" size="sm" icon={Plus}>
            Create campaign
          </Button>
        </div>

        {/* Campaign List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No campaigns yet"
            description="Group your short links into campaigns to measure aggregated channel ROI."
            actionLabel="Create campaign"
            onAction={() => setIsCreateOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((cmp) => (
              <Card key={cmp.id} className="hover:border-border-hover transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent-purple">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] text-txt-muted flex items-center space-x-1 font-numeric">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(cmp.created_at)}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-txt-primary">{cmp.name}</h3>
                    {cmp.description && (
                      <p className="text-xs text-txt-secondary mt-1 line-clamp-2">
                        {cmp.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border-subtle grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-txt-muted flex items-center space-x-1">
                      <Link2 className="w-3 h-3" />
                      <span>Links</span>
                    </span>
                    <p className="font-semibold text-txt-primary font-numeric mt-0.5">
                      {formatNumber(cmp.link_count)}
                    </p>
                  </div>
                  <div>
                    <span className="text-txt-muted flex items-center space-x-1">
                      <MousePointerClick className="w-3 h-3" />
                      <span>Total clicks</span>
                    </span>
                    <p className="font-semibold text-txt-primary font-numeric mt-0.5">
                      {formatNumber(cmp.total_clicks)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateCampaignModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </ApplicationShell>
  );
}
