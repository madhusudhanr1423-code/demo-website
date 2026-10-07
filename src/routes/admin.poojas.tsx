import { createFileRoute } from "@tanstack/react-router";
import { adminDeletePooja, adminGetPoojas, adminSavePooja } from "@/lib/api";
import type { Pooja } from "@/types";
import { CrudPage } from "@/components/admin/AdminUI";
import { fmtDate, inr } from "@/components/site";

export const Route = createFileRoute("/admin/poojas")({ component: Page });

const blank: Partial<Pooja> = {
  title: "", slug: "", deity: "", category: "", temple_name: "", temple_location: "", description: "", benefits: [],
  image_url: "", price_per_person: 0, pooja_date: "", max_bookings: 50, is_active: true, pooja_type: "one_time", pricing_model: "per_person",
};

function Page() {
  return (
    <CrudPage<Pooja>
      title="Poojas" queryKey="poojas" fetch={adminGetPoojas} save={adminSavePooja} remove={adminDeletePooja} blank={blank} slugFrom="title"
      searchText={(p) => p.title + p.deity + p.temple_name}
      fields={[
        { key: "title", label: "Title", type: "text", required: true, full: true },
        { key: "slug", label: "Slug", type: "slug", required: true, full: true },
        { key: "deity", label: "Deity", type: "text", required: true },
        { key: "category", label: "Category", type: "text", required: true },
        { key: "temple_name", label: "Temple name", type: "text", required: true },
        { key: "temple_location", label: "Temple location", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "benefits", label: "Benefits", type: "list" },
        { key: "image_url", label: "Image", type: "image" },
        { key: "price_per_person", label: "Price (₹)", type: "number", required: true },
        { key: "pooja_date", label: "Pooja date", type: "date", required: true },
        { key: "max_bookings", label: "Max bookings", type: "number" },
        { key: "is_active", label: "Active", type: "switch" },
      ]}
      columns={[
        { label: "Pooja", render: (p) => <div className="flex items-center gap-2"><img src={p.image_url} alt="" className="h-9 w-12 rounded object-cover" /><span className="font-medium">{p.title}</span></div> },
        { label: "Deity", render: (p) => p.deity },
        { label: "Date", render: (p) => <span className="whitespace-nowrap">{p.pooja_date && fmtDate(p.pooja_date)}</span> },
        { label: "Price", render: (p) => inr(p.price_per_person) },
        { label: "Active", render: (p) => (p.is_active ? "Yes" : "No") },
      ]}
    />
  );
}
