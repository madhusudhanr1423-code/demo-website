import { useTranslation } from "react-i18next";
import type { OrderDetail } from "@/lib/api";
import { StatusBadge, fmtDate, inr, useLang } from "@/components/site";

export function OrderSummary({ o, full }: { o: OrderDetail; full?: boolean }) {
  const { t } = useTranslation();
  const lang = useLang();
  const subtotal = o.total_amount - o.shipping_amount;
  return (
    <div className="space-y-4 rounded-xl border bg-card p-5 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono">#{o.id}</span>
        <span className="text-muted-foreground">{fmtDate(o.created_at, lang)}</span>
        <StatusBadge status={o.status} />
      </div>
      <div>
        <p className="mb-1 font-semibold">{t("orders.items")}</p>
        <ul className="divide-y">
          {o.items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-2">
              {i.product && <img src={i.product.image_url} alt="" className="h-10 w-10 rounded object-cover" />}
              <span className="flex-1">{i.product?.name} × {i.quantity}</span>
              <span>{inr(i.unit_price * i.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-1 border-t pt-3">
        <div className="flex justify-between"><span>{t("cart.subtotal")}</span><span>{inr(subtotal)}</span></div>
        <div className="flex justify-between"><span>{t("cart.shipping")}</span><span>{inr(o.shipping_amount)}</span></div>
        <div className="flex justify-between text-lg font-bold"><span>{t("cart.total")}</span><span>{inr(o.total_amount)}</span></div>
      </div>
      {full && (
        <>
          <div className="border-t pt-3">
            <p className="font-semibold">{t("orders.shipTo")}</p>
            <p className="text-muted-foreground">{o.full_name}, {o.phone}<br />{o.address}, {o.city}, {o.state} – {o.pincode}</p>
          </div>
          {o.tracking_number && <div className="border-t pt-3"><p className="font-semibold">{t("orders.tracking")}</p><p className="font-mono">{o.tracking_number}</p></div>}
        </>
      )}
    </div>
  );
}
