// core 이벤트 목록 + 선샤인 전용 홈 이벤트 프리셋 선택 UI
import CoreEventsPage from "@yooniqpark/clinic-core/admin/events/page";
import { EventPresetSelector } from "./EventPresetSelector";

export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  return <CoreEventsPage presetSlot={<EventPresetSelector />} />;
}
