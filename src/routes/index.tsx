import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Flower2, ClipboardList, CreditCard, Video, HandHeart, ShoppingBag, Quote } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { getPoojas } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PageContainer, PoojaCard, PoojaCardSkeleton, SectionHeading } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "[Temple Name] — Book Sacred Poojas for Your Family" },
      { name: "description", content: "Choose a pooja, add family names and gotras, pay online and receive the pooja video." },
      { property: "og:title", content: "[Temple Name] — Book Sacred Poojas" },
      { property: "og:description", content: "Book temple poojas online and receive the video of your pooja." },
    ],
  }),
  component: Home,
});

const steps = [
  { icon: Flower2, title: "Choose pooja", text: "Browse poojas by deity, temple and date." },
  { icon: ClipboardList, title: "Enter details", text: "Add family names, gotras and relations." },
  { icon: CreditCard, title: "Pay online", text: "Secure online payment in a few taps." },
  { icon: Video, title: "Receive video", text: "Watch your pooja performed by our priests." },
];
const testimonials = [
  { name: "Devotee from Hyderabad", text: "Our family's names were chanted clearly and the video arrived the same evening. Truly heartfelt." },
  { name: "Devotee from Bengaluru", text: "Living abroad, this was the closest we could be to our temple. Simple to book and very sincere." },
  { name: "Devotee from Chennai", text: "The priests performed the archana beautifully. We will book again for every festival." },
];

function Home() {
  const { data, isLoading } = useQuery({ queryKey: ["poojas"], queryFn: () => getPoojas() });
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Temple lit with brass lamps at dusk" width={1600} height={912} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero" />
        <div className="mx-auto max-w-6xl px-4 py-24 text-primary-foreground sm:px-6 sm:py-32">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold">Sacred rituals, from anywhere</p>
          <h1 className="max-w-2xl text-4xl leading-tight sm:text-6xl">Offer your prayers at the temple, wherever you are</h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">Book poojas performed by temple priests in your family's name and receive the video of the ritual.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="saffron" size="lg" asChild><Link to="/poojas">Book a Pooja</Link></Button>
            <Button variant="cream" size="lg" asChild><Link to="/about">About the temple</Link></Button>
          </div>
        </div>
      </section>

      <PageContainer className="py-16">
        <SectionHeading eyebrow="Upcoming" title="Featured poojas" subtitle="Hand-picked rituals for the coming weeks." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading || !data ? Array.from({ length: 4 }).map((_, i) => <PoojaCardSkeleton key={i} />) : data.slice(0, 4).map((p) => <PoojaCard key={p.id} pooja={p} />)}
        </div>
        <div className="mt-8 text-center"><Button variant="outline" asChild><Link to="/poojas">View all poojas</Link></Button></div>
      </PageContainer>

      <section className="bg-secondary py-16">
        <PageContainer className="py-0">
          <SectionHeading center eyebrow="Simple process" title="How it works" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-xl bg-card p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-saffron text-saffron-foreground"><s.icon className="h-6 w-6" /></div>
                <p className="text-sm font-semibold text-saffron">Step {i + 1}</p>
                <h3 className="text-2xl text-primary">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-16">
        <SectionHeading center eyebrow="Devotees" title="Words of gratitude" />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-xl border bg-card p-6">
              <Quote className="mb-3 h-6 w-6 text-saffron" />
              <blockquote className="text-foreground/90">{t.text}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-primary">— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </PageContainer>

      <PageContainer className="grid gap-6 pt-0 md:grid-cols-2">
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
          <HandHeart className="mb-3 h-8 w-8 text-gold" />
          <h3 className="text-3xl">Support temple seva</h3>
          <p className="mt-2 opacity-85">Contribute to annadanam, festivals and temple upkeep.</p>
          <Button variant="saffron" className="mt-5" asChild><Link to="/campaigns">Donate now</Link></Button>
        </div>
        <div className="rounded-2xl border bg-accent p-8">
          <ShoppingBag className="mb-3 h-8 w-8 text-primary" />
          <h3 className="text-3xl text-primary">Pooja essentials</h3>
          <p className="mt-2 text-muted-foreground">Prasadam, rudraksha, lamps and more, blessed at the temple.</p>
          <Button className="mt-5" asChild><Link to="/shop">Visit shop</Link></Button>
        </div>
      </PageContainer>
    </>
  );
}
