import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bike, Crosshair, Loader2, Locate, MapPin, Navigation, Radio, Star } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { NamsangMap } from "@/components/NamsangMap";
import { useApp } from "@/lib/mgwin-store";
import { useGps } from "@/hooks/use-gps";
import { useRiderTrack } from "@/hooks/use-rider-track";
import { isActiveOrder } from "@/lib/rider-track";
import { NAMSANG_CENTER, computeDeliveryFee, estimateEta } from "@/lib/mgwin";
import { directionsUrl, nearbyRestaurants } from "@/lib/namsang-map";


export const Route = createFileRoute("/map")({
  component: NamsangMapPage,
  head: () => ({
    meta: [
      { title: "Namsang Food Map & GPS Delivery | Mg Win" },
      {
        name: "description",
        content:
          "Live Namsang map with GPS: find Shan noodle shops, tea shops and restaurants near you, see distance, delivery fee and rider ETA in Namsang, Shan State.",
      },
      { property: "og:title", content: "Namsang Food Map & GPS Delivery | Mg Win" },
      {
        property: "og:description",
        content: "Locate yourself with GPS and order from the closest Namsang restaurants on Mg Win.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function NamsangMapPage() {
  const { lang, orders } = useApp();
  const gps = useGps();
  const [selected, setSelected] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<string>("all");
  const [openOnly, setOpenOnly] = useState(false);

  const origin = gps.point ?? NAMSANG_CENTER;
  const allShops = useMemo(() => nearbyRestaurants(origin), [origin.lat, origin.lng]);
  const mm = lang === "mm";
  const f = mm ? "font-mm" : "";

  const cuisines = useMemo(() => {
    const map = new Map<string, string>();
    allShops.forEach((s) => map.set(s.cuisine_en, mm ? s.cuisine_mm : s.cuisine_en));
    return [...map.entries()];
  }, [allShops, mm]);

  const shops = useMemo(
    () =>
      allShops.filter(
        (s) => (cuisine === "all" || s.cuisine_en === cuisine) && (!openOnly || s.isOpen),
      ),
    [allShops, cuisine, openOnly],
  );

  const activeOrder = useMemo(
    () => orders.find((o) => isActiveOrder(o)) ?? null,
    [orders],
  );
  const riderTrack = useRiderTrack(activeOrder);


  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-5">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-display ${f}`}>
            {mm ? "နမ့်စန် မြေပုံနှင့် GPS" : "Namsang map & GPS"}
          </h1>
          <p className={`mt-1 text-sm text-muted-foreground ${f}`}>
            {mm
              ? "သင့်တည်နေရာကို GPS ဖြင့်ရှာပြီး အနီးဆုံးဆိုင်များ၊ ပို့ဆောင်ခနှင့် အချိန်ကို ကြည့်ပါ။"
              : "Use GPS to find your spot, then see the closest shops, delivery fees and rider ETA."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={gps.locate}
            className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-ember text-primary-foreground text-sm font-semibold hover:scale-[1.02] transition-transform ${f}`}
          >
            {gps.status === "locating" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Locate className="w-4 h-4" />}
            {mm ? "ကျွန်ုပ်တည်နေရာ" : "Locate me"}
          </button>
          <button
            onClick={gps.watching ? gps.stopWatch : gps.startWatch}
            className={`inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-sm transition-colors ${
              gps.watching ? "border-primary text-primary bg-primary/10" : "border-border hover:bg-muted"
            } ${f}`}
          >
            <Radio className={`w-4 h-4 ${gps.watching ? "animate-pulse" : ""}`} />
            {gps.watching ? (mm ? "တိုက်ရိုက် ရပ်မည်" : "Stop live GPS") : mm ? "တိုက်ရိုက် GPS" : "Live GPS"}
          </button>
          {gps.point && (
            <span className="text-xs text-muted-foreground font-mono">
              {gps.point.lat.toFixed(5)}, {gps.point.lng.toFixed(5)}
              {gps.point.accuracy ? ` · ±${Math.round(gps.point.accuracy)}m` : ""}
            </span>
          )}
          {gps.error && <span className="text-xs text-destructive">{gps.error}</span>}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          <div className="h-[58vh] lg:h-[560px]">
            <NamsangMap
              shops={shops}
              me={gps.point}
              selectedId={selected}
              onSelect={setSelected}
              lang={lang}
            />
          </div>

          <div className="space-y-3 lg:max-h-[560px] lg:overflow-y-auto pr-1">
            {shops.map((s, i) => {
              const eta = estimateEta(s.liveDistanceKm);
              const fee = computeDeliveryFee(s.liveDistanceKm);
              const active = selected === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className={`animate-float-up cursor-pointer rounded-2xl border p-3 flex gap-3 transition-all ${
                    active ? "border-primary bg-primary/5 shadow-ember" : "border-border bg-card/60 hover:border-primary/50"
                  }`}
                >
                  <img
                    src={s.image}
                    alt={mm ? s.name_mm : s.name_en}
                    loading="lazy"
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className={`font-semibold text-sm truncate ${f}`}>{mm ? s.name_mm : s.name_en}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3 h-3 text-primary" /> {s.rating}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {s.liveDistanceKm.toFixed(1)} km
                      </span>
                      <span>· {eta.totalMin} min</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className={`text-primary font-medium ${f}`}>
                        {fee.toLocaleString()} Ks {mm ? "ပို့ခ" : "delivery"}
                      </span>
                      {!s.isOpen && (
                        <span className={`text-muted-foreground ${f}`}>{mm ? "ပိတ်ထားသည်" : "Closed"}</span>
                      )}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Link
                        to="/restaurants/$id"
                        params={{ id: s.id }}
                        className={`h-8 px-3 inline-flex items-center rounded-lg bg-gradient-ember text-primary-foreground text-xs font-semibold ${f}`}
                      >
                        {mm ? "မီနူး ကြည့်" : "View menu"}
                      </Link>
                      <a
                        href={directionsUrl({ lat: s.lat, lng: s.lng }, gps.point)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-border text-xs hover:bg-muted ${f}`}
                      >
                        <Navigation className="w-3 h-3" />
                        {mm ? "လမ်းညွှန်" : "Directions"}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className={`flex items-start gap-2 rounded-2xl border border-border bg-card/40 p-3 text-xs text-muted-foreground ${f}`}>
              <Crosshair className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
              {mm
                ? "GPS မဖွင့်ပါက အကွာအဝေးများကို နမ့်စန်မြို့လယ်မှ တွက်ချက်ပါသည်။"
                : "Without GPS, distances are measured from Namsang town centre."}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
