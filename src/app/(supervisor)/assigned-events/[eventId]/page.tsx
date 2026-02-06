"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AssignedEventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;

  useEffect(() => {
    router.replace(`/events/${eventId}/manage`);
  }, [router, eventId]);

  return null;
}
