import { useEffect, useRef, useState } from "react";
import { Bike, MapPin, WifiOff } from "lucide-react";
import { DARK_STYLE, LIGHT_LOAD_STYLE, isLowEndDevice, loadGoogleMaps } from "@/lib/gmaps";
import type { RiderTrack } from "@/lib/rider-track";

interface Props {
  track: RiderTrack;
  lang: "mm" | "en";
  height?: number;
  /** Shown when the rider has not collected the food yet. */
  waitingLabel?: string;
}

/** Compact live map: shop → rider → customer, lazy-loaded when scrolled into view. */
export function RiderTrackMap({ track, lang, height = 220, waitingLabel }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const riderMarker = useRef<any>(null);
  const pathLine = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const mm = lang === "mm";

  // Only fetch the maps script once the card is actually on screen.
  useEffect(() => {
    const node = el.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && setVisible(true),
      { rootMargin: "120px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || mapRef.current) return;
    let cancelled = false;
    setStatus("loading");
    const lowEnd = isLowEndDevice();
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !el.current) return;
        const g = window.google.maps;
        const map = new g.Map(el.current, {
          center: track.position,
          zoom: 15,
          disableDefaultUI: true,
          gestureHandling: "cooperative",
          clickableIcons: false,
          keyboardShortcuts: false,
          styles: lowEnd ? LIGHT_LOAD_STYLE : DARK_STYLE,
        });
        mapRef.current = map;
        new g.Marker({
          position: track.from,
          map,
          title: mm ? "ဆိုင်" : "Shop",
          icon: { path: g.SymbolPath.CIRCLE, scale: 6, fillColor: "#f97316", fillOpacity: 1, strokeColor: "#1f1a17", strokeWeight: 2 },
        });
        new g.Marker({
          position: track.to,
          map,
          title: mm ? "ပို့ဆောင်ရမည့်နေရာ" : "Drop-off",
          icon: { path: g.SymbolPath.BACKWARD_CLOSED_ARROW, scale: 5, fillColor: "#c9a97a", fillOpacity: 1, strokeColor: "#1f1a17", strokeWeight: 2 },
        });
        if (!lowEnd) {
          pathLine.current = new g.Polyline({
            map,
            path: [track.from, track.to],
            strokeColor: "#f97316",
            strokeOpacity: 0.35,
            strokeWeight: 2,
          });
        }
        riderMarker.current = new g.Marker({
          position: track.position,
          map,
          zIndex: 999,
          title: mm ? "ပို့ဆောင်သူ" : "Rider",
          icon: { path: g.SymbolPath.CIRCLE, scale: 8, fillColor: "#38bdf8", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 2 },
        });
        const bounds = new g.LatLngBounds();
        [track.from, track.to, track.position].forEach((p) => bounds.extend(p));
        map.fitBounds(bounds, 48);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [visible, mm, track.from, track.to]);

  // Smoothly move the rider marker as new positions arrive.
  useEffect(() => {
    if (status !== "ready") return;
    riderMarker.current?.setPosition(track.position);
  }, [status, track.position]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted" style={{ height }}>
      <div ref={el} className="absolute inset-0" />
      {status !== "ready" && status !== "error" && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gradient-to-br from-[#1f1a17] to-[#0f0c0a] text-xs text-muted-foreground animate-pulse">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className={mm ? "font-mm" : ""}>{mm ? "တိုက်ရိုက် မြေပုံ..." : "Loading live map…"}</span>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-card text-xs text-muted-foreground">
          <WifiOff className="w-4 h-4 text-destructive" />
          <span className="font-mono">
            {track.position.lat.toFixed(5)}, {track.position.lng.toFixed(5)}
          </span>
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-lg bg-black/65 backdrop-blur px-3 py-2 text-xs text-white">
        <Bike className={`w-3.5 h-3.5 text-primary ${track.riding ? "animate-pulse" : ""}`} />
        <span className={mm ? "font-mm" : ""}>
          {track.riding
            ? mm
              ? `ပို့ဆောင်သူ လမ်းပေါ်ရှိသည် · ${track.minutesLeft} မိနစ်အတွင်း`
              : `Rider on the way · ~${track.minutesLeft} min`
            : (waitingLabel ?? (mm ? "ဆိုင်တွင် စောင့်နေသည်" : "Waiting at the shop"))}
        </span>
        {track.riding && (
          <span className="ml-auto font-mono text-[10px] opacity-80">{Math.round(track.progress * 100)}%</span>
        )}
      </div>
    </div>
  );
}
