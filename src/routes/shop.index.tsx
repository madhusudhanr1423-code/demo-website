import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getProducts } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState, PageContainer, PoojaCardSkeleton, SectionHeading, inr } from "@/components/site";

export const Route = createFileRoute("/shop/")({
  head: pageHead("Temple Shop", "Prasadam, incense, brass diyas and pooja essentials blessed at the temple."),
  component: ShopPage,
});

export function ProductCard({ p }: { p: Product }) {
  const { t } = useTranslation();
  const { add } = useCart();
  const out = p.stock === 0;
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-warm">
      <Link to="/shop/$slug" params={{ slug: p.slug }} className="relative aspect-square overflow-hidden bg-muted">
        <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
        {out && <span className="absolute left-2 top-2 rounded-full bg-foreground/80 px-2 py-0.5 text-xs font-semibold text-background">{t("shop.out")}</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to="/shop/$slug" params={{ slug: p.slug }}><h3 className="text-lg leading-tight text-primary hover:underline">{p.name}</h3></Link>
        <p className="font-bold">{inr(p.price)}</p>
        <Button className="mt-auto" variant={out ? "outline" : "saffron"} disabled={out} onClick={() => { add(p); toast.success(t("shop.added")); }}>
          {out ? t("shop.out") : t("shop.add")}
        </Button>
      </div>
    </div>
  );
}

function ShopPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const list = (data ?? []).filter((p) => (p.name + p.description).toLowerCase().includes(q.toLowerCase()));
  return (
    <PageContainer>
      <SectionHeading title={t("shop.title")} subtitle={t("shop.subtitle")} />
      <Input aria-label={t("common.search")} placeholder={t("common.search")} className="mb-6 max-w-sm" value={q} onChange={(e) => setQ(e.target.value)} />
      {isError ? <ErrorState onRetry={refetch} />
        : isLoading ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 6 }).map((_, i) => <PoojaCardSkeleton key={i} />)}</div>
        : !list.length ? <EmptyState title={t("shop.empty")} text={t("shop.emptyText")} />
        : <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </PageContainer>
  );
}
