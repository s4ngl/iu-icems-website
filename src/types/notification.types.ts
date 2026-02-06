export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type NotificationType =
  | "event_assigned"
  | "event_not_selected"
  | "event_modified"
  | "event_cancelled"
  | "cert_expiring"
  | "cert_approved"
  | "cert_rejected"
  | "account_status_change";

export interface SendNotificationData {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
}