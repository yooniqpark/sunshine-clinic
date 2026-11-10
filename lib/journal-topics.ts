import { JOURNAL_ALIAS } from "./blog-seo";

// Editorial links to the matching public treatment pages. No inference from
// titles or uncontrolled slug input; the stored article remains editable.
const topics = [
  { id: JOURNAL_ALIAS.to, path: "/treatments/anti-aging/rejuran", label: "리쥬란", also: ["/treatments/anti-aging/rejuran-i"] },
  { id: "fd405318-ec82-4f12-8118-a95e914db0d7", path: "/treatments/lifting/ulthera-prime", label: "울쎄라 프라임" },
  { id: "daaf48f7-201d-4e10-af79-5524b56ff2aa", path: "/treatments/lifting/inmode", label: "인모드" },
  { id: "2449280e-0d74-401e-a689-c60c02ac5958", path: "/treatments/anti-aging/radiesse", label: "레디어스" },
  { id: "46880512-faab-4890-ae54-aa2b5aa475c6", path: "/treatments/anti-aging/filler", label: "필러" },
] as const;

export const journalTopicForPost = (id: string) =>
  topics.find(topic => topic.id === (id === JOURNAL_ALIAS.from ? JOURNAL_ALIAS.to : id));

export const journalTopicForTreatment = (path: string) =>
  topics.find(topic => topic.path === path || ("also" in topic && topic.also.some(alias => alias === path)));
