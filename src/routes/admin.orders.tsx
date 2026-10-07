import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminGetOrders, adminUpdateOrder, type OrderDetail } from "@/lib/api";
import type { OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AdminHeader, AdminTable, EmptyRow, TableSkeleton, selectCls } from "@/components/admin/AdminUI";
import { StatusBadge, fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/admin/orders")({ component: Page });

const STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"];

function Page() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "orders"], queryFn: adminGetOrders });
  const [status, setStatus] = useState("");
  const [sel, setSel] = useState<OrderDetail | null>(null);
  const list = (data ?? []).filter((o) => !status || o.status === status);
  return (
    <>
      <AdminHeader title="Orders">
        <select aria-label="Status" className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </AdminHeader>
      {isLoading ? <TableSkeleton /> : (
        <AdminTable head={["Order", "Customer", "City", "Items", "Total", "Status", "Date"]}>
          {!list.length ? <EmptyRow cols={7} text="No orders match." /> : list.map((o) => (
            <tr key={o.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSel(o)}>
              <td className="px-3 py-2 font-mono">{o.id}</td><td className="px-3 py-2">{o.full_name}</td><td className="px-3 py-2">{o.city}</td>
              <td className="px-3 py-2">{o.items.reduce((n, i) => n + i.quantity, 0)}</td><td className="px-3 py-2">{inr(o.total_amount)}</td>
              <td className="px-3 py-2"><StatusBadge status={o.status} /></td><td className="whitespace-nowrap px-3 py-2">{fmtDate(o.created_at)}</td>
            </tr>
          ))}
        </AdminTable>
      )}
      <OrderDrawer o={sel} onClose={() => setSel(null)} />
    </>
  );
}

function OrderDrawer({ o, onClose }: { o: OrderDetail | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [tracking, setTracking] = useState("");
  useEffect(() => { if (o) { setStatus(o.status); setTracking(o.tracking_number ?? ""); } }, [o]);
  const m = useMutation({
    mutationFn: () => adminUpdateOrder(o!.id, { status, tracking_number: tracking.trim() || null }),
    onSuccess: () => { toast.success("Order updated"); qc.invalidateQueries({ queryKey: ["admin"] }); onClose(); },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <Sheet open={!!o} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {o && (
          <>
            <SheetHeader><SheetTitle>Order {o.id}</SheetTitle></SheetHeader>
            <div className="space-y-5 p-4 text-sm">
              <ul className="divide-y rounded-lg border">
                {o.items.map((i) => <li key={i.id} className="flex justify-between gap-2 px-3 py-2"><span>{i.product?.name} × {i.quantity}</span><span>{inr(i.unit_price * i.quantity)}</span></li>)}
                <li className="flex justify-between px-3 py-2 text-muted-foreground"><span>Shipping</span><span>{inr(o.shipping_amount)}</span></li>
                <li className="flex justify-between px-3 py-2 font-bold"><span>Total</span><span>{inr(o.total_amount)}</span></li>
              </ul>
              <div><p className="font-semibold">Shipping address</p><p>{o.full_name}, {o.phone}, {o.email}</p><p>{o.address}, {o.city}, {o.state} – {o.pincode}</p></div>
              <div><Label htmlFor="os">Status</Label><select id="os" className={selectCls + " mt-1 w-full"} value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
              <div><Label htmlFor="ot">Tracking number</Label><Input id="ot" className="mt-1" value={tracking} onChange={(e) => setTracking(e.target.value)} /></div>
              <Button className="w-full" onClick={() => m.mutate()} disabled={m.isPending}>{m.isPending ? "Saving…" : "Save"}</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
