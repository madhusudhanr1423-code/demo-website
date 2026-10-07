import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getBooking, updateBookingStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageContainer, RequireAuth } from "@/components/site";
import { BookingSummary } from "@/components/BookingSummary";

export const Route = createFileRoute("/payment/$bookingId")({
  head: () => ({
    meta: [
      { title: "Payment — [Temple Name]" },
      { name: "description", content: "Complete payment for your pooja booking." },
      { property: "og:title", content: "Payment — [Temple Name]" },
      { property: "og:description", content: "Complete payment for your pooja booking." },
    ],
  }),
  component: () => <RequireAuth><PaymentPage /></RequireAuth>,
});

function PaymentPage() {
  const { bookingId } = Route.useParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const { data: b, isLoading } = useQuery({ queryKey: ["booking", bookingId], queryFn: () => getBooking(bookingId) });
  if (isLoading) return <PageContainer className="max-w-lg"><Skeleton className="h-72" /></PageContainer>;
  if (!b) return <PageContainer><EmptyState title="Booking not found" text="Please check the link." /></PageContainer>;
  const simulate = async () => {
    setBusy(true);
    await updateBookingStatus(b.id, "paid");
    toast.success("Payment successful");
    navigate({ to: "/booking-success/$bookingId", params: { bookingId: b.id } });
  };
  return (
    <PageContainer className="max-w-lg">
      <h1 className="mb-6 text-4xl text-primary">Complete payment</h1>
      <BookingSummary b={b} />
      <div className="mt-6 space-y-3">
        <Button className="w-full opacity-60" size="lg" disabled aria-disabled>Pay with Razorpay (coming soon)</Button>
        <Button variant="saffron" className="w-full" size="lg" onClick={simulate} disabled={busy}>{busy ? "Processing…" : "Simulate success"}</Button>
      </div>
    </PageContainer>
  );
}
