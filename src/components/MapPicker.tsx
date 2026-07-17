import { useEffect, useRef, useState } from "react";
import { X, MapPin, Crosshair, Check } from "lucide-react";

// Namsang, southern Shan State approx coordinates
const NAMSANG_CENTER = { lat: 20.8833, lng: 97.7333 };

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

export interface PickedLocation {
  lat: number;
  lng: number;
}

interface Props {
  open: boolean;
  initial?: PickedLocation | null;
  onClose: () => void;
  onConfirm: (loc: PickedLocation) => void;
  lang: "mm" | "en";
}

export function MapPicker({ open, initial, onClose, onConfirm, lang }: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [loc, setLoc] = useState<PickedLocation>(initial ?? NAMSANG_CENTER);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus("loading");
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !mapEl.current) return;
        const start = initial ?? NAMSANG_CENTER;
        const map = new window.google.maps.Map(mapEl.current, {
          center: start,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: [
            { elementType: "geometry", stylers: [{ color: "#1f1a17" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1f1a17" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#c9a97a" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#2b2420" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1a20" }] },
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        });
        const marker = new window.google.maps.Marker({
          position: start,
          map,
          draggable: true,
        });
        marker.addListener("dragend", () => {
          const p = marker.getPosition();
          if (p) setLoc({ lat: p.lat(), lng: p.lng() });
        });
        map.addListener("click", (e: any) => {
          if (!e.latLng) return;
          marker.setPosition(e.latLng);
          setLoc({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        });
        mapRef.current = map;
        markerRef.current = marker;
        setStatus("ready");
      })
      .catch((e) => {
        if (cancelled) return;
        setErrMsg(e?.message ?? "Failed to load map");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [open, initial]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLoc(p);
        if (mapRef.current && markerRef.current) {
          mapRef.current.panTo(p);
          mapRef.current.setZoom(16);
          markerRef.current.setPosition(p);
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full sm:max-w-2xl bg-card border border-border sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className={`font-semibold ${lang === "mm" ? "font-mm" : ""}`}>
              {lang === "mm" ? "မြေပုံပေါ်တွင် နေရာသတ်မှတ်ရန်" : "Pin your delivery location"}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative h-[60vh] sm:h-[440px] bg-muted">
          <div ref={mapEl} className="absolute inset-0" />
          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              <div className="animate-pulse">{lang === "mm" ? "မြေပုံ ဖွင့်နေသည်..." : "Loading map..."}</div>
            </div>
          )}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-destructive px-6 text-center">
              <span>{lang === "mm" ? "မြေပုံ ဖွင့်၍မရပါ" : "Couldn't load the map"}</span>
              <span className="text-xs text-muted-foreground">{errMsg}</span>
            </div>
          )}

          {status === "ready" && (
            <button
              onClick={useMyLocation}
              className="absolute bottom-4 right-4 h-11 w-11 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Use my location"
            >
              <Crosshair className="w-4 h-4 text-primary" />
            </button>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="text-xs text-muted-foreground font-mono">
            📍 {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`flex-1 h-11 rounded-xl border border-border hover:bg-muted transition-colors ${lang === "mm" ? "font-mm" : ""}`}
            >
              {lang === "mm" ? "ပယ်ဖျက်" : "Cancel"}
            </button>
            <button
              onClick={() => onConfirm(loc)}
              disabled={status !== "ready"}
              className={`flex-1 h-11 rounded-xl bg-gradient-ember text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] transition-transform ${lang === "mm" ? "font-mm" : ""}`}
            >
              <Check className="w-4 h-4" />
              {lang === "mm" ? "ဒီနေရာသုံးမည်" : "Use this location"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
