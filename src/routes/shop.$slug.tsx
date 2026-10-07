import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { getProductBySlug } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, PageContainer, ShareButton, inr } from "@/components/site";

export const Route = createFileRoute("/shop/$slug")({
  head: pageHead("Product", "Product details from the temple shop."),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { t } = useTranslation();
  const { add, items } = useCart();
  const [qty, setQty] = useState(1);
  const { data: p, isLoading, isError, refetch } = useQuery({ queryKey: ["product", slug], queryFn: () => getProductBySlug(slug) });
  if (isError) return <PageContainer><ErrorState onRetry={refetch} /></PageContainer>;
  if (isLoading) return <PageContainer className="grid gap-8 md:grid-cols-2"><Skeleton className="aspect-square" /><Skeleton className="h-64" /></PageContainer>;
  if (!p) return <PageContainer><EmptyState title={t("common.notFound")} text={t("common.notFoundText")} action={<Button asChild><Link to="/shop">{t("nav.shop")}</Link></Button>} /></PageContainer>;
  const inCart = items.find((i) => i.product_id === p.id)?.quantity ?? 0;
  const max = Math.max(0, p.stock - inCart);
  return (
    <PageContainer className="grid gap-10 md:grid-cols-2">
      <img src={p.image_url} alt={p.name} className="aspect-square w-full rounded-2xl object-cover shadow-warm" />
      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-4xl text-primary">{p.name}</h1>
          <ShareButton title={p.name} />
        </div>
        <p className="mt-2 text-2xl font-bold">{inr(p.price)}</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">{p.description}</p>
        <p className="mt-4 text-sm font-medium">{p.stock === 0 ? t("shop.out") : t("shop.inStock", { count: p.stock })}</p>
        {p.stock > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2" role="group" aria-label={t("shop.qty")}>
              <Button size="icon" variant="outline" aria-label="-" disabled={qty <= 1} onClick={() => setQty(qty - 1)}><Minus className="h-4 w-4" /></Button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <Button size="icon" variant="outline" aria-label="+" disabled={qty >= max} onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <Button variant="saffron" size="lg" disabled={max === 0} onClick={() => { add(p, qty); setQty(1); toast.success(t("shop.added")); }}>{t("shop.add")}</Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
