import type { AiAccessStats } from "@/lib/ai-access";

function formatTime(value: string | null) {
  if (!value) return "확인되지 않음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "확인되지 않음";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function VerificationBadge({ verified }: { verified: boolean }) {
  return <span className={verified
    ? "inline-flex rounded-full bg-green-50 px-2 py-1 text-[10px] font-medium text-green-800"
    : "inline-flex rounded-full bg-sand/50 px-2 py-1 text-[10px] font-medium text-ink-soft"}>
    {verified ? "공식 IP 일치" : "IP 미검증"}
  </span>;
}

export default function AiAccessPanel({ stats }: { stats: AiAccessStats }) {
  return (
    <section className="mt-10 rounded-2xl border border-line bg-white p-6" aria-labelledby="ai-access-heading">
      <h2 id="ai-access-heading" className="text-lg font-bold">AI 수집·열람 접근</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        AI 수집기와 열람 도구가 홈페이지에 요청한 기록입니다. 아래의 AI 서비스 링크를 통한 방문 통계와 별도로 집계합니다.
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
        요청 수에는 페이지·robots.txt·사이트맵·이미지 등의 접근이 포함됩니다. 사람 수나 AI 추천 횟수를 뜻하지 않으며, 콘텐츠 활용 여부는 알 수 없습니다.
      </p>

      {!stats.available ? (
        <div className="mt-5 rounded-xl border border-line bg-sand/30 p-5" role="status">
          <p className="text-sm font-semibold">연결 준비 중</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">서버 접근 기록을 연결하면 수집기별 요청 수와 공개 페이지 접근 내역이 표시됩니다. 현재는 접근 여부를 확인할 수 없습니다.</p>
          <p className="mt-2 text-[11px] text-ink-soft">연결 후 15분마다 집계합니다.</p>
        </div>
      ) : (
        <>
          <dl className="mt-5 grid gap-3 rounded-xl bg-sand/30 p-4 text-[11px] leading-relaxed text-ink-soft sm:grid-cols-2">
            <div><dt className="font-semibold text-ink">최근 수집 시각 · 한국시간</dt><dd className="mt-1">{formatTime(stats.updatedAt)} · 15분마다 집계</dd></div>
            <div><dt className="font-semibold text-ink">보관 기록 범위 · 한국시간</dt><dd className="mt-1">{formatTime(stats.coverageFrom)} ~ {formatTime(stats.coverageTo)}</dd></div>
            <div className="sm:col-span-2"><dt className="inline font-semibold text-ink">OpenAI 공식 IP 목록 갱신 </dt><dd className="inline">{formatTime(stats.openaiIpUpdatedAt)} · 한국시간</dd></div>
          </dl>

          <div className="mt-5 overflow-x-auto" role="region" aria-label="AI 수집기별 접근 요청 수" tabIndex={0}>
            <table className="w-full min-w-[920px] text-sm">
              <caption className="mb-3 text-left text-[11px] leading-relaxed text-ink-soft">
                요청 수 기준 · 오늘·최근 7일·최근 30일 중 보관된 기록만 집계합니다. 기록 범위 이전의 접근은 포함되지 않습니다.
              </caption>
              <thead className="border-b border-line text-[11px] text-ink-soft">
                <tr>
                  <th scope="col" className="py-3 pr-4 text-left font-medium">수집기·열람 도구</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">오늘</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">최근 7일<br />(보관분)</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">최근 30일<br />(보관분)</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">공식 IP 일치<br />최근 30일</th>
                  <th scope="col" className="py-3 pl-4 text-left font-medium">마지막 접근 · 한국시간</th>
                </tr>
              </thead>
              <tbody>
                {stats.services.map((service) => (
                  <tr key={service.id} className="border-b border-line align-top last:border-0">
                    <th scope="row" className="max-w-[250px] py-4 pr-4 text-left font-normal">
                      <p className="font-semibold text-ink">{service.label}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">{service.description}</p>
                    </th>
                    <td className="px-3 py-4 text-right tabular-nums">{service.today.toLocaleString()}</td>
                    <td className="px-3 py-4 text-right tabular-nums">{service.week.toLocaleString()}</td>
                    <td className="px-3 py-4 text-right tabular-nums">
                      {service.month.toLocaleString()}
                      <p className="mt-1 whitespace-nowrap text-[10px] text-ink-soft">공개 페이지 200 응답 {service.successMonth.toLocaleString()}회</p>
                    </td>
                    <td className="px-3 py-4 text-right tabular-nums">
                      {service.canVerify
                        ? service.verifiedMonth === null ? <span className="text-[11px] text-ink-soft">미확인</span> : service.verifiedMonth.toLocaleString()
                        : <span className="text-[11px] text-ink-soft">표기 기준</span>}
                    </td>
                    <td className="max-w-[260px] py-4 pl-4">
                      {service.lastAccess ? <>
                        <p className="whitespace-nowrap text-[11px] tabular-nums">{formatTime(service.lastAccess.at)}</p>
                        <p className="mt-1 break-all text-[11px] leading-relaxed text-ink-soft">{service.lastAccess.path || "/"}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-[10px] text-ink-soft">HTTP {service.lastAccess.status}</span><VerificationBadge verified={service.lastAccess.verified} /></div>
                      </> : <span className="text-[11px] text-ink-soft">보관 기록 없음</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-soft">수집기 이름은 요청에 표기된 이름을 기준으로 분류합니다. 공식 IP와 일치하지 않은 기록은 실제 해당 서비스의 요청인지 확정할 수 없습니다.</p>

          <div className="mt-6 border-t border-line pt-5">
            <h3 className="text-sm font-semibold">최근 공개 페이지 열람 · 최대 20건</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">공개 HTML 페이지에 정상 응답(HTTP 200)한 요청만 표시합니다.</p>
            {stats.recent.length === 0 ? (
              <p className="mt-4 text-sm text-ink-soft">보관된 기록에서 공개 페이지에 정상 응답한 접근이 아직 확인되지 않았습니다.</p>
            ) : (
              <ol className="mt-4 divide-y divide-line">
                {stats.recent.slice(0, 20).map((item, index) => (
                  <li key={`${item.botId}-${item.at}-${index}`} className="grid gap-2 py-4 first:pt-0 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-5">
                    <div><p className="text-sm font-semibold text-ink">{item.label}</p><p className="mt-1 text-[11px] tabular-nums text-ink-soft">{formatTime(item.at)} · 한국시간</p></div>
                    <div className="min-w-0"><p className="break-all text-sm leading-relaxed text-ink">{item.path || "/"}</p><div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-[11px] text-ink-soft">HTTP {item.status}</span><VerificationBadge verified={item.verified} /></div></div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </>
      )}
      <p className="mt-5 text-[11px] leading-relaxed text-ink-soft">Google 수집기 요청만으로 Gemini 접근 여부는 확정할 수 없습니다.</p>
    </section>
  );
}
