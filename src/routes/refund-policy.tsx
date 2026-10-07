import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — [Temple Name]" },
      { name: "description", content: "Cancellation and refund rules for pooja bookings." },
      { property: "og:title", content: "Refund Policy — [Temple Name]" },
      { property: "og:description", content: "Cancellation and refund rules for pooja bookings." },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <PolicyPage title="Refund Policy">
      <h2>Cancellations</h2>
      <p>Bookings can be cancelled up to 48 hours before the pooja date for a full refund.</p>
      <h2>Late cancellations</h2>
      <p>Cancellations within 48 hours of the pooja are not eligible for a refund, as preparations will have begun.</p>
      <h2>Temple cancellations</h2>
      <p>If the temple cancels or cannot perform a pooja, you will receive a full refund or may choose another date.</p>
      <h2>Processing time</h2>
      <p>Approved refunds are processed to the original payment method within 5 to 7 working days.</p>
    </PolicyPage>
  );
}
