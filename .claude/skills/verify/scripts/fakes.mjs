import { appendFileSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

const port = Number(process.env.VERIFY_FAKES_PORT);
const evidenceDir = process.env.VERIFY_EVIDENCE_DIR;
const scanResultPath = path.join(import.meta.dirname, '..', 'fixtures', 'scan-result.json');

if (!port || !evidenceDir) {
  throw new Error('VERIFY_FAKES_PORT and VERIFY_EVIDENCE_DIR are required.');
}

const counts = { graph: 0, openai: 0 };
const failNext = { graph: false, openai: false };

function record(file, entry) {
  appendFileSync(
    path.join(evidenceDir, file),
    `${JSON.stringify({ receivedAt: new Date().toISOString(), ...entry })}\n`,
  );
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function redactImages(body) {
  return JSON.parse(JSON.stringify(body), (key, value) =>
    key === 'image_url' && typeof value === 'string'
      ? `${value.slice(0, 40)}... (${value.length} chars)`
      : value,
  );
}

async function handleGraph(request, response, rawBody) {
  counts.graph += 1;
  const body = JSON.parse(rawBody);
  record('graph-requests.ndjson', {
    path: request.url,
    authorization: request.headers.authorization,
    body,
  });

  if (failNext.graph) {
    failNext.graph = false;
    return json(response, 400, { error: { message: 'verify: forced Graph failure' } });
  }

  json(response, 200, {
    messaging_product: 'whatsapp',
    contacts: [{ input: body.to, wa_id: body.to }],
    messages: [{ id: `wamid.verify.${counts.graph}` }],
  });
}

function sse(response, event) {
  response.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
}

async function handleOpenAiResponses(request, response, rawBody) {
  counts.openai += 1;
  const body = JSON.parse(rawBody);
  record('openai-requests.ndjson', {
    path: request.url,
    authorization: request.headers.authorization,
    body: redactImages(body),
  });

  if (failNext.openai) {
    failNext.openai = false;
    return json(response, 500, { error: { message: 'verify: forced OpenAI failure' } });
  }

  const text = readFileSync(scanResultPath, 'utf8').trim();
  const baseResponse = {
    id: `resp_verify_${counts.openai}`,
    object: 'response',
    created_at: Math.floor(Date.now() / 1000),
    model: body.model,
    output: [],
    status: 'in_progress',
  };
  const message = {
    type: 'message',
    id: `msg_verify_${counts.openai}`,
    role: 'assistant',
    status: 'in_progress',
    content: [],
  };
  let sequence = 0;
  const next = (event) => sse(response, { ...event, sequence_number: sequence++ });

  response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
  next({ type: 'response.created', response: baseResponse });
  next({ type: 'response.output_item.added', output_index: 0, item: message });
  next({
    type: 'response.content_part.added',
    output_index: 0,
    content_index: 0,
    item_id: message.id,
    part: { type: 'output_text', text: '', annotations: [] },
  });

  for (let index = 0; index < text.length; index += 24) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    next({
      type: 'response.output_text.delta',
      output_index: 0,
      content_index: 0,
      item_id: message.id,
      delta: text.slice(index, index + 24),
    });
  }

  next({
    type: 'response.completed',
    response: {
      ...baseResponse,
      status: 'completed',
      output: [
        {
          ...message,
          status: 'completed',
          content: [{ type: 'output_text', text, annotations: [] }],
        },
      ],
    },
  });
  response.end();
}

const server = createServer(async (request, response) => {
  try {
    const rawBody = await readBody(request);
    const url = new URL(request.url, 'http://fakes');

    if (request.method === 'GET' && url.pathname === '/health') {
      return json(response, 200, { ok: true, pid: process.pid, counts });
    }
    if (request.method === 'POST' && url.pathname.startsWith('/__control/fail-next/')) {
      const target = url.pathname.split('/').pop();
      if (!(target in failNext)) return json(response, 404, { error: 'unknown target' });
      failNext[target] = true;
      return json(response, 200, { ok: true, failNext });
    }
    if (request.method === 'POST' && /^\/graph\/[^/]+\/[^/]+\/messages$/.test(url.pathname)) {
      return await handleGraph(request, response, rawBody);
    }
    if (request.method === 'POST' && url.pathname === '/openai/v1/responses') {
      return await handleOpenAiResponses(request, response, rawBody);
    }

    record('fakes-unhandled.ndjson', { method: request.method, path: request.url });
    json(response, 404, { error: `verify fakes: no handler for ${request.method} ${url.pathname}` });
  } catch (error) {
    record('fakes-unhandled.ndjson', { path: request.url, error: String(error) });
    if (!response.headersSent) json(response, 500, { error: String(error) });
    else response.end();
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`verify fakes listening on http://127.0.0.1:${port}`);
});
