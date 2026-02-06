import type { SendNotificationData } from "@/types/notification.types";

export async function sendNotification(
  data: SendNotificationData
): Promise<{ error: string | null }> {
  // Notification implementation depends on the notification channel (email, in-app, etc.)
  // This is a placeholder that can be extended with email service integration
  try {
    const response = await fetch("/api/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
