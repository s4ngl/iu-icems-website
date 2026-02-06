import { NextRequest, NextResponse } from "next/server";
import { approveCertification } from "@/services/certificationService";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ certId: string }> }
) {
  try {
    const { certId } = await params;
    const body = await request.json();
    const { approvedBy, expirationDate } = body;

    if (!approvedBy) {
      return NextResponse.json(
        { error: "approvedBy is required" },
        { status: 400 }
      );
    }

    const result = await approveCertification(certId, approvedBy, expirationDate);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving certification:", error);
    return NextResponse.json(
      { error: "Failed to approve certification" },
      { status: 500 }
    );
  }
}
