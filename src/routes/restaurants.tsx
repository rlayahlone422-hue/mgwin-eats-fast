import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Clock, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useApp, RESTAURANTS } from "@/lib/mgwin-store";
import { formatKs } from "@/lib/mgwin";

const LIST_TITLE = "Restaurants & Stalls in Namsang — Menus, Prices, Delivery | Mg Win";
const LIST_DESCRIPTION =
  "Browse every Namsang kitchen, tea shop and market stall on Mg Win: opening status, ratings, delivery fee in Kyat and estimated delivery time before you order.";
const LIST_URL = "https://mgwin-eats-fast.lovable.app/restaurants";

export const Route = createFileRoute("/restaurants")({
  component: RestaurantsPage,
  head: () => ({
    meta: [
      { title: LIST_TITLE },
      { name: "description", content: LIST_DESCRIPTION },
      { property: "og:title", content: LIST_TITLE },
      { property: "og:description", content: LIST_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: LIST_URL },
      { name: "twitter:title", content: LIST_TITLE },
      { name: "twitter:description", content: LIST_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: LIST_URL }],
  }),
});

function RestaurantsPage() {
  const { lang, L } = useApp();
  const [q, setQ] = useState("");

  const filtered = RESTAURANTS.filter((r) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      r.name_en.toLowerCase().includes(s) ||
      r.name_mm.includes(q) ||
      r.cuisine_en.toLowerCase().includes(s) ||
      r.cuisine_mm.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-accent mb-2">Namsang</div>
          <h1 className={`font-display text-4xl md:text-5xl ${lang === "mm" ? "font-mm" : ""}`}>
            {L({ mm: "ဆိုင်များကို ရွေးချယ်ပါ", en: "Choose a restaurant" })}
          </h1>
          <p className={`text-muted-foreground mt-2 ${lang === "mm" ? "font-mm" : ""}`}>
            {L({ mm: `${RESTAURANTS.length} ဆိုင် ရနိုင်ပါသည်`, en: `${RESTAURANTS.length} kitchens available today` })}
          </p>
        </div>

        <div className="relative mb-8 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "mm" ? "ဆိုင်/အစားအစာ ရှာဖွေရန်..." : "Search restaurants or cuisine..."}
            className={`w-full h-12 pl-11 pr-4 rounded-full bg-card border border-border focus:border-primary outline-none transition-colors ${lang === "mm" ? "font-mm" : ""}`}
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => (
            <Link
              key={r.id}
              to="/restaurants/$id"
              params={{ id: r.id }}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-primary/60 transition-all hover:-translate-y-1 hover:shadow-ember animate-float-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={r.image} alt={r.name_en} width={800} height={600} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute top-4 left-4 rounded-full bg-background/85 backdrop-blur-xl px-2.5 py-1 text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accent text-accent" /> {r.rating}
                </div>
                {!r.isOpen && (
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
                    <span className="rounded-full bg-destructive/90 text-destructive-foreground px-4 py-1.5 text-sm font-semibold">
                      {lang === "mm" ? "ဆိုင်ပိတ်ထားသည်" : "Closed"}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className={`font-semibold text-lg leading-tight ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: r.name_mm, en: r.name_en })}</h3>
                <p className={`text-xs text-muted-foreground mt-1 ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: r.cuisine_mm, en: r.cuisine_en })}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {r.deliveryMin} min</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.distanceKm} km</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-accent font-medium">{formatKs(r.deliveryFee)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            {lang === "mm" ? "ရှာဖွေမှုနှင့် ကိုက်ညီသည့် ဆိုင်မရှိပါ။" : "No restaurants match your search."}
          </div>
        )}
      </div>
    </div>
  );
}
