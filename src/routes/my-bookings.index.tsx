import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageContainer, RequireAuth, SectionHeading, StatusBadge, fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/my-bookings/")({
  head: () => ({
    meta: [
      { title: "My Bookings — [Temple Name]" },
      { name: "description", content: "Track your pooja bookings, status and videos." },
      { property: "og:title", content: "My Bookings — [Temple Name]" },
      { property: "og:description", content: "Track your pooja bookings." },
    ],
  }),
  component: () => <RequireAuth><MyBookings /></RequireAuth>,
});

function MyBookings() {
  const { data, isLoading } = useQuery({ queryKey: ["my-bookings"], queryFn: getMyBookings });
  return (
    <PageContainer className="max-w-4xl">
      <SectionHeading title="My Bookings" />
      {isLoading ? <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}</div>
        : !data?.length ? <EmptyState title="No bookings yet" text="Your booked poojas will appear here." action={<Button asChild><Link to="/poojas">Book a Pooja</Link></Button>} />
        : (
          <ul className="space-y-3">
            {data.map((b) => (
              <li key={b.id}>
                <Link to="/my-bookings/$id" params={{ id: b.id }} className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 transition hover:shadow-warm">
                  {b.pooja && <img src={b.pooja.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-xl text-primary">{b.pooja?.title}</p>
                    <p className="text-sm text-muted-foreground">{b.pooja && fmtDate(b.pooja.pooja_date)} · {b.members.length} member(s)</p>
                  </div>
                  <div className="text-right"><StatusBadge status={b.status} /><p className="mt-1 font-semibold">{inr(b.total_amount)}</p></div>
                </Link>
              </li>
            ))}
          </ul>
        )}
    </PageContainer>
  );
}
