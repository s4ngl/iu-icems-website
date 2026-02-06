import { NextRequest, NextResponse } from "next/server";
import { updateDuesStatus } from "@/services/memberService";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const body = await request.json();
    const { duesPaid, duesExpiration } = body;

    if (typeof duesPaid !== "boolean") {
      return NextResponse.json(
        { error: "duesPaid must be a boolean" },
        { status: 400 }
      );
    }

    const result = await updateDuesStatus(memberId, duesPaid, duesExpiration);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating dues:", error);
    return NextResponse.json(
      { error: "Failed to update dues" },
      { status: 500 }
    );
  }
}
