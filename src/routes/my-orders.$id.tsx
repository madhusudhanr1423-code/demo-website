import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getOrder } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, PageContainer, RequireAuth } from "@/components/site";
import { OrderSummary } from "@/components/OrderSummary";

export const Route = createFileRoute("/my-orders/$id")({
  head: pageHead("Order Details", "Items, address and tracking for your order."),
  component: () => <RequireAuth><Detail /></RequireAuth>,
});

function Detail() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const { data: o, isLoading, isError, refetch } = useQuery({ queryKey: ["order", id], queryFn: () => getOrder(id) });
  return (
    <PageContainer className="max-w-2xl">
      <Link to="/my-orders" className="text-sm text-primary hover:underline">← {t("orders.title")}</Link>
      <div className="mt-4">
        {isError ? <ErrorState onRetry={refetch} /> : isLoading ? <Skeleton className="h-80" />
          : !o ? <EmptyState title={t("common.notFound")} text={t("common.notFoundText")} /> : <OrderSummary o={o} full />}
      </div>
    </PageContainer>
  );
}
