import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, ChevronRight, Receipt, RotateCcw } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";
import { formatKs, STATUS_LABELS } from "@/lib/mgwin";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "My orders — Mg Win" }] }),
});

function timeAgo(ts: number, lang: "mm" | "en") {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return lang === "mm" ? "ယခုပဲ" : "just now";
  if (m < 60) return lang === "mm" ? `${m} မိနစ်ကြာပြီ` : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return lang === "mm" ? `${h} နာရီကြာပြီ` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return lang === "mm" ? `${d} ရက်ကြာပြီ` : `${d}d ago`;
}

function OrdersPage() {
  const { lang, L, orders, reorder } = useApp();
  const navigate = useNavigate();

  const handleReorder = (id: string) => {
    const rId = reorder(id);
    if (rId) navigate({ to: "/cart" });
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-card border border-border flex items-center justify-center mb-6">
            <Receipt className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className={`font-display text-3xl ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "မှာယူမှတ်တမ်း မရှိသေးပါ", en: "No orders yet" })}</h1>
          <p className={`text-muted-foreground mt-2 ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "ဆိုင်တစ်ခုကနေ စတင် မှာယူပါ။", en: "Order from a restaurant to see it here." })}</p>
          <Link to="/restaurants" className="mt-6 inline-flex rounded-full bg-gradient-ember px-7 py-3 text-sm font-semibold text-primary-foreground shadow-ember">
            {L({ mm: "ဆိုင်များကို ကြည့်ရန်", en: "Browse restaurants" })}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-accent mb-2">Orders</div>
          <h1 className={`font-display text-4xl md:text-5xl ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "ကျွန်ုပ်၏ မှာယူမှုများ", en: "My orders" })}</h1>
        </div>

        <div className="space-y-4">
          {orders.map((o, i) => {
            const active = o.status !== "delivered";
            return (
              <article key={o.id} className="rounded-2xl bg-card border border-border/60 p-5 animate-float-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                        {L(STATUS_LABELS[o.status])}
                      </span>
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(o.createdAt, lang)}</span>
                    </div>
                    <h3 className={`font-semibold truncate ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: o.restaurantName_mm, en: o.restaurantName_en })}</h3>
                    <p className={`text-xs text-muted-foreground mt-0.5 truncate ${lang === "mm" ? "font-mm" : ""}`}>
                      {o.items.length} {lang === "mm" ? "မျိုး" : "items"} · {formatKs(o.total)} · #{o.id}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Link to="/orders/$id" params={{ id: o.id }} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                      {lang === "mm" ? "အသေးစိတ်" : "Track"} <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => handleReorder(o.id)} className="inline-flex items-center gap-1 rounded-full bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-xs font-semibold">
                      <RotateCcw className="w-3 h-3" /> {lang === "mm" ? "ထပ်မှာမည်" : "Reorder"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
