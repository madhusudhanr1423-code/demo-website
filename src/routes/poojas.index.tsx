import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getPoojas } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyState, PageContainer, PoojaCard, PoojaCardSkeleton, SectionHeading } from "@/components/site";

export const Route = createFileRoute("/poojas/")({
  head: () => ({
    meta: [
      { title: "All Poojas — [Temple Name]" },
      { name: "description", content: "Browse and filter upcoming temple poojas by deity and category." },
      { property: "og:title", content: "All Poojas — [Temple Name]" },
      { property: "og:description", content: "Browse upcoming poojas by deity and category." },
    ],
  }),
  component: PoojasPage,
});

const selectCls = "h-9 w-full rounded-md border border-input bg-card px-3 text-sm";

function PoojasPage() {
  const { data, isLoading } = useQuery({ queryKey: ["poojas"], queryFn: () => getPoojas() });
  const [deity, setDeity] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const deities = useMemo(() => [...new Set(data?.map((p) => p.deity))], [data]);
  const cats = useMemo(() => [...new Set(data?.map((p) => p.category))], [data]);
  const list = (data ?? []).filter(
    (p) => (!deity || p.deity === deity) && (!category || p.category === category) &&
      (!q || (p.title + p.temple_name + p.deity).toLowerCase().includes(q.toLowerCase())),
  );
  const reset = () => { setDeity(""); setCategory(""); setQ(""); };

  return (
    <PageContainer>
      <SectionHeading eyebrow="Book online" title="Poojas" subtitle="Find the right pooja for your family." />
      <div className="mb-8 grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-3">
        <div><Label htmlFor="s">Search</Label><Input id="s" className="mt-1" placeholder="Search poojas or temples" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div><Label htmlFor="d">Deity</Label>
          <select id="d" className={selectCls + " mt-1"} value={deity} onChange={(e) => setDeity(e.target.value)}>
            <option value="">All deities</option>{deities.map((d) => <option key={d}>{d}</option>)}
          </select></div>
        <div><Label htmlFor="c">Category</Label>
          <select id="c" className={selectCls + " mt-1"} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>{cats.map((d) => <option key={d}>{d}</option>)}
          </select></div>
      </div>
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <PoojaCardSkeleton key={i} />)}</div>
      ) : list.length === 0 ? (
        <EmptyState title="No poojas found" text="Try a different deity, category or search term." action={<Button variant="outline" onClick={reset}>Clear filters</Button>} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <PoojaCard key={p.id} pooja={p} />)}</div>
      )}
    </PageContainer>
  );
}
