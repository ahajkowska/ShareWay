import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_URL = process.env.BACKEND_API_URL || "http://localhost:4000/api/v1";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ trips: [] }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/trips`, {
      headers: {
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch trips:", response.status);
      return NextResponse.json({ trips: [] }, { status: response.status });
    }

    const trips = await response.json();

    return NextResponse.json({ trips }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return NextResponse.json({ trips: [] }, { status: 500 });
  }
}
