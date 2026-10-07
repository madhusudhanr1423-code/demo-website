import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/types";

export type CartItem = { product_id: string; slug: string; name: string; price: number; image_url: string; stock: number; quantity: number };
type CartValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  setDrawerOpen: (o: boolean) => void;
  add: (p: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const KEY = "temple-cart";
const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, loaded]);

  const clampQty = (q: number, stock: number) => Math.max(1, Math.min(q, stock));
  const value: CartValue = {
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
    drawerOpen,
    setDrawerOpen,
    add: (p, qty = 1) => setItems((cur) => {
      const ex = cur.find((i) => i.product_id === p.id);
      if (ex) return cur.map((i) => (i.product_id === p.id ? { ...i, quantity: clampQty(i.quantity + qty, p.stock) } : i));
      return [...cur, { product_id: p.id, slug: p.slug, name: p.name, price: p.price, image_url: p.image_url, stock: p.stock, quantity: clampQty(qty, p.stock) }];
    }),
    setQty: (id, qty) => setItems((cur) => cur.map((i) => (i.product_id === id ? { ...i, quantity: clampQty(qty, i.stock) } : i))),
    remove: (id) => setItems((cur) => cur.filter((i) => i.product_id !== id)),
    clear: () => setItems([]),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
