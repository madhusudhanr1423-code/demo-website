import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PlayCircle, Check } from "lucide-react";
import { getBooking } from "@/lib/api";
import type { BookingStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageContainer, RequireAuth } from "@/components/site";
import { BookingSummary } from "@/components/BookingSummary";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-bookings/$id")({
  head: () => ({
    meta: [
      { title: "Booking Details — [Temple Name]" },
      { name: "description", content: "Details, family members and status of your pooja booking." },
      { property: "og:title", content: "Booking Details — [Temple Name]" },
      { property: "og:description", content: "See the status of your pooja booking." },
    ],
  }),
  component: () => <RequireAuth><Detail /></RequireAuth>,
});

const flow: BookingStatus[] = ["pending", "paid", "confirmed", "completed"];

function Detail() {
  const { id } = Route.useParams();
  const { data: b, isLoading } = useQuery({ queryKey: ["booking", id], queryFn: () => getBooking(id) });
  if (isLoading) return <PageContainer><Skeleton className="h-96" /></PageContainer>;
  if (!b) return <PageContainer><EmptyState title="Booking not found" text="It may not belong to your account." action={<Button asChild><Link to="/my-bookings">Back</Link></Button>} /></PageContainer>;
  const off = b.status === "cancelled" || b.status === "refunded";
  const idx = flow.indexOf(b.status);
  return (
    <PageContainer className="max-w-4xl">
      <Link to="/my-bookings" className="text-sm text-primary hover:underline">← My Bookings</Link>
      <h1 className="mb-6 mt-2 text-4xl text-primary">{b.pooja?.title}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <BookingSummary b={b} />
          {b.video_url && <Button variant="saffron" size="lg" className="w-full" asChild><a href={b.video_url} target="_blank" rel="noreferrer"><PlayCircle className="h-5 w-5" />Watch pooja video</a></Button>}
        </div>
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-2xl text-primary">Status</h2>
            {off ? <p className="capitalize text-muted-foreground">This booking was {b.status}.</p> : (
              <ol className="space-y-4">
                {flow.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className={cn("grid h-7 w-7 place-items-center rounded-full border text-xs", i <= idx ? "border-success bg-success text-primary-foreground" : "bg-muted text-muted-foreground")}>{i <= idx ? <Check className="h-4 w-4" /> : i + 1}</span>
                    <span className={cn("capitalize", i <= idx ? "font-semibold" : "text-muted-foreground")}>{s}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-3 text-2xl text-primary">Family members</h2>
            <ul className="divide-y">
              {b.members.map((m) => <li key={m.id} className="flex justify-between py-2 text-sm"><span className="font-medium">{m.name}</span><span className="text-muted-foreground">{m.gotra} · {m.relation}</span></li>)}
            </ul>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
