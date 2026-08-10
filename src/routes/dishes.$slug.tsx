import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, Clock, MapPin, ShoppingBag, ChevronRight, Utensils } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";
import { formatKs } from "@/lib/mgwin";
import { DISH_PAGES, DISH_NOTES, absoluteUrl, getDishPage, type DishPage, type DishOffer } from "@/lib/seo-pages";

export const Route = createFileRoute("/dishes/$slug")({
  loader: ({ params }): { dish: DishPage } => {
    const dish = getDishPage(params.slug);
    if (!dish) throw notFound();
    return { dish };
  },
  head: ({ params, loaderData }) => {
    const dish = loaderData?.dish;
    if (!dish) {
      return { meta: [{ title: "Dish not found — Mg Win" }, { name: "robots", content: "noindex" }] };
    }
    const url = absoluteUrl(`/dishes/${params.slug}`);
    const title = `${dish.name_en} in Namsang — Order Burmese & Shan Food | Mg Win`;
    const description = `Where to eat ${dish.name_en.toLowerCase()} (${dish.name_mm}) in Namsang, Shan State. ${dish.offers.length} local kitchen${dish.offers.length > 1 ? "s" : ""} from ${formatKs(dish.minPrice)}, delivered by motorbike with cash, KBZPay or Wave Pay.`;
    const image = absoluteUrl(dish.image);
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
            "@type": "MenuItem",
            name: dish.name_en,
            alternateName: dish.name_mm,
            description: dish.desc_en,
            image,
            offers: dish.offers.map((o) => ({
              "@type": "Offer",
              price: o.item.price,
              priceCurrency: "MMK",
              availability: o.item.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@type": "Restaurant", name: o.restaurant.name_en, address: o.restaurant.address_en },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Dishes", item: absoluteUrl("/dishes") },
              { "@type": "ListItem", position: 2, name: dish.name_en, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: DishNotFound,
  component: DishPageView,
});

function DishNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Dish not found</h1>
        <Link to="/dishes" className="text-accent hover:underline">
          Browse all Namsang dishes
        </Link>
      </div>
    </div>
  );
}

function DishPageView() {
  const { dish } = Route.useLoaderData();
  const { lang, L } = useApp();
  const mm = lang === "mm";
  const note = DISH_NOTES[dish.slug];
  const related = DISH_PAGES.filter((d) => d.slug !== dish.slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <div className="relative">
        <div className="absolute inset-0">
          <img src={dish.image} alt={dish.name_en} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/50" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-14 pb-12">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
            <Link to="/dishes" className="hover:text-foreground">
              {L({ mm: "အစားအစာများ", en: "Dishes" })}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{L({ mm: dish.name_mm, en: dish.name_en })}</span>
          </nav>
          <div className="text-xs uppercase tracking-widest text-accent mb-2">
            {L({ mm: dish.category_mm, en: dish.category_en })} · Namsang, Shan State
          </div>
          <h1 className={`font-display text-4xl md:text-6xl leading-tight ${mm ? "font-mm" : ""}`}>
            {L({ mm: `နမ့်စန်မြို့မှာ ${dish.name_mm}`, en: `${dish.name_en} in Namsang` })}
          </h1>
          <p className={`mt-4 max-w-2xl text-muted-foreground ${mm ? "font-mm" : ""}`}>
            {L({ mm: dish.desc_mm, en: dish.desc_en })}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-card border border-border px-4 py-2">
              {L({ mm: "စတင်ဆေးနှုန်း", en: "From" })} <span className="text-accent font-semibold">{formatKs(dish.minPrice)}</span>
            </span>
            <span className="rounded-full bg-card border border-border px-4 py-2 inline-flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              {dish.offers.length} {L({ mm: "ဆိုင်", en: dish.offers.length > 1 ? "kitchens" : "kitchen" })}
            </span>
            <Link
              to="/restaurants"
              className="rounded-full bg-gradient-ember px-5 py-2 font-semibold text-primary-foreground shadow-ember hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {L({ mm: "မှာယူမည်", en: "Order now" })}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-20">
        {note && (
          <section className="rounded-3xl bg-card border border-border/60 p-6 md:p-8 animate-float-up">
            <h2 className={`font-display text-2xl mb-3 ${mm ? "font-mm" : ""}`}>
              {L({ mm: `${dish.name_mm} အကြောင်း`, en: `About ${dish.name_en.toLowerCase()}` })}
            </h2>
            <p className={`text-muted-foreground leading-relaxed ${mm ? "font-mm" : ""}`}>{L(note)}</p>
          </section>
        )}

        <section className="mt-10">
          <h2 className={`font-display text-2xl mb-5 ${mm ? "font-mm" : ""}`}>
            {L({ mm: "ဘယ်ဆိုင်မှာ ရနိုင်လဲ", en: `Where to order ${dish.name_en.toLowerCase()} in Namsang` })}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {dish.offers.map((o: DishOffer, i: number) => (
              <Link
                key={o.item.id}
                to="/restaurants/$id"
                params={{ id: o.restaurant.id }}
                className="group rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-primary/60 transition-all hover:-translate-y-1 hover:shadow-ember animate-float-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={o.item.image}
                    alt={`${o.item.name_en} at ${o.restaurant.name_en}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full bg-background/85 backdrop-blur-xl px-2.5 py-1 text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" /> {o.restaurant.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className={`font-semibold text-lg ${mm ? "font-mm" : ""}`}>
                    {L({ mm: o.restaurant.name_mm, en: o.restaurant.name_en })}
                  </h3>
                  <p className={`text-xs text-muted-foreground mt-1 ${mm ? "font-mm" : ""}`}>
                    {L({ mm: o.restaurant.address_mm, en: o.restaurant.address_en })}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="text-accent font-semibold text-sm">{formatKs(o.item.price)}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {o.restaurant.deliveryMin} min
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {o.restaurant.distanceKm} km
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className={`font-display text-2xl mb-4 ${mm ? "font-mm" : ""}`}>
            {L({ mm: "အခြား ဒေသအစားအစာများ", en: "More Burmese & Shan dishes" })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((d) => (
              <Link
                key={d.slug}
                to="/dishes/$slug"
                params={{ slug: d.slug }}
                className={`rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary/60 hover:text-foreground text-muted-foreground transition-colors ${mm ? "font-mm" : ""}`}
              >
                {L({ mm: d.name_mm, en: d.name_en })}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <Link to="/guide" className="text-accent hover:underline">
              {L({ mm: "နမ့်စန်အစားအစာလမ်းညွှန် ဖတ်မည်", en: "Read the full Namsang food guide" })}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
