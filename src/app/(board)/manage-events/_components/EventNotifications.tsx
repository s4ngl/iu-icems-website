"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSend, IconBell } from "@tabler/icons-react";

interface EventNotificationsProps {
  eventId: string;
  eventName: string;
  onSend?: (data: NotificationData) => void;
}

interface NotificationData {
  type: string;
  message: string;
  recipients: string;
}

const NOTIFICATION_TYPE_OPTIONS = [
  { value: "assignment", label: "Assignment Notification" },
  { value: "non_selection", label: "Non-Selection Notification" },
  { value: "modification", label: "Event Modification" },
  { value: "cancellation", label: "Event Cancellation" },
] as const;

const RECIPIENT_OPTIONS = [
  { value: "all_signups", label: "All Signed-Up Members" },
  { value: "assigned", label: "Assigned Members Only" },
  { value: "waitlisted", label: "Waitlisted Members Only" },
  { value: "all_members", label: "All Active Members" },
] as const;

const MESSAGE_TEMPLATES: Record<string, string> = {
  assignment: `You have been assigned to the event "{eventName}". Please confirm your availability.`,
  non_selection: `Thank you for signing up for "{eventName}". Unfortunately, you were not selected for this event. You remain on the waitlist in case a spot opens.`,
  modification: `The event "{eventName}" has been modified. Please review the updated details.`,
  cancellation: `The event "{eventName}" has been cancelled. We apologize for any inconvenience.`,
};

export function EventNotifications({ eventName, onSend }: EventNotificationsProps) {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleTypeChange = (value: string) => {
    setType(value);
    const template = MESSAGE_TEMPLATES[value];
    if (template) {
      setMessage(template.replace(/\{eventName\}/g, eventName));
    }
  };

  const handleSend = async () => {
    if (!type || !message.trim() || !recipients) return;

    setIsSending(true);
    try {
      await onSend?.({ type, message, recipients });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <IconBell className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Send Notification</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Event: <span className="font-medium text-foreground">{eventName}</span>
      </p>

      <div className="space-y-2">
        <Label>Notification Type</Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select notification type" />
          </SelectTrigger>
          <SelectContent>
            {NOTIFICATION_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Recipients</Label>
        <Select value={recipients} onValueChange={setRecipients}>
          <SelectTrigger>
            <SelectValue placeholder="Select recipients" />
          </SelectTrigger>
          <SelectContent>
            {RECIPIENT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notification_message">Message</Label>
        <Textarea
          id="notification_message"
          placeholder="Enter notification message..."
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSend}
          disabled={!type || !message.trim() || !recipients || isSending}
        >
          <IconSend className="mr-2 h-4 w-4" />
          {isSending ? "Sending..." : "Send Notification"}
        </Button>
      </div>
    </div>
  );
}
