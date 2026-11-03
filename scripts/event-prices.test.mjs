import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import test from 'node:test';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ListTable, Won} from '../components/EventPriceTables.tsx';
import {EventsBoard} from '../app/[locale]/(site)/community/events/EventsBoard.tsx';
import {POPUP_EVENTS} from '../lib/event-popup.ts';
import {formatPrice} from '../lib/event-popup-i18n.ts';

// TSX loads app components through CJS in this repository. Match its provider
// resolution so ESM/CJS exports do not create two separate intl contexts.
const {NextIntlClientProvider}=createRequire(import.meta.url)('next-intl');

function renderPrice(locale, component) {
  return renderToStaticMarkup(createElement(NextIntlClientProvider,
    {locale,messages:{},timeZone:'Asia/Seoul'},component));
}

test('every locale keeps its event cover beside the localized price sheet', () => {
  for (const locale of ['ko','en','ja','zh']) {
    const messages=JSON.parse(readFileSync(new URL(`../messages/${locale}.json`,import.meta.url),'utf8'));
    const item=messages.v2.events.items.find(event=>event.slug==='november-2026');
    assert.ok(item.images?.length, `${locale}: cover image is configured`);
    const html=renderPrice(locale,createElement(EventsBoard,{items:[item],openTag:item.tag}));
    assert.match(html, /<figure/);
    assert.ok(html.includes(encodeURIComponent(item.images[0].src)), `${locale}: existing cover is rendered`);
    assert.ok(html.includes(formatPrice('150만원',locale).num), `${locale}: translated prices remain`);
  }
});

