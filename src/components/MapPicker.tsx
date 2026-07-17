import { useEffect, useRef, useState, useCallback } from "react";
import { X, MapPin, Crosshair, Check, RefreshCw, WifiOff, Loader2 } from "lucide-react";
import { NAMSANG_CENTER } from "@/lib/mgwin";
import { reverseGeocode } from "@/lib/geocode.functions";

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
      reject(new Error("Network error loading map — check your connection"));
    };
    // Fail if the script tag never fires (blocked/very slow)
    setTimeout(() => {
      if (!window.google?.maps) {
        window.__mgwinMapLoading = undefined;
        reject(new Error("Map is taking too long to load"));
      }
    }, 12000);
    document.head.appendChild(s);
  });
  return window.__mgwinMapLoading;
}

export interface PickedLocation {
  lat: number;
  lng: number;
  label?: string | null;
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
  const [fallback, setFallback] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [label, setLabel] = useState<string | null>(initial?.label ?? null);
  const [geocoding, setGeocoding] = useState(false);
  const [manualLat, setManualLat] = useState<string>("");
  const [manualLng, setManualLng] = useState<string>("");

  const fetchLabel = useCallback(async (lat: number, lng: number) => {
    setGeocoding(true);
    try {
      const res = await reverseGeocode({ data: { lat, lng } });
      const s = res?.short ?? res?.label ?? null;
      setLabel(s);
      setLoc((prev) => ({ ...prev, label: s }));
    } catch {
      setLabel(null);
    } finally {
      setGeocoding(false);
    }
  }, []);

  useEffect(() => {
    if (!open || fallback) return;
    let cancelled = false;
    setStatus("loading");
    setErrMsg("");
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
          if (p) {
            const next = { lat: p.lat(), lng: p.lng() };
            setLoc(next);
            fetchLabel(next.lat, next.lng);
          }
        });
        map.addListener("click", (e: any) => {
          if (!e.latLng) return;
          marker.setPosition(e.latLng);
          const next = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          setLoc(next);
          fetchLabel(next.lat, next.lng);
        });
        mapRef.current = map;
        markerRef.current = marker;
        setStatus("ready");
        // Initial reverse geocode if we don't have a label yet
        if (!label) fetchLabel(start.lat, start.lng);
      })
      .catch((e) => {
        if (cancelled) return;
        setErrMsg(e?.message ?? "Failed to load map");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, attempt, fallback]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLoc(p);
        fetchLabel(p.lat, p.lng);
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

  const retry = () => {
    window.__mgwinMapLoading = undefined;
    setAttempt((a) => a + 1);
  };

  const applyManual = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
    const p = { lat, lng };
    setLoc(p);
    fetchLabel(lat, lng);
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
          {!fallback && <div ref={mapEl} className="absolute inset-0" />}

          {status === "loading" && !fallback && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#1f1a17] to-[#0f0c0a]">
              {/* Skeleton pattern */}
              <div className="absolute inset-0 opacity-40">
                <div className="w-full h-full grid grid-cols-6 grid-rows-8 gap-px">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="bg-card/40 animate-pulse" style={{ animationDelay: `${(i % 6) * 80}ms` }} />
                  ))}
                </div>
              </div>
              <div className="relative flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-ember flex items-center justify-center animate-ember-pulse">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className={`text-sm text-muted-foreground ${lang === "mm" ? "font-mm" : ""}`}>
                  {lang === "mm" ? "မြေပုံ ဖွင့်နေသည်..." : "Loading map..."}
                </div>
              </div>
            </div>
          )}

          {status === "error" && !fallback && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center bg-card">
              <WifiOff className="w-8 h-8 text-destructive" />
              <div className={`text-sm font-semibold ${lang === "mm" ? "font-mm" : ""}`}>
                {lang === "mm" ? "မြေပုံ ဖွင့်၍မရပါ" : "Couldn't load the map"}
              </div>
              <div className="text-xs text-muted-foreground max-w-xs">{errMsg}</div>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={retry}
                  className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gradient-ember text-primary-foreground text-sm font-semibold ${lang === "mm" ? "font-mm" : ""}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {lang === "mm" ? "ပြန်ကြိုးစားရန်" : "Retry"}
                </button>
                <button
                  onClick={() => setFallback(true)}
                  className={`inline-flex items-center h-9 px-4 rounded-lg border border-border text-sm hover:bg-muted ${lang === "mm" ? "font-mm" : ""}`}
                >
                  {lang === "mm" ? "ကိုယ်တိုင်ရိုက်ထည့်ရန်" : "Enter manually"}
                </button>
              </div>
            </div>
          )}

          {fallback && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 bg-card">
              <div className={`text-sm font-semibold ${lang === "mm" ? "font-mm" : ""}`}>
                {lang === "mm" ? "လိပ်စာ (lat, lng) ရိုက်ထည့်ရန်" : "Enter coordinates manually"}
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                <input
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  inputMode="decimal"
                  placeholder="20.88330"
                  className="h-11 px-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm font-mono"
                />
                <input
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  inputMode="decimal"
                  placeholder="97.73330"
                  className="h-11 px-3 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm font-mono"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={applyManual}
                  className={`h-9 px-4 rounded-lg bg-gradient-ember text-primary-foreground text-sm font-semibold ${lang === "mm" ? "font-mm" : ""}`}
                >
                  {lang === "mm" ? "အသုံးပြုမည်" : "Apply"}
                </button>
                <button
                  onClick={() => { setFallback(false); retry(); }}
                  className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-border text-sm hover:bg-muted ${lang === "mm" ? "font-mm" : ""}`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {lang === "mm" ? "မြေပုံ ပြန်စမည်" : "Try map again"}
                </button>
              </div>
            </div>
          )}

          {status === "ready" && !fallback && (
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
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className={`truncate ${label ? "text-foreground" : "text-muted-foreground italic"} ${lang === "mm" ? "font-mm" : ""}`}>
                {geocoding ? (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {lang === "mm" ? "လိပ်စာ ရှာနေသည်..." : "Finding address..."}
                  </span>
                ) : label ? (
                  label
                ) : (
                  lang === "mm" ? "လိပ်စာ မတွေ့ပါ" : "Address not resolved"
                )}
              </div>
              <div className="text-muted-foreground font-mono mt-0.5">
                {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`flex-1 h-11 rounded-xl border border-border hover:bg-muted transition-colors ${lang === "mm" ? "font-mm" : ""}`}
            >
              {lang === "mm" ? "ပယ်ဖျက်" : "Cancel"}
            </button>
            <button
              onClick={() => onConfirm({ ...loc, label })}
              disabled={status !== "ready" && !fallback}
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
