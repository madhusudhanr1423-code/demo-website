import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { inr } from "@/components/site";

export function CartLine({ item }: { item: CartItem }) {
  const { t } = useTranslation();
  const { setQty, remove } = useCart();
  return (
    <li className="flex gap-3 py-3">
      <img src={item.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-tight">{item.name}</p>
        <p className="text-sm text-muted-foreground">{inr(item.price)}</p>
        <div className="mt-2 flex items-center gap-2">
          <Button type="button" size="icon" variant="outline" className="h-7 w-7" aria-label="-" disabled={item.quantity <= 1} onClick={() => setQty(item.product_id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
          <span className="w-6 text-center text-sm" aria-live="polite">{item.quantity}</span>
          <Button type="button" size="icon" variant="outline" className="h-7 w-7" aria-label="+" disabled={item.quantity >= item.stock} onClick={() => setQty(item.product_id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
          <Button type="button" size="icon" variant="ghost" className="ml-auto h-7 w-7" aria-label={t("cart.remove")} onClick={() => remove(item.product_id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
      <p className="font-semibold">{inr(item.price * item.quantity)}</p>
    </li>
  );
}

export function CartButton() {
  const { t } = useTranslation();
  const { count, setDrawerOpen } = useCart();
  return (
    <button type="button" onClick={() => setDrawerOpen(true)} aria-label={`${t("nav.cart")} (${count})`} className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
      <ShoppingCart className="h-5 w-5 text-primary" />
      {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-saffron px-1 text-[10px] font-bold text-saffron-foreground">{count}</span>}
    </button>
  );
}

export function CartDrawer() {
  const { t } = useTranslation();
  const { items, subtotal, drawerOpen, setDrawerOpen } = useCart();
  const close = () => setDrawerOpen(false);
  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader><SheetTitle className="font-serif text-2xl text-primary">{t("cart.title")}</SheetTitle></SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <ShoppingCart className="h-10 w-10 text-saffron" />
            <p className="font-serif text-xl text-primary">{t("cart.empty")}</p>
            <Button variant="outline" asChild onClick={close}><Link to="/shop">{t("cart.continue")}</Link></Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-4">{items.map((i) => <CartLine key={i.product_id} item={i} />)}</ul>
            <div className="space-y-3 border-t p-4">
              <div className="flex justify-between font-semibold"><span>{t("cart.subtotal")}</span><span>{inr(subtotal)}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" asChild onClick={close}><Link to="/cart">{t("cart.viewCart")}</Link></Button>
                <Button variant="saffron" asChild onClick={close}><Link to="/checkout">{t("cart.checkout")}</Link></Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
