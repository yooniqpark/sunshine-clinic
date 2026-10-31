# Doctor’s Notes

- Public: `/journal` and `/journal/[id]` (Korean content only).
- Admin: `/admin/blog`, using the existing ADMIN session.
- Import a DOCX up to 12MB. Every upload creates a private draft; publishing is explicit.
- Word text, inline images, tables, emphasis, and headings are converted without AI rewriting. Direct font-size headings are recognized. Web fonts, wrapping, and pagination may differ from Word.
- Content is sanitized before storage. Original DOCX downloads require ADMIN authentication. Draft URLs return 404 to visitors.
- Posts use the existing `SiteContent` table, group `clinic-blog`; no schema migration is required.
- Embedded images remain in the stored HTML. Original files live in `blog-source` beside `CLINIC_UPLOAD_DIR`, outside immutable releases and public uploads. Include that directory in file backups along with the database backups.
- Korean community navigation links to the journal. Existing external blog routes remain unchanged.

Administrators can upload a separate preview image from each post editor (JPG, PNG, WebP, or AVIF, up to 5MB), or restore the first image from the article. Uploads are decoded, resized within 1200×1200 without cropping, stripped of metadata, and encoded as WebP in the existing post record. They survive releases without a separate public file. Replacing a cover preserves the article body, publication state, unsaved editor fields, and chronological list order. The list orders posts by creation time so cover edits do not move an older post above newer ones.

On a disposable local fixture with two posts and the local test administrator, run `node scripts/check-blog-cover.mjs` against a running app on port 8097 to verify upload, invalid files, authorization, persistence, public display, stable order, and reset. The script refuses production hosts.

Verification: production build, TypeScript, scoped ESLint, locale checks, and authenticated upload/publish/unpublish integration checks. The sample document preserved all text (ignoring whitespace), nine images, four tables, and seven headings.

Deployment uses the repository’s existing Lightsail workflow. The known Prisma 6 CLI advisory is confined to trusted schema/config tooling; the blog endpoints do not accept Prisma configuration. Keep the current Core-compatible Prisma version until the planned major-version migration. No new critical production advisories were found.
