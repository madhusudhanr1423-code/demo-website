import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { createOrder, SHIPPING_FLAT, type ShippingDetails } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, PageContainer, RequireAuth, inr } from "@/components/site";

export const Route = createFileRoute("/checkout")({
  head: pageHead("Checkout", "Enter your shipping details and place your order."),
  component: () => <RequireAuth><Checkout /></RequireAuth>,
});

function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { items, subtotal } = useCart();
  const [f, setF] = useState<ShippingDetails>({ full_name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { setF((c) => ({ ...c, full_name: c.full_name || profile?.full_name || "", phone: c.phone || profile?.phone || "", email: c.email || user?.email || "" })); }, [user, profile]);

  if (!items.length) return <PageContainer><EmptyState title={t("cart.empty")} text={t("cart.emptyText")} action={<Button asChild><Link to="/shop">{t("cart.continue")}</Link></Button>} /></PageContainer>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    (Object.keys(f) as (keyof ShippingDetails)[]).forEach((k) => { if (!f[k].trim()) er[k] = t("checkout.eRequired"); });
    if (f.phone && !/^[6-9]\d{9}$/.test(f.phone)) er["phone"] = t("book.ePhone");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er["email"] = t("book.eEmail");
    if (f.pincode && !/^\d{6}$/.test(f.pincode)) er["pincode"] = t("checkout.ePincode");
    setErr(er);
    if (Object.keys(er).length) { toast.error(t("book.fix")); return; }
    setBusy(true);
    try {
      const o = await createOrder(items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })), f);
      navigate({ to: "/payment/order/$orderId", params: { orderId: o.id } });
    } catch (x) { toast.error((x as Error).message); setBusy(false); }
  };

  const field = (k: keyof ShippingDetails, label: string, type = "text", cls = "") => (
    <div className={cls}>
      <Label htmlFor={k}>{label}</Label>
      {k === "address" ? <Textarea id={k} rows={2} className="mt-1" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} />
        : <Input id={k} type={type} inputMode={k === "pincode" || k === "phone" ? "numeric" : undefined} className="mt-1" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} />}
      {err[k] && <p className="mt-1 text-xs text-destructive">{err[k]}</p>}
    </div>
  );

  return (
    <PageContainer>
      <h1 className="mb-6 text-4xl text-primary">{t("checkout.title")}</h1>
      <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2">
          {field("full_name", t("book.fullName"), "text", "sm:col-span-2")}
          {field("phone", t("book.phone"), "tel")}
          {field("email", t("book.email"), "email")}
          {field("address", t("checkout.address"), "text", "sm:col-span-2")}
          {field("city", t("checkout.city"))}
          {field("state", t("checkout.state"))}
          {field("pincode", t("checkout.pincode"))}
        </div>
        <aside className="h-fit rounded-xl border bg-card p-5 shadow-warm lg:sticky lg:top-24">
          <h2 className="mb-3 text-2xl text-primary">{t("checkout.summary")}</h2>
          <ul className="space-y-1 text-sm">{items.map((i) => <li key={i.product_id} className="flex justify-between gap-2"><span>{i.name} × {i.quantity}</span><span>{inr(i.price * i.quantity)}</span></li>)}</ul>
          <div className="mt-3 space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between"><span>{t("cart.subtotal")}</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between"><span>{t("cart.shipping")}</span><span>{inr(SHIPPING_FLAT)}</span></div>
            <div className="flex justify-between pt-1 text-lg font-bold"><span>{t("cart.total")}</span><span>{inr(subtotal + SHIPPING_FLAT)}</span></div>
          </div>
          <Button type="submit" variant="saffron" size="lg" className="mt-4 w-full" disabled={busy}>{busy ? t("common.sending") : t("checkout.proceed")}</Button>
        </aside>
      </form>
    </PageContainer>
  );
}
