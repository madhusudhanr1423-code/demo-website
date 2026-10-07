import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getMyOrders } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, PageContainer, RequireAuth, SectionHeading, StatusBadge, fmtDate, inr, useLang } from "@/components/site";

export const Route = createFileRoute("/my-orders/")({
  head: pageHead("My Orders", "Track your temple shop orders."),
  component: () => <RequireAuth><Orders /></RequireAuth>,
});

function Orders() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["my-orders"], queryFn: getMyOrders });
  return (
    <PageContainer className="max-w-4xl">
      <SectionHeading title={t("orders.title")} />
      {isError ? <ErrorState onRetry={refetch} />
        : isLoading ? <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-24" />)}</div>
        : !data?.length ? <EmptyState title={t("orders.empty")} text={t("orders.emptyText")} action={<Button asChild><Link to="/shop">{t("nav.shop")}</Link></Button>} />
        : (
          <ul className="space-y-3">
            {data.map((o) => (
              <li key={o.id}>
                <Link to="/my-orders/$id" params={{ id: o.id }} className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 hover:shadow-warm">
                  <div className="flex -space-x-3">{o.items.slice(0, 3).map((i) => i.product && <img key={i.id} src={i.product.image_url} alt="" className="h-12 w-12 rounded-lg border-2 border-card object-cover" />)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm">#{o.id}</p>
                    <p className="text-sm text-muted-foreground">{fmtDate(o.created_at, lang)} · {t("orders.itemCount", { count: o.items.reduce((n, i) => n + i.quantity, 0) })}</p>
                  </div>
                  <div className="text-right"><StatusBadge status={o.status} /><p className="mt-1 font-semibold">{inr(o.total_amount)}</p></div>
                </Link>
              </li>
            ))}
          </ul>
        )}
    </PageContainer>
  );
}
