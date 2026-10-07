import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer, SectionHeading } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — [Temple Name]" },
      { name: "description", content: "Reach the temple office with questions about poojas and bookings." },
      { property: "og:title", content: "Contact Us — [Temple Name]" },
      { property: "og:description", content: "Get in touch with the temple office." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er["name"] = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er["email"] = "Enter a valid email";
    if (f.message.trim().length < 10) er["message"] = "Message should be at least 10 characters";
    setErr(er);
    if (Object.keys(er).length) return;
    toast.success("Thank you! We'll get back to you soon.");
    setF({ name: "", email: "", message: "" });
  };
  return (
    <PageContainer className="grid gap-10 md:grid-cols-2">
      <div>
        <SectionHeading eyebrow="We're here to help" title="Contact us" subtitle="Questions about a pooja, booking or video? Write to us." />
        <div className="space-y-1 text-muted-foreground"><p>Temple Road, Your City</p><p>+91 00000 00000</p><p>contact@example.org</p><p>Office hours: 6 AM – 8 PM</p></div>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-6" noValidate>
        <div><Label htmlFor="n">Name</Label><Input id="n" className="mt-1" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />{err["name"] && <p className="mt-1 text-xs text-destructive">{err["name"]}</p>}</div>
        <div><Label htmlFor="e">Email</Label><Input id="e" type="email" className="mt-1" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />{err["email"] && <p className="mt-1 text-xs text-destructive">{err["email"]}</p>}</div>
        <div><Label htmlFor="m">Message</Label><Textarea id="m" rows={5} className="mt-1" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />{err["message"] && <p className="mt-1 text-xs text-destructive">{err["message"]}</p>}</div>
        <Button type="submit" className="w-full">Send message</Button>
      </form>
    </PageContainer>
  );
}
