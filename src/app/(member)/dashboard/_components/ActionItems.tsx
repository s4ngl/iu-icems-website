"use client";

import { IconCheckbox, IconSquare } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActionItem {
  isDone: boolean;
  text: string;
  urgent?: boolean;
}

interface ActionItemsProps {
  items?: ActionItem[];
}

const defaultItems: ActionItem[] = [
  { isDone: false, text: "Upload BLS certification — expires soon", urgent: true },
  { isDone: false, text: "Pay membership dues before Dec 31", urgent: true },
  { isDone: true, text: "Finish ICS-100 online course" },
  { isDone: true, text: "Submit headshot for the member directory" },
  { isDone: false, text: "RSVP to December general body meeting" },
];

export default function ActionItems({ items = defaultItems }: ActionItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Items</CardTitle>
        <CardDescription>Tasks that need your attention</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.text} className="flex items-start gap-2">
              {item.isDone ? (
                <IconCheckbox className="mt-px size-5 shrink-0 text-emerald-600" stroke={1.5} />
              ) : (
                <IconSquare className="mt-px size-5 shrink-0 text-muted-foreground/50" stroke={1.5} />
              )}
              <span className={item.isDone ? "text-muted-foreground line-through" : ""}>
                {item.text}
              </span>
              {item.urgent && !item.isDone && (
                <Badge variant="destructive" className="ml-auto shrink-0 text-[10px]">
                  Urgent
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}