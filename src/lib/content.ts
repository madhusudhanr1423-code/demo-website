import type { Pooja } from "@/types";
import type { TFunction } from "i18next";

type WithTranslations = { translations?: Record<string, Record<string, unknown> | undefined> } & object;

/** Returns item.translations[lang][field] when present, otherwise the English field. */
export function t_content<T extends WithTranslations, K extends keyof T & string>(item: T, field: K, lang: string): T[K] {
  const v = item.translations?.[lang]?.[field];
  return (v !== undefined && v !== "" ? v : item[field]) as T[K];
}

export function scheduleText(p: Pooja, t: TFunction): string {
  if (!p.seva_frequency || !p.seva_sessions) return "";
  if (p.seva_frequency === "weekly") {
    const days = t("weekdays", { returnObjects: true }) as string[];
    return t("schedule.weekly", { day: days[p.seva_weekday ?? 0], count: p.seva_sessions });
  }
  return t(`schedule.${p.seva_frequency}`, { count: p.seva_sessions });
}
