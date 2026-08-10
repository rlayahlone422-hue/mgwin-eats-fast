import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, Clock, MapPin, ShoppingBag, ChevronRight, Bike } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";
import { formatKs } from "@/lib/mgwin";
import type { MenuItem } from "@/lib/mgwin";
import {
  RESTAURANT_PAGES,
  absoluteUrl,
  getRestaurantPage,
  slugify,
  type RestaurantPage,
} from "@/lib/seo-pages";

export const Route = createFileRoute("/eat/$slug")({
  loader: ({ params }): { place: RestaurantPage } => {
    const place = getRestaurantPage(params.slug);
    if (!place) throw notFound();
    return { place };
  },
  head: ({ params, loaderData }) => {
    const place = loaderData?.place;
    if (!place) {
      return { meta: [{ title: "Restaurant not found — Mg Win" }, { name: "robots", content: "noindex" }] };
    }
    const url = absoluteUrl(`/eat/${params.slug}`);
    const title = `${place.name_en} — ${place.cuisine_en} Delivery in Namsang | Mg Win`;
    const description = `${place.name_en} (${place.name_mm}) on ${place.address_en}, Namsang. ${place.cuisine_en} delivered in about ${place.deliveryMin} minutes from ${formatKs(place.deliveryFee)}. Pay cash, KBZPay or Wave Pay.`;
    const image = absoluteUrl(place.image);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: place.name_en,
            alternateName: place.name_mm,
            servesCuisine: place.cuisine_en,
            image,
            url,
            priceRange: "MMK",
            address: {
              "@type": "PostalAddress",
              streetAddress: place.address_en,
              addressLocality: "Namsang",
              addressRegion: "Shan State",
              addressCountry: "MM",
            },
            aggregateRating: { "@type": "AggregateRating", ratingValue: place.rating, bestRating: 5, ratingCount: 40 },
            hasMenu: {
              "@type": "Menu",
              hasMenuSection: {
                "@type": "MenuSection",
                name: place.cuisine_en,
                hasMenuItem: place.items.map((m) => ({
                  "@type": "MenuItem",
                  name: m.name_en,
                  description: m.desc_en,
                  offers: { "@type": "Offer", price: m.price, priceCurrency: "MMK" },
                })),
              },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Dishes", item: absoluteUrl("/dishes") },
              { "@type": "ListItem", position: 2, name: place.name_en, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: PlaceNotFound,
  component: PlacePageView,
});

function PlaceNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Restaurant not found</h1>
        <Link to="/restaurants" className="text-accent hover:underline">
          Browse Namsang restaurants
        </Link>
      </div>
    </div>
  );
}

function PlacePageView() {
  const { place } = Route.useLoaderData();
  const { lang, L } = useApp();
  const mm = lang === "mm";
  const others = RESTAURANT_PAGES.filter((r) => r.slug !== place.slug).slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <div className="relative">
        <div className="absolute inset-0">
          <img src={place.image} alt={place.name_en} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/50" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-12">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
            <Link to="/restaurants" className="hover:text-foreground">
              {L({ mm: "ဆိုင်များ", en: "Restaurants" })}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{L({ mm: place.name_mm, en: place.name_en })}</span>
          </nav>
          <div className="text-xs uppercase tracking-widest text-accent mb-2">
            {L({ mm: place.cuisine_mm, en: place.cuisine_en })} · Namsang, Shan State
          </div>
          <h1 className={`font-display text-4xl md:text-6xl leading-tight ${mm ? "font-mm" : ""}`}>
            {L({ mm: place.name_mm, en: place.name_en })}
          </h1>
          <p className={`mt-4 max-w-2xl text-muted-foreground ${mm ? "font-mm" : ""}`}>
            {L({
              mm: `${place.address_mm} တွင် တည်ရှိသော ${place.name_mm} မှ ${place.cuisine_mm} အစားအစာများကို မော်တော်ဆိုင်ကယ်ဖြင့် ${place.deliveryMin} မိနစ်အတွင်း ပို့ဆောင်ပေးသည်။`,
              en: `${place.name_en} serves ${place.cuisine_en.toLowerCase()} from ${place.address_en} in Namsang, delivered by motorbike in about ${place.deliveryMin} minutes.`,
            })}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-card border border-border px-4 py-2 inline-flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {place.rating}
            </span>
            <span className="rounded-full bg-card border border-border px-4 py-2 inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {place.deliveryMin} min
            </span>
            <span className="rounded-full bg-card border border-border px-4 py-2 inline-flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5" /> {formatKs(place.deliveryFee)}
            </span>
            <span className="rounded-full bg-card border border-border px-4 py-2 inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {L({ mm: place.address_mm, en: place.address_en })}
            </span>
            <Link
              to="/restaurants/$id"
              params={{ id: place.id }}
              className="rounded-full bg-gradient-ember px-5 py-2 font-semibold text-primary-foreground shadow-ember hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {L({ mm: "မီနူးကြည့်၍ မှာမည်", en: "View menu & order" })}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-20">
        <section>
          <h2 className={`font-display text-2xl mb-5 ${mm ? "font-mm" : ""}`}>
            {L({ mm: "မီနူးနှင့် ဆေးနှုန်းများ", en: `${place.name_en} menu & prices` })}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {place.items.map((m: MenuItem, i: number) => (
              <Link
                key={m.id}
                to="/dishes/$slug"
                params={{ slug: slugify(m.name_en) }}
                className="group flex gap-4 rounded-2xl bg-card border border-border/60 p-3 hover:border-primary/60 transition-all hover:-translate-y-0.5 animate-float-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <img
                  src={m.image}
                  alt={m.name_en}
                  loading="lazy"
                  className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold truncate ${mm ? "font-mm" : ""}`}>{L({ mm: m.name_mm, en: m.name_en })}</h3>
                  <p className={`text-xs text-muted-foreground line-clamp-2 mt-0.5 ${mm ? "font-mm" : ""}`}>
                    {L({ mm: m.desc_mm, en: m.desc_en })}
                  </p>
                  <div className="mt-2 text-accent font-semibold text-sm">{formatKs(m.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-card border border-border/60 p-6 md:p-8">
          <h2 className={`font-display text-2xl mb-3 ${mm ? "font-mm" : ""}`}>
            {L({ mm: "ပို့ဆောင်မှုနှင့် ငွေပေးချေမှု", en: "Delivery & payment in Namsang" })}
          </h2>
          <p className={`text-muted-foreground leading-relaxed ${mm ? "font-mm" : ""}`}>
            {L({
              mm: `Mg Win ရိုက်ဒါများသည် ${place.address_mm} မှ သင့်တံခါးအထိ ပို့ဆောင်ပေးပါသည်။ ငွေအကြေ၊ KBZPay နှင့် Wave Pay ဖြင့် ပေးချေနိုင်ပါသည်။ ပို့ဆောင်ခ ${formatKs(place.deliveryFee)} မှ စတင်သည်။`,
              en: `Mg Win riders collect from ${place.address_en} and deliver across Namsang town. Pay with cash on delivery, KBZPay or Wave Pay. Delivery starts at ${formatKs(place.deliveryFee)} and is calculated from your map pin.`,
            })}
          </p>
        </section>

        <section className="mt-12">
          <h2 className={`font-display text-2xl mb-4 ${mm ? "font-mm" : ""}`}>
            {L({ mm: "အခြားဆိုင်များ", en: "Other Namsang restaurants" })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {others.map((r) => (
              <Link
                key={r.slug}
                to="/eat/$slug"
                params={{ slug: r.slug }}
                className={`rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:border-primary/60 hover:text-foreground transition-colors ${mm ? "font-mm" : ""}`}
              >
                {L({ mm: r.name_mm, en: r.name_en })}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
