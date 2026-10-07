import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { pageHead } from "@/lib/seo";
import { SHIPPING_FLAT } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CartLine } from "@/components/CartDrawer";
import { EmptyState, PageContainer, SectionHeading, inr } from "@/components/site";

export const Route = createFileRoute("/cart")({
  head: pageHead("Your Cart", "Review the items in your cart before checkout."),
  component: CartPage,
});

function CartPage() {
  const { t } = useTranslation();
  const { items, subtotal } = useCart();
  if (!items.length) return <PageContainer><EmptyState title={t("cart.empty")} text={t("cart.emptyText")} action={<Button asChild><Link to="/shop">{t("cart.continue")}</Link></Button>} /></PageContainer>;
  return (
    <PageContainer className="max-w-4xl">
      <SectionHeading title={t("cart.title")} />
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <ul className="divide-y rounded-xl border bg-card px-4">{items.map((i) => <CartLine key={i.product_id} item={i} />)}</ul>
        <aside className="h-fit space-y-2 rounded-xl border bg-card p-5 text-sm">
          <div className="flex justify-between"><span>{t("cart.subtotal")}</span><span>{inr(subtotal)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>{t("cart.shipping")}</span><span>{inr(SHIPPING_FLAT)}</span></div>
          <div className="flex justify-between border-t pt-2 text-lg font-bold"><span>{t("cart.total")}</span><span>{inr(subtotal + SHIPPING_FLAT)}</span></div>
          <Button variant="saffron" size="lg" className="mt-3 w-full" asChild><Link to="/checkout">{t("cart.checkout")}</Link></Button>
        </aside>
      </div>
    </PageContainer>
  );
}
