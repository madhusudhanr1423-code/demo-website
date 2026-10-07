import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Check, Landmark } from "lucide-react";
import { getPoojaBySlug } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageContainer, fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/poojas/$slug")({
  head: () => ({
    meta: [
      { title: "Pooja Details — [Temple Name]" },
      { name: "description", content: "Details, benefits, date and price for this temple pooja." },
      { property: "og:title", content: "Pooja Details — [Temple Name]" },
      { property: "og:description", content: "See the pooja's benefits, date and price, and book online." },
    ],
  }),
  component: PoojaDetail,
});

function PoojaDetail() {
  const { slug } = Route.useParams();
  const { data: p, isLoading } = useQuery({ queryKey: ["pooja", slug], queryFn: () => getPoojaBySlug(slug) });
  if (isLoading) return <PageContainer className="grid gap-8 md:grid-cols-2"><Skeleton className="aspect-[4/3]" /><div className="space-y-3"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-24" /><Skeleton className="h-10 w-40" /></div></PageContainer>;
  if (!p) return <PageContainer><EmptyState title="Pooja not found" text="It may have been removed." action={<Button asChild><Link to="/poojas">Browse poojas</Link></Button>} /></PageContainer>;
  return (
    <PageContainer className="grid gap-10 md:grid-cols-2">
      <img src={p.image_url} alt={p.title} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-warm" />
      <div>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{p.deity} · {p.category}</span>
        <h1 className="mt-3 text-4xl text-primary sm:text-5xl">{p.title}</h1>
        <div className="mt-4 space-y-2 text-muted-foreground">
          <p className="flex items-center gap-2"><Landmark className="h-4 w-4" />{p.temple_name}</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{p.temple_location}</p>
          <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{fmtDate(p.pooja_date)}</p>
        </div>
        <p className="mt-6 leading-relaxed">{p.description}</p>
        <h2 className="mt-6 text-2xl text-primary">Benefits</h2>
        <ul className="mt-2 space-y-1">{p.benefits.map((b) => <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />{b}</li>)}</ul>
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
          <p className="text-2xl font-bold">{inr(p.price_per_person)} <span className="text-sm font-normal text-muted-foreground">per person</span></p>
          <Button variant="saffron" size="lg" className="ml-auto" asChild><Link to="/book/$slug" params={{ slug: p.slug }}>Book Now</Link></Button>
        </div>
      </div>
    </PageContainer>
  );
}
