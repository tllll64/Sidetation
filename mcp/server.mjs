#!/usr/bin/env node
// Sidetation MCP server — stdio entrypoint.
//
// This is what stdio-based agents (Claude Code, Codex, CodeBuddy, Cursor…)
// spawn. It's a pure READER: it never owns a port and reads the shared store
// file fresh on every tool call, so any number of agents can run at once
// without conflict. Browser edits arrive via the separate receiver daemon
// (receiver.mjs), which also hosts a Streamable-HTTP MCP endpoint for remote
// clients.
//
// MCP speaks JSON-RPC on stdout, so all logging goes to stderr.

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { buildMcp } from './mcp.mjs';

const log = (...a) => console.error('[sidetation-mcp]', ...a);

const mcp = buildMcp();
await mcp.connect(new StdioServerTransport());
log('MCP server ready on stdio (reader mode)');
