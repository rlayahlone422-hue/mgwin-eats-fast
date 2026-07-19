import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { STATUS_LABELS } from "./mgwin";
import {
  type CartLine,
  type DeliveryPin,
  type Lang,
  type Order,
  type OrderStatus,
  type PaymentMethod,
  ORDER_STEPS,
  MENU,
  RESTAURANTS,
  getRestaurant,
  getMenuItem,
} from "./mgwin";

type AppCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  L: <T extends { mm: string; en: string }>(v: T) => string;

  cart: { restaurantId: string | null; lines: CartLine[] };
  cartCount: number;
  cartSubtotal: number;
  addToCart: (restaurantId: string, menuItemId: string, qty?: number, notes?: string) => "added" | "replaced";
  updateQty: (menuItemId: string, qty: number) => void;
  updateNotes: (menuItemId: string, notes: string) => void;
  removeLine: (menuItemId: string) => void;
  clearCart: () => void;
  forceReplaceCart: (restaurantId: string, menuItemId: string, qty: number, notes: string) => void;

  orders: Order[];
  lastPin: DeliveryPin | null;
  setLastPin: (pin: DeliveryPin | null) => void;
  placeOrder: (input: {
    phone: string;
    address: string;
    paymentMethod: PaymentMethod;
    pin?: DeliveryPin | null;
    distanceKm?: number | null;
    deliveryFee?: number;
  }) => Order | null;
  reorder: (orderId: string) => string | null;
  cancelOrder: (orderId: string) => boolean;
  notificationsEnabled: boolean;
  enableNotifications: () => Promise<boolean>;
};

const Ctx = createContext<AppCtx | null>(null);

