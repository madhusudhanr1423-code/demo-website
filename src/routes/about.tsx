import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — [Temple Name]" },
      { name: "description", content: "Learn about our temple, priests and the seva we offer." },
      { property: "og:title", content: "About Us — [Temple Name]" },
      { property: "og:description", content: "Learn about our temple, priests and the seva we offer." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PolicyPage title="About Us">
      <h2>Our story</h2>
      <p>For generations, our temple has been a place where families gather to celebrate festivals, seek blessings and mark life's important moments. This website extends that tradition to devotees who cannot visit in person.</p>
      <h2>Our priests</h2>
      <p>Every pooja is performed by trained priests who follow the traditional procedures, chanting each devotee's name and gotra during the sankalpam.</p>
      <h2>Our promise</h2>
      <p>We aim to keep every ritual sincere and transparent, and share the video of your pooja so you can be part of it from wherever you are.</p>
    </PolicyPage>
  );
}
