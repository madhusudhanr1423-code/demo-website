import type { BookingDetail } from "@/lib/api";
import { StatusBadge, fmtDate, inr } from "@/components/site";

export function BookingSummary({ b }: { b: BookingDetail }) {
  return (
    <dl className="space-y-2 rounded-xl border bg-card p-5 text-sm">
      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Booking ID</dt><dd className="font-mono">{b.id}</dd></div>
      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Pooja</dt><dd className="text-right font-medium">{b.pooja?.title}</dd></div>
      {b.pooja && <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Date</dt><dd>{fmtDate(b.pooja.pooja_date)}</dd></div>}
      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Contact</dt><dd className="text-right">{b.contact_name}</dd></div>
      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Members</dt><dd>{b.members.length}</dd></div>
      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={b.status} /></dd></div>
      <div className="flex justify-between border-t pt-3 text-lg font-bold"><dt>Total</dt><dd>{inr(b.total_amount)}</dd></div>
    </dl>
  );
}
