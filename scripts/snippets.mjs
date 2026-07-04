// Generate copy-paste snippets for testing Sidetation on arbitrary websites:
//   dist/console-paste.js  -> paste into any site's DevTools console
//   dist/bookmarklet.txt   -> save as a bookmark URL, click on any page
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const umd = readFileSync(resolve(root, 'dist/sidetation.umd.cjs'), 'utf8');

const boot = `;(function(){var s=window.Sidetation||globalThis.Sidetation;if(document.querySelector('[data-sidetation]')){console.log('Sidetation already injected');return;}window.__sidetation=s.init({autoStart:true});console.log('Sidetation ready — 已自动进入编辑模式');})();`;

const consolePaste = umd + boot;
writeFileSync(resolve(root, 'dist/console-paste.js'), consolePaste);

const bookmarklet = 'javascript:' + encodeURIComponent(consolePaste);
writeFileSync(resolve(root, 'dist/bookmarklet.txt'), bookmarklet);

// keep the Chrome extension's bundle in sync with every build
writeFileSync(resolve(root, 'extension/sidetation.js'), umd);

console.log(
  `snippets written: console-paste.js (${(consolePaste.length / 1024).toFixed(1)} kB), ` +
    `bookmarklet.txt (${(bookmarklet.length / 1024).toFixed(1)} kB)`
);
