export type UserRole = "buyer" | "shop" | "rider" | "admin";

export type PoolStatus =
  | "open"
  | "filled"
  | "packing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packing"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "held"
  | "captured"
  | "refunded"
  | "failed";

export type Category =
  | "meat_poultry"
  | "drinks"
  | "pantry"
  | "produce"
  | "frozen"
  | "horeca"
  | "other";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  location_lat: number | null;
  location_lng: number | null;
  location_label: string | null;
  onesignal_player_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  categories: Category[];
  address: string | null;
  lat: number | null;
  lng: number | null;
  rating_avg: number;
  rating_count: number;
  verified: boolean;
  active: boolean;
  stripe_account_id: string | null;
  wholesale_price_verified: boolean;
  shop_ref: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  category: Category;
  image_urls: string[];
  wholesale_price_gbp: number;
  retail_price_gbp: number | null;
  case_weight_g: number | null;
  split_options: number[];
  default_split: number;
  min_fill_portions: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  shop?: Shop;
}

export interface Pool {
  id: string;
  pool_ref: string;
  item_id: string;
  shop_id: string;
  total_portions: number;
  filled_portions: number;
  price_per_portion_gbp: number;
  status: PoolStatus;
  expires_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  rider_id: string | null;
  created_at: string;
  updated_at: string;
  item?: Item;
  shop?: Shop;
  members?: PoolMember[];
}

export interface PoolMember {
  id: string;
  pool_id: string;
  buyer_id: string;
  portions: number;
  price_paid_gbp: number;
  delivery_address: string;
  delivery_lat: number | null;
  delivery_lng: number | null;
  stripe_payment_intent_id: string | null;
  payment_status: PaymentStatus;
  verification_code: string | null;
  delivered_at: string | null;
  created_at: string;
  buyer?: Profile;
}

export interface Order {
  id: string;
  order_ref: string;
  pool_id: string;
  buyer_id: string;
  pool_member_id: string;
  subtotal_gbp: number;
  delivery_fee_gbp: number;
  service_fee_gbp: number;
  total_gbp: number;
  status: OrderStatus;
  stripe_payment_intent_id: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
  pool?: Pool;
}

export interface Review {
  id: string;
  reviewer_id: string;
  pool_id: string;
  shop_rating: number | null;
  rider_rating: number | null;
  note: string | null;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance_gbp: number;
  pending_gbp: number;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
}

/** Format pence to GBP string */
export function formatGBP(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

/** Format pence to GBP without pence if whole pounds */
export function formatGBPShort(pence: number): string {
  const pounds = pence / 100;
  return pounds % 1 === 0 ? `£${pounds.toFixed(0)}` : `£${pounds.toFixed(2)}`;
}
