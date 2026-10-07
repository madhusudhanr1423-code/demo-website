import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getCampaigns } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { EmptyState, ErrorState, PageContainer, PoojaCardSkeleton, SectionHeading } from "@/components/site";
import { CampaignProgress } from "@/components/CampaignProgress";

export const Route = createFileRoute("/campaigns/")({
  head: pageHead("Donate", "Support annadanam, temple restoration and goshala care."),
  component: Campaigns,
});

function Campaigns() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["campaigns"], queryFn: getCampaigns });
  return (
    <PageContainer>
      <SectionHeading title={t("campaigns.title")} subtitle={t("campaigns.subtitle")} />
      {isError ? <ErrorState onRetry={refetch} />
        : isLoading ? <div className="grid gap-6 md:grid-cols-3">{[0, 1, 2].map((i) => <PoojaCardSkeleton key={i} />)}</div>
        : !data?.length ? <EmptyState title={t("campaigns.emptyTitle")} text="" />
        : (
          <div className="grid gap-6 md:grid-cols-3">
            {data.map((c) => (
              <Link key={c.id} to="/campaigns/$slug" params={{ slug: c.slug }} className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-warm">
                <img src={c.image_url} alt={c.title} loading="lazy" className="aspect-video w-full object-cover" />
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <h3 className="text-xl text-primary">{c.title}</h3>
                  <div className="mt-auto"><CampaignProgress c={c} /></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      <p className="mt-8 text-center text-xs text-muted-foreground">{t("trust.line")}</p>
    </PageContainer>
  );
}
