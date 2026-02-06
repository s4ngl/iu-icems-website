import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/auth/session";
import type { NotificationType } from "@/types/notification.types";

export async function POST(request: NextRequest) {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (member.position_web > 1) {
      return NextResponse.json({ error: "Forbidden: board access required" }, { status: 403 });
    }

    const body = await request.json();
    const { type, recipients, message, title } = body as {
      type: NotificationType;
      recipients: string[];
      message: string;
      title?: string;
    };

    if (!type) {
      return NextResponse.json({ error: "Notification type is required" }, { status: 400 });
    }
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "At least one recipient is required" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get recipient member details for email notifications
    const { data: recipientMembers, error: memberError } = await supabase
      .from("members")
      .select("user_id, first_name, last_name, iu_email")
      .in("user_id", recipients);

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    const sent: string[] = [];
    const failed: string[] = [];

    for (const recipient of recipientMembers ?? []) {
      try {
        // Log notification (in production, would also send email)
        console.log(
          `Notification [${type}] to ${recipient.iu_email}: ${title ?? type} - ${message}`
        );
        sent.push(recipient.user_id);
      } catch {
        failed.push(recipient.user_id);
      }
    }

    return NextResponse.json({
      data: {
        sent_count: sent.length,
        failed_count: failed.length,
        sent,
        failed,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
