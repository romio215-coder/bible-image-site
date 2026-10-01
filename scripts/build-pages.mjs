import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = process.cwd();
const output = resolve(root, '.pages');
if (output !== join(root, '.pages')) throw new Error('Invalid output directory');
process.env.NEXT_PUBLIC_SITE_URL ||= 'https://bible.huchu.xyz';
const build = spawnSync(process.execPath, ['scripts/build-sites.mjs'], { stdio: 'inherit', env: process.env });
if (build.status !== 0) process.exit(build.status || 1);

// Rebuild only the generated Pages output. Never publish server modules as static assets.
rmSync(output, { recursive: true, force: true });
function copyTree(from, to) {
  if (statSync(from).isDirectory()) {
    mkdirSync(to, { recursive: true });
    for (const name of readdirSync(from)) {
      if (['.vite', '.wrangler', 'wrangler.json'].includes(name)) continue;
      copyTree(join(from, name), join(to, name));
    }
  } else writeFileSync(to, readFileSync(from));
}
copyTree(join(root, 'dist/client'), output);
copyTree(join(root, 'dist/server'), join(output, '_worker.js'));
writeFileSync(join(output, '_routes.json'), JSON.stringify({
  version: 1, include: ['/*'],
  exclude: ['/_next/static/*', '/images/*', '/fonts/*', '/icons/*', '/sw.js', '/offline.html'],
}, null, 2));
writeFileSync(join(output, '_headers'), '/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n/sw.js\n  Cache-Control: no-cache\n');
console.log('Cloudflare Pages output ready in .pages (SSR worker + public assets).');
