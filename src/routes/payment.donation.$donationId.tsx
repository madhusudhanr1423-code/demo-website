import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getDonation, markDonationPaid } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, PageContainer, inr } from "@/components/site";

export const Route = createFileRoute("/payment/donation/$donationId")({
  head: pageHead("Donation Payment", "Complete your donation to the temple."),
  component: Pay,
});

function Pay() {
  const { donationId } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const { data: d, isLoading, isError, refetch } = useQuery({ queryKey: ["donation", donationId], queryFn: () => getDonation(donationId) });
  if (isError) return <PageContainer><ErrorState onRetry={refetch} /></PageContainer>;
  if (isLoading) return <PageContainer className="max-w-lg"><Skeleton className="h-60" /></PageContainer>;
  if (!d) return <PageContainer><EmptyState title={t("common.notFound")} text={t("common.notFoundText")} /></PageContainer>;
  const simulate = async () => {
    setBusy(true);
    await markDonationPaid(d.id);
    toast.success(t("payment.success"));
    navigate({ to: "/donation-success/$donationId", params: { donationId: d.id } });
  };
  return (
    <PageContainer className="max-w-lg">
      <h1 className="mb-6 text-4xl text-primary">{t("payment.title")}</h1>
      <dl className="space-y-2 rounded-xl border bg-card p-5 text-sm">
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{t("nav.donate")}</dt><dd className="text-right font-medium">{d.campaign?.title}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{t("campaigns.donor")}</dt><dd>{d.is_anonymous ? t("campaigns.anonymousName") : d.donor_name}</dd></div>
        <div className="flex justify-between border-t pt-3 text-lg font-bold"><dt>{t("cart.total")}</dt><dd>{inr(d.amount)}</dd></div>
      </dl>
      <div className="mt-6 space-y-3">
        <Button className="w-full opacity-60" size="lg" disabled>{t("payment.razorpay")}</Button>
        <Button variant="saffron" className="w-full" size="lg" onClick={simulate} disabled={busy}>{busy ? t("payment.processing") : t("payment.simulate")}</Button>
      </div>
    </PageContainer>
  );
}
