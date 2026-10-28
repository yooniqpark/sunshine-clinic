import fs from "node:fs";
import path from "node:path";

const HANGUL = /[\uac00-\ud7a3]/;
const files = [
  ...["en", "ja", "zh"].map((locale) => `messages/${locale}.json`),
  ...fs.readdirSync("content")
    .filter((name) => /-(en|ja|zh)\.json$/.test(name))
    .map((name) => path.join("content", name)),
];

const failures = [];

function visit(value, jsonPath, file) {
  if (typeof value === "string") {
    if (HANGUL.test(value)) failures.push(`${file}:${jsonPath} = ${JSON.stringify(value)}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, `${jsonPath}[${index}]`, file));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) visit(item, `${jsonPath}.${key}`, file);
  }
}

for (const file of files) {
  visit(JSON.parse(fs.readFileSync(file, "utf8")), "$", file);
}

if (failures.length) {
  console.error(`Found Hangul in non-Korean locale content (${failures.length}):`);
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Locale content check passed (${files.length} files).`);
