import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { adminGetBookings, adminUpdateBooking, type BookingDetail } from "@/lib/api";
import type { BookingStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AdminHeader, AdminTable, EmptyRow, TableSkeleton, selectCls } from "@/components/admin/AdminUI";
import { StatusBadge, fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/admin/bookings")({ component: Page });

const STATUSES: BookingStatus[] = ["pending", "paid", "confirmed", "completed", "cancelled", "refunded"];

function Page() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "bookings"], queryFn: adminGetBookings });
  const [status, setStatus] = useState("");
  const [pooja, setPooja] = useState("");
  const [date, setDate] = useState("");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<BookingDetail | null>(null);
  const poojas = [...new Map((data ?? []).map((b) => [b.pooja_id, b.pooja?.title ?? b.pooja_id])).entries()];
  const list = (data ?? []).filter((b) =>
    (!status || b.status === status) && (!pooja || b.pooja_id === pooja) &&
    (!date || b.pooja?.pooja_date === date || b.created_at.startsWith(date)) &&
    (!q || (b.contact_name + b.phone).toLowerCase().includes(q.toLowerCase())));
  return (
    <>
      <AdminHeader title="Bookings">
        <Input aria-label="Search name or phone" placeholder="Name or phone" className="w-40" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Status" className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select aria-label="Pooja" className={selectCls} value={pooja} onChange={(e) => setPooja(e.target.value)}><option value="">All poojas</option>{poojas.map(([id, t]) => <option key={id} value={id}>{t}</option>)}</select>
        <Input aria-label="Date" type="date" className="w-40" value={date} onChange={(e) => setDate(e.target.value)} />
      </AdminHeader>
      {isLoading ? <TableSkeleton /> : (
        <AdminTable head={["ID", "Pooja", "Contact", "Phone", "Members", "Amount", "Status", "Booked"]}>
          {!list.length ? <EmptyRow cols={8} text="No bookings match." /> : list.map((b) => (
            <tr key={b.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSel(b)}>
              <td className="px-3 py-2 font-mono">{b.id}</td><td className="px-3 py-2">{b.pooja?.title}</td><td className="px-3 py-2">{b.contact_name}</td>
              <td className="px-3 py-2">{b.phone}</td><td className="px-3 py-2">{b.members.length}</td><td className="px-3 py-2">{inr(b.total_amount)}</td>
              <td className="px-3 py-2"><StatusBadge status={b.status} /></td><td className="whitespace-nowrap px-3 py-2">{fmtDate(b.created_at)}</td>
            </tr>
          ))}
        </AdminTable>
      )}
      <BookingDrawer b={sel} onClose={() => setSel(null)} />
    </>
  );
}

function BookingDrawer({ b, onClose }: { b: BookingDetail | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [video, setVideo] = useState("");
  useEffect(() => { if (b) { setStatus(b.status); setVideo(b.video_url ?? ""); } }, [b]);
  const m = useMutation({
    mutationFn: () => adminUpdateBooking(b!.id, { status, video_url: video.trim() || null }),
    onSuccess: () => { toast.success("Booking updated"); qc.invalidateQueries({ queryKey: ["admin"] }); onClose(); },
    onError: (e) => toast.error((e as Error).message),
  });
  const copy = async () => {
    if (!b) return;
    const text = [`Booking ${b.id}`, `Pooja: ${b.pooja?.title} (${b.pooja?.pooja_date})`, `Contact: ${b.contact_name}, ${b.phone}, ${b.email}`, `WhatsApp: ${b.whatsapp_number}`, `Amount: ${inr(b.total_amount)}`, "Members:", ...b.members.map((x, i) => `${i + 1}. ${x.name} – ${x.gotra} – ${x.relation}`)].join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Details copied");
  };
  return (
    <Sheet open={!!b} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {b && (
          <>
            <SheetHeader><SheetTitle>Booking {b.id}</SheetTitle></SheetHeader>
            <div className="space-y-5 p-4 text-sm">
              <div><p className="font-semibold">{b.pooja?.title}</p><p className="text-muted-foreground">{b.pooja?.pooja_date && fmtDate(b.pooja.pooja_date)} · {inr(b.total_amount)}</p></div>
              <div><p className="font-semibold">Contact</p><p>{b.contact_name}</p><p>{b.phone} · WhatsApp {b.whatsapp_number}</p><p>{b.email}</p></div>
              <div>
                <p className="mb-1 font-semibold">Members</p>
                <ul className="divide-y rounded-lg border">{b.members.map((x) => <li key={x.id} className="flex justify-between gap-2 px-3 py-2"><span>{x.name}</span><span className="text-muted-foreground">{x.gotra} · {x.relation}</span></li>)}</ul>
              </div>
              <div><Label htmlFor="bs">Status</Label><select id="bs" className={selectCls + " mt-1 w-full"} value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
              <div><Label htmlFor="bv">Video URL</Label><Input id="bv" className="mt-1" placeholder="https://" value={video} onChange={(e) => setVideo(e.target.value)} /></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={copy}><Copy className="h-4 w-4" />Copy details</Button>
                <Button className="flex-1" onClick={() => m.mutate()} disabled={m.isPending}>{m.isPending ? "Saving…" : "Save"}</Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
