"use client";

import { useState } from "react";
import { EventTabsPopup } from "@/components/EventTabsPopup";
import type { PopupEvent } from "@/lib/event-popup";

/** Show promotional events only; informational notices remain outside the popup flow. */
export function HomePopups({ events }: { events?: PopupEvent[] }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return <EventTabsPopup onClose={() => setVisible(false)} events={events} localized={Boolean(events?.length)} />;
}
