import { useCallback, useEffect, useRef, useState } from "react";

export type GpsPoint = { lat: number; lng: number; accuracy: number | null };
export type GpsStatus = "idle" | "locating" | "tracking" | "ready" | "denied" | "error";

/** Live GPS service: one-shot locate plus optional continuous watch. */
export function useGps() {
  const [point, setPoint] = useState<GpsPoint | null>(null);
  const [status, setStatus] = useState<GpsStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const supported = typeof navigator !== "undefined" && !!navigator.geolocation;

  const handleErr = useCallback((e: GeolocationPositionError) => {
    setStatus(e.code === e.PERMISSION_DENIED ? "denied" : "error");
    setError(
      e.code === e.PERMISSION_DENIED
        ? "Location permission denied"
        : e.code === e.TIMEOUT
          ? "GPS timed out — try again outdoors"
          : "Couldn't get your location",
    );
  }, []);

  const locate = useCallback(() => {
    if (!supported) {
      setStatus("error");
      setError("GPS not supported on this device");
      return;
    }
    setStatus("locating");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPoint({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy ?? null });
        setStatus((s) => (s === "tracking" ? s : "ready"));
      },
      handleErr,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 15000 },
    );
  }, [supported, handleErr]);

  const stopWatch = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setStatus((s) => (s === "tracking" ? "ready" : s));
    }
  }, []);

  const startWatch = useCallback(() => {
    if (!supported || watchId.current !== null) return;
    setStatus("tracking");
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => setPoint({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy ?? null }),
      handleErr,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    );
  }, [supported, handleErr]);

  useEffect(() => () => stopWatch(), [stopWatch]);

  return { point, status, error, supported, locate, startWatch, stopWatch, watching: status === "tracking" };
}
