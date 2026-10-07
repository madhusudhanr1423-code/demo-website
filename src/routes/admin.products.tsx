import { createFileRoute } from "@tanstack/react-router";
import { adminDeleteProduct, adminGetProducts, adminSaveProduct } from "@/lib/api";
import type { Product } from "@/types";
import { CrudPage } from "@/components/admin/AdminUI";
import { inr } from "@/components/site";

export const Route = createFileRoute("/admin/products")({ component: Page });

function Page() {
  return (
    <CrudPage<Product>
      title="Products" queryKey="products" fetch={adminGetProducts} save={adminSaveProduct} remove={adminDeleteProduct} slugFrom="name"
      blank={{ name: "", slug: "", description: "", price: 0, stock: 0, image_url: "", is_active: true }}
      searchText={(p) => p.name}
      rowClass={(p) => (p.stock < 5 ? "bg-warning/15" : "")}
      fields={[
        { key: "name", label: "Name", type: "text", required: true, full: true },
        { key: "slug", label: "Slug", type: "slug", required: true, full: true },
        { key: "description", label: "Description", type: "textarea" },
        { key: "image_url", label: "Image", type: "image" },
        { key: "price", label: "Price (₹)", type: "number", required: true },
        { key: "stock", label: "Stock", type: "number", required: true },
        { key: "is_active", label: "Active", type: "switch" },
      ]}
      columns={[
        { label: "Product", render: (p) => <div className="flex items-center gap-2"><img src={p.image_url} alt="" className="h-9 w-9 rounded object-cover" /><span className="font-medium">{p.name}</span></div> },
        { label: "Price", render: (p) => inr(p.price) },
        { label: "Stock", render: (p) => <span className={p.stock < 5 ? "font-bold text-destructive" : ""}>{p.stock}{p.stock < 5 && " (low)"}</span> },
        { label: "Active", render: (p) => (p.is_active ? "Yes" : "No") },
      ]}
    />
  );
}
