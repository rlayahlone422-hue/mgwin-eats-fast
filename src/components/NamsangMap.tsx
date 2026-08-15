import { useEffect, useRef, useState } from "react";
import { MapPin, WifiOff } from "lucide-react";
import { NAMSANG_CENTER } from "@/lib/mgwin";
import { NAMSANG_LANDMARKS, type NearbyShop } from "@/lib/namsang-map";
import { DARK_STYLE, LIGHT_LOAD_STYLE, clusterPoints, isLowEndDevice, loadGoogleMaps } from "@/lib/gmaps";
import type { RiderTrack } from "@/lib/rider-track";

interface Props {
  shops: NearbyShop[];
  me?: { lat: number; lng: number; accuracy?: number | null } | null;
  rider?: RiderTrack | null;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  lang: "mm" | "en";
  showLandmarks?: boolean;
}

export function NamsangMap({ shops, me, rider, selectedId, onSelect, lang, showLandmarks = true }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const shopMarkers = useRef<Record<string, any>>({});
  const meMarker = useRef<any>(null);
  const meCircle = useRef<any>(null);
  const riderMarker = useRef<any>(null);
  const idleListener = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [lowEnd] = useState(() => isLowEndDevice());

  // Defer the (heavy) maps script until the map area is scrolled into view.
  useEffect(() => {
    const node = el.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && setVisible(true),
      { rootMargin: "150px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || mapRef.current) return;
    let cancelled = false;
    setStatus("loading");
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !el.current) return;
        mapRef.current = new window.google.maps.Map(el.current, {
          center: NAMSANG_CENTER,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          keyboardShortcuts: false,
          maxZoom: lowEnd ? 17 : 19,
          styles: lowEnd ? LIGHT_LOAD_STYLE : DARK_STYLE,
        });
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [visible, lowEnd]);

  // Shop + landmark markers, grouped into clusters at low zoom.
  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;
    const g = window.google.maps;

    const render = () => {
      markers.current.forEach((m) => m.setMap(null));
      markers.current = [];
      shopMarkers.current = {};

      const clusters = clusterPoints(map, shops, lowEnd ? 80 : 56);
      clusters.forEach((c) => {
        if (c.items.length > 1) {
          const marker = new g.Marker({
            position: { lat: c.lat, lng: c.lng },
            map,
            label: { text: String(c.items.length), color: "#1f1a17", fontSize: "11px", fontWeight: "700" },
            icon: {
              path: g.SymbolPath.CIRCLE,
              scale: 13 + Math.min(6, c.items.length),
              fillColor: "#f9a825",
              fillOpacity: 0.95,
              strokeColor: "#1f1a17",
              strokeWeight: 2,
            },
          });
          marker.addListener("click", () => {
            const bounds = new g.LatLngBounds();
            c.items.forEach((i) => bounds.extend({ lat: i.lat, lng: i.lng }));
            map.fitBounds(bounds, 60);
          });
          markers.current.push(marker);
          return;
        }
        const s = c.items[0];
        const marker = new g.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          title: lang === "mm" ? s.name_mm : s.name_en,
          icon: {
            path: g.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: s.isOpen ? "#f97316" : "#6b7280",
            fillOpacity: 1,
            strokeColor: "#1f1a17",
            strokeWeight: 2,
          },
        });
        marker.addListener("click", () => onSelect?.(s.id));
        markers.current.push(marker);
        shopMarkers.current[s.id] = marker;
      });

      // Landmarks are decoration — skip them entirely on low-end phones.
      if (showLandmarks && !lowEnd) {
        NAMSANG_LANDMARKS.forEach((l) => {
          markers.current.push(
            new g.Marker({
              position: { lat: l.lat, lng: l.lng },
              map,
              title: lang === "mm" ? l.name_mm : l.name_en,
              icon: {
                path: g.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: "#c9a97a",
                fillOpacity: 0.9,
                strokeColor: "#1f1a17",
                strokeWeight: 1,
              },
            }),
          );
        });
      }
    };

    render();
    idleListener.current = map.addListener("idle", render);
    return () => {
      idleListener.current?.remove?.();
      idleListener.current = null;
    };
  }, [status, shops, lang, showLandmarks, onSelect, lowEnd]);

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

  // Live rider marker for the active delivery
  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;
    if (!rider) {
      riderMarker.current?.setMap(null);
      riderMarker.current = null;
      return;
    }
    if (!riderMarker.current) {
      riderMarker.current = new window.google.maps.Marker({
        position: rider.position,
        map,
        zIndex: 1000,
        title: lang === "mm" ? "ပို့ဆောင်သူ" : "Rider",
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
    } else {
      riderMarker.current.setPosition(rider.position);
    }
  }, [status, rider, lang]);

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
      {status !== "ready" && status !== "error" && (
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
