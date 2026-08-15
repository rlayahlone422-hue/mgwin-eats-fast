declare global {
  interface Window {
    google?: any;
    __mgwinInitMap?: () => void;
    __mgwinMapLoading?: Promise<void>;
  }
}

/** Shared, single-flight Google Maps JS loader. */
export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps) return Promise.resolve();
  if (window.__mgwinMapLoading) return window.__mgwinMapLoading;
  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
  if (!key) return Promise.reject(new Error("Missing Google Maps browser key"));
  window.__mgwinMapLoading = new Promise<void>((resolve, reject) => {
    window.__mgwinInitMap = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__mgwinInitMap`;
    s.async = true;
    s.defer = true;
    s.onerror = () => {
      window.__mgwinMapLoading = undefined;
      reject(new Error("Network error loading map"));
    };
    document.head.appendChild(s);
  });
  return window.__mgwinMapLoading;
}

export const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1f1a17" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1f1a17" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#c9a97a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2b2420" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1a20" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
];

/** Trimmed style set for low-end phones (fewer style rules to rasterise). */
export const LIGHT_LOAD_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1f1a17" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#c9a97a" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

/** Best-effort detection of slow devices / slow data so we can render less. */
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as any;
  const conn = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  const slowNet =
    !!conn && (conn.saveData === true || /(^|-)(2g|slow-2g)$/.test(String(conn.effectiveType ?? "")));
  const lowCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
  const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
  return slowNet || lowMem || lowCores;
}

/** Simple pixel-grid clustering, used instead of shipping a clustering library. */
export function clusterPoints<T extends { lat: number; lng: number }>(
  map: any,
  points: T[],
  gridPx = 64,
): { lat: number; lng: number; items: T[] }[] {
  const projection = map?.getProjection?.();
  const zoom = map?.getZoom?.() ?? 15;
  if (!projection || points.length < 2) return points.map((p) => ({ lat: p.lat, lng: p.lng, items: [p] }));
  const scale = Math.pow(2, zoom);
  const buckets = new Map<string, { lat: number; lng: number; items: T[] }>();
  for (const p of points) {
    const world = projection.fromLatLngToPoint(new window.google.maps.LatLng(p.lat, p.lng));
    const key = `${Math.floor((world.x * scale) / gridPx)}:${Math.floor((world.y * scale) / gridPx)}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.items.push(p);
      bucket.lat = bucket.items.reduce((s, i) => s + i.lat, 0) / bucket.items.length;
      bucket.lng = bucket.items.reduce((s, i) => s + i.lng, 0) / bucket.items.length;
    } else {
      buckets.set(key, { lat: p.lat, lng: p.lng, items: [p] });
    }
  }
  return [...buckets.values()];
}
