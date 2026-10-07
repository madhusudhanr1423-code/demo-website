import { useTranslation } from "react-i18next";
import type { Campaign } from "@/types";
import { inr } from "@/components/site";

export const daysLeft = (c: Campaign) => Math.ceil((new Date(c.end_date + "T23:59:59").getTime() - Date.now()) / 86400000);

export function CampaignProgress({ c }: { c: Campaign }) {
  const { t } = useTranslation();
  const pct = Math.round((c.raised_amount / c.goal_amount) * 100);
  const d = daysLeft(c);
  return (
    <div className="space-y-2">
      <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-saffron transition-all" style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold">{pct}%</span>
        <span className={d < 0 ? "rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground" : "text-muted-foreground"}>
          {d < 0 ? t("campaigns.ended") : t("campaigns.daysLeft", { count: d })}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{t("campaigns.raised", { raised: inr(c.raised_amount), goal: inr(c.goal_amount) })}</p>
    </div>
  );
}
