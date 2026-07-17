import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

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
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return window.__mgwinMapLoading;
}

interface Props {
  lat: number;
  lng: number;
  label?: string | null;
  height?: number;
}

export function MapPreview({ lat, lng, label, height = 180 }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !el.current) return;
        const map = new window.google.maps.Map(el.current, {
          center: { lat, lng },
          zoom: 15,
          disableDefaultUI: true,
          gestureHandling: "none",
          clickableIcons: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#1f1a17" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1f1a17" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#c9a97a" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#2b2420" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1a20" }] },
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        });
        new window.google.maps.Marker({ position: { lat, lng }, map });
        setReady(true);
      })
      .catch(() => setErr(true));
    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border" style={{ height }}>
      <div ref={el} className="absolute inset-0 bg-muted" />
      {!ready && !err && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground bg-gradient-to-br from-[#1f1a17] to-[#0f0c0a] animate-pulse">
          Loading map…
        </div>
      )}
      {err && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-muted-foreground bg-card gap-1 px-4 text-center">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-mono">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
        </div>
      )}
      {label && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs text-white">
            <MapPin className="w-3 h-3 text-primary shrink-0" />
            <span className="truncate">{label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
