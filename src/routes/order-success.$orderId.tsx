import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { getOrder } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageContainer } from "@/components/site";
import { OrderSummary } from "@/components/OrderSummary";

export const Route = createFileRoute("/order-success/$orderId")({
  head: pageHead("Order Placed", "Thank you for your order from the temple shop."),
  component: Success,
});

function Success() {
  const { orderId } = Route.useParams();
  const { t } = useTranslation();
  const { data: o, isLoading } = useQuery({ queryKey: ["order", orderId, "ok"], queryFn: () => getOrder(orderId) });
  if (isLoading) return <PageContainer className="max-w-lg"><Skeleton className="h-80" /></PageContainer>;
  if (!o) return <PageContainer><EmptyState title={t("common.notFound")} text={t("common.notFoundText")} /></PageContainer>;
  return (
    <PageContainer className="max-w-lg text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
      <h1 className="mt-4 text-4xl text-primary">{t("orders.successTitle")}</h1>
      <p className="mb-6 mt-2 text-muted-foreground">{t("orders.successText")}</p>
      <div className="text-left"><OrderSummary o={o} full /></div>
      <Button className="mt-6" size="lg" asChild><Link to="/my-orders">{t("orders.view")}</Link></Button>
    </PageContainer>
  );
}
