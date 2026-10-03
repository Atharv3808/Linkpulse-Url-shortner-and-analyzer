import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Plus, Link2, MousePointerClick, Calendar } from "lucide-react";
import { campaignsApi } from "../../api/campaigns.api";
import { queryKeys } from "../../lib/queryKeys";
import { formatNumber, formatDate } from "../../lib/formatters";
import { ApplicationShell } from "../../components/layout/ApplicationShell";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { CardSkeleton } from "../../components/ui/Skeleton";
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
            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-txt-muted mb-1 font-bold">
              <span className="text-accent-purple">[MARKETING]</span>
              <span>/</span>
              <span>CAMPAIGN MANAGEMENT</span>
            </div>
            <h2 className="text-xl font-black text-txt-primary uppercase tracking-tight">
              Campaigns
            </h2>
            <p className="text-xs text-txt-secondary mt-1 max-w-xl leading-relaxed">
              Group your links and measure campaign performance across marketing channels.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} variant="primary" size="sm" icon={Plus}>
            Create Campaign
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
            title="No campaigns created"
            description="Group your short links into campaigns to measure aggregated channel ROI."
            actionLabel="Create campaign"
            onAction={() => setIsCreateOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((cmp) => (
              <Card key={cmp.id} className="hover:border-txt-primary transition-colors flex flex-col justify-between rounded-none border-border-subtle">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-none bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent-purple font-mono text-xs font-bold">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-txt-muted flex items-center space-x-1 font-mono uppercase font-bold tracking-wider">
                      <Calendar className="w-3 h-3 text-txt-muted" />
                      <span>{formatDate(cmp.created_at)}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary uppercase tracking-tight">{cmp.name}</h3>
                    {cmp.description && (
                      <p className="text-xs text-txt-secondary mt-1 line-clamp-2 leading-relaxed">
                        {cmp.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border-subtle grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-txt-muted uppercase font-mono font-bold tracking-wider flex items-center space-x-1">
                      <Link2 className="w-3 h-3 text-accent-purple" />
                      <span>LINKS</span>
                    </span>
                    <p className="font-bold text-txt-primary font-numeric text-sm mt-0.5">
                      {formatNumber(cmp.link_count)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-txt-muted uppercase font-mono font-bold tracking-wider flex items-center space-x-1">
                      <MousePointerClick className="w-3 h-3 text-accent-purple" />
                      <span>CLICKS</span>
                    </span>
                    <p className="font-bold text-txt-primary font-numeric text-sm mt-0.5">
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
