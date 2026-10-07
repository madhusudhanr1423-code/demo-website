import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminGetStats } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { StatusBadge, fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { data: s, isLoading } = useQuery({ queryKey: ["admin", "stats"], queryFn: adminGetStats });
  if (isLoading || !s) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>;
  const cards = [
    ["Total bookings", s.totalBookings], ["Paid bookings", s.paidBookings], ["Pooja revenue", inr(s.poojaRevenue)], ["Orders", s.orders],
    ["Product revenue", inr(s.productRevenue)], ["Total donations", inr(s.totalDonations)], ["Active campaigns", s.activeCampaigns],
  ] as const;
  const max = Math.max(1, ...s.bookingsPerPooja.map((b) => b.count));
  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([l, v]) => <div key={l} className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">{l}</p><p className="mt-1 text-2xl font-bold text-primary">{v}</p></div>)}
      </div>
      <section className="mt-8 rounded-xl border bg-card p-5">
        <h2 className="mb-4 text-xl text-primary">Bookings per pooja</h2>
        <ul className="space-y-2">
          {s.bookingsPerPooja.map((b) => (
            <li key={b.title} className="grid grid-cols-[minmax(0,10rem)_1fr_2rem] items-center gap-3 text-sm">
              <span className="truncate">{b.title}</span>
              <div className="h-4 rounded bg-muted"><div className="h-full rounded bg-saffron" style={{ width: `${(b.count / max) * 100}%` }} /></div>
              <span className="text-right font-semibold">{b.count}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="mb-3 text-xl text-primary">Latest 5 bookings</h2>
        <AdminTable head={["ID", "Pooja", "Contact", "Amount", "Status", "Date"]}>
          {!s.latestBookings.length ? <EmptyRow cols={6} /> : s.latestBookings.map((b) => (
            <tr key={b.id}>
              <td className="px-3 py-2 font-mono">{b.id}</td><td className="px-3 py-2">{b.pooja?.title}</td><td className="px-3 py-2">{b.contact_name}</td>
              <td className="px-3 py-2">{inr(b.total_amount)}</td><td className="px-3 py-2"><StatusBadge status={b.status} /></td><td className="whitespace-nowrap px-3 py-2">{fmtDate(b.created_at)}</td>
            </tr>
          ))}
        </AdminTable>
      </section>
    </>
  );
}
