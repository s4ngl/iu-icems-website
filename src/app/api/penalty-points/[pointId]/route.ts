import { NextRequest, NextResponse } from "next/server";
import { removePenaltyPoint } from "@/services/penaltyService";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pointId: string }> }
) {
  try {
    const { pointId } = await params;
    const result = await removePenaltyPoint(pointId);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing penalty point:", error);
    return NextResponse.json(
      { error: "Failed to remove penalty point" },
      { status: 500 }
    );
  }
}
