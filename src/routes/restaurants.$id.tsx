import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Star, Clock, MapPin, Plus, Check, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";
import { formatKs, getRestaurant, getMenuByRestaurant } from "@/lib/mgwin";

export const Route = createFileRoute("/restaurants/$id")({
  component: RestaurantMenu,
  loader: ({ params }) => {
    const r = getRestaurant(params.id);
    if (!r) throw notFound();
    return { restaurant: r, menu: getMenuByRestaurant(params.id) };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.restaurant.name_en} — Mg Win` : "Restaurant — Mg Win" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-3xl">Restaurant not found</h1>
        <Link to="/restaurants" className="mt-4 inline-block text-primary underline">Back to restaurants</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

function RestaurantMenu() {
  const { restaurant, menu } = Route.useLoaderData() as { restaurant: Restaurant; menu: MenuItem[] };
  const { lang, L, cart, addToCart, forceReplaceCart, cartCount, cartSubtotal } = useApp();
  const navigate = useNavigate();
  const [added, setAdded] = useState<Record<string, number>>({});
  const [switchPrompt, setSwitchPrompt] = useState<{ menuItemId: string } | null>(null);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    return menu
      .filter((m) => { const k = lang === "mm" ? m.category_mm : m.category_en; if (seen.has(k)) return false; seen.add(k); return true; })
      .map((m) => ({ mm: m.category_mm, en: m.category_en }));
  }, [menu, lang]);

  const handleAdd = (menuItemId: string) => {
    const result = addToCart(restaurant.id, menuItemId);
    if (result === "replaced") {
      setSwitchPrompt({ menuItemId });
      return;
    }
    setAdded((a) => ({ ...a, [menuItemId]: (a[menuItemId] ?? 0) + 1 }));
    setTimeout(() => setAdded((a) => { const { [menuItemId]: _, ...rest } = a; return rest; }), 1500);
  };

  const confirmSwitch = () => {
    if (!switchPrompt) return;
    forceReplaceCart(restaurant.id, switchPrompt.menuItemId, 1, "");
    setSwitchPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <AppHeader />

      {/* Hero */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name_en} width={1600} height={600} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-16 relative">
        <Link to="/restaurants" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> {lang === "mm" ? "ဆိုင်များသို့" : "All restaurants"}
        </Link>

        <div className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className={`font-display text-3xl md:text-4xl ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: restaurant.name_mm, en: restaurant.name_en })}</h1>
              <p className={`text-muted-foreground mt-1 ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: restaurant.cuisine_mm, en: restaurant.cuisine_en })}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/30 px-3 py-1.5 text-sm text-accent font-semibold">
              <Star className="w-4 h-4 fill-accent" /> {restaurant.rating}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> {restaurant.deliveryMin} min</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {L({ mm: restaurant.address_mm, en: restaurant.address_en })}</span>
            <span className="text-accent font-medium">{formatKs(restaurant.deliveryFee)} {lang === "mm" ? "ပို့ဆောင်ခ" : "delivery"}</span>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-10 space-y-10">
          {categories.map((cat) => (
            <section key={cat.en}>
              <h2 className={`font-display text-2xl mb-4 ${lang === "mm" ? "font-mm" : ""}`}>{L(cat)}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {menu.filter((m) => m.category_en === cat.en).map((m) => {
                  const inCart = cart.lines.find((l) => l.menuItemId === m.id);
                  const justAdded = added[m.id];
                  return (
                    <article key={m.id} className={`group rounded-2xl bg-card border border-border/60 p-4 flex gap-4 transition-all ${m.available ? "hover:border-primary/60" : "opacity-50"}`}>
                      <img src={m.image} alt={m.name_en} width={96} height={96} loading="lazy" className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h3 className={`font-semibold ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: m.name_mm, en: m.name_en })}</h3>
                        <p className={`text-xs text-muted-foreground mt-1 line-clamp-2 flex-1 ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: m.desc_mm, en: m.desc_en })}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-display text-lg text-gradient-ember">{formatKs(m.price)}</span>
                          {m.available ? (
                            <button
                              onClick={() => handleAdd(m.id)}
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                                justAdded ? "bg-accent text-accent-foreground scale-110" : "bg-gradient-ember text-primary-foreground shadow-ember hover:scale-105"
                              }`}
                            >
                              {justAdded ? <><Check className="w-3.5 h-3.5" /> {lang === "mm" ? "ထည့်ပြီး" : "Added"}</> : <><Plus className="w-3.5 h-3.5" /> {inCart ? `×${inCart.qty}` : (lang === "mm" ? "ထည့်ရန်" : "Add")}</>}
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">{lang === "mm" ? "မရနိုင်ပါ" : "Unavailable"}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Sticky cart bar */}
      {cartCount > 0 && cart.restaurantId === restaurant.id && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md animate-float-up">
          <button
            onClick={() => navigate({ to: "/cart" })}
            className="w-full flex items-center justify-between gap-4 rounded-full bg-gradient-ember px-5 py-3.5 shadow-ember text-primary-foreground font-semibold hover:scale-[1.02] transition-transform"
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-background/25 flex items-center justify-center text-xs">{cartCount}</span>
              <ShoppingBag className="w-4 h-4" /> {lang === "mm" ? "စျေးခြင်းသို့" : "View cart"}
            </span>
            <span>{formatKs(cartSubtotal)}</span>
          </button>
        </div>
      )}

      {/* Switch restaurant prompt */}
      {switchPrompt && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl border border-border p-6 max-w-sm w-full shadow-ember">
            <h3 className={`font-display text-xl mb-2 ${lang === "mm" ? "font-mm" : ""}`}>
              {lang === "mm" ? "စျေးခြင်းကို ရှင်းရမလား?" : "Start a new cart?"}
            </h3>
            <p className={`text-sm text-muted-foreground mb-6 ${lang === "mm" ? "font-mm" : ""}`}>
              {lang === "mm" ? "သင့်စျေးခြင်းထဲမှာ တခြားဆိုင်ရဲ့ အစားအစာတွေ ရှိနေပါတယ်။ ဒီဆိုင်ကနေ မှာလိုရင် စျေးခြင်းအဟောင်းကို ရှင်းရပါမယ်။" : "Your cart has items from another restaurant. Ordering from here will clear it."}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setSwitchPrompt(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold hover:bg-secondary">
                {lang === "mm" ? "မလုပ်တော့ပါ" : "Cancel"}
              </button>
              <button onClick={confirmSwitch} className="flex-1 rounded-full bg-gradient-ember py-2.5 text-sm font-semibold text-primary-foreground shadow-ember">
                {lang === "mm" ? "ရှင်းပြီး ထည့်မည်" : "Clear & add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
