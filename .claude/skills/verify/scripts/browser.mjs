#!/usr/bin/env node
import { appendFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { chromium } from '@playwright/test';

const USAGE = `usage: browser.mjs <command> [args]

  goto <path>                         open <base url><path>
  click   <target>                    click an element
  fill    <target> --value <text>     replace the value of a textbox
  check | uncheck <target>            set a checkbox
  upload  <target> --file <path>      set files on a file input
  press   --key <key>                 press a key on the focused element
  expect  <target> [--gone]           wait until the target is visible (or gone)
  screenshot <name> [--full]          save evidence/screenshots/NN-<name>.png
  aria <name>                         save evidence/aria/NN-<name>.txt and print it
  viewport <width> <height>           resize the page
  storage                             print localStorage as JSON
  url                                 print the current URL

  <target> is one of:
    --role <role> --name <accessible name> [--exact]
    --label <label text> [--exact]
    --text <visible text> [--exact]
  plus optional --nth <index> and --timeout <ms> (default 10000)`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    role: { type: 'string' },
    name: { type: 'string' },
    label: { type: 'string' },
    text: { type: 'string' },
    exact: { type: 'boolean', default: false },
    nth: { type: 'string' },
    value: { type: 'string' },
    file: { type: 'string' },
    key: { type: 'string' },
    gone: { type: 'boolean', default: false },
    full: { type: 'boolean', default: false },
    timeout: { type: 'string', default: '10000' },
  },
});

const [command, ...rest] = positionals;
if (!command) {
  console.error(USAGE);
  process.exit(2);
}

const runDir = path.resolve(import.meta.dirname, '..', '..', '..', '..', '.verify', 'run');
const state = JSON.parse(readFileSync(path.join(runDir, 'state.json'), 'utf8'));
const timeout = Number(values.timeout);

function nextArtifactPath(subdir, name, extension) {
  const dir = path.join(state.evidenceDir, subdir);
  mkdirSync(dir, { recursive: true });
  const index = String(readdirSync(dir).length + 1).padStart(2, '0');
  return path.join(dir, `${index}-${name}.${extension}`);
}

function locate(page) {
  let locator;
  if (values.role) locator = page.getByRole(values.role, { name: values.name, exact: values.exact });
  else if (values.label) locator = page.getByLabel(values.label, { exact: values.exact });
  else if (values.text) locator = page.getByText(values.text, { exact: values.exact });
  else throw new Error(`"${command}" needs a target: --role/--name, --label or --text.`);
  return values.nth === undefined ? locator : locator.nth(Number(values.nth));
}

const browser = await chromium.connectOverCDP(`http://127.0.0.1:${state.cdpPort}`);
const [context] = browser.contexts();
const page = context.pages()[0] ?? (await context.newPage());
page.setDefaultTimeout(timeout);

const commands = {
  goto: async () => {
    await page.goto(new URL(rest[0] ?? '/', state.baseUrl).href, { waitUntil: 'load' });
    return page.url();
  },
  click: () => locate(page).click(),
  fill: () => locate(page).fill(values.value ?? ''),
  check: () => locate(page).check(),
  uncheck: () => locate(page).uncheck(),
  upload: () => locate(page).setInputFiles(path.resolve(values.file)),
  press: () => page.keyboard.press(values.key),
  expect: () => locate(page).waitFor({ state: values.gone ? 'hidden' : 'visible', timeout }),
  screenshot: async () => {
    const file = nextArtifactPath('screenshots', rest[0] ?? 'page', 'png');
    await page.screenshot({ path: file, fullPage: values.full });
    return file;
  },
  aria: async () => {
    const file = nextArtifactPath('aria', rest[0] ?? 'page', 'txt');
    const snapshot = await page.locator('body').ariaSnapshot();
    writeFileSync(file, `# ${page.url()}\n${snapshot}\n`);
    return `${file}\n${snapshot}`;
  },
  viewport: () => page.setViewportSize({ width: Number(rest[0]), height: Number(rest[1]) }),
  storage: () => page.evaluate(() => JSON.stringify({ ...localStorage }, null, 2)),
  url: () => page.url(),
};

if (!(command in commands)) {
  console.error(`unknown command "${command}"\n\n${USAGE}`);
  process.exit(2);
}

let exitCode = 0;
try {
  const output = await commands[command]();
  if (typeof output === 'string') console.log(output);
  appendFileSync(
    path.join(state.evidenceDir, 'actions.ndjson'),
    `${JSON.stringify({ at: new Date().toISOString(), command, args: rest, ...values, url: page.url(), ok: true })}\n`,
  );
} catch (error) {
  exitCode = 1;
  console.error(`FAILED ${command}: ${error.message.split('\n')[0]}`);
  appendFileSync(
    path.join(state.evidenceDir, 'actions.ndjson'),
    `${JSON.stringify({ at: new Date().toISOString(), command, args: rest, ...values, url: page.url(), ok: false, error: error.message.split('\n')[0] })}\n`,
  );
} finally {
  await browser.close();
}
process.exit(exitCode);
