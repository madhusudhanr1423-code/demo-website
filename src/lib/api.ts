// Mock data layer. Replace the bodies with real backend calls later; keep signatures.
import type {
  Campaign, Donation, Order, OrderItem, OrderStatus, Product,
  Booking, BookingMember, BookingRequest, BookingSession, BookingStatus, Faq, FilterKind, FilterOption,
  GalleryImage, Partner, Pooja, PoojaType, RequestType, SevaFrequency, SiteSettings, Testimonial,
} from "@/types";
import {
  sampleCampaigns, sampleDonations, sampleOrderItems, sampleOrders, sampleProducts,
  sampleBookings, sampleFaqs, sampleFilterOptions, sampleGallery, sampleMembers, samplePartners,
  samplePoojas, sampleRequests, sampleSessions, sampleSiteSettings, sampleTestimonials,
} from "@/data/sampleData";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const poojas: Pooja[] = [...samplePoojas];
const bookings: Booking[] = [...sampleBookings];
const members: BookingMember[] = [...sampleMembers];
const sessions: BookingSession[] = [...sampleSessions];
const requests: BookingRequest[] = [...sampleRequests];

let currentUserId: string | null = null;
/** Called by AuthContext so the mock API knows who is signed in. */
export function setApiUser(id: string | null) {
  currentUserId = id;
}
const mine = (b: Booking) => b.user_id === currentUserId || b.user_id === "sample";

export type BookingContact = { contact_name: string; phone: string; email: string; whatsapp_number: string };
export type MemberInput = { name: string; gotra: string; relation: string };
export type BookingDetail = Booking & { pooja: Pooja | undefined; members: BookingMember[]; sessions: BookingSession[] };
export type PoojaFilters = {
  type?: PoojaType | "";
  deity?: string[];
  category?: string[];
  dosha?: string[];
  benefit?: string[];
  frequency?: SevaFrequency | "";
  q?: string;
};

export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

/** Price rule: price_per_person is THE price; multiply only for per_person pricing. */
export const calcTotal = (p: Pooja, memberCount: number) =>
  p.pricing_model === "per_person" ? p.price_per_person * memberCount : p.price_per_person;

function applyFilters(list: Pooja[], f: PoojaFilters = {}) {
  const any = (sel: string[] | undefined, vals: string[]) => !sel?.length || sel.some((s) => vals.includes(s));
  return list
    .filter((p) => p.is_active)
    .filter((p) => !f.type || p.pooja_type === f.type)
    .filter((p) => !f.frequency || p.seva_frequency === f.frequency)
    .filter((p) => any(f.deity, [slugify(p.deity)]))
    .filter((p) => any(f.category, [slugify(p.category)]))
    .filter((p) => any(f.dosha, p.dosha))
    .filter((p) => any(f.benefit, p.benefit))
    .filter((p) => !f.q || JSON.stringify([p.title, p.temple_name, p.deity, p.translations]).toLowerCase().includes(f.q.toLowerCase()))
    .sort((a, b) => a.sort_order - b.sort_order);
}

/** One-time poojas and chadhava (not sevas). */
export async function getPoojas(filters: PoojaFilters = {}): Promise<Pooja[]> {
  await delay();
  return applyFilters(poojas.filter((p) => p.pooja_type !== "seva"), filters);
}

export async function getSevas(filters: PoojaFilters = {}): Promise<Pooja[]> {
  await delay();
  return applyFilters(poojas.filter((p) => p.pooja_type === "seva"), filters);
}

export async function getPoojaBySlug(slug: string): Promise<Pooja | null> {
  await delay();
  return poojas.find((p) => p.slug === slug) ?? null;
}

