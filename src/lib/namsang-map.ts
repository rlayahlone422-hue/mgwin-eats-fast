import { NAMSANG_CENTER, RESTAURANTS, haversineKm, type Restaurant } from "@/lib/mgwin";

/** Approximate shop coordinates around Namsang town centre. */
export const RESTAURANT_COORDS: Record<string, { lat: number; lng: number }> = {
  r1: { lat: 20.8851, lng: 97.7346 },
  r2: { lat: 20.8828, lng: 97.7311 },
  r3: { lat: 20.8869, lng: 97.7368 },
  r4: { lat: 20.8802, lng: 97.7382 },
  r5: { lat: 20.8839, lng: 97.7327 },
  r6: { lat: 20.8879, lng: 97.7292 },
};

/** Handy pickup / landmark points riders use in town. */
export const NAMSANG_LANDMARKS: {
  id: string;
  name_mm: string;
  name_en: string;
  lat: number;
  lng: number;
}[] = [
  { id: "market", name_mm: "နမ့်စန် ဇေးတန်း", name_en: "Namsang Market", lat: 20.8836, lng: 97.7331 },
  { id: "hospital", name_mm: "ပြည်သူ့ဆေးရုံ", name_en: "Township Hospital", lat: 20.8862, lng: 97.7302 },
  { id: "bus", name_mm: "ကားဂိတ်", name_en: "Bus Gate", lat: 20.8809, lng: 97.7356 },
  { id: "monastery", name_mm: "ဘုန်းကြီးကျောင်း", name_en: "Main Monastery", lat: 20.8888, lng: 97.7339 },
];

export function restaurantCoord(id: string) {
  return RESTAURANT_COORDS[id] ?? NAMSANG_CENTER;
}

export type NearbyShop = Restaurant & {
  lat: number;
  lng: number;
  liveDistanceKm: number;
};

export function nearbyRestaurants(from: { lat: number; lng: number }): NearbyShop[] {
  return RESTAURANTS.map((r) => {
    const c = restaurantCoord(r.id);
    return { ...r, ...c, liveDistanceKm: haversineKm(from, c) };
  }).sort((a, b) => a.liveDistanceKm - b.liveDistanceKm);
}

export function directionsUrl(to: { lat: number; lng: number }, from?: { lat: number; lng: number } | null) {
  const base = `https://www.google.com/maps/dir/?api=1&destination=${to.lat},${to.lng}&travelmode=two-wheeler`;
  return from ? `${base}&origin=${from.lat},${from.lng}` : base;
}
