// End-to-end smoke of the running stack. It talks to the web origin (default :8080), so it
// exercises the real path a browser takes: static files served by nginx and /api/v1 reverse-
// proxied to the api container. Point SMOKE_URL at the dev server (:5173) to run it there.
//
//   docker compose up -d --build && npm run smoke

const BASE = process.env.SMOKE_URL ?? 'http://localhost:8080';
const STATES = ['COLD', 'WARM', 'HOT'];

let failures = 0;
function check(name, ok, detail) {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

async function getJson(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

try {
  // The shell is served, and the entry script it references actually resolves (so the page is
  // not a blank mount). Works for the built bundle (/assets/*.js) and the dev module (/src).
  const shellRes = await fetch(`${BASE}/`);
  const shell = await shellRes.text();
  check('serves the app shell', shellRes.ok && /id="root"/.test(shell));

  const scriptSrc = shell.match(/<script[^>]+src="([^"]+)"/)?.[1];
  const scriptRes = scriptSrc ? await fetch(`${BASE}${scriptSrc}`) : undefined;
  check(
    'serves the entry script',
    !!scriptRes && scriptRes.ok && /javascript/.test(scriptRes.headers.get('content-type') ?? ''),
    scriptSrc ?? 'no script referenced',
  );

  // The API is reachable through the proxy.
  const reading = await getJson('/api/v1/temperature');
  check(
    'proxies GET /api/v1/temperature',
    typeof reading.temperature === 'number' && STATES.includes(reading.state),
    JSON.stringify(reading),
  );
  check(
    'proxies GET /api/v1/temperature/history',
    Array.isArray(await getJson('/api/v1/temperature/history')),
  );

  // The write path round-trips; restore the previous thresholds so a running demo is untouched.
  const original = await getJson('/api/v1/thresholds');
  const put = await fetch(`${BASE}/api/v1/thresholds`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coldMax: 18, hotMin: 30 }),
  });
  const written = put.ok ? await put.json() : {};
  check(
    'PUT /api/v1/thresholds returns the saved values',
    written.coldMax === 18 && written.hotMin === 30,
    JSON.stringify(written),
  );
  const reread = await getJson('/api/v1/thresholds');
  check('GET reflects the saved thresholds', reread.coldMax === 18 && reread.hotMin === 30);

  await fetch(`${BASE}/api/v1/thresholds`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(original),
  });
} catch (error) {
  console.error(`\ncould not reach the stack at ${BASE}: ${error.message}`);
  process.exit(1);
}

console.log(failures ? `\n${failures} check(s) failed` : '\nall smoke checks passed');
process.exit(failures ? 1 : 0);
