import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getOrder, updateOrderStatus } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, PageContainer, RequireAuth } from "@/components/site";
import { OrderSummary } from "@/components/OrderSummary";

export const Route = createFileRoute("/payment/order/$orderId")({
  head: pageHead("Order Payment", "Complete payment for your shop order."),
  component: () => <RequireAuth><Pay /></RequireAuth>,
});

function Pay() {
  const { orderId } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clear } = useCart();
  const [busy, setBusy] = useState(false);
  const { data: o, isLoading, isError, refetch } = useQuery({ queryKey: ["order", orderId], queryFn: () => getOrder(orderId) });
  if (isError) return <PageContainer><ErrorState onRetry={refetch} /></PageContainer>;
  if (isLoading) return <PageContainer className="max-w-lg"><Skeleton className="h-72" /></PageContainer>;
  if (!o) return <PageContainer><EmptyState title={t("common.notFound")} text={t("common.notFoundText")} /></PageContainer>;
  const simulate = async () => {
    setBusy(true);
    await updateOrderStatus(o.id, "paid");
    clear();
    toast.success(t("payment.success"));
    navigate({ to: "/order-success/$orderId", params: { orderId: o.id } });
  };
  return (
    <PageContainer className="max-w-lg">
      <h1 className="mb-6 text-4xl text-primary">{t("payment.title")}</h1>
      <OrderSummary o={o} />
      <div className="mt-6 space-y-3">
        <Button className="w-full opacity-60" size="lg" disabled>{t("payment.razorpay")}</Button>
        <Button variant="saffron" className="w-full" size="lg" onClick={simulate} disabled={busy}>{busy ? t("payment.processing") : t("payment.simulate")}</Button>
      </div>
    </PageContainer>
  );
}