export async function getFilterOptions(kind: FilterKind): Promise<FilterOption[]> {
  await delay(200);
  return sampleFilterOptions.filter((o) => o.kind === kind && o.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Planned session dates for a seva, starting at least 2 days from `from`. */
export function planSessionDates(p: Pooja, from = new Date()): string[] {
  if (p.pooja_type !== "seva" || !p.seva_frequency || !p.seva_sessions) return [];
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 2, 12);
  const out: string[] = [];
  if (p.seva_frequency === "weekly") {
    const wd = p.seva_weekday ?? start.getDay();
    start.setDate(start.getDate() + ((wd - start.getDay() + 7) % 7));
    for (let i = 0; i < p.seva_sessions; i++) out.push(iso(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i * 7, 12)));
  } else if (p.seva_frequency === "daily") {
    for (let i = 0; i < p.seva_sessions; i++) out.push(iso(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i, 12)));
  } else {
    for (let i = 0; i < p.seva_sessions; i++) out.push(iso(new Date(start.getFullYear(), start.getMonth() + i, start.getDate(), 12)));
  }
  return out;
}

export async function createBooking(poojaId: string, contact: BookingContact, memberList: MemberInput[]): Promise<Booking> {
  await delay(600);
  const pooja = poojas.find((p) => p.id === poojaId);
  if (!pooja) throw new Error("Pooja not found");
  if (!currentUserId) throw new Error("Please log in");
  const booking: Booking = {
    id: "b" + Date.now().toString().slice(-6),
    user_id: currentUserId,
    pooja_id: poojaId,
    ...contact,
    total_amount: calcTotal(pooja, memberList.length),
    status: "pending",
    video_url: null,
    created_at: new Date().toISOString(),
  };
  bookings.unshift(booking);
  memberList.forEach((m, i) => members.push({ id: `${booking.id}-m${i}`, booking_id: booking.id, ...m }));
  planSessionDates(pooja).forEach((d, i) =>
    sessions.push({ id: `${booking.id}-s${i}`, booking_id: booking.id, session_date: d, status: "scheduled", video_url: null }),
  );
  return booking;
}

const detail = (b: Booking): BookingDetail => ({
  ...b,
  pooja: poojas.find((p) => p.id === b.pooja_id),
  members: members.filter((m) => m.booking_id === b.id),
  sessions: sessions.filter((s) => s.booking_id === b.id).sort((a, c) => a.session_date.localeCompare(c.session_date)),
});

export async function getMyBookings(): Promise<BookingDetail[]> {
  await delay();
  return bookings.filter(mine).map(detail);
}

export async function getMySubscriptions(): Promise<BookingDetail[]> {
  await delay();
  return bookings.filter(mine).map(detail).filter((b) => b.pooja?.pooja_type === "seva");
}

export async function getBooking(id: string): Promise<BookingDetail | null> {
  await delay();
  const b = bookings.find((x) => x.id === id);
  return b ? detail(b) : null;
}

export async function getBookingSessions(bookingId: string): Promise<BookingSession[]> {
  await delay(250);
  return sessions.filter((s) => s.booking_id === bookingId).sort((a, b) => a.session_date.localeCompare(b.session_date));
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  await delay(500);
  const b = bookings.find((x) => x.id === id);
  if (!b) throw new Error("Booking not found");
  b.status = status;
  return b;
}

export async function requestBookingChange(bookingId: string, type: RequestType, reason: string, preferredDate: string | null): Promise<BookingRequest> {
  await delay(500);
  if (!currentUserId) throw new Error("Please log in");
  const r: BookingRequest = {
    id: "r" + Date.now().toString().slice(-6), booking_id: bookingId, user_id: currentUserId, request_type: type,
    reason, preferred_date: preferredDate, status: "pending", admin_note: null, created_at: new Date().toISOString(),
  };
  requests.unshift(r);
  return r;
}

export async function getMyBookingRequests(): Promise<BookingRequest[]> {
  await delay(250);
  return requests.filter((r) => r.user_id === currentUserId);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  await delay();
  return sampleTestimonials.filter((t) => t.is_active).sort((a, b) => a.sort_order - b.sort_order);
}
export async function getGalleryImages(): Promise<GalleryImage[]> {
  await delay();
  return sampleGallery.filter((g) => g.is_active).sort((a, b) => a.sort_order - b.sort_order);
}
export async function getFaqs(): Promise<Faq[]> {
  await delay();
  return sampleFaqs.filter((f) => f.is_active).sort((a, b) => a.sort_order - b.sort_order);
}
export async function getPartners(): Promise<Partner[]> {
  await delay();
  return samplePartners.filter((p) => p.is_active).sort((a, b) => a.sort_order - b.sort_order);
}
export async function getSiteSettings(): Promise<SiteSettings> {
  await delay(150);
  return sampleSiteSettings;
}

