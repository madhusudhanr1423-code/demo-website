export type BookingStatus = "pending" | "paid" | "confirmed" | "completed" | "cancelled" | "refunded";
export type PoojaType = "one_time" | "seva" | "chadhava";
export type PricingModel = "per_booking" | "per_person";
export type SevaFrequency = "daily" | "weekly" | "monthly";

/** Per-language overrides for content fields, e.g. { te: { title: "..." } } */
export type Translations = Record<string, Record<string, string | string[] | undefined>>;

export interface Pooja {
  id: string;
  title: string;
  slug: string;
  deity: string;
  category: string;
  temple_name: string;
  temple_location: string;
  description: string;
  benefits: string[];
  image_url: string;
  /** THE price. Multiplied by members only when pricing_model is 'per_person'. */
  price_per_person: number;
  pooja_date: string;
  max_bookings: number;
  is_active: boolean;
  pooja_type: PoojaType;
  pricing_model: PricingModel;
  max_members: number;
  tag_line: string;
  subtitle: string;
  dosha: string[];
  benefit: string[];
  seva_frequency: SevaFrequency | null;
  seva_weekday: number | null;
  seva_sessions: number | null;
  is_featured: boolean;
  sort_order: number;
  translations: Translations;
}

export interface Booking {
  id: string;
  user_id: string;
  pooja_id: string;
  contact_name: string;
  phone: string;
  email: string;
  whatsapp_number: string;
  total_amount: number;
  status: BookingStatus;
  video_url: string | null;
  created_at: string;
}

export interface BookingMember {
  id: string;
  booking_id: string;
  name: string;
  gotra: string;
  relation: string;
}

export type SessionStatus = "scheduled" | "completed" | "missed" | "cancelled";
export interface BookingSession {
  id: string;
  booking_id: string;
  session_date: string;
  status: SessionStatus;
  video_url: string | null;
}

export type RequestType = "cancel" | "reschedule";
export type RequestStatus = "pending" | "approved" | "rejected";
export interface BookingRequest {
  id: string;
  booking_id: string;
  user_id: string;
  request_type: RequestType;
  reason: string;
  preferred_date: string | null;
  status: RequestStatus;
  admin_note: string | null;
  created_at: string;
}

export type FilterKind = "deity" | "category" | "dosha" | "benefit";
export interface FilterOption {
  id: string;
  kind: FilterKind;
  slug: string;
  label: string;
  translations: Translations;
  sort_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  image_url: string;
  translations: Translations;
  sort_order: number;
  is_active: boolean;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
  is_active: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  translations: Translations;
  sort_order: number;
  is_active: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface SiteSettings {
  whatsapp_number: string;
  support_email: string;
  address: string;
  social_links: { platform: "facebook" | "instagram" | "youtube" | "twitter"; url: string }[];
  trust_badges: { label: string; translations?: Translations }[];
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: "user" | "admin";
  preferred_language: string;
  whatsapp_number: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
export interface Order {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  shipping_amount: number;
  total_amount: number;
  status: OrderStatus;
  tracking_number: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  story: string;
  image_url: string;
  goal_amount: number;
  raised_amount: number;
  end_date: string;
  is_active: boolean;
}

export type DonationStatus = "pending" | "paid" | "failed";
export interface Donation {
  id: string;
  campaign_id: string;
  user_id: string | null;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  donor_pan: string | null;
  amount: number;
  is_anonymous: boolean;
  status: DonationStatus;
  receipt_number: string | null;
  created_at: string;
}
