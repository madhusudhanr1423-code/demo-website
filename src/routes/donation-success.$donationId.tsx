import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Printer } from "lucide-react";
import { getDonation } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageContainer, fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/donation-success/$donationId")({
  head: pageHead("Thank You for Your Donation", "Your donation receipt from the temple trust."),
  component: Success,
});

function Success() {
  const { donationId } = Route.useParams();
  const { t } = useTranslation();
  const { data: d, isLoading } = useQuery({ queryKey: ["donation", donationId, "ok"], queryFn: () => getDonation(donationId) });
  if (isLoading) return <PageContainer className="max-w-lg"><Skeleton className="h-80" /></PageContainer>;
  if (!d) return <PageContainer><EmptyState title={t("common.notFound")} text={t("common.notFoundText")} /></PageContainer>;
  return (
    <PageContainer className="max-w-xl">
      <div className="text-center print:hidden">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-4 text-4xl text-primary">{t("campaigns.successTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("campaigns.receipt")}: <span className="font-mono font-semibold text-foreground">{d.receipt_number}</span></p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => window.print()}><Printer className="h-4 w-4" />{t("campaigns.print")}</Button>
          <Button variant="outline" asChild><Link to="/campaigns">{t("nav.donate")}</Link></Button>
        </div>
      </div>
      {/* Printable receipt */}
      <section aria-label={t("campaigns.receiptTitle")} className="mt-10 rounded-xl border-2 border-dashed bg-card p-6 print:mt-0 print:border-solid">
        <div className="border-b pb-4 text-center">
          <p className="font-serif text-2xl font-bold text-primary">[Trust Name]</p>
          <p className="text-xs text-muted-foreground">Reg. No. [placeholder] · 80G No. [placeholder] · PAN [placeholder]</p>
          <p className="mt-3 font-serif text-xl">{t("campaigns.receiptTitle")}</p>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("campaigns.receipt")}</dt><dd className="font-mono">{d.receipt_number}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("common.date")}</dt><dd>{fmtDate(d.created_at)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("campaigns.donor")}</dt><dd>{d.donor_name}</dd></div>
          {d.donor_pan && <div className="flex justify-between"><dt className="text-muted-foreground">PAN</dt><dd className="font-mono">{d.donor_pan}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted-foreground">{t("nav.donate")}</dt><dd className="text-right">{d.campaign?.title}</dd></div>
          <div className="flex justify-between border-t pt-3 text-lg font-bold"><dt>{t("campaigns.amount")}</dt><dd>{inr(d.amount)}</dd></div>
        </dl>
        <p className="mt-6 text-center text-xs text-muted-foreground">Donations to [Trust Name] are eligible for deduction under section 80G of the Income Tax Act, subject to applicable limits.</p>
      </section>
    </PageContainer>
  );
}
