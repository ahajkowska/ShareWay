import { headers } from "next/headers";
import DashboardPageClient from "./DashboardPageClient";
import type { Trip } from "@/lib/types/trip";
import { getImagesForTrips } from "@/lib/server/tripImages";
import { tripsMock } from "@/app/dashboard/hooks/useTripsMock";

async function getInitialSidebarOpen(): Promise<boolean> {
  const cookieHeader = (await headers()).get("cookie");
  if (cookieHeader) {
    const entry = cookieHeader
      .split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith("sidebar-open="));
    if (entry) {
      const value = entry.split("=")[1];
      if (value === "false") return false;
      if (value === "true") return true;
    }
  }
  return true;
}

export default async function DashboardPage() {
  const initialSidebarOpen = await getInitialSidebarOpen();

  const initialTrips = tripsMock;

  const initialTripImages = await getImagesForTrips(initialTrips);

  return (
    <DashboardPageClient
      initialSidebarOpen={initialSidebarOpen}
      initialTrips={initialTrips}
      initialTripImages={initialTripImages}
    />
  );
}
