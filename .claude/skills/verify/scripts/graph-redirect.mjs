import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const target = process.env.VERIFY_GRAPH_URL;
const runDir = process.env.VERIFY_RUN_DIR;

if (!target || !runDir) {
  throw new Error('VERIFY_GRAPH_URL and VERIFY_RUN_DIR are required when graph-redirect.mjs is preloaded.');
}

mkdirSync(path.join(runDir, 'redirected-pids'), { recursive: true });
writeFileSync(path.join(runDir, 'redirected-pids', String(process.pid)), target);

const GRAPH_ORIGIN = 'https://graph.facebook.com';
const originalFetch = globalThis.fetch;

function redirect(url) {
  return url.startsWith(GRAPH_ORIGIN) ? target + url.slice(GRAPH_ORIGIN.length) : url;
}

globalThis.fetch = function verifyFetch(input, init) {
  if (typeof input === 'string') return originalFetch(redirect(input), init);
  if (input instanceof URL) return originalFetch(redirect(input.href), init);
  if (input instanceof Request && input.url.startsWith(GRAPH_ORIGIN)) {
    return originalFetch(new Request(redirect(input.url), input), init);
  }
  return originalFetch(input, init);
};
