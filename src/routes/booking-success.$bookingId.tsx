import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { getBooking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageContainer } from "@/components/site";
import { BookingSummary } from "@/components/BookingSummary";

export const Route = createFileRoute("/booking-success/$bookingId")({
  head: () => ({
    meta: [
      { title: "Booking Confirmed — [Temple Name]" },
      { name: "description", content: "Thank you, your pooja booking is received." },
      { property: "og:title", content: "Booking Confirmed — [Temple Name]" },
      { property: "og:description", content: "Thank you for booking your pooja." },
    ],
  }),
  component: Success,
});

function Success() {
  const { bookingId } = Route.useParams();
  const { data: b, isLoading } = useQuery({ queryKey: ["booking", bookingId, "success"], queryFn: () => getBooking(bookingId) });
  if (isLoading) return <PageContainer className="max-w-lg"><Skeleton className="h-80" /></PageContainer>;
  if (!b) return <PageContainer><EmptyState title="Booking not found" text="Please check My Bookings." /></PageContainer>;
  return (
    <PageContainer className="max-w-lg text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
      <h1 className="mt-4 text-4xl text-primary">Thank you!</h1>
      <p className="mb-6 mt-2 text-muted-foreground">Your pooja is booked. We'll share the video once it's performed.</p>
      <div className="text-left"><BookingSummary b={b} /></div>
      <Button className="mt-6" size="lg" asChild><Link to="/my-bookings">View My Bookings</Link></Button>
    </PageContainer>
  );
}