test('mobile event popups start on the photo for every locale and reset it on tab changes', () => {
  const source=readFileSync(new URL('../components/EventTabsPopup.tsx',import.meta.url),'utf8');
  assert.match(source, /\[showPrice, setShowPrice\] = useState\(false\)/);
  assert.match(source, /function selectEvent\(i: number\)\s*\{[^}]*setShowPrice\(false\)/);
  assert.match(source, /onClick=\{\(\) => setShowPrice\(true\)\}/);
  const poster=source.slice(source.indexOf('data-event-poster'),source.indexOf('data-event-price-panel'));
  const price=source.slice(source.indexOf('data-event-price-panel'));
  assert.match(poster, /showPrice \? "hidden lg:block" : "block"/);
  assert.match(price, /showPrice \? "flex" : "hidden lg:flex"/);
  assert.doesNotMatch(source, /locale\s*[!=]==?\s*["']ko["']/);
});

test('original-price strike applies only to numeric text, never the currency unit or parent', () => {
  const event=POPUP_EVENTS.find(event=>event.id==='november-2026');
  const category={...event.categories[0],rows:[event.categories[0].rows[0]]};
  for (const locale of ['ko','en','ja','zh']) {
    const expected=formatPrice('190~200만원',locale);
    const html=renderPrice(locale,createElement(ListTable,{category,theme:event.theme}));
    assert.doesNotMatch(html,/<p[^>]*line-through/);
    assert.deepEqual([...html.matchAll(/<span class="line-through">([^<]*)<\/span>/g)].map(match=>match[1]),[expected.num]);
    assert(html.includes(`${expected.unit}</em>`));
    assert(html.includes(formatPrice('150만원',locale).num));
  }
});

test('normal event prices have no strike decoration', () => {
  const html=renderPrice('ko',createElement(Won,{value:'150만원',unitColor:'#333333'}));
  assert.doesNotMatch(html,/line-through/);
  assert(html.includes('150'));
  assert(html.includes('만원</em>'));
});

test('base-price ranges localize both endpoints without Korean leaking into other locales', () => {
  for (const separator of ['~', '-', '–']) {
    assert.deepEqual(formatPrice(`190${separator}200만원`, 'ko'), {num:'190–200',unit:'만원'});
    assert.deepEqual(formatPrice(`190${separator}200만원`, 'en'), {num:'1,900,000–2,000,000',unit:' KRW'});
    assert.deepEqual(formatPrice(`250${separator}270만원`, 'ja'), {num:'250–270',unit:'万ウォン'});
    assert.deepEqual(formatPrice(`250${separator}270만원`, 'zh'), {num:'250–270',unit:'万韩元'});
  }
});

test('existing single prices, decimal prices and percentages keep their behavior', () => {
  assert.deepEqual(formatPrice('150만원','en'), {num:'1,500,000',unit:' KRW'});
  assert.deepEqual(formatPrice('1.5만원','en'), {num:'15,000',unit:' KRW'});
  assert.deepEqual(formatPrice('190만원','ko'), {num:'190',unit:'만원'});
  assert.deepEqual(formatPrice('20%','en'), {num:'20%',unit:''});
});

test('November board and managed-event seed have the same confirmed base ranges and unchanged discounts', () => {
  const rows=POPUP_EVENTS.find(event=>event.id==='november-2026').categories[0].rows;
  assert.deepEqual(rows.slice(0,2).map(row=>[row.original,row.event]), [['190~200만원','150만원'],['250~270만원','190만원']]);
  const seed=JSON.parse(readFileSync(new URL('../prisma/current-events.json',import.meta.url),'utf8'));
  const data=JSON.parse(seed.find(event=>event.slug==='managed-november-2026').templateData);
  assert.deepEqual(data.sections[0].rows.slice(0,2).map(row=>[row.originalPrice,row.eventPrice]), rows.slice(0,2).map(row=>[row.original,row.event]));
});

function legacyDocument() {
  const seed=JSON.parse(readFileSync(new URL('../prisma/current-events.json',import.meta.url),'utf8'));
  const document=JSON.parse(seed.find(event=>event.slug==='managed-november-2026').templateData);
  document.sections[0].rows[0].originalPrice='140만원';
  document.sections[0].rows[1].originalPrice='200만원';
  return document;
}

function migrateDocument(document) {
  const sql=readFileSync(new URL('../prisma/migrations/20261103000000_fix_november_price_baselines/migration.sql',import.meta.url),'utf8');
  const output=execFileSync('python3',['-c',`
import json, sqlite3, sys
data=json.load(sys.stdin)
db=sqlite3.connect(':memory:')
db.execute('CREATE TABLE Event(id TEXT PRIMARY KEY, slug TEXT, templateData TEXT, updatedAt INTEGER)')
db.execute('INSERT INTO Event VALUES(?,?,?,?)',('test','managed-november-2026',json.dumps(data['document'],ensure_ascii=False,separators=(',',':')),0))
db.executescript(data['sql'])
first=db.execute('SELECT templateData,updatedAt FROM Event').fetchone()
db.executescript(data['sql'])
second=db.execute('SELECT templateData,updatedAt FROM Event').fetchone()
print(json.dumps({'document':json.loads(first[0]),'repeatUnchanged':first==second}))
`],{input:JSON.stringify({document,sql}),encoding:'utf8'});
  return JSON.parse(output);
}

test('stored content migration only changes two original prices and is idempotent', () => {
  const original=legacyDocument();
  const updated=migrateDocument(original);
  const expected=structuredClone(original);
  expected.sections[0].rows[0].originalPrice='190~200만원';
  expected.sections[0].rows[1].originalPrice='250~270만원';
  assert.deepEqual(updated.document,expected);
  assert.equal(updated.repeatUnchanged,true);
});

test('unrecognized admin edits are not overwritten by the one-time correction', () => {
  const doc=legacyDocument();
  doc.sections[0].rows[0].eventPrice='160만원';
  assert.deepEqual(migrateDocument(doc).document,doc);
  doc.sections[0].rows[0].eventPrice='150만원';
  doc.sections[0].rows[1].originalPrice='280만원';
  assert.deepEqual(migrateDocument(doc).document,doc);
});

test('stored rows may be reordered without changing which treatments are corrected', () => {
  const doc=legacyDocument();
  doc.sections.reverse();
  const section=doc.sections.find(s=>s.id==='section-lifting');
  section.rows.reverse();
  const expected=structuredClone(doc);
  const expectedRows=expected.sections.find(s=>s.id==='section-lifting').rows;
  expectedRows.find(row=>row.id==='row-lifting-1').originalPrice='190~200만원';
  expectedRows.find(row=>row.id==='row-lifting-2').originalPrice='250~270만원';
  assert.deepEqual(migrateDocument(doc).document,expected);
});
