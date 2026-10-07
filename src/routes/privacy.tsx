import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — [Temple Name]" },
      { name: "description", content: "How we collect, use and protect your personal information." },
      { property: "og:title", content: "Privacy Policy — [Temple Name]" },
      { property: "og:description", content: "How we collect, use and protect your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Policy">
      <h2>Information we collect</h2>
      <p>We collect your name, phone, email and the names, gotras and relations of family members you add to a booking.</p>
      <h2>How we use it</h2>
      <p>Your information is used only to perform the pooja, communicate with you about your booking and share the video.</p>
      <h2>Sharing</h2>
      <p>We do not sell your information. Payment details are handled by our payment partner and are never stored on our servers.</p>
      <h2>Your choices</h2>
      <p>You can update your profile at any time or contact us to request deletion of your data.</p>
    </PolicyPage>
  );
}
