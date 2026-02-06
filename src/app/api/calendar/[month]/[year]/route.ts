import { NextResponse, type NextRequest } from "next/server";
import { getCalendarDataByMonth } from "@/services/calendarService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ month: string; year: string }> }
) {
  try {
    const { month, year } = await params;
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12 || yearNum < 2000) {
      return NextResponse.json({ error: "Invalid month or year" }, { status: 400 });
    }

    const data = await getCalendarDataByMonth(monthNum, yearNum);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