export async function sendContactMessage(data: { name: string; email: string; message: string }): Promise<{ ok: true }> {
  await delay(500);
  console.info("Contact message (mock):", data);
  return { ok: true };
}

export async function requestAccountDeletion(reason: string): Promise<{ ok: true }> {
  await delay(500);
  if (!currentUserId) throw new Error("Please log in");
  console.info("Account deletion requested (mock):", currentUserId, reason);
  return { ok: true };
}

// ---------- Shop ----------
const products: Product[] = [...sampleProducts];
const orders: Order[] = [...sampleOrders];
const orderItems: OrderItem[] = [...sampleOrderItems];
export const SHIPPING_FLAT = 50;

export type CartLine = { product_id: string; quantity: number };
export type ShippingDetails = { full_name: string; phone: string; email: string; address: string; city: string; state: string; pincode: string };
export type OrderDetail = Order & { items: (OrderItem & { product: Product | undefined })[] };

export async function getProducts(): Promise<Product[]> {
  await delay();
  return products.filter((p) => p.is_active);
}
export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay();
  return products.find((p) => p.slug === slug) ?? null;
}
/** Returns products for the given ids (used by the cart to show live prices). */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  await delay(150);
  return products.filter((p) => ids.includes(p.id));
}
export async function createOrder(items: CartLine[], shipping: ShippingDetails): Promise<Order> {
  await delay(600);
  if (!currentUserId) throw new Error("Please log in");
  if (!items.length) throw new Error("Cart is empty");
  let subtotal = 0;
  const id = "o" + Date.now().toString().slice(-6);
  const lines: OrderItem[] = items.map((l, i) => {
    const p = products.find((x) => x.id === l.product_id);
    if (!p) throw new Error("Product not found");
    if (l.quantity > p.stock) throw new Error(`Only ${p.stock} left of ${p.name}`);
    subtotal += p.price * l.quantity;
    return { id: `${id}-i${i}`, order_id: id, product_id: p.id, quantity: l.quantity, unit_price: p.price };
  });
  const order: Order = { id, user_id: currentUserId, ...shipping, shipping_amount: SHIPPING_FLAT, total_amount: subtotal + SHIPPING_FLAT, status: "pending", tracking_number: null, created_at: new Date().toISOString() };
  orders.unshift(order);
  orderItems.push(...lines);
  return order;
}
const orderDetail = (o: Order): OrderDetail => ({
  ...o,
  items: orderItems.filter((i) => i.order_id === o.id).map((i) => ({ ...i, product: products.find((p) => p.id === i.product_id) })),
});
export async function getMyOrders(): Promise<OrderDetail[]> {
  await delay();
  return orders.filter((o) => o.user_id === currentUserId || o.user_id === "sample").map(orderDetail);
}
export async function getOrder(id: string): Promise<OrderDetail | null> {
  await delay();
  const o = orders.find((x) => x.id === id);
  return o ? orderDetail(o) : null;
}
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  await delay(500);
  const o = orders.find((x) => x.id === id);
  if (!o) throw new Error("Order not found");
  if (status === "paid" && o.status !== "paid") {
    orderItems.filter((i) => i.order_id === id).forEach((i) => { const p = products.find((x) => x.id === i.product_id); if (p) p.stock = Math.max(0, p.stock - i.quantity); });
  }
  o.status = status;
  return o;
}

// ---------- Fundraising ----------
const campaigns: Campaign[] = [...sampleCampaigns];
const donations: Donation[] = [...sampleDonations];
let receiptSeq = donations.length;

export type DonorDetails = { donor_name: string; donor_email: string; donor_phone: string; donor_pan: string | null; amount: number; is_anonymous: boolean };
export type DonationDetail = Donation & { campaign: Campaign | undefined };
export type PublicDonor = { id: string; display_name: string; amount: number; created_at: string };

