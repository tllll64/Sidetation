// copy the library bundle built at repo root into the extension's media/
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../../dist/sidetation.umd.cjs');
if (!existsSync(src)) {
  console.error('缺少 dist/sidetation.umd.cjs —— 请先在仓库根目录运行 npm run build');
  process.exit(1);
}
mkdirSync(resolve(here, '../media'), { recursive: true });
copyFileSync(src, resolve(here, '../media/sidetation.umd.cjs'));
console.log('synced media/sidetation.umd.cjs');
