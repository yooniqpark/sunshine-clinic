# AI referral analytics

The existing browser beacon and PageView records already retain the referring origin and UTM source. The clinic analytics page now classifies ChatGPT, Gemini, and Claude separately in the monthly source chart and a dedicated table (today, last seven days, last thirty days, all using Korean calendar dates). The table counts page views, not unique people, sessions, AI mentions, or crawler fetches. Its page breakdown shows pages viewed with an AI source signal, not necessarily the landing page.

Explicit UTM source tags take precedence over referring origins. Recognized domains use exact hostname/subdomain matching; Gemini is checked before generic Google. Historical records are reclassified on read without rewriting them or changing the schema. Missing referrers and tags remain direct/unknown; the site cannot reconstruct a source suppressed by an app, browser, or link policy. A zero count means no identifiable records, not proof that nobody arrived from AI.

No additional visitor identifiers, conversation URLs, prompts, or chat contents are collected. Referrers continue to be stored only as origins, and the existing administrator visit-exclusion setting remains in effect.

Run `npx tsx scripts/check-ai-analytics.mts` for classification, lookalike domains, attribution precedence, date boundaries, and empty-data checks.

With a disposable local fixture and the local test administrator, `node scripts/check-ai-analytics-http.mjs` verifies the existing beacon endpoint through the rendered admin page. It refuses production hosts and marks synthetic events with `utmCampaign=ai-analytics-local-check`; remove these local-only rows after verification.
