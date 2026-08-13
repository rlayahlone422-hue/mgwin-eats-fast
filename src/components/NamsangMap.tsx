import { useEffect, useRef, useState } from "react";
import { MapPin, WifiOff } from "lucide-react";
import { NAMSANG_CENTER } from "@/lib/mgwin";
import { NAMSANG_LANDMARKS, type NearbyShop } from "@/lib/namsang-map";

declare global {
  interface Window {
    google?: any;
    __mgwinInitMap?: () => void;
    __mgwinMapLoading?: Promise<void>;
  }
}

function loadGoogleMaps(): Promise<void> {
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

const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1f1a17" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1f1a17" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#c9a97a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2b2420" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1a20" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
];

interface Props {
  shops: NearbyShop[];
  me?: { lat: number; lng: number; accuracy?: number | null } | null;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  lang: "mm" | "en";
  showLandmarks?: boolean;
}

export function NamsangMap({ shops, me, selectedId, onSelect, lang, showLandmarks = true }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const shopMarkers = useRef<Record<string, any>>({});
  const meMarker = useRef<any>(null);
  const meCircle = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !el.current) return;
        mapRef.current = new window.google.maps.Map(el.current, {
          center: NAMSANG_CENTER,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: DARK_STYLE,
        });
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  // Shop + landmark markers
  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;
    Object.values(shopMarkers.current).forEach((m: any) => m.setMap(null));
    shopMarkers.current = {};
    shops.forEach((s) => {
      const marker = new window.google.maps.Marker({
        position: { lat: s.lat, lng: s.lng },
        map,
        title: lang === "mm" ? s.name_mm : s.name_en,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: s.isOpen ? "#f97316" : "#6b7280",
          fillOpacity: 1,
          strokeColor: "#1f1a17",
          strokeWeight: 2,
        },
      });
      marker.addListener("click", () => onSelect?.(s.id));
      shopMarkers.current[s.id] = marker;
    });
    if (showLandmarks) {
      NAMSANG_LANDMARKS.forEach((l) => {
        new window.google.maps.Marker({
          position: { lat: l.lat, lng: l.lng },
          map,
          title: lang === "mm" ? l.name_mm : l.name_en,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: "#c9a97a",
            fillOpacity: 0.9,
            strokeColor: "#1f1a17",
            strokeWeight: 1,
          },
        });
      });
    }
  }, [status, shops, lang, showLandmarks, onSelect]);

  // GPS marker + accuracy halo
  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;
    if (!me) {
      meMarker.current?.setMap(null);
      meCircle.current?.setMap(null);
      meMarker.current = null;
      meCircle.current = null;
      return;
    }
    const pos = { lat: me.lat, lng: me.lng };
    if (!meMarker.current) {
      meMarker.current = new window.google.maps.Marker({
        position: pos,
        map,
        zIndex: 999,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#38bdf8",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
      meCircle.current = new window.google.maps.Circle({
        map,
        center: pos,
        radius: me.accuracy ?? 40,
        strokeColor: "#38bdf8",
        strokeOpacity: 0.4,
        strokeWeight: 1,
        fillColor: "#38bdf8",
        fillOpacity: 0.12,
      });
      map.panTo(pos);
    } else {
      meMarker.current.setPosition(pos);
      meCircle.current?.setCenter(pos);
      meCircle.current?.setRadius(me.accuracy ?? 40);
    }
  }, [status, me]);

  // Focus selection
  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map || !selectedId) return;
    const m = shopMarkers.current[selectedId];
    if (m) {
      map.panTo(m.getPosition());
      map.setZoom(16);
    }
  }, [status, selectedId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-muted">
      <div ref={el} className="absolute inset-0" />
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1f1a17] to-[#0f0c0a]">
          <div className="w-12 h-12 rounded-full bg-gradient-ember flex items-center justify-center animate-ember-pulse">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className={`text-sm text-muted-foreground ${lang === "mm" ? "font-mm" : ""}`}>
            {lang === "mm" ? "နမ့်စန် မြေပုံ ဖွင့်နေသည်..." : "Loading Namsang map..."}
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card px-6 text-center">
          <WifiOff className="w-7 h-7 text-destructive" />
          <div className={`text-sm ${lang === "mm" ? "font-mm" : ""}`}>
            {lang === "mm" ? "မြေပုံ ဖွင့်၍မရပါ" : "Couldn't load the map"}
          </div>
        </div>
      )}
    </div>
  );
}
