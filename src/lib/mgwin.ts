import dishShan from "@/assets/dish-shan.jpg";
import dishMohinga from "@/assets/dish-mohinga.jpg";
import dishLahpet from "@/assets/dish-lahpet.jpg";
import heroFood from "@/assets/hero-food.jpg";

export type Lang = "mm" | "en";

export type Restaurant = {
  id: string;
  name_mm: string;
  name_en: string;
  cuisine_mm: string;
  cuisine_en: string;
  image: string;
  rating: number;
  deliveryMin: number;
  deliveryFee: number;
  distanceKm: number;
  isOpen: boolean;
  address_mm: string;
  address_en: string;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name_mm: string;
  name_en: string;
  desc_mm: string;
  desc_en: string;
  price: number;
  image: string;
  available: boolean;
  category_mm: string;
  category_en: string;
};

export type PaymentMethod = "cash" | "kbzpay" | "wavepay";
export type OrderStatus = "placed" | "confirmed" | "preparing" | "picked_up" | "delivered";

export const ORDER_STEPS: OrderStatus[] = ["placed", "confirmed", "preparing", "picked_up", "delivered"];

export type CartLine = {
  menuItemId: string;
  qty: number;
  notes: string;
};

export type OrderItem = {
  menuItemId: string;
  name_mm: string;
  name_en: string;
  price: number;
  qty: number;
  notes: string;
};

export type DeliveryPin = {
  lat: number;
  lng: number;
  label?: string | null;
  label_mm?: string | null;
  label_en?: string | null;
};

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName_mm: string;
  restaurantName_en: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  phone: string;
  address: string;
  pin?: DeliveryPin | null;
  distanceKm?: number | null;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: number;
  statusHistory: { status: OrderStatus; at: number }[];
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: "r1", name_mm: "မယ်ဒေါ်မိန်း ရှမ်းခေါက်ဆွဲ", name_en: "May Daw Mein Shan Noodles",
    cuisine_mm: "ရှမ်းရိုးရာ", cuisine_en: "Shan traditional",
    image: dishShan, rating: 4.9, deliveryMin: 18, deliveryFee: 1500, distanceKm: 1.2, isOpen: true,
    address_mm: "မြို့မလမ်း၊ နမ့်စန်", address_en: "Myoma Road, Namsang",
  },
  {
    id: "r2", name_mm: "ရွှေမြန်မာ မုန့်ဟင်းခါး", name_en: "Shwe Myanmar Mohinga",
    cuisine_mm: "မနက်စာ", cuisine_en: "Breakfast",
    image: dishMohinga, rating: 4.8, deliveryMin: 15, deliveryFee: 1500, distanceKm: 0.8, isOpen: true,
    address_mm: "ဗိုလ်ချုပ်လမ်း", address_en: "Bogyoke Street",
  },
  {
    id: "r3", name_mm: "ဒေါ်ခင် လက်ဖက်သုပ်", name_en: "Daw Khin Tea Leaf Salad",
    cuisine_mm: "ရိုးရာအသုပ်", cuisine_en: "Traditional salads",
    image: dishLahpet, rating: 4.7, deliveryMin: 20, deliveryFee: 1800, distanceKm: 1.6, isOpen: true,
    address_mm: "ဈေးလမ်း", address_en: "Market Lane",
  },
  {
    id: "r4", name_mm: "နမ့်စန်ကြက်သားထမင်း", name_en: "Namsang Chicken Rice",
    cuisine_mm: "ကြက်သားထမင်း", cuisine_en: "Chicken rice",
    image: heroFood, rating: 4.6, deliveryMin: 22, deliveryFee: 2000, distanceKm: 2.1, isOpen: true,
    address_mm: "စျေးရှေ့လမ်း", address_en: "Front Market Road",
  },
  {
    id: "r5", name_mm: "မြို့မတီးဆိုင်", name_en: "Myoma Tea House",
    cuisine_mm: "လက်ဖက်ရည်နှင့် မုန့်", cuisine_en: "Tea & snacks",
    image: dishShan, rating: 4.5, deliveryMin: 12, deliveryFee: 1200, distanceKm: 0.5, isOpen: true,
    address_mm: "ဘုရားလမ်း", address_en: "Pagoda Road",
  },
  {
    id: "r6", name_mm: "ရေခဲမုန့်စျေး", name_en: "Ice Cream Corner",
    cuisine_mm: "မုန့်နှင့် ရေခဲ", cuisine_en: "Sweets & ice cream",
    image: dishLahpet, rating: 4.4, deliveryMin: 15, deliveryFee: 1500, distanceKm: 1.0, isOpen: false,
    address_mm: "ကျောင်းလမ်း", address_en: "School Road",
  },
];

