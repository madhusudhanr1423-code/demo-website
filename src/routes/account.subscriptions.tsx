import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getMySubscriptions } from "@/lib/api";
import { pageHead } from "@/lib/seo";
import { t_content, scheduleText } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, PageContainer, RequireAuth, SectionHeading, StatusBadge, fmtDate, useLang } from "@/components/site";

export const Route = createFileRoute("/account/subscriptions")({
  head: pageHead("My Subscriptions", "Your seva subscriptions and their sessions."),
  component: () => <RequireAuth><Subs /></RequireAuth>,
});

function Subs() {
  const { t } = useTranslation();
  const lang = useLang();
  const [open, setOpen] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["subs"], queryFn: getMySubscriptions });
  return (
    <PageContainer className="max-w-3xl">
      <SectionHeading title={t("subs.title")} />
      {isError ? <ErrorState onRetry={refetch} /> : isLoading ? <Skeleton className="h-32" />
        : !data?.length ? <EmptyState title={t("subs.emptyTitle")} text={t("subs.emptyText")} action={<Button asChild><Link to="/sevas">{t("subs.browse")}</Link></Button>} />
        : (
          <ul className="space-y-3">
            {data.map((b) => (
              <li key={b.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-serif text-xl text-primary">{b.pooja && t_content(b.pooja, "title", lang)}</p>
                    <p className="text-sm text-muted-foreground">{b.pooja && scheduleText(b.pooja, t)}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <Button variant="link" className="px-0" onClick={() => setOpen(open === b.id ? null : b.id)}>{open === b.id ? t("subs.hide") : t("subs.show")}</Button>
                {open === b.id && (
                  <ul className="divide-y">
                    {b.sessions.map((s) => (
                      <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                        <span>{fmtDate(s.session_date, lang)}</span>
                        <StatusBadge status={s.status} />
                        {s.video_url && <a href={s.video_url} target="_blank" rel="noreferrer" className="text-primary underline">{t("subs.watch")}</a>}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
    </PageContainer>
  );
}
