import { appendFileSync } from 'node:fs';
import path from 'node:path';

import { chromium } from '@playwright/test';

const { VERIFY_CDP_PORT, VERIFY_PROFILE_DIR, VERIFY_EVIDENCE_DIR, VERIFY_BASE_URL } = process.env;

if (!VERIFY_CDP_PORT || !VERIFY_PROFILE_DIR || !VERIFY_EVIDENCE_DIR || !VERIFY_BASE_URL) {
  throw new Error('VERIFY_CDP_PORT, VERIFY_PROFILE_DIR, VERIFY_EVIDENCE_DIR, VERIFY_BASE_URL are required.');
}

function record(file, entry) {
  appendFileSync(
    path.join(VERIFY_EVIDENCE_DIR, file),
    `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`,
  );
}

function summarizePostData(request) {
  const contentType = request.headers()['content-type'] ?? '';
  const data = request.postData();
  if (!data) return null;
  if (contentType.startsWith('multipart/form-data')) {
    return data.replace(/(Content-Type: image\/[a-z]+\r\n\r\n)[\s\S]*?(\r\n--)/g, '$1<binary omitted>$2');
  }
  return data.length > 4000 ? `${data.slice(0, 4000)}... (${data.length} chars)` : data;
}

const context = await chromium.launchPersistentContext(VERIFY_PROFILE_DIR, {
  headless: true,
  locale: 'es-AR',
  viewport: { width: 1280, height: 900 },
  args: [`--remote-debugging-port=${VERIFY_CDP_PORT}`],
});

context.on('request', (request) => {
  if (!request.url().startsWith(`${VERIFY_BASE_URL}/api/`)) return;
  record('network.ndjson', {
    kind: 'request',
    method: request.method(),
    url: request.url(),
    body: summarizePostData(request),
  });
});

context.on('response', async (response) => {
  if (!response.url().startsWith(`${VERIFY_BASE_URL}/api/`)) return;
  const body = await response.text().catch((error) => `<unreadable: ${error.message}>`);
  record('network.ndjson', {
    kind: 'response',
    status: response.status(),
    url: response.url(),
    body,
  });
});

function watchPage(page) {
  page.on('console', (message) => {
    if (message.type() === 'error') record('console.ndjson', { url: page.url(), text: message.text() });
  });
  page.on('pageerror', (error) => record('console.ndjson', { url: page.url(), pageerror: error.message }));
}

context.pages().forEach(watchPage);
context.on('page', watchPage);

console.log(`verify browser ready, CDP on ${VERIFY_CDP_PORT}`);

const shutdown = async () => {
  await context.close().catch(() => {});
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
