import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined }),
  head: () => ({
    meta: [
      { title: "Login — [Temple Name]" },
      { name: "description", content: "Log in to book poojas and view your bookings." },
      { property: "og:title", content: "Login — [Temple Name]" },
      { property: "og:description", content: "Log in to your devotee account." },
    ],
  }),
  component: () => <AuthForm mode="login" redirect={Route.useSearch().redirect} />,
});
