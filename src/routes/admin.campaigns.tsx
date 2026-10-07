import { createFileRoute } from "@tanstack/react-router";
import { adminDeleteCampaign, adminGetCampaigns, adminSaveCampaign } from "@/lib/api";
import type { Campaign } from "@/types";
import { CrudPage } from "@/components/admin/AdminUI";
import { fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/admin/campaigns")({ component: Page });

function Page() {
  return (
    <CrudPage<Campaign>
      title="Campaigns" queryKey="campaigns" fetch={adminGetCampaigns} save={adminSaveCampaign} remove={adminDeleteCampaign} slugFrom="title"
      blank={{ title: "", slug: "", story: "", image_url: "", goal_amount: 100000, raised_amount: 0, end_date: "", is_active: true }}
      searchText={(c) => c.title}
      fields={[
        { key: "title", label: "Title", type: "text", required: true, full: true },
        { key: "slug", label: "Slug", type: "slug", required: true, full: true },
        { key: "story", label: "Story", type: "textarea" },
        { key: "image_url", label: "Image", type: "image" },
        { key: "goal_amount", label: "Goal (₹)", type: "number", required: true },
        { key: "end_date", label: "End date", type: "date", required: true },
        { key: "is_active", label: "Active", type: "switch" },
      ]}
      columns={[
        { label: "Campaign", render: (c) => <span className="font-medium">{c.title}</span> },
        { label: "Progress", render: (c) => {
          const pct = Math.round((c.raised_amount / Math.max(1, c.goal_amount)) * 100);
          return <div className="w-40"><div className="h-2 rounded bg-muted"><div className="h-full rounded bg-saffron" style={{ width: `${Math.min(100, pct)}%` }} /></div><p className="mt-1 text-xs text-muted-foreground">{pct}% · {inr(c.raised_amount)} / {inr(c.goal_amount)}</p></div>;
        } },
        { label: "Ends", render: (c) => <span className="whitespace-nowrap">{c.end_date && fmtDate(c.end_date)}</span> },
        { label: "Active", render: (c) => (c.is_active ? "Yes" : "No") },
      ]}
    />
  );
}
