// Render the home page's Zurich map from data/geo.json in the --map-* tokens of
// src/styles/global.css, with headless Chrome, into src/assets/citymap/.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = join(HERE, '../..');
const css = readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8');
const tok = (n) => css.match(new RegExp(`--map-${n}:\\s*([^;]+);`))[1].trim();
// How bright one street line is before overlaps add up. The whole layer's volume.
const ALPHA = 0.045;
const t = { ground: tok('ground'), wood: tok('wood'), lake: tok('lake'), road: tok('road'), street: tok('street'), alpha: ALPHA };

const server = createServer((req, res) => {
  const file = join(HERE, req.url.split('?')[0]);
  if (!['render.html', 'data/geo.json'].some((f) => file.endsWith(f))) return res.writeHead(404).end();
  res.end(readFileSync(file));
}).listen(8791);
const chromeBin = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chrome = spawn(chromeBin, ['--headless=new', '--remote-debugging-port=9391', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'citymap-'))}`, 'about:blank'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));
const page = (await (await fetch('http://127.0.0.1:9391/json')).json()).find((x) => x.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
await send('Page.navigate', { url: 'http://localhost:8791/render.html' });
await new Promise((r) => setTimeout(r, 1000));
const out = await send('Runtime.evaluate', { expression: `render(${JSON.stringify(t)})`, awaitPromise: true, returnByValue: true });
const { land, portrait } = out.result.result.value;
const save = (name, url) => writeFileSync(join(ROOT, 'src/assets/citymap', name), Buffer.from(url.split(',')[1], 'base64'));
save('zurich.webp', land);
save('zurich-portrait.webp', portrait);
console.log('rendered with', t);
ws.close(); chrome.kill(); server.close();
