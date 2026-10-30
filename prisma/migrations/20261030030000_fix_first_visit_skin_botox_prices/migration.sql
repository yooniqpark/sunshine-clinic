-- Apply the requested first-visit prices once. Keep all other administrator
-- edits, including the other brands and events. Locate columns by name so
-- rearranging the price table does not change which brands are updated.
WITH corrections AS (
  SELECT
    event.id,
    json_set(
      event.templateData,
      '$.sections[' || section.key || '].rows[' || price_row.key || '].prices[' || coretox.key || ']',
      '15만원',
      '$.sections[' || section.key || '].rows[' || price_row.key || '].prices[' || xeomin.key || ']',
      '25만원'
    ) AS templateData
  FROM "Event" AS event,
    json_each(event.templateData, '$.sections') AS section,
    json_each(section.value, '$.rows') AS price_row,
    json_each(section.value, '$.columns') AS coretox,
    json_each(section.value, '$.columns') AS xeomin
  WHERE event.slug = 'managed-first-visit'
    AND json_extract(section.value, '$.layout') = 'matrix'
    AND json_extract(price_row.value, '$.name.ko') = '커스텀 스킨보톡스'
    AND json_extract(coretox.value, '$.ko') = '프리미엄 코어톡스'
    AND json_extract(xeomin.value, '$.ko') = '외산 제오민'
)
UPDATE "Event"
SET "templateData" = (SELECT corrections.templateData FROM corrections WHERE corrections.id = "Event".id),
    "updatedAt" = CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE id IN (SELECT id FROM corrections)
  AND templateData <> (SELECT corrections.templateData FROM corrections WHERE corrections.id = "Event".id);
