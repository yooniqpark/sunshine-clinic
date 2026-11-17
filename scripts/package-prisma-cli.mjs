import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, relative, resolve } from 'node:path';

// Next standalone traces the runtime client, not the Prisma CLI used at deploy.
// Ship the CLI and its exact audited dependencies from CI, including its engine.
const source = process.cwd();
const release = resolve(process.argv[2] ?? '');
assert.notEqual(release, source, 'Supply the release directory.');
assert.ok(existsSync(join(release, 'server.js')), 'Expected a standalone release.');
const lock = JSON.parse(readFileSync(join(source, 'package-lock.json'), 'utf8'));
const copied = new Set();

function packagePath(name, from) {
  return (createRequire(from).resolve.paths(name) ?? [])
    .filter(dir => relative(source, dir).split('/')[0] === 'node_modules')
    .map(dir => join(dir, name, 'package.json'))
    .find(existsSync);
}

function copyPackage(name, from, optional = false) {
  const manifest = packagePath(name, from);
  if (!manifest && optional) return;
  assert.ok(manifest, `Missing Prisma CLI dependency: ${name}`);
  const dir = dirname(manifest);
  if (copied.has(dir)) return;
  copied.add(dir);
  const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
  const path = relative(source, dir);
  assert.equal(pkg.version, lock.packages[path]?.version, `Unexpected version: ${name}`);
  const target = join(release, path);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(dir, target, {
    recursive: true,
    filter: file => file === dir || basename(file) !== 'node_modules',
  });
  const optionalDeps = pkg.optionalDependencies ?? {};
  for (const dep of Object.keys({ ...pkg.dependencies, ...optionalDeps })) {
    copyPackage(dep, manifest, Object.hasOwn(optionalDeps, dep));
  }
}

copyPackage('prisma', join(source, 'package.json'));
const cli = packagePath('prisma', join(source, 'package.json'));
const config = packagePath('@prisma/config', cli);
const fixed = packagePath('deepmerge-ts', config);
assert.equal(JSON.parse(readFileSync(fixed, 'utf8')).version, '8.0.0');
