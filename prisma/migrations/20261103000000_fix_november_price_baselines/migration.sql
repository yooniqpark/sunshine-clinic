-- Apply the clinic-confirmed November base prices once. Locate rows by stable
-- identity, not array position, and preserve event prices and all other edits.
WITH corrections AS (
  SELECT
    event.id,
    json_set(
      event.templateData,
      '$.sections[' || section.key || '].rows[' || ulthera.key || '].originalPrice',
      '190~200만원',
      '$.sections[' || section.key || '].rows[' || thermage.key || '].originalPrice',
      '250~270만원'
    ) AS templateData
  FROM "Event" AS event,
    json_each(event.templateData, '$.sections') AS section,
    json_each(section.value, '$.rows') AS ulthera,
    json_each(section.value, '$.rows') AS thermage
  WHERE event.slug = 'managed-november-2026'
    AND json_extract(section.value, '$.id') = 'section-lifting'
    AND json_extract(ulthera.value, '$.id') = 'row-lifting-1'
    AND json_extract(ulthera.value, '$.name.ko') = '울쎄라 400샷'
    AND json_extract(ulthera.value, '$.originalPrice') IN ('140만원', '190~200만원')
    AND json_extract(ulthera.value, '$.eventPrice') = '150만원'
    AND json_extract(thermage.value, '$.id') = 'row-lifting-2'
    AND json_extract(thermage.value, '$.name.ko') = '써마지 600샷'
    AND json_extract(thermage.value, '$.originalPrice') IN ('200만원', '250~270만원')
    AND json_extract(thermage.value, '$.eventPrice') = '190만원'
)
UPDATE "Event"
SET "templateData" = (SELECT corrections.templateData FROM corrections WHERE corrections.id = "Event".id),
    "updatedAt" = CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE id IN (SELECT id FROM corrections)
  AND templateData <> (SELECT corrections.templateData FROM corrections WHERE corrections.id = "Event".id);
