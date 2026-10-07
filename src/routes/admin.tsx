import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Flower2, CalendarCheck, Package, Truck, HandHeart, Receipt, Users, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — [Temple Name]" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/poojas", label: "Poojas", icon: Flower2 },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: Truck },
  { to: "/admin/campaigns", label: "Campaigns", icon: HandHeart },
  { to: "/admin/donations", label: "Donations", icon: Receipt },
  { to: "/admin/users", label: "Users", icon: Users },
] as const;

function AdminLayout() {
  const { ready, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (ready && !isAdmin) navigate({ to: "/login", search: { redirect: user ? undefined : window.location.pathname } });
  }, [ready, isAdmin, user, navigate]);
  if (!ready || !isAdmin) return <div className="p-10"><Skeleton className="h-64" /></div>;

  const nav = (
    <nav className="space-y-1 p-3">
      {links.map((l) => (
        <Link key={l.to} to={l.to} activeOptions={{ exact: "exact" in l }} onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-secondary"
          activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}>
          <l.icon className="h-4 w-4" />{l.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="mx-auto flex max-w-7xl">
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r bg-card md:block">{nav}</aside>
      {open && <div className="fixed inset-0 z-50 bg-foreground/40 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl transition-transform md:hidden", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between border-b p-3"><span className="font-serif text-xl text-primary">Admin</span><button aria-label="Close menu" onClick={() => setOpen(false)}><X /></button></div>
        {nav}
      </aside>
      <div className="min-w-0 flex-1 p-4 sm:p-6">
        <button className="mb-4 flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm md:hidden" onClick={() => setOpen(true)}><Menu className="h-4 w-4" />Admin menu</button>
        <Outlet />
      </div>
    </div>
  );
}
