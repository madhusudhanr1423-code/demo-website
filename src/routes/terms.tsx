import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — [Temple Name]" },
      { name: "description", content: "The terms that apply to using this website and booking poojas." },
      { property: "og:title", content: "Terms & Conditions — [Temple Name]" },
      { property: "og:description", content: "The terms that apply to using this website and booking poojas." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions">
      <h2>Use of the website</h2>
      <p>By using this website you agree to provide accurate information and to use the services only for lawful devotional purposes.</p>
      <h2>Bookings</h2>
      <p>A booking is confirmed only after successful payment. The temple may reschedule a pooja due to unforeseen circumstances and will inform you in advance.</p>
      <h2>Videos</h2>
      <p>Pooja videos are shared for personal, non-commercial use by the devotee and family.</p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continued use of the website means you accept the updated terms.</p>
    </PolicyPage>
  );
}
