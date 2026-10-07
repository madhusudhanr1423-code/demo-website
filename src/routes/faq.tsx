import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — [Temple Name]" },
      { name: "description", content: "Answers to common questions about booking poojas online." },
      { property: "og:title", content: "Frequently Asked Questions — [Temple Name]" },
      { property: "og:description", content: "Answers to common questions about booking poojas online." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PolicyPage title="Frequently Asked Questions">
      <h2>How do I book a pooja?</h2>
      <p>Choose a pooja, enter your contact details and family members, then complete the payment. You'll see the booking in My Bookings.</p>
      <h2>How many family members can I add?</h2>
      <p>You can add between 1 and 20 members per booking. The price is calculated per person.</p>
      <h2>When will I receive the video?</h2>
      <p>Videos are usually shared within 24 to 48 hours after the pooja is performed.</p>
      <h2>Do I need my gotra?</h2>
      <p>The gotra is used in the sankalpam. If you do not know it, you may enter 'Shiva gotra' as is customary.</p>
      <h2>Can I cancel a booking?</h2>
      <p>Please see our Refund Policy for cancellation timelines.</p>
    </PolicyPage>
  );
}
