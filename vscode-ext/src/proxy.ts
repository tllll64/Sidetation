import * as http from 'node:http';
import httpProxy from 'http-proxy';

/** the one URL the proxy answers itself; everything else forwards to the target */
const INJECT_PATH = '/__sidetation__/sidetation.js';

export interface ProxyOptions {
  /** dev server to forward to, e.g. http://localhost:5173 */
  target: string;
  /** Sidetation UMD bundle source text */
  umdSource: string;
  /** receiver endpoint the injected toolbar's「同步 MCP」posts to */
  mcpEndpoint: string;
}

export interface InjectingProxy {
  port: number;
  dispose: () => void;
}

/**
 * Reverse proxy that rewrites text/html responses to load Sidetation,
 * and passes everything else through untouched — including WebSocket
 * upgrades, so Vite HMR keeps working.
 */
export function startInjectingProxy(opts: ProxyOptions): Promise<InjectingProxy> {
  // defer past DOMContentLoaded so a page that already calls init() itself
  // (module scripts run later than this classic script) wins, and the
  // [data-sidetation] guard actually sees its host
  const boot =
    ';(function(){function boot(){' +
    'if(window.__sidetation||document.querySelector("[data-sidetation]"))return;' +
    'var S=window.Sidetation||globalThis.Sidetation;if(!S)return;' +
    `window.__sidetation=S.init({enableMcpSync:true,mcpEndpoint:${JSON.stringify(opts.mcpEndpoint)}});}` +
    'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(boot,0);});' +
    'else setTimeout(boot,0);})();';
  const payload = `${opts.umdSource}\n${boot}`;

  const proxy = httpProxy.createProxyServer({
    target: opts.target,
    ws: true,
    selfHandleResponse: true,
  });

  // compressed HTML can't be rewritten; identity costs nothing on localhost
  proxy.on('proxyReq', (proxyReq) => {
    proxyReq.setHeader('accept-encoding', 'identity');
  });

  proxy.on('proxyRes', (proxyRes, _req, res) => {
    const headers = { ...proxyRes.headers };
    const isHtml = String(headers['content-type'] ?? '').includes('text/html');
    if (!isHtml) {
      res.writeHead(proxyRes.statusCode ?? 200, headers);
      proxyRes.pipe(res);
      return;
    }
    const chunks: Buffer[] = [];
    proxyRes.on('data', (c: Buffer) => chunks.push(c));
    proxyRes.on('end', () => {
      let html = Buffer.concat(chunks).toString('utf8');
      const tag = `<script src="${INJECT_PATH}"></script>`;
      html = html.includes('</body>') ? html.replace('</body>', `${tag}\n</body>`) : html + tag;
      const body = Buffer.from(html, 'utf8');
      delete headers['content-length'];
      delete headers['transfer-encoding'];
      res.writeHead(proxyRes.statusCode ?? 200, { ...headers, 'content-length': String(body.byteLength) });
      res.end(body);
    });
  });

  // a dead target should show a readable message, not a blank panel
  proxy.on('error', (err, _req, res) => {
    const r = res as http.ServerResponse | undefined;
    if (r && typeof r.writeHead === 'function') {
      if (!r.headersSent) r.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
      r.end(`Sidetation 代理无法连接 ${opts.target}\n${String(err)}\n\n请确认 dev server 正在运行。`);
    } else if (res) {
      res.end();
    }
  });

  const server = http.createServer((req, res) => {
    if (req.url === INJECT_PATH) {
      res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-cache' });
      res.end(payload);
      return;
    }
    proxy.web(req, res);
  });
  server.on('upgrade', (req, socket, head) => proxy.ws(req, socket, head));

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      const port = addr && typeof addr === 'object' ? addr.port : 0;
      resolve({
        port,
        dispose: () => {
          server.close();
          proxy.close();
        },
      });
    });
  });
}
