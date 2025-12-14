import { NextResponse } from "next/server";
import { tripsMock } from "@/app/dashboard/hooks/useTripsMock";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({ trips: tripsMock }, { status: 200 });
}
