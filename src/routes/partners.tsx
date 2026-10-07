import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageContainer, SectionHeading } from "@/components/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Our Brands — [Temple Name]" },
      { name: "description", content: "Our Brands at [Temple Name]." },
      { property: "og:title", content: "Our Brands — [Temple Name]" },
      { property: "og:description", content: "Our Brands at [Temple Name]." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <SectionHeading title={t("partners.title")} />
      <p className="text-muted-foreground">Coming soon.</p>
      <Button className="mt-4" asChild><Link to="/poojas">{t("nav.poojas")}</Link></Button>
    </PageContainer>
  );
}
