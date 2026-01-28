"use client";

import { useCallback, useEffect, useState } from "react";
import type { Trip } from "@/lib/types/trip";
import { listTrips } from "@/lib/api";

type UseTripsState = {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useTrips(): UseTripsState {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const reload = useCallback(() => setRefreshIndex((v) => v + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listTrips(controller.signal);
        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "Nie udało się pobrać podróży.";
        setError(message);
        setTrips([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTrips();
    return () => controller.abort();
  }, [refreshIndex]);

  return { trips, loading, error, reload };
}
