import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, StickyNote } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";
import { formatKs, getMenuItem, getRestaurant } from "@/lib/mgwin";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Cart — Mg Win" }] }),
});

function CartPage() {
  const { lang, L, cart, updateQty, updateNotes, removeLine, cartSubtotal } = useApp();
  const restaurant = cart.restaurantId ? getRestaurant(cart.restaurantId) : null;
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const total = cartSubtotal + deliveryFee;

  if (!restaurant || cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AppHeader />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-24 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-card border border-border flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className={`font-display text-3xl ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "စျေးခြင်း ဗလာဖြစ်နေသည်", en: "Your cart is empty" })}</h1>
          <p className={`text-muted-foreground mt-2 ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "ဆိုင်တစ်ခုကို ဝင်ကြည့်ပြီး အစားအစာ ရွေးပါ။", en: "Browse a restaurant and add something delicious." })}</p>
          <Link to="/restaurants" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-ember px-7 py-3 text-sm font-semibold text-primary-foreground shadow-ember">
            {L({ mm: "ဆိုင်များကို ကြည့်ရန်", en: "Browse restaurants" })}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-accent mb-2">Cart</div>
          <h1 className={`font-display text-4xl md:text-5xl ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "စျေးခြင်း", en: "Your cart" })}</h1>
          <Link to="/restaurants/$id" params={{ id: restaurant.id }} className={`text-sm text-muted-foreground hover:text-foreground mt-2 inline-block ${lang === "mm" ? "font-mm" : ""}`}>
            {L({ mm: "ဆိုင်:", en: "From:" })} <span className="text-foreground font-semibold">{L({ mm: restaurant.name_mm, en: restaurant.name_en })}</span>
          </Link>
        </div>

        <div className="space-y-4">
          {cart.lines.map((line) => {
            const m = getMenuItem(line.menuItemId);
            if (!m) return null;
            return (
              <article key={line.menuItemId} className="rounded-2xl bg-card border border-border/60 p-4 animate-float-up">
                <div className="flex gap-4">
                  <img src={m.image} alt={m.name_en} width={80} height={80} loading="lazy" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-semibold ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: m.name_mm, en: m.name_en })}</h3>
                        <div className="text-sm text-gradient-ember font-display mt-0.5">{formatKs(m.price)}</div>
                      </div>
                      <button onClick={() => removeLine(line.menuItemId)} className="text-muted-foreground hover:text-destructive p-1" aria-label="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-border overflow-hidden">
                        <button onClick={() => updateQty(line.menuItemId, line.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary" aria-label="Decrease">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold">{line.qty}</span>
                        <button onClick={() => updateQty(line.menuItemId, line.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary" aria-label="Increase">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="ml-auto text-sm font-semibold">{formatKs(m.price * line.qty)}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 relative">
                  <StickyNote className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <textarea
                    value={line.notes}
                    onChange={(e) => updateNotes(line.menuItemId, e.target.value)}
                    placeholder={lang === "mm" ? "မှတ်ချက် — ဥပမာ 'အစပ်နည်းနည်း', 'ကြက်သွန်မထည့်ပါနှင့်'" : "Notes — e.g. 'not spicy', 'no onions', 'extra chili'"}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-sm focus:border-primary outline-none resize-none transition-colors ${lang === "mm" ? "font-mm" : ""}`}
                    rows={2}
                    maxLength={200}
                  />
                </div>
              </article>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 rounded-2xl bg-card border border-border/60 p-5">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{L({ mm: "အခြေခံ", en: "Subtotal" })}</span><span className="text-foreground">{formatKs(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{L({ mm: "ပို့ဆောင်ခ", en: "Delivery fee" })}</span><span className="text-foreground">{formatKs(deliveryFee)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-base font-bold">
              <span>{L({ mm: "စုစုပေါင်း", en: "Total" })}</span>
              <span className="text-gradient-ember font-display text-xl">{formatKs(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky checkout */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md">
        <Link
          to="/checkout"
          className="w-full flex items-center justify-between gap-4 rounded-full bg-gradient-ember px-5 py-3.5 shadow-ember text-primary-foreground font-semibold hover:scale-[1.02] transition-transform"
        >
          <span>{L({ mm: "ငွေရှင်းသို့ ဆက်ရန်", en: "Proceed to checkout" })}</span>
          <span className="inline-flex items-center gap-2">{formatKs(total)} <ArrowRight className="w-4 h-4" /></span>
        </Link>
      </div>
    </div>
  );
}
