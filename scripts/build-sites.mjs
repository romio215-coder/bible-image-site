import { readFileSync, writeFileSync, readdirSync, statSync, mkdtempSync, mkdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
function copyTree(from, to) {
  if (statSync(from).isDirectory()) {
    mkdirSync(to, { recursive: true });
    for (const name of readdirSync(from)) copyTree(join(from, name), join(to, name));
  } else writeFileSync(to, readFileSync(from));
}
// Rolldown on Windows exits during RSC linking when the project path contains
// Korean characters. Build the exact source in an ASCII temporary directory.
const staged = process.platform === 'win32' && /[^\x00-\x7f]/.test(root);
const directory = staged ? mkdtempSync(join(tmpdir(), 'wordlight-sites-')) : root;
if (staged) {
  for (const entry of ['src', 'public', '.openai', 'package.json', 'package-lock.json', 'vite.config.mts', 'next.config.ts', 'tsconfig.json', 'postcss.config.mjs']) {
    copyTree(join(root, entry), join(directory, entry));
  }
  symlinkSync(join(root, 'node_modules'), join(directory, 'node_modules'), 'junction');
}
process.chdir(directory);
const { createBuilder } = await import(pathToFileURL(join(directory, 'node_modules/vite/dist/node/index.js')).href);
const builder = await createBuilder({ root: directory });
await builder.buildApp();
if (staged) {
  mkdirSync(join(root, 'dist'), { recursive: true });
  copyTree(join(directory, 'dist'), join(root, 'dist'));
}
