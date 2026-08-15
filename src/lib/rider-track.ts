import { NAMSANG_CENTER, estimateEta, type Order } from "@/lib/mgwin";
import { restaurantCoord } from "@/lib/namsang-map";

export type LatLng = { lat: number; lng: number };

export type RiderTrack = {
  /** Current simulated rider position. */
  position: LatLng;
  /** Restaurant pickup point. */
  from: LatLng;
  /** Customer drop point. */
  to: LatLng;
  /** 0 → at shop, 1 → arrived. */
  progress: number;
  /** Whether the rider is currently riding to the customer. */
  riding: boolean;
  /** Minutes left of the ride leg. */
  minutesLeft: number;
};

const ACTIVE = new Set(["placed", "confirmed", "preparing", "picked_up"]);

export function isActiveOrder(order: Order): boolean {
  return ACTIVE.has(order.status);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Derives a live rider position for an order.
 * Riders wait at the shop until pickup, then move along the shop → customer line.
 */
export function riderTrack(order: Order, now = Date.now()): RiderTrack | null {
  if (order.status === "cancelled") return null;
  const from = restaurantCoord(order.restaurantId);
  const to = order.pin ? { lat: order.pin.lat, lng: order.pin.lng } : NAMSANG_CENTER;
  const rideMin = estimateEta(order.distanceKm).rideMin;
  const pickedAt = order.statusHistory.find((h) => h.status === "picked_up")?.at ?? null;

  let progress = 0;
  if (order.status === "delivered") progress = 1;
  else if (pickedAt) {
    const elapsedMin = (now - pickedAt) / 60000;
    progress = Math.min(0.97, Math.max(0, elapsedMin / Math.max(1, rideMin)));
  }

  // Gentle arc so the path doesn't look like a straight ruler line.
  const arc = Math.sin(progress * Math.PI) * 0.00035;
  return {
    position: {
      lat: lerp(from.lat, to.lat, progress) + arc,
      lng: lerp(from.lng, to.lng, progress) - arc,
    },
    from,
    to,
    progress,
    riding: !!pickedAt && order.status !== "delivered",
    minutesLeft: Math.max(0, Math.round(rideMin * (1 - progress))),
  };
}
