# AI referral analytics

The existing browser beacon and PageView records already retain the referring origin and UTM source. The clinic analytics page now classifies ChatGPT, Gemini, and Claude separately in the monthly source chart and a dedicated table (today, last seven days, last thirty days, all using Korean calendar dates). The table counts page views, not unique people, sessions, AI mentions, or crawler fetches. Its page breakdown shows pages viewed with an AI source signal, not necessarily the landing page.

Explicit UTM source tags take precedence over referring origins. Recognized domains use exact hostname/subdomain matching; Gemini is checked before generic Google. Historical records are reclassified on read without rewriting them or changing the schema. Missing referrers and tags remain direct/unknown; the site cannot reconstruct a source suppressed by an app, browser, or link policy. A zero count means no identifiable records, not proof that nobody arrived from AI.

No additional visitor identifiers, conversation URLs, prompts, or chat contents are collected. Referrers continue to be stored only as origins, and the existing administrator visit-exclusion setting remains in effect.

Run `npx tsx scripts/check-ai-analytics.mts` for classification, lookalike domains, attribution precedence, date boundaries, and empty-data checks.

With a disposable local fixture and the local test administrator, `node scripts/check-ai-analytics-http.mjs` verifies the existing beacon endpoint through the rendered admin page. It refuses production hosts and marks synthetic events with `utmCampaign=ai-analytics-local-check`; remove these local-only rows after verification.

## AI crawler and fetcher access

The separate AI access panel reads an IP-free summary of nginx request logs. A root-owned systemd job refreshes `/home/ubuntu/app-data/analytics/ai-access.json` every fifteen minutes; the web process cannot read the original logs. OpenAI identities are checked against the published IP ranges cached for one day. Anthropic and Google names remain user-agent observations, and Googlebot/GoogleOther do not prove a Gemini fetch.

Counts include requests for robots, sitemaps, assets and error responses. The successful-page column and recent list contain HTTP 200 GET requests for public content routes only. They are request counts rather than unique people or recommendation/impression counts; site audits can generate these fetches too.

Hourly buckets are replaced on rescans rather than added, while buckets older than the currently rotated logs remain for up to 32 days. The panel reports actual coverage and collection time, so the first thirty-day window can be incomplete. Snapshots retain only bot names, times, paths without queries, status codes and IP-match verdicts. Client IPs and full user agents are not exported.

`python3 scripts/test-ai-access.py` checks classification, IP-match verdicts, path privacy, successful-page filtering, repeated scans, archive rotation, retention, and atomic output permissions. `npx tsx scripts/check-ai-access.mts` checks Korean date boundaries, period counts, missing snapshots, and verification confidence. The deployed timer/service are `sunshine-ai-access.timer` and `sunshine-ai-access.service`; failure preserves the last successful summary.
