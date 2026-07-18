import { useEffect, useRef, useState } from "react";
import { MapPin, Maximize2, X } from "lucide-react";

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

const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1f1a17" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1f1a17" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#c9a97a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2b2420" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1a20" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
];

function useMap(
  el: React.RefObject<HTMLDivElement | null>,
  lat: number,
  lng: number,
  interactive: boolean,
) {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setErr(false);
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !el.current) return;
        const map = new window.google.maps.Map(el.current, {
          center: { lat, lng },
          zoom: interactive ? 16 : 15,
          disableDefaultUI: !interactive,
          zoomControl: interactive,
          gestureHandling: interactive ? "greedy" : "none",
          clickableIcons: false,
          styles: DARK_STYLE,
        });
        new window.google.maps.Marker({ position: { lat, lng }, map });
        setReady(true);
      })
      .catch(() => setErr(true));
    return () => {
      cancelled = true;
    };
  }, [el, lat, lng, interactive]);
  return { ready, err };
}

interface Props {
  lat: number;
  lng: number;
  label?: string | null;
  height?: number;
  expandable?: boolean;
}

export function MapPreview({ lat, lng, label, height = 180, expandable = true }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const { ready, err } = useMap(el, lat, lng, false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={expandable ? () => setExpanded(true) : undefined}
        aria-label={expandable ? "Expand map" : undefined}
        className={`group relative w-full rounded-xl overflow-hidden border border-border block ${
          expandable ? "cursor-zoom-in" : "cursor-default"
        }`}
        style={{ height }}
        disabled={!expandable}
      >
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
        {expandable && (
          <div className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center text-white opacity-90 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        )}
        {label && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-left">
            <div className="flex items-center gap-1.5 text-xs text-white">
              <MapPin className="w-3 h-3 text-primary shrink-0" />
              <span className="truncate">{label}</span>
            </div>
          </div>
        )}
      </button>

      {expanded && (
        <FullscreenMap lat={lat} lng={lng} label={label} onClose={() => setExpanded(false)} />
      )}
    </>
  );
}

function FullscreenMap({
  lat,
  lng,
  label,
  onClose,
}: {
  lat: number;
  lng: number;
  label?: string | null;
  onClose: () => void;
}) {
  const el = useRef<HTMLDivElement | null>(null);
  const { ready, err } = useMap(el, lat, lng, true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-0" ref={el} />
      {!ready && !err && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground bg-gradient-to-br from-[#1f1a17] to-[#0f0c0a] animate-pulse">
          Loading map…
        </div>
      )}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 h-11 w-11 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors z-10"
        aria-label="Close map"
      >
        <X className="w-5 h-5" />
      </button>
      {label && (
        <div className="absolute left-4 right-16 top-4 rounded-xl bg-card/95 backdrop-blur border border-border px-4 py-3 shadow-lg z-10">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{label}</div>
              <div className="text-xs text-muted-foreground font-mono">
                {lat.toFixed(5)}, {lng.toFixed(5)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
