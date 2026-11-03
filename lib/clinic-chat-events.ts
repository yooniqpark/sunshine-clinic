export const OPEN_CLINIC_CHAT_EVENT = "sunshine:open-chat";

/** Opens the existing widget without starting a new conversation or an API request. */
export function requestClinicChatOpen(target: Pick<EventTarget, "dispatchEvent">) {
  target.dispatchEvent(new Event(OPEN_CLINIC_CHAT_EVENT));
}
