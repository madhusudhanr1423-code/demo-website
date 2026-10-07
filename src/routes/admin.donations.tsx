import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download } from "lucide-react";
import { adminGetDonations } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AdminHeader, AdminTable, EmptyRow, TableSkeleton, downloadCsv, selectCls } from "@/components/admin/AdminUI";
import { StatusBadge, fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/admin/donations")({ component: Page });

function Page() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "donations"], queryFn: adminGetDonations });
  const [camp, setCamp] = useState("");
  const [status, setStatus] = useState("");
  const camps = [...new Map((data ?? []).map((d) => [d.campaign_id, d.campaign?.title ?? d.campaign_id])).entries()];
  const list = (data ?? []).filter((d) => (!camp || d.campaign_id === camp) && (!status || d.status === status));
  const exportCsv = () => downloadCsv(`donations-${new Date().toISOString().slice(0, 10)}.csv`, [
    ["Receipt", "Campaign", "Donor", "Anonymous", "Email", "Phone", "PAN", "Amount", "Status", "Date"],
    ...list.map((d) => [d.receipt_number ?? "", d.campaign?.title ?? "", d.donor_name, d.is_anonymous ? "yes" : "no", d.donor_email, d.donor_phone, d.donor_pan ?? "", d.amount, d.status, d.created_at.slice(0, 10)]),
  ]);
  return (
    <>
      <AdminHeader title="Donations">
        <select aria-label="Campaign" className={selectCls} value={camp} onChange={(e) => setCamp(e.target.value)}><option value="">All campaigns</option>{camps.map(([id, t]) => <option key={id} value={id}>{t}</option>)}</select>
        <select aria-label="Status" className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{["pending", "paid", "failed"].map((s) => <option key={s}>{s}</option>)}</select>
        <Button variant="outline" onClick={exportCsv} disabled={!list.length}><Download className="h-4 w-4" />Export CSV</Button>
      </AdminHeader>
      {isLoading ? <TableSkeleton /> : (
        <AdminTable head={["Donor", "Campaign", "Amount", "PAN", "Receipt", "Status", "Date"]}>
          {!list.length ? <EmptyRow cols={7} text="No donations match." /> : list.map((d) => (
            <tr key={d.id}>
              <td className="px-3 py-2">{d.donor_name}{d.is_anonymous && <span className="ml-1 text-xs text-muted-foreground">(anon)</span>}</td>
              <td className="px-3 py-2">{d.campaign?.title}</td><td className="px-3 py-2">{inr(d.amount)}</td>
              <td className="px-3 py-2 font-mono">{d.donor_pan ?? "—"}</td><td className="px-3 py-2 font-mono">{d.receipt_number ?? "—"}</td>
              <td className="px-3 py-2"><StatusBadge status={d.status} /></td><td className="whitespace-nowrap px-3 py-2">{fmtDate(d.created_at)}</td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
