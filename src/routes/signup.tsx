import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined }),
  head: () => ({
    meta: [
      { title: "Sign Up — [Temple Name]" },
      { name: "description", content: "Create an account to book temple poojas online." },
      { property: "og:title", content: "Sign Up — [Temple Name]" },
      { property: "og:description", content: "Create your devotee account." },
    ],
  }),
  component: () => <AuthForm mode="signup" redirect={Route.useSearch().redirect} />,
});
