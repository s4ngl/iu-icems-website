import { NextResponse } from "next/server";
import { getCalendarData } from "@/services/calendarService";

export async function GET() {
  try {
    const data = await getCalendarData();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