export async function getCampaigns(): Promise<Campaign[]> {
  await delay();
  return campaigns.filter((c) => c.is_active);
}
export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  await delay();
  return campaigns.find((c) => c.slug === slug) ?? null;
}
/** Public donor list: never exposes email, phone or PAN. */
export async function getCampaignDonors(campaignId: string): Promise<PublicDonor[]> {
  await delay(250);
  return donations
    .filter((d) => d.campaign_id === campaignId && d.status === "paid")
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((d) => ({ id: d.id, display_name: d.is_anonymous ? "" : d.donor_name, amount: d.amount, created_at: d.created_at }));
}
export async function createDonation(campaignId: string, donor: DonorDetails): Promise<Donation> {
  await delay(600);
  if (donor.amount < 1) throw new Error("Minimum donation is Rs. 1");
  const d: Donation = { id: "d" + Date.now().toString().slice(-6), campaign_id: campaignId, user_id: currentUserId, ...donor, status: "pending", receipt_number: null, created_at: new Date().toISOString() };
  donations.unshift(d);
  return d;
}
export async function getDonation(id: string): Promise<DonationDetail | null> {
  await delay();
  const d = donations.find((x) => x.id === id);
  return d ? { ...d, campaign: campaigns.find((c) => c.id === d.campaign_id) } : null;
}
export async function markDonationPaid(id: string): Promise<Donation> {
  await delay(500);
  const d = donations.find((x) => x.id === id);
  if (!d) throw new Error("Donation not found");
  if (d.status !== "paid") {
    d.status = "paid";
    receiptSeq += 1;
    d.receipt_number = `RCPT-${new Date().getFullYear()}-${String(receiptSeq).padStart(6, "0")}`;
    const c = campaigns.find((x) => x.id === d.campaign_id);
    if (c) c.raised_amount += d.amount;
  }
  return d;
}

// ---------- Admin (mock; real backend must enforce admin role server-side) ----------
import type { Profile } from "@/types";

const slugOk = (s: string) => slugify(s).replace(/^-|-$/g, "");
function upsert<T extends { id: string }>(list: T[], item: Partial<T> & { id?: string }, make: (id: string) => T): T {
  if (item.id) {
    const ex = list.find((x) => x.id === item.id);
    if (!ex) throw new Error("Not found");
    Object.assign(ex, item);
    return ex;
  }
  const created = { ...make("n" + Date.now().toString(36)), ...item } as T;
  list.unshift(created);
  return created;
}
function remove<T extends { id: string }>(list: T[], id: string) {
  const i = list.findIndex((x) => x.id === id);
  if (i >= 0) list.splice(i, 1);
}

export type AdminStats = {
  totalBookings: number; paidBookings: number; poojaRevenue: number; orders: number; productRevenue: number;
  totalDonations: number; activeCampaigns: number; bookingsPerPooja: { title: string; count: number }[]; latestBookings: BookingDetail[];
};
const PAID_B: BookingStatus[] = ["paid", "confirmed", "completed"];
const PAID_O: OrderStatus[] = ["paid", "shipped", "delivered"];

export async function adminGetStats(): Promise<AdminStats> {
  await delay();
  const per = new Map<string, number>();
  bookings.forEach((b) => per.set(b.pooja_id, (per.get(b.pooja_id) ?? 0) + 1));
  return {
    totalBookings: bookings.length,
    paidBookings: bookings.filter((b) => PAID_B.includes(b.status)).length,
    poojaRevenue: bookings.filter((b) => PAID_B.includes(b.status)).reduce((n, b) => n + b.total_amount, 0),
    orders: orders.length,
    productRevenue: orders.filter((o) => PAID_O.includes(o.status)).reduce((n, o) => n + o.total_amount, 0),
    totalDonations: donations.filter((d) => d.status === "paid").reduce((n, d) => n + d.amount, 0),
    activeCampaigns: campaigns.filter((c) => c.is_active && new Date(c.end_date) >= new Date()).length,
    bookingsPerPooja: [...per].map(([id, count]) => ({ title: poojas.find((p) => p.id === id)?.title ?? id, count })).sort((a, b) => b.count - a.count),
    latestBookings: [...bookings].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5).map(detail),
  };
}

