import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer, RequireAuth } from "@/components/site";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — [Temple Name]" },
      { name: "description", content: "Update your name and phone number." },
      { property: "og:title", content: "My Profile — [Temple Name]" },
      { property: "og:description", content: "Manage your devotee profile." },
    ],
  }),
  component: () => <RequireAuth><ProfilePage /></RequireAuth>,
});

function ProfilePage() {
  const { user, profile, updateProfile, isAdmin } = useAuth();
  const [f, setF] = useState({ full_name: "", phone: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (profile) setF({ full_name: profile.full_name, phone: profile.phone }); }, [profile]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.full_name.trim().length < 2) er["full_name"] = "Enter your full name";
    if (f.phone && !/^\d{10}$/.test(f.phone)) er["phone"] = "Enter a 10-digit phone number";
    setErr(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    await updateProfile(f);
    setBusy(false);
    toast.success("Profile updated");
  };
  return (
    <PageContainer className="max-w-md">
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <h1 className="text-4xl text-primary">My Profile</h1>
        <p className="mb-6 text-sm text-muted-foreground">{user?.email}{isAdmin && " · Admin"}</p>
        <form onSubmit={save} className="space-y-4" noValidate>
          <div><Label htmlFor="fn">Full name</Label><Input id="fn" className="mt-1" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} aria-invalid={!!err["full_name"]} />{err["full_name"] && <p className="mt-1 text-xs text-destructive">{err["full_name"]}</p>}</div>
          <div><Label htmlFor="ph">Phone</Label><Input id="ph" type="tel" className="mt-1" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} aria-invalid={!!err["phone"]} />{err["phone"] && <p className="mt-1 text-xs text-destructive">{err["phone"]}</p>}</div>
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
        </form>
      </div>
    </PageContainer>
  );
}
