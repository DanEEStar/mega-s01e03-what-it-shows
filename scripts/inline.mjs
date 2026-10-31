// Copy the built page into one self-contained HTML file: the page as the desk will see it.
// Styles are inlined and the hydration bundle is dropped, so the file opens without a server.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const PAGE = 'build/kb/incidents/4471-split.html';
const OUT = 'rendered/4471-split.html';

let html = readFileSync(PAGE, 'utf8');

html = html.replace(/[ \t]*<link[^>]*rel="modulepreload"[^>]*>\n?/g, '');
html = html.replace(
  /[ \t]*<link[^>]*href="([^"]+\.css)"[^>]*rel="stylesheet"[^>]*>/g,
  (_, href) => {
    const file = href.startsWith('/') ? resolve('build', href.slice(1)) : resolve(dirname(PAGE), href);
    return `    <style>\n${readFileSync(file, 'utf8')}\n    </style>`;
  },
);
html = html.replace(/[ \t]*<script[\s\S]*?<\/script>\n?/g, '');
html = html.replace(/<!--[-[\]]*-->/g, '');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
console.log(`${OUT}: ${html.length} bytes, ${(html.match(/<style>/g) ?? []).length} inline styles, scripts: ${(html.match(/<script/g) ?? []).length}`);
