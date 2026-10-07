import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { createDonation, getCampaignBySlug, getCampaignDonors } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, PageContainer, ShareButton, fmtDate, inr, useLang } from "@/components/site";
import { CampaignProgress, daysLeft } from "@/components/CampaignProgress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/campaigns/$slug")({
  head: pageHead("Donation Campaign", "Read the story and donate to this temple campaign."),
  component: CampaignPage,
});

const PRESETS = [501, 1001, 2501, 5001];
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

function CampaignPage() {
  const { slug } = Route.useParams();
  const { t } = useTranslation();
  const lang = useLang();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: c, isLoading, isError, refetch } = useQuery({ queryKey: ["campaign", slug], queryFn: () => getCampaignBySlug(slug) });
  const donors = useQuery({ queryKey: ["donors", c?.id], queryFn: () => getCampaignDonors(c!.id), enabled: !!c });
  const [amount, setAmount] = useState<number>(1001);
  const [custom, setCustom] = useState("");
  const [f, setF] = useState({ donor_name: "", donor_email: "", donor_phone: "", donor_pan: "" });
  const [anon, setAnon] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { setF((x) => ({ ...x, donor_name: x.donor_name || profile?.full_name || "", donor_email: x.donor_email || user?.email || "", donor_phone: x.donor_phone || profile?.phone || "" })); }, [user, profile]);

  if (isError) return <PageContainer><ErrorState onRetry={refetch} /></PageContainer>;
  if (isLoading) return <PageContainer><Skeleton className="aspect-video w-full" /></PageContainer>;
  if (!c) return <PageContainer><EmptyState title={t("common.notFound")} text={t("common.notFoundText")} action={<Button asChild><Link to="/campaigns">{t("nav.donate")}</Link></Button>} /></PageContainer>;
  const ended = daysLeft(c) < 0;
  const finalAmount = custom ? Number(custom) : amount;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!Number.isFinite(finalAmount) || finalAmount < 1) er["amount"] = t("campaigns.eAmount");
    if (f.donor_name.trim().length < 2) er["donor_name"] = t("book.eName");
    if (!/^\S+@\S+\.\S+$/.test(f.donor_email)) er["donor_email"] = t("book.eEmail");
    if (!/^[6-9]\d{9}$/.test(f.donor_phone)) er["donor_phone"] = t("book.ePhone");
    if (f.donor_pan && !PAN_RE.test(f.donor_pan)) er["donor_pan"] = t("campaigns.ePan");
    setErr(er);
    if (Object.keys(er).length) { toast.error(t("book.fix")); return; }
    setBusy(true);
    try {
      const d = await createDonation(c.id, { ...f, donor_pan: f.donor_pan || null, amount: Math.round(finalAmount), is_anonymous: anon });
      navigate({ to: "/payment/donation/$donationId", params: { donationId: d.id } });
    } catch (x) { toast.error((x as Error).message); setBusy(false); }
  };
  const fld = (k: keyof typeof f, label: string, type = "text") => (
    <div>
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} className="mt-1" value={f[k]} onChange={(e) => setF({ ...f, [k]: k === "donor_pan" ? e.target.value.toUpperCase() : e.target.value })} aria-invalid={!!err[k]} maxLength={k === "donor_pan" ? 10 : undefined} />
      {err[k] && <p className="mt-1 text-xs text-destructive">{err[k]}</p>}
    </div>
  );

  return (
    <PageContainer>
      <img src={c.image_url} alt={c.title} className="aspect-[21/9] w-full rounded-2xl object-cover shadow-warm" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="flex items-start justify-between gap-3"><h1 className="text-4xl text-primary sm:text-5xl">{c.title}</h1><ShareButton title={c.title} /></div>
          <div className="mt-4 max-w-md"><CampaignProgress c={c} /></div>
          <h2 className="mt-8 text-2xl text-primary">{t("campaigns.story")}</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">{c.story}</p>
          <h2 className="mt-10 text-2xl text-primary">{t("campaigns.recent")}</h2>
          {donors.isLoading ? <Skeleton className="mt-3 h-24" /> : !donors.data?.length ? <p className="mt-2 text-muted-foreground">{t("campaigns.noDonors")}</p> : (
            <ul className="mt-3 divide-y rounded-xl border bg-card">
              {donors.data.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span className="font-medium">{d.display_name || t("campaigns.anonymousName")}</span>
                  <span className="text-muted-foreground">{fmtDate(d.created_at, lang)}</span>
                  <span className="font-semibold">{inr(d.amount)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-xs text-muted-foreground">{t("trust.line")}</p>
        </div>
        <form onSubmit={submit} noValidate className="h-fit space-y-4 rounded-2xl border bg-card p-5 shadow-warm lg:sticky lg:top-24">
          <p className="font-semibold">{t("campaigns.amount")}</p>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button key={p} type="button" aria-pressed={!custom && amount === p} onClick={() => { setAmount(p); setCustom(""); }}
                className={cn("rounded-lg border py-2 font-semibold transition", !custom && amount === p ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-secondary")}>{inr(p)}</button>
            ))}
          </div>
          <div>
            <Label htmlFor="custom">{t("campaigns.custom")}</Label>
            <Input id="custom" type="number" min={1} inputMode="numeric" className="mt-1" placeholder="₹" value={custom} onChange={(e) => setCustom(e.target.value)} aria-invalid={!!err["amount"]} />
            {err["amount"] && <p className="mt-1 text-xs text-destructive">{err["amount"]}</p>}
          </div>
          {fld("donor_name", t("book.fullName"))}
          {fld("donor_email", t("book.email"), "email")}
          {fld("donor_phone", t("book.phone"), "tel")}
          {fld("donor_pan", t("campaigns.pan"))}
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={anon} onCheckedChange={(v) => setAnon(v === true)} />{t("campaigns.anonymous")}</label>
          <p className="text-xs text-muted-foreground">{t("campaigns.consent")}</p>
          <Button type="submit" variant="saffron" size="lg" className="w-full" disabled={busy || ended}>
            {ended ? t("campaigns.ended") : busy ? t("common.sending") : `${t("campaigns.donate")} · ${inr(Number.isFinite(finalAmount) ? finalAmount : 0)}`}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