export const MENU: MenuItem[] = [
  // r1
  { id: "m1-1", restaurantId: "r1", name_mm: "ရှမ်းခေါက်ဆွဲ", name_en: "Shan noodles", desc_mm: "ကြက်သားချောနှင့် ငရုတ်ဆီ", desc_en: "Chicken mince with chili oil", price: 2500, image: dishShan, available: true, category_mm: "အဓိကဟင်း", category_en: "Mains" },
  { id: "m1-2", restaurantId: "r1", name_mm: "အုန်းနို့ခေါက်ဆွဲ", name_en: "Coconut noodles", desc_mm: "အုန်းနို့နှင့် ကြက်သား", desc_en: "Chicken in coconut broth", price: 3000, image: dishMohinga, available: true, category_mm: "အဓိကဟင်း", category_en: "Mains" },
  { id: "m1-3", restaurantId: "r1", name_mm: "ရှမ်းထမင်း", name_en: "Shan rice", desc_mm: "ငါးနှင့် ခရမ်းချဉ်သီး", desc_en: "Rice with fish & tomato", price: 3500, image: dishLahpet, available: true, category_mm: "အဓိကဟင်း", category_en: "Mains" },
  { id: "m1-4", restaurantId: "r1", name_mm: "ရေခဲသောက်", name_en: "Iced tea", desc_mm: "ရိုးရာလက်ဖက်ရည်", desc_en: "Traditional milk tea, iced", price: 800, image: dishShan, available: true, category_mm: "အဖျော်ယမကာ", category_en: "Drinks" },
  // r2
  { id: "m2-1", restaurantId: "r2", name_mm: "မုန့်ဟင်းခါး", name_en: "Mohinga", desc_mm: "ငါးမုန့်ဟင်းခါးအမြင့်ဆုံး", desc_en: "Classic fish noodle soup", price: 1800, image: dishMohinga, available: true, category_mm: "မနက်စာ", category_en: "Breakfast" },
  { id: "m2-2", restaurantId: "r2", name_mm: "အာလူးကြော်", name_en: "Potato fritters", desc_mm: "ခဲထုပ်ငရုတ်ဆီနှင့်", desc_en: "Crispy fritters with chili sauce", price: 800, image: dishLahpet, available: true, category_mm: "မုန့်", category_en: "Snacks" },
  { id: "m2-3", restaurantId: "r2", name_mm: "ကြာဇံကြော်", name_en: "Fried glass noodles", desc_mm: "ဟင်းသီးဟင်းရွက်နှင့်", desc_en: "With mixed vegetables", price: 2200, image: dishShan, available: true, category_mm: "အဓိကဟင်း", category_en: "Mains" },
  { id: "m2-4", restaurantId: "r2", name_mm: "ဒိန်ချဉ်", name_en: "Yogurt", desc_mm: "ဒေသထွက် နွားနို့", desc_en: "Local dairy yogurt", price: 600, image: dishMohinga, available: false, category_mm: "အလှူ", category_en: "Sides" },
  // r3
  { id: "m3-1", restaurantId: "r3", name_mm: "လက်ဖက်သုပ်", name_en: "Tea leaf salad", desc_mm: "မြေပဲနှင့် ကြက်သွန်ကြော်", desc_en: "With peanuts & fried garlic", price: 2000, image: dishLahpet, available: true, category_mm: "အသုပ်", category_en: "Salads" },
  { id: "m3-2", restaurantId: "r3", name_mm: "ခရမ်းချဉ်သီးသုပ်", name_en: "Tomato salad", desc_mm: "အသစ်လတ်ဆတ်", desc_en: "Fresh & tangy", price: 1500, image: dishShan, available: true, category_mm: "အသုပ်", category_en: "Salads" },
  { id: "m3-3", restaurantId: "r3", name_mm: "ကြက်ဥသုပ်", name_en: "Egg salad", desc_mm: "ရိုးရာအရသာ", desc_en: "Traditional recipe", price: 1800, image: dishMohinga, available: true, category_mm: "အသုပ်", category_en: "Salads" },
  // r4
  { id: "m4-1", restaurantId: "r4", name_mm: "ကြက်သားထမင်း", name_en: "Chicken rice", desc_mm: "ကြက်သားပြုတ်နှင့် ချဉ်ရည်", desc_en: "Poached chicken with soup", price: 3500, image: heroFood, available: true, category_mm: "အဓိကဟင်း", category_en: "Mains" },
  { id: "m4-2", restaurantId: "r4", name_mm: "ဝက်သားဆီပြန်", name_en: "Pork curry", desc_mm: "ရိုးရာဝက်သားဆီပြန်", desc_en: "Traditional pork curry", price: 4000, image: dishShan, available: true, category_mm: "အဓိကဟင်း", category_en: "Mains" },
  { id: "m4-3", restaurantId: "r4", name_mm: "ငရုတ်ဆီသုပ်", name_en: "Chili oil relish", desc_mm: "အားလုံးနှင့် သင့်တော်", desc_en: "Goes with everything", price: 500, image: dishLahpet, available: true, category_mm: "အလှူ", category_en: "Sides" },
  // r5
  { id: "m5-1", restaurantId: "r5", name_mm: "လက်ဖက်ရည်ကြမ်း", name_en: "Strong milk tea", desc_mm: "ရိုးရာမြန်မာ", desc_en: "Traditional Burmese", price: 700, image: dishShan, available: true, category_mm: "အဖျော်ယမကာ", category_en: "Drinks" },
  { id: "m5-2", restaurantId: "r5", name_mm: "အီကြာကွေး", name_en: "E-kya-kway fritters", desc_mm: "လက်ဖက်ရည်နှင့် ကောင်း", desc_en: "Perfect with tea", price: 500, image: dishMohinga, available: true, category_mm: "မုန့်", category_en: "Snacks" },
  { id: "m5-3", restaurantId: "r5", name_mm: "ပလာတာ", name_en: "Palata", desc_mm: "ဂျုံမုန့်လိပ်", desc_en: "Flaky flatbread", price: 800, image: dishLahpet, available: true, category_mm: "မုန့်", category_en: "Snacks" },
  // r6
  { id: "m6-1", restaurantId: "r6", name_mm: "အုန်းရေခဲမုန့်", name_en: "Coconut ice cream", desc_mm: "အသစ်လုပ်ထား", desc_en: "Fresh made", price: 1500, image: dishLahpet, available: true, category_mm: "ရေခဲမုန့်", category_en: "Ice cream" },
];

