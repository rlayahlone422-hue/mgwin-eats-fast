import { useEffect, useState } from "react";
import type { Order } from "@/lib/mgwin";
import { riderTrack, type RiderTrack } from "@/lib/rider-track";

/** Live (simulated) rider position that refreshes on a light interval. */
export function useRiderTrack(order: Order | null | undefined, intervalMs = 4000): RiderTrack | null {
  const [track, setTrack] = useState<RiderTrack | null>(() => (order ? riderTrack(order) : null));

  useEffect(() => {
    if (!order) {
      setTrack(null);
      return;
    }
    setTrack(riderTrack(order));
    if (order.status === "delivered" || order.status === "cancelled") return;
    const t = setInterval(() => setTrack(riderTrack(order)), intervalMs);
    return () => clearInterval(t);
  }, [order, intervalMs]);

  return track;
}
