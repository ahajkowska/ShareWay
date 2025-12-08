import { NextResponse } from "next/server";
import { tripsMock } from "@/app/dashboard/hooks/useTripsMock";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // In future, replace tripsMock with real DB/service fetch.
  return NextResponse.json({ trips: tripsMock }, { status: 200 });
}