const LS_LANG = "mgwin-lang";
const LS_CART = "mgwin-cart-v1";
const LS_ORDERS = "mgwin-orders-v1";
const LS_LAST_PIN = "mgwin-last-pin-v1";

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("mm");
  const [cart, setCart] = useState<{ restaurantId: string | null; lines: CartLine[] }>({ restaurantId: null, lines: [] });
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastPin, setLastPinState] = useState<DeliveryPin | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem(LS_LANG) as Lang | null;
    if (savedLang) setLangState(savedLang);
    setCart(loadJSON(LS_CART, { restaurantId: null, lines: [] }));
    setOrders(loadJSON(LS_ORDERS, []));
    setLastPinState(loadJSON<DeliveryPin | null>(LS_LAST_PIN, null));
  }, []);

  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem(LS_CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem(LS_ORDERS, JSON.stringify(orders)); }, [orders]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (lastPin) localStorage.setItem(LS_LAST_PIN, JSON.stringify(lastPin));
    else localStorage.removeItem(LS_LAST_PIN);
  }, [lastPin]);

  const setLastPin = (pin: DeliveryPin | null) => setLastPinState(pin);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(LS_LANG, l);
    if (typeof document !== "undefined") document.documentElement.lang = l === "mm" ? "my" : "en";
  };

  // Auto-advance active orders every ~15s for live tracking demo
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) => {
        let changed = false;
        const next = prev.map((o) => {
          if (o.status === "delivered" || o.status === "cancelled") return o;
          const idx = ORDER_STEPS.indexOf(o.status as (typeof ORDER_STEPS)[number]);
          if (idx < 0) return o;
          const elapsed = Date.now() - (o.statusHistory[o.statusHistory.length - 1]?.at ?? o.createdAt);
          if (elapsed < 15000) return o;
          const nextStatus = ORDER_STEPS[idx + 1];
          if (!nextStatus) return o;
          changed = true;
          return {
            ...o,
            status: nextStatus,
            statusHistory: [...o.statusHistory, { status: nextStatus, at: Date.now() }],
          };
        });
        return changed ? next : prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const L = <T extends { mm: string; en: string }>(v: T) => (lang === "mm" ? v.mm : v.en);

  const cartCount = useMemo(() => cart.lines.reduce((s, l) => s + l.qty, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.lines.reduce((s, l) => s + (getMenuItem(l.menuItemId)?.price ?? 0) * l.qty, 0),
    [cart],
  );

  const addToCart: AppCtx["addToCart"] = (restaurantId, menuItemId, qty = 1, notes = "") => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId && cart.lines.length > 0) {
      return "replaced"; // caller must confirm, then call forceReplaceCart
    }
    setCart((prev) => {
      const existing = prev.lines.find((l) => l.menuItemId === menuItemId);
      const lines = existing
        ? prev.lines.map((l) => (l.menuItemId === menuItemId ? { ...l, qty: l.qty + qty } : l))
        : [...prev.lines, { menuItemId, qty, notes }];
      return { restaurantId, lines };
    });
    return "added";
  };

  const forceReplaceCart: AppCtx["forceReplaceCart"] = (restaurantId, menuItemId, qty, notes) =>
    setCart({ restaurantId, lines: [{ menuItemId, qty, notes }] });

  const updateQty = (menuItemId: string, qty: number) =>
    setCart((prev) => {
      if (qty <= 0) {
        const lines = prev.lines.filter((l) => l.menuItemId !== menuItemId);
        return { restaurantId: lines.length ? prev.restaurantId : null, lines };
      }
      return { ...prev, lines: prev.lines.map((l) => (l.menuItemId === menuItemId ? { ...l, qty } : l)) };
    });

  const updateNotes = (menuItemId: string, notes: string) =>
    setCart((prev) => ({ ...prev, lines: prev.lines.map((l) => (l.menuItemId === menuItemId ? { ...l, notes } : l)) }));

  const removeLine = (menuItemId: string) =>
    setCart((prev) => {
      const lines = prev.lines.filter((l) => l.menuItemId !== menuItemId);
      return { restaurantId: lines.length ? prev.restaurantId : null, lines };
    });

  const clearCart = () => setCart({ restaurantId: null, lines: [] });

  const placeOrder: AppCtx["placeOrder"] = (input) => {
    if (!cart.restaurantId || cart.lines.length === 0) return null;
    const restaurant = getRestaurant(cart.restaurantId);
    if (!restaurant) return null;
    const items = cart.lines
      .map((l) => {
        const m = getMenuItem(l.menuItemId);
        if (!m) return null;
        return { menuItemId: m.id, name_mm: m.name_mm, name_en: m.name_en, price: m.price, qty: l.qty, notes: l.notes };
      })
      .filter(Boolean) as Order["items"];
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const deliveryFee = input.deliveryFee ?? restaurant.deliveryFee;
    const now = Date.now();
    const id = `MG-${now.toString(36).toUpperCase().slice(-6)}`;
    const order: Order = {
      id,
      restaurantId: restaurant.id,
      restaurantName_mm: restaurant.name_mm,
      restaurantName_en: restaurant.name_en,
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      phone: input.phone,
      address: input.address,
      pin: input.pin ?? null,
      distanceKm: input.distanceKm ?? null,
      paymentMethod: input.paymentMethod,
      status: "placed",
      createdAt: now,
      statusHistory: [{ status: "placed", at: now }],
    };
    setOrders((prev) => [order, ...prev]);
    if (order.pin) setLastPinState(order.pin);
    clearCart();
    return order;
  };

  const reorder: AppCtx["reorder"] = (orderId) => {
    const o = orders.find((x) => x.id === orderId);
    if (!o) return null;
    const lines: CartLine[] = o.items
      .filter((i) => MENU.some((m) => m.id === i.menuItemId))
      .map((i) => ({ menuItemId: i.menuItemId, qty: i.qty, notes: i.notes }));
    if (lines.length === 0) return null;
    setCart({ restaurantId: o.restaurantId, lines });
    if (o.pin) setLastPinState(o.pin);
    return o.restaurantId;
  };

  const cancelOrder: AppCtx["cancelOrder"] = (orderId) => {
    let ok = false;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status !== "placed") return o;
        ok = true;
        return { ...o, status: "cancelled", statusHistory: [...o.statusHistory, { status: "cancelled", at: Date.now() }] };
      }),
    );
    return ok;
  };

  // Push notifications for status changes
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }
  }, []);

  const enableNotifications: AppCtx["enableNotifications"] = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    if (Notification.permission === "granted") { setNotificationsEnabled(true); return true; }
    if (Notification.permission === "denied") return false;
    const p = await Notification.requestPermission();
    const ok = p === "granted";
    setNotificationsEnabled(ok);
    return ok;
  };

  const prevStatusesRef = useRef<Map<string, OrderStatus>>(new Map());
  useEffect(() => {
    if (!notificationsEnabled) {
      prevStatusesRef.current = new Map(orders.map((o) => [o.id, o.status]));
      return;
    }
    const prev = prevStatusesRef.current;
    for (const o of orders) {
      const before = prev.get(o.id);
      if (before && before !== o.status) {
        try {
          const label = lang === "mm" ? STATUS_LABELS[o.status].mm : STATUS_LABELS[o.status].en;
          const restName = lang === "mm" ? o.restaurantName_mm : o.restaurantName_en;
          new Notification(`Mg Win · #${o.id}`, {
            body: `${label} — ${restName}`,
            tag: `mgwin-${o.id}`,
          });
        } catch { /* ignore */ }
      }
    }
    prevStatusesRef.current = new Map(orders.map((o) => [o.id, o.status]));
  }, [orders, notificationsEnabled, lang]);

  const value: AppCtx = {
    lang, setLang, L,
    cart, cartCount, cartSubtotal,
    addToCart, updateQty, updateNotes, removeLine, clearCart, forceReplaceCart,
    orders, lastPin, setLastPin, placeOrder, reorder, cancelOrder,
    notificationsEnabled, enableNotifications,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// Static exports for convenience
export { RESTAURANTS, MENU };
