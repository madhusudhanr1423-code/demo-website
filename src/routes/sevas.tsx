import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageContainer, SectionHeading } from "@/components/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sevas")({
  head: () => ({
    meta: [
      { title: "Sevas — [Temple Name]" },
      { name: "description", content: "Sevas at [Temple Name]." },
      { property: "og:title", content: "Sevas — [Temple Name]" },
      { property: "og:description", content: "Sevas at [Temple Name]." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <SectionHeading title={t("sevas.title")} />
      <p className="text-muted-foreground">Coming soon.</p>
      <Button className="mt-4" asChild><Link to="/poojas">{t("nav.poojas")}</Link></Button>
    </PageContainer>
  );
}
