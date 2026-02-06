import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body as { message?: string };

    const testMessage = message || "This is a test notification from IC-EMS.";

    console.log(`Test notification for user ${user.id}: ${testMessage}`);

    return NextResponse.json({
      data: {
        success: true,
        message: testMessage,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
