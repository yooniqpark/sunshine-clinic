// 이벤트 목록과 편집은 clinic-core의 단일 관리 화면을 사용한다.
import CoreEventsPage from "@yooniqpark/clinic-core/admin/events/page";

export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  return <CoreEventsPage />;
}