export const formatKs = (n: number) => `${n.toLocaleString("en-US")} Ks`;

export const getRestaurant = (id: string) => RESTAURANTS.find((r) => r.id === id);
export const getMenuItem = (id: string) => MENU.find((m) => m.id === id);
export const getMenuByRestaurant = (id: string) => MENU.filter((m) => m.restaurantId === id);

export const STATUS_LABELS: Record<OrderStatus, { mm: string; en: string }> = {
  placed: { mm: "မှာယူပြီးပါပြီ", en: "Order placed" },
  confirmed: { mm: "ဆိုင်က လက်ခံပြီးပါပြီ", en: "Restaurant confirmed" },
  preparing: { mm: "ချက်ပြုတ်နေသည်", en: "Preparing" },
  picked_up: { mm: "ဆိုင်ကယ်သမား ယူသွားပြီးပါပြီ", en: "Rider picked up" },
  delivered: { mm: "ရောက်ရှိပြီးပါပြီ", en: "Delivered" },
};

export const PAYMENT_LABELS: Record<PaymentMethod, { mm: string; en: string }> = {
  cash: { mm: "ငွေသား", en: "Cash on delivery" },
  kbzpay: { mm: "KBZPay", en: "KBZPay" },
  wavepay: { mm: "Wave Pay", en: "Wave Pay" },
};

// Namsang town centre (approx). Used as the base for delivery distance.
export const NAMSANG_CENTER = { lat: 20.8833, lng: 97.7333 };

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Simple local radius table for Namsang motorbike delivery (Ks)
export const DELIVERY_TIERS: { maxKm: number; fee: number }[] = [
  { maxKm: 2, fee: 1500 },
  { maxKm: 4, fee: 2000 },
  { maxKm: 6, fee: 2500 },
  { maxKm: 10, fee: 3000 },
  { maxKm: Infinity, fee: 4000 },
];

export function computeDeliveryFee(distanceKm: number): number {
  return DELIVERY_TIERS.find((t) => distanceKm <= t.maxKm)?.fee ?? 4000;
}
