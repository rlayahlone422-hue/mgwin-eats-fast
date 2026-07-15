import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Phone, MapPin, Wallet, RotateCcw, Receipt, Clock, Flame, Bike, ChefHat, ShoppingBag, PackageCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";
import { formatKs, ORDER_STEPS, STATUS_LABELS, PAYMENT_LABELS, type OrderStatus } from "@/lib/mgwin";

export const Route = createFileRoute("/orders/$id")({
  component: OrderTracking,
  head: () => ({ meta: [{ title: "Order — Mg Win" }] }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-display text-3xl">Order not found</h1>
        <Link to="/orders" className="mt-4 inline-block text-primary underline">Back to orders</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

const STATUS_ICONS: Record<OrderStatus, typeof Flame> = {
  placed: ShoppingBag,
  confirmed: Check,
  preparing: ChefHat,
  picked_up: Bike,
  delivered: PackageCheck,
};

function OrderTracking() {
  const { id } = Route.useParams();
  const { lang, L, orders, reorder } = useApp();
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === id);
  if (!order) throw notFound();

  const currentIdx = ORDER_STEPS.indexOf(order.status);
  const progressPct = (currentIdx / (ORDER_STEPS.length - 1)) * 100;

  const handleReorder = () => {
    const rId = reorder(order.id);
    if (rId) navigate({ to: "/cart" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> {lang === "mm" ? "အော်ဒါများ" : "All orders"}
        </Link>

        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-primary/15 via-card to-card border border-primary/30 p-6 md:p-8 shadow-ember relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-accent" />
              <span className="text-xs uppercase tracking-widest text-accent">Order #{order.id}</span>
            </div>
            <h1 className={`font-display text-3xl md:text-4xl ${lang === "mm" ? "font-mm" : ""}`}>{L(STATUS_LABELS[order.status])}</h1>
            <p className={`text-muted-foreground mt-1 ${lang === "mm" ? "font-mm" : ""}`}>
              {L({ mm: order.restaurantName_mm, en: order.restaurantName_en })}
            </p>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-ember rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-6 grid grid-cols-5 gap-2">
                {ORDER_STEPS.map((step, i) => {
                  const Icon = STATUS_ICONS[step];
                  const done = i <= currentIdx;
                  const active = i === currentIdx && order.status !== "delivered";
                  return (
                    <div key={step} className="flex flex-col items-center text-center">
                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        done ? "bg-gradient-ember text-primary-foreground shadow-ember" : "bg-secondary text-muted-foreground"
                      }`}>
                        <Icon className="w-4 h-4" />
                        {active && <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />}
                      </div>
                      <div className={`text-[10px] mt-2 leading-tight ${done ? "text-foreground font-semibold" : "text-muted-foreground"} ${lang === "mm" ? "font-mm" : ""}`}>
                        {L(STATUS_LABELS[step])}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.status !== "delivered" && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-background/60 backdrop-blur border border-border px-3 py-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className={lang === "mm" ? "font-mm" : ""}>
                  {L({ mm: "အခြေအနေ ၁၅ စက္ကန့်တိုင်း အလိုအလျောက် အသစ်ဖြစ်ပါမည်", en: "Status updates automatically every ~15s" })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 rounded-2xl bg-card border border-border p-5">
          <h2 className={`font-semibold mb-4 ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "အခြေအနေ မှတ်တမ်း", en: "Status history" })}</h2>
          <ol className="space-y-3">
            {order.statusHistory.map((h, i) => {
              const Icon = STATUS_ICONS[h.status];
              return (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`font-medium ${lang === "mm" ? "font-mm" : ""}`}>{L(STATUS_LABELS[h.status])}</span>
                    <span className="text-xs text-muted-foreground">{new Date(h.at).toLocaleTimeString(lang === "mm" ? "my-MM" : "en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${lang === "mm" ? "font-mm" : ""}`}>
              <MapPin className="w-4 h-4 text-primary" /> {L({ mm: "ပို့ဆောင်ရမည့်နေရာ", en: "Delivery" })}
            </h3>
            <p className={`text-sm ${lang === "mm" ? "font-mm" : ""}`}>{order.address}</p>
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <a href={`tel:${order.phone}`} className="text-primary hover:underline">{order.phone}</a>
            </div>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${lang === "mm" ? "font-mm" : ""}`}>
              <Wallet className="w-4 h-4 text-primary" /> {L({ mm: "ငွေပေးချေမှု", en: "Payment" })}
            </h3>
            <p className={`text-sm ${lang === "mm" ? "font-mm" : ""}`}>{L(PAYMENT_LABELS[order.paymentMethod])}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {order.paymentMethod === "cash"
                ? (lang === "mm" ? "ဆိုင်ကယ်သမားက ကောက်ခံပါမည်" : "Rider will collect on delivery")
                : (lang === "mm" ? "ပေးချေပြီးပါပြီ" : "Paid via wallet")}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-4 rounded-2xl bg-card border border-border p-5">
          <h3 className={`font-semibold mb-3 ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "အော်ဒါ", en: "Items" })}</h3>
          <ul className="divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.menuItemId} className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className={`font-medium text-sm ${lang === "mm" ? "font-mm" : ""}`}>
                    <span className="text-muted-foreground mr-2">{item.qty}×</span>{L({ mm: item.name_mm, en: item.name_en })}
                  </div>
                  {item.notes && (
                    <div className={`text-xs text-accent mt-1 ${lang === "mm" ? "font-mm" : ""}`}>
                      <span className="opacity-70">{lang === "mm" ? "မှတ်ချက်:" : "Note:"}</span> {item.notes}
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-muted-foreground shrink-0">{formatKs(item.price * item.qty)}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>{L({ mm: "အခြေခံ", en: "Subtotal" })}</span><span className="text-foreground">{formatKs(order.subtotal)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>{L({ mm: "ပို့ဆောင်ခ", en: "Delivery" })}</span><span className="text-foreground">{formatKs(order.deliveryFee)}</span></div>
            <div className="flex justify-between items-baseline pt-2">
              <span className="font-bold">{L({ mm: "စုစုပေါင်း", en: "Total" })}</span>
              <span className="text-gradient-ember font-display text-2xl">{formatKs(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={handleReorder} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-ember px-5 py-3 text-sm font-semibold text-primary-foreground shadow-ember hover:scale-105 transition-transform">
            <RotateCcw className="w-4 h-4" /> {lang === "mm" ? "ထပ်မှာမည်" : "Reorder"}
          </button>
          <Link to="/restaurants" className="flex-1 inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-secondary">
            {lang === "mm" ? "ဆက်လက် ရှာဖွေရန်" : "Keep browsing"}
          </Link>
        </div>
      </div>
    </div>
  );
}
