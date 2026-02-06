import type { SendNotificationData, Notification } from "@/types/notification.types";

export async function sendNotification(
  data: SendNotificationData
): Promise<{ error: string | null }> {
  try {
    const response = await fetch("/api/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: data.type,
        recipients: [data.user_id],
        message: data.message,
        title: data.title,
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      return { error: result.error || "Failed to send notification" };
    }

    return { error: null };
  } catch {
    return { error: "Failed to send notification" };
  }
}

export async function sendBulkNotifications(
  notifications: SendNotificationData[]
): Promise<{ errors: string[] }> {
  const results = await Promise.allSettled(
    notifications.map((n) => sendNotification(n))
  );

  const errors = results
    .map((r) => (r.status === "fulfilled" ? r.value.error : "Request failed"))
    .filter((e): e is string => e !== null);

  return { errors };
}

export async function getNotificationHistory(): Promise<{
  data: Notification[];
  error: string | null;
}> {
  try {
    // In-app notification history would be stored in a notifications table
    // For now, returns empty array as the notifications table hasn't been created yet
    console.log("Fetching notification history");
    return { data: [], error: null };
  } catch {
    return { data: [], error: "Failed to fetch notification history" };
  }
}
