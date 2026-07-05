#!/usr/bin/env node
// Sidetation receiver daemon — the always-on process.
//
// Owns one HTTP port and serves three things:
//   POST /ingest  — the browser's "同步 MCP" button posts edit snapshots here
//   GET  /health  — liveness + page count
//   POST /mcp     — a Streamable-HTTP MCP endpoint for remote agents (e.g.
//                   cloud/office agents that connect to a URL rather than
//                   spawning a local stdio process)
//
// Decoupling ingestion into this daemon means stdio MCP readers (server.mjs)
// never fight over the port, and the daemon staying up keeps ingestion working
// regardless of which agents come and go. All state lives in the shared store
// file, so this and every reader always see the same data.
//
// Run it once:  npm run receiver   (or: node receiver.mjs)

import http from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { buildMcp } from './mcp.mjs';
import { ingest, pageCount } from './store.mjs';

const PORT = Number(process.env.SIDETATION_PORT ?? 8787);
const HOST = process.env.SIDETATION_HOST ?? '127.0.0.1';

const log = (...a) => console.error('[sidetation-receiver]', ...a);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, mcp-session-id, mcp-protocol-version',
  'Access-Control-Expose-Headers': 'mcp-session-id',
};

function readBody(req, limit = 20 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => {
      body += c;
      if (body.length > limit) reject(new Error('payload too large'));
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  res.writeHead(status, { ...CORS, 'content-type': 'application/json' });
  res.end(JSON.stringify(obj));
}

// stateless Streamable-HTTP MCP: one throwaway server+transport per request
async function handleMcp(req, res, body) {
  const mcp = buildMcp();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on('close', () => {
    transport.close();
    mcp.close();
  });
  for (const [k, v] of Object.entries(CORS)) res.setHeader(k, v);
  await mcp.connect(transport);
  await transport.handleRequest(req, res, body);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, CORS);
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      sendJson(res, 200, { ok: true, pages: pageCount() });
      return;
    }

    if (req.method === 'POST' && req.url === '/ingest') {
      const url = ingest(JSON.parse(await readBody(req)));
      log(`ingested edits from ${url}`);
      sendJson(res, 200, { ok: true, url });
      return;
    }

    if (req.url === '/mcp') {
      if (req.method === 'POST') {
        const body = JSON.parse(await readBody(req));
        await handleMcp(req, res, body);
        return;
      }
      // stateless mode has no server-initiated stream / session to delete
      sendJson(res, 405, {
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Method not allowed (stateless: POST only).' },
        id: null,
      });
      return;
    }

    res.writeHead(404, CORS);
    res.end();
  } catch (err) {
    log('request error:', String(err));
    if (!res.headersSent) sendJson(res, 400, { ok: false, error: String(err) });
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log(`port ${PORT} already in use — a receiver is probably already running. Exiting.`);
    process.exit(1);
  }
  log('server error:', String(err));
});

server.listen(PORT, HOST, () => {
  log(`listening on http://${HOST}:${PORT}`);
  log(`  ingest:  POST http://${HOST}:${PORT}/ingest`);
  log(`  mcp:     POST http://${HOST}:${PORT}/mcp   (Streamable HTTP)`);
});
