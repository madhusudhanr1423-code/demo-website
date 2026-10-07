import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  CalendarDays, MapPin, Flame, Home, Flower2, Repeat, ShoppingBag, User, Share2, MessageCircle,
  Facebook, Instagram, Youtube, Twitter, AlertTriangle,
} from "lucide-react";
import type { Pooja } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getSiteSettings } from "@/lib/api";
import { t_content, scheduleText } from "@/lib/content";
import { LANGUAGES, LANG_STORAGE_KEY } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CartButton } from "@/components/CartDrawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const TEMPLE_NAME = "[Temple Name]";
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const fmtDate = (d: string, lang = "en") =>
  new Date(d).toLocaleDateString(lang === "te" ? "te-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" });

export function useLang() {
  const { i18n } = useTranslation();
  return i18n.language;
}

export function useSiteSettings() {
  return useQuery({ queryKey: ["site-settings"], queryFn: getSiteSettings, staleTime: Infinity });
}

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 py-10 sm:px-6", className)}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, subtitle, center }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={cn("mb-8", center && "text-center")}>
      {eyebrow && <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-saffron">{eyebrow}</p>}
      <h2 className="text-3xl text-primary sm:text-4xl">{title}</h2>
      {subtitle && <p className={cn("mt-2 max-w-2xl text-muted-foreground", center && "mx-auto")}>{subtitle}</p>}
    </div>
  );
}

export function PriceTag({ pooja, className }: { pooja: Pooja; className?: string }) {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <p className="text-lg font-bold text-foreground">{inr(pooja.price_per_person)}</p>
      <p className="text-xs text-muted-foreground">{pooja.pricing_model === "per_booking" ? t("common.perBooking") : t("common.perPerson")}</p>
    </div>
  );
}

export function PoojaCard({ pooja }: { pooja: Pooja }) {
  const { t } = useTranslation();
  const lang = useLang();
  const isSeva = pooja.pooja_type === "seva";
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-warm">
      <Link to="/poojas/$slug" params={{ slug: pooja.slug }} className="aspect-[4/3] overflow-hidden bg-muted">
        <img src={pooja.image_url} alt={t_content(pooja, "title", lang)} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1">
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{t_content(pooja, "deity", lang)}</span>
          {pooja.pooja_type !== "one_time" && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{t(`types.${pooja.pooja_type}`)}</span>}
        </div>
        <Link to="/poojas/$slug" params={{ slug: pooja.slug }}><h3 className="text-xl leading-tight text-primary hover:underline">{t_content(pooja, "title", lang)}</h3></Link>
        <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{t_content(pooja, "temple_name", lang)}</p>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          {isSeva ? <Repeat className="h-4 w-4 shrink-0" /> : <CalendarDays className="h-4 w-4 shrink-0" />}
          {isSeva ? scheduleText(pooja, t) : fmtDate(pooja.pooja_date, lang)}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <PriceTag pooja={pooja} />
          <Button size="sm" variant="saffron" asChild><Link to="/book/$slug" params={{ slug: pooja.slug }}>{t("common.bookNow")}</Link></Button>
        </div>
      </div>
    </div>
  );
}

export function PoojaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4"><Skeleton className="h-4 w-16" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/3" /></div>
    </div>
  );
}

const statusStyle: Record<string, string> = {
  pending: "bg-warning/20 text-foreground border-warning",
  paid: "bg-info/15 text-info border-info",
  confirmed: "bg-saffron/20 text-primary border-saffron",
  completed: "bg-success/15 text-success border-success",
  approved: "bg-success/15 text-success border-success",
  scheduled: "bg-info/15 text-info border-info",
  cancelled: "bg-muted text-muted-foreground border-border",
  missed: "bg-destructive/10 text-destructive border-destructive",
  refunded: "bg-destructive/10 text-destructive border-destructive",
  rejected: "bg-destructive/10 text-destructive border-destructive",
};
export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  return <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", statusStyle[status])}>{t(`status.${status}`)}</span>;
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed bg-card p-10 text-center">
      <Flame className="mx-auto mb-3 h-8 w-8 text-saffron" />
      <h3 className="text-2xl text-primary">{title}</h3>
      <p className="mt-1 text-muted-foreground">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-destructive/40 bg-card p-8 text-center">
      <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-destructive" />
      <h3 className="text-2xl text-primary">{t("common.errorTitle")}</h3>
      <p className="mt-1 text-muted-foreground">{t("common.errorText")}</p>
      {onRetry && <Button variant="outline" className="mt-4" onClick={onRetry}>{t("common.retry")}</Button>}
    </div>
  );
}

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const { t } = useTranslation();
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success(t("common.linkCopied"));
  };
  return <Button type="button" variant="outline" size="sm" className={className} onClick={share}><Share2 className="h-4 w-4" />{t("common.share")}</Button>;
}

