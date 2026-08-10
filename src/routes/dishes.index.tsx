import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Utensils, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";
import { formatKs } from "@/lib/mgwin";
import { DISH_PAGES, RESTAURANT_PAGES, absoluteUrl } from "@/lib/seo-pages";

const TITLE = "Burmese & Shan Dishes in Namsang — Prices & Delivery | Mg Win";
const DESCRIPTION =
  "Every Burmese and Shan dish you can order in Namsang, Shan State: Shan noodles, mohinga, tea leaf salad, coconut noodles, palata and more, with local prices in Kyat and motorbike delivery.";
const URL = absoluteUrl("/dishes");

export const Route = createFileRoute("/dishes/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:image", content: absoluteUrl("/guide-hero.jpg") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: absoluteUrl("/guide-hero.jpg") },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Burmese & Shan dishes in Namsang",
          itemListElement: DISH_PAGES.map((d, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: d.name_en,
            url: absoluteUrl(`/dishes/${d.slug}`),
          })),
        }),
      },
    ],
  }),
  component: DishesHub,
});

function DishesHub() {
  const { lang, L } = useApp();
  const mm = lang === "mm";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Namsang, Shan State</div>
        <h1 className={`font-display text-4xl md:text-5xl ${mm ? "font-mm" : ""}`}>
          {L({ mm: "မြန်မာနှင့် ရှမ်းအစားအစာများ", en: "Burmese & Shan dishes in Namsang" })}
        </h1>
        <p className={`text-muted-foreground mt-3 max-w-2xl ${mm ? "font-mm" : ""}`}>
          {L({
            mm: "ဒေသတွင်း ဆိုင်များမှ မှာယူနိုင်သည့် အစားအစာတိုင်းအတွက် သီးသန့်စာမျက်နှာ — အရသာ၊ ဆေးနှုန်းနှင့် ဘယ်ဆိုင်တွင် ရနိုင်သည်ကို ဖတ်ပါ။",
            en: "A page for every dish our Namsang kitchens cook — the story behind it, the local price in Kyat, and exactly which stall to order it from.",
          })}
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISH_PAGES.map((d, i) => (
            <Link
              key={d.slug}
              to="/dishes/$slug"
              params={{ slug: d.slug }}
              className="group rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-primary/60 transition-all hover:-translate-y-1 hover:shadow-ember animate-float-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name_en}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              </div>
              <div className="p-5">
                <h2 className={`font-semibold text-lg ${mm ? "font-mm" : ""}`}>{L({ mm: d.name_mm, en: d.name_en })}</h2>
                <p className={`text-xs text-muted-foreground mt-1 line-clamp-2 ${mm ? "font-mm" : ""}`}>
                  {L({ mm: d.desc_mm, en: d.desc_en })}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="text-accent font-semibold text-sm">{formatKs(d.minPrice)}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="inline-flex items-center gap-1">
                    <Utensils className="w-3 h-3" /> {d.offers.length}{" "}
                    {L({ mm: "ဆိုင်", en: d.offers.length > 1 ? "kitchens" : "kitchen" })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-16">
          <h2 className={`font-display text-2xl mb-5 ${mm ? "font-mm" : ""}`}>
            {L({ mm: "နမ့်စန်မြို့ရဲ့ ဆိုင်များ", en: "Top Namsang restaurants" })}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESTAURANT_PAGES.map((r) => (
              <Link
                key={r.slug}
                to="/eat/$slug"
                params={{ slug: r.slug }}
                className="flex items-center justify-between gap-3 rounded-2xl bg-card border border-border/60 p-4 hover:border-primary/60 transition-colors"
              >
                <div className="min-w-0">
                  <h3 className={`font-semibold truncate ${mm ? "font-mm" : ""}`}>{L({ mm: r.name_mm, en: r.name_en })}</h3>
                  <p className={`text-xs text-muted-foreground mt-0.5 truncate ${mm ? "font-mm" : ""}`}>
                    {L({ mm: r.cuisine_mm, en: r.cuisine_en })} · {L({ mm: r.address_mm, en: r.address_en })}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" /> {r.rating}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