export async function adminGetPoojas(): Promise<Pooja[]> { await delay(); return [...poojas].sort((a, b) => a.sort_order - b.sort_order); }
export async function adminSavePooja(p: Partial<Pooja>): Promise<Pooja> {
  await delay(400);
  if (!p.title?.trim()) throw new Error("Title is required");
  const slug = slugOk(p.slug || p.title);
  if (poojas.some((x) => x.slug === slug && x.id !== p.id)) throw new Error("Slug already in use");
  return upsert(poojas, { ...p, slug }, (id) => ({ ...samplePoojas[0]!, id, translations: {}, is_featured: false, sort_order: 99 }));
}
export async function adminDeletePooja(id: string) { await delay(300); remove(poojas, id); }

export async function adminGetBookings(): Promise<BookingDetail[]> { await delay(); return bookings.map(detail); }
export async function adminUpdateBooking(id: string, data: { status: BookingStatus; video_url: string | null }): Promise<Booking> {
  await delay(400);
  const b = bookings.find((x) => x.id === id);
  if (!b) throw new Error("Booking not found");
  b.status = data.status;
  b.video_url = data.video_url || null;
  return b;
}

export async function adminGetProducts(): Promise<Product[]> { await delay(); return [...products]; }
export async function adminSaveProduct(p: Partial<Product>): Promise<Product> {
  await delay(400);
  if (!p.name?.trim()) throw new Error("Name is required");
  const slug = slugOk(p.slug || p.name);
  if (products.some((x) => x.slug === slug && x.id !== p.id)) throw new Error("Slug already in use");
  return upsert(products, { ...p, slug }, (id) => ({ id, name: "", slug, description: "", price: 0, stock: 0, image_url: "", is_active: true }));
}
export async function adminDeleteProduct(id: string) { await delay(300); remove(products, id); }

export async function adminGetOrders(): Promise<OrderDetail[]> { await delay(); return orders.map(orderDetail); }
export async function adminUpdateOrder(id: string, data: { status: OrderStatus; tracking_number: string | null }): Promise<Order> {
  await delay(400);
  const o = orders.find((x) => x.id === id);
  if (!o) throw new Error("Order not found");
  o.status = data.status;
  o.tracking_number = data.tracking_number || null;
  return o;
}

export async function adminGetCampaigns(): Promise<Campaign[]> { await delay(); return [...campaigns]; }
export async function adminSaveCampaign(c: Partial<Campaign>): Promise<Campaign> {
  await delay(400);
  if (!c.title?.trim()) throw new Error("Title is required");
  const slug = slugOk(c.slug || c.title);
  if (campaigns.some((x) => x.slug === slug && x.id !== c.id)) throw new Error("Slug already in use");
  return upsert(campaigns, { ...c, slug }, (id) => ({ id, title: "", slug, story: "", image_url: "", goal_amount: 0, raised_amount: 0, end_date: iso(new Date()), is_active: true }));
}
export async function adminDeleteCampaign(id: string) { await delay(300); remove(campaigns, id); }

export async function adminGetDonations(): Promise<DonationDetail[]> {
  await delay();
  return donations.map((d) => ({ ...d, campaign: campaigns.find((c) => c.id === d.campaign_id) }));
}

export async function adminGetUsers(): Promise<(Profile & { email: string })[]> {
  await delay();
  return [
    { id: "sample", full_name: "Ravi Kumar", phone: "9876543210", email: "ravi@example.com", role: "user", preferred_language: "te", whatsapp_number: "9876543210" },
    { id: "u_admin", full_name: "Temple Admin", phone: "9000000000", email: "admin@example.org", role: "admin", preferred_language: "en", whatsapp_number: "9000000000" },
    { id: "u_sita", full_name: "Sita R.", phone: "9000000001", email: "sita@example.com", role: "user", preferred_language: "te", whatsapp_number: "9000000001" },
  ];
}