/** Redirects to /login (and back) when not signed in. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", search: { redirect: window.location.pathname } });
  }, [ready, user, navigate]);
  if (!ready || !user) return <PageContainer><Skeleton className="h-64 w-full" /></PageContainer>;
  return <>{children}</>;
}

export function LanguageSelect() {
  const { t, i18n } = useTranslation();
  const { user, profile, updateProfile } = useAuth();
  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
  }, [i18n]);
  useEffect(() => { document.documentElement.lang = i18n.language; }, [i18n.language]);
  const change = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem(LANG_STORAGE_KEY, code);
    if (user && profile && profile.preferred_language !== code) updateProfile({ preferred_language: code });
  };
  return (
    <select aria-label={t("common.language")} value={i18n.language} onChange={(e) => change(e.target.value)} className="h-8 rounded-md border border-input bg-card px-2 text-sm">
      {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
    </select>
  );
}

const tabs = [
  { to: "/", key: "home", icon: Home },
  { to: "/poojas", key: "poojas", icon: Flower2 },
  { to: "/sevas", key: "sevas", icon: Repeat },
  { to: "/shop", key: "shop", icon: ShoppingBag },
  { to: "/account", key: "account", icon: User },
] as const;

const headerLinks = [
  { to: "/poojas", key: "poojas" }, { to: "/sevas", key: "sevas" }, { to: "/shop", key: "shop" },
  { to: "/campaigns", key: "donate" }, { to: "/about", key: "about" }, { to: "/contact", key: "contact" },
] as const;

export function Header() {
  const { t } = useTranslation();
  const { user, profile, logout, isAdmin } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-serif text-xl font-bold text-primary sm:text-2xl">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-saffron text-saffron-foreground">ॐ</span>
          <span className="truncate">{TEMPLE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {headerLinks.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-foreground/80 hover:text-primary" activeProps={{ className: "text-primary font-semibold" }}>{t(`nav.${n.key}`)}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSelect />
          <CartButton />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label={t("nav.menu")} className="hidden h-9 w-9 place-items-center rounded-full bg-primary font-semibold text-primary-foreground md:grid">{(profile?.full_name || user.email).charAt(0).toUpperCase()}</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/my-bookings">{t("nav.myBookings")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/account/subscriptions">{t("nav.subscriptions")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/my-orders">{t("nav.myOrders")}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile">{t("nav.profile")}</Link></DropdownMenuItem>
                {isAdmin && <DropdownMenuItem asChild><Link to="/admin">Admin</Link></DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>{t("nav.logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : <Button size="sm" className="hidden md:inline-flex" asChild><Link to="/login" search={{ redirect: undefined }}>{t("nav.login")}</Link></Button>}
        </div>
      </div>
    </header>
  );
}

export function BottomTabBar() {
  const { t } = useTranslation();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-card md:hidden">
      {tabs.map((n) => (
        <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="flex flex-col items-center gap-0.5 py-2 text-[11px] text-muted-foreground" activeProps={{ className: "text-primary font-semibold" }}>
          <n.icon className="h-5 w-5" />{t(`nav.${n.key}`)}
        </Link>
      ))}
    </nav>
  );
}

export const waLink = (number: string, msg: string) => `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;

export function WhatsAppButton() {
  const { t } = useTranslation();
  const { data } = useSiteSettings();
  if (!data) return null;
  return (
    <a href={waLink(data.whatsapp_number, t("common.whatsappMsg"))} target="_blank" rel="noreferrer"
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-whatsapp-foreground shadow-warm transition hover:brightness-105 md:bottom-6">
      <MessageCircle className="h-5 w-5" /><span className="hidden sm:inline">{t("common.needHelp")}</span>
    </a>
  );
}

const socialIcon = { facebook: Facebook, instagram: Instagram, youtube: Youtube, twitter: Twitter };

export function Footer() {
  const { t } = useTranslation();
  const { data } = useSiteSettings();
  const links = [
    ["/about", "about"], ["/contact", "contact"], ["/faq", "faq"], ["/partners", "partners"], ["/terms", "terms"],
    ["/privacy", "privacy"], ["/refund-policy", "refund"], ["/campaigns", "donate"], ["/shop", "shop"], ["/account-deletion", "deletion"],
  ] as const;
  return (
    <footer className="mt-16 bg-primary pb-16 text-primary-foreground md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-bold">{TEMPLE_NAME}</p>
          <p className="mt-2 text-sm opacity-80">{t("footer.tagline")}</p>
        </div>
        <nav className="grid grid-cols-2 gap-2 text-sm">
          {links.map(([to, k]) => <Link key={to} to={to} className="opacity-85 hover:underline hover:opacity-100">{t(`nav.${k}`)}</Link>)}
        </nav>
        <div className="text-sm">
          {data && <div className="space-y-1 opacity-80"><p>{data.address}</p><p>{data.support_email}</p><p>+{data.whatsapp_number}</p></div>}
          <p className="mt-4 font-semibold">{t("footer.follow")}</p>
          <div className="mt-2 flex gap-3">
            {data?.social_links.map((s) => {
              const Icon = socialIcon[s.platform];
              return <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform} className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20"><Icon className="h-4 w-4" /></a>;
            })}
          </div>
        </div>
      </div>
      <p className="px-4 pb-2 text-center text-xs opacity-70">{t("trust.line")}</p>
      <p className="border-t border-primary-foreground/20 py-4 text-center text-xs opacity-70">© {new Date().getFullYear()} {TEMPLE_NAME}. {t("footer.rights")}</p>
    </footer>
  );
}

export function PolicyPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageContainer className="max-w-3xl">
      <h1 className="mb-2 text-4xl text-primary sm:text-5xl">{title}</h1>
      <p className="mb-6 text-sm text-muted-foreground">Last updated: 1 October 2026</p>
      <div className="prose-temple">{children}</div>
    </PageContainer>
  );
}
