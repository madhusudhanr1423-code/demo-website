import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createBooking, getPoojaBySlug, type MemberInput } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageContainer, RequireAuth, fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/book/$slug")({
  head: () => ({
    meta: [
      { title: "Book Pooja — [Temple Name]" },
      { name: "description", content: "Enter contact and family details to book your pooja." },
      { property: "og:title", content: "Book Pooja — [Temple Name]" },
      { property: "og:description", content: "Add family members and book your pooja online." },
    ],
  }),
  component: () => <RequireAuth><BookPage /></RequireAuth>,
});

const emptyMember = (): MemberInput => ({ name: "", gotra: "", relation: "" });
type Errors = Record<string, string>;

function BookPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: p, isLoading } = useQuery({ queryKey: ["pooja", slug], queryFn: () => getPoojaBySlug(slug) });
  const [contact, setContact] = useState({ contact_name: "", phone: "", email: "" });
  const [members, setMembers] = useState<MemberInput[]>([emptyMember()]);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setContact((c) => ({ contact_name: c.contact_name || profile?.full_name || "", phone: c.phone || profile?.phone || "", email: c.email || user?.email || "" }));
  }, [user, profile]);

  if (isLoading) return <PageContainer><Skeleton className="h-96" /></PageContainer>;
  if (!p) return <PageContainer><EmptyState title="Pooja not found" text="Please choose another pooja." action={<Button asChild><Link to="/poojas">Browse poojas</Link></Button>} /></PageContainer>;

  const setM = (i: number, k: keyof MemberInput, v: string) => setMembers((m) => m.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const validate = () => {
    const e: Errors = {};
    if (contact.contact_name.trim().length < 2) e["contact_name"] = "Enter your name";
    if (!/^[6-9]\d{9}$/.test(contact.phone.replace(/\D/g, "").slice(-10))) e["phone"] = "Enter a valid 10-digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) e["email"] = "Enter a valid email";
    members.forEach((m, i) => {
      if (m.name.trim().length < 2) e[`m${i}name`] = "Name required";
      if (!m.gotra.trim()) e[`m${i}gotra`] = "Gotra required";
      if (!m.relation.trim()) e[`m${i}relation`] = "Relation required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) { toast.error("Please fix the highlighted fields"); return; }
    setBusy(true);
    try {
      const b = await createBooking(p.id, { ...contact, whatsapp_number: contact.phone }, members);
      navigate({ to: "/payment/$bookingId", params: { bookingId: b.id } });
    } catch (err) {
      toast.error((err as Error).message);
      setBusy(false);
    }
  };

  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="mt-1 text-xs text-destructive">{errors[k]}</p> : null);

  return (
    <PageContainer>
      <h1 className="mb-6 text-4xl text-primary">Book: {p.title}</h1>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_340px]" noValidate>
        <div className="space-y-8">
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-2xl text-primary">Contact details</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {([["contact_name", "Full name", "text"], ["phone", "Phone", "tel"], ["email", "Email", "email"]] as const).map(([k, l, t]) => (
                <div key={k}><Label htmlFor={k}>{l}</Label><Input id={k} type={t} className="mt-1" value={contact[k]} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} aria-invalid={!!errors[k]} /><Err k={k} /></div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl text-primary">Family members <span className="text-base text-muted-foreground">({members.length}/20)</span></h2>
              <Button type="button" size="sm" variant="outline" disabled={members.length >= 20} onClick={() => setMembers([...members, emptyMember()])}><Plus className="h-4 w-4" />Add</Button>
            </div>
            <div className="space-y-4">
              {members.map((m, i) => (
                <div key={i} className="grid gap-3 rounded-lg bg-secondary p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-start">
                  {(["name", "gotra", "relation"] as const).map((k) => (
                    <div key={k}><Label htmlFor={`m${i}${k}`} className="capitalize">{k}</Label><Input id={`m${i}${k}`} className="mt-1 bg-card" value={m[k]} onChange={(e) => setM(i, k, e.target.value)} aria-invalid={!!errors[`m${i}${k}`]} /><Err k={`m${i}${k}`} /></div>
                  ))}
                  <Button type="button" variant="ghost" size="icon" className="sm:mt-6" aria-label={`Remove member ${i + 1}`} disabled={members.length <= 1} onClick={() => setMembers(members.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-xl border bg-card p-5 shadow-warm lg:sticky lg:top-24">
          <h2 className="text-2xl text-primary">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Pooja</dt><dd className="text-right font-medium">{p.title}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Date</dt><dd>{fmtDate(p.pooja_date)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Members</dt><dd>{members.length}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Price / person</dt><dd>{inr(p.price_per_person)}</dd></div>
            <div className="flex justify-between border-t pt-3 text-lg font-bold"><dt>Total</dt><dd>{inr(p.price_per_person * members.length)}</dd></div>
          </dl>
          <Button type="submit" variant="saffron" size="lg" className="mt-5 w-full" disabled={busy}>{busy ? "Creating booking…" : "Proceed to Pay"}</Button>
        </aside>
      </form>
    </PageContainer>
  );
}
