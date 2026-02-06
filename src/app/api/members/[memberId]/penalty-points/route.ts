import { NextRequest, NextResponse } from "next/server";
import { getPenaltyPoints, addPenaltyPoints } from "@/services/penaltyService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const penaltyPoints = await getPenaltyPoints(memberId);
    return NextResponse.json(penaltyPoints);
  } catch (error) {
    console.error("Error fetching penalty points:", error);
    return NextResponse.json(
      { error: "Failed to fetch penalty points" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const body = await request.json();
    const { points, reason, assignedBy, autoRemoveDate } = body;

    if (!points || !reason || !assignedBy) {
      return NextResponse.json(
        { error: "points, reason, and assignedBy are required" },
        { status: 400 }
      );
    }

    const result = await addPenaltyPoints(
      memberId,
      points,
      reason,
      assignedBy,
      autoRemoveDate
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding penalty points:", error);
    return NextResponse.json(
      { error: "Failed to add penalty points" },
      { status: 500 }
    );
  }
}
