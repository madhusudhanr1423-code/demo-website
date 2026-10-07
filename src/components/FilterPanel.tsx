import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { SlidersHorizontal } from "lucide-react";
import { getFilterOptions, type PoojaFilters } from "@/lib/api";
import { t_content } from "@/lib/content";
import type { FilterKind } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useLang } from "@/components/site";
import { cn } from "@/lib/utils";

const KINDS: FilterKind[] = ["deity", "category", "dosha", "benefit"];

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick}
      className={cn("rounded-full border px-3 py-1 text-sm transition", active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary")}>
      {children}
    </button>
  );
}

function Panel({ value, onApply, showType, onDone }: { value: PoojaFilters; onApply: (f: PoojaFilters) => void; showType?: boolean; onDone?: () => void }) {
  const { t } = useTranslation();
  const lang = useLang();
  const [draft, setDraft] = useState<PoojaFilters>(value);
  useEffect(() => setDraft(value), [value]);
  const opts = useQueries({ queries: KINDS.map((k) => ({ queryKey: ["filter-options", k], queryFn: () => getFilterOptions(k), staleTime: Infinity })) });
  const toggle = (k: FilterKind, slug: string) => {
    const cur = draft[k] ?? [];
    setDraft({ ...draft, [k]: cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug] });
  };
  const clear = () => { const f = { q: "", type: "" as const, frequency: value.frequency ?? "" }; setDraft(f); onApply(f); onDone?.(); };
  return (
    <div className="space-y-5">
      <div><Label htmlFor="fq">{t("common.search")}</Label><Input id="fq" className="mt-1" placeholder={t("common.searchPlaceholder")} value={draft.q ?? ""} onChange={(e) => setDraft({ ...draft, q: e.target.value })} /></div>
      {showType && (
        <div>
          <p className="mb-2 text-sm font-semibold">{t("filters.type")}</p>
          <div className="flex flex-wrap gap-2">
            {(["", "one_time", "chadhava"] as const).map((ty) => <Chip key={ty} active={(draft.type ?? "") === ty} onClick={() => setDraft({ ...draft, type: ty })}>{t(`types.${ty || "all"}`)}</Chip>)}
          </div>
        </div>
      )}
      {KINDS.map((k, i) => (
        <div key={k}>
          <p className="mb-2 text-sm font-semibold">{t(`filters.${k}`)}</p>
          <div className="flex flex-wrap gap-2">
            {opts[i]?.isLoading ? <Skeleton className="h-7 w-40" /> : opts[i]?.data?.map((o) => (
              <Chip key={o.slug} active={!!draft[k]?.includes(o.slug)} onClick={() => toggle(k, o.slug)}>{t_content(o, "label", lang)}</Chip>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2 border-t pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={clear}>{t("filters.clearAll")}</Button>
        <Button type="button" className="flex-1" onClick={() => { onApply(draft); onDone?.(); }}>{t("filters.apply")}</Button>
      </div>
    </div>
  );
}

const activeCount = (f: PoojaFilters) => KINDS.reduce((n, k) => n + (f[k]?.length ?? 0), 0) + (f.type ? 1 : 0) + (f.q ? 1 : 0);

/** Sidebar on desktop, bottom drawer on mobile. */
export function FilterBar(props: { value: PoojaFilters; onApply: (f: PoojaFilters) => void; showType?: boolean }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const n = activeCount(props.value);
  return (
    <>
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full"><SlidersHorizontal className="h-4 w-4" />{t("filters.title")}{n > 0 && ` (${n})`}</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader><SheetTitle>{t("filters.title")}</SheetTitle></SheetHeader>
            <div className="p-4"><Panel {...props} onDone={() => setOpen(false)} /></div>
          </SheetContent>
        </Sheet>
      </div>
      <aside className="hidden h-fit rounded-xl border bg-card p-4 lg:sticky lg:top-24 lg:block">
        <p className="mb-4 flex items-center gap-2 font-serif text-xl text-primary"><SlidersHorizontal className="h-4 w-4" />{t("filters.title")}</p>
        <Panel {...props} />
      </aside>
    </>
  );
}
