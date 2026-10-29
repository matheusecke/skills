'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const http = require('node:http');
const cp = require('node:child_process');

process.umask(0o077);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const within = (root, p) => p === root || p.startsWith(root + path.sep);
function atomic(file, data) {
  const temp = file + '.' + crypto.randomBytes(8).toString('hex');
  fs.writeFileSync(temp, data, { mode: 0o600, flag: 'wx' });
  fs.renameSync(temp, file);
}
function privateDir(p) {
  try { fs.mkdirSync(p, { mode: 0o700 }); } catch (e) { if (e.code !== 'EEXIST') throw e; }
  const st = fs.lstatSync(p);
  if (!st.isDirectory() || st.isSymbolicLink() || (process.getuid && st.uid !== process.getuid()) || (st.mode & 0o077)) throw Error('Runtime directory is not private or owned by the current user; use an external private TMPDIR.');
}
function state(sessionArg, create) {
  const session = fs.realpathSync(sessionArg);
  if (!fs.statSync(session).isDirectory()) throw Error('Session must be a directory.');
  const tmp = fs.realpathSync(os.tmpdir());
  const git = cp.spawnSync('git', ['-C', session, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  const marker = `${path.sep}.development${path.sep}prototypes${path.sep}`;
  const markerAt = session.lastIndexOf(marker);
  const project = git.status === 0 ? fs.realpathSync(git.stdout.trim()) : markerAt > 0 ? session.slice(0, markerAt) : session;
  if (within(project, tmp) || within(session, tmp)) throw Error('TMPDIR is inside the project; select an external private temporary directory.');
  const root = path.join(tmp, 'visual-prototyping-' + hash(os.homedir()));
  const runtime = path.join(root, hash(session));
  if (within(project, runtime) || within(session, runtime)) throw Error('Runtime would be inside the project; select an external private temporary directory.');
  if (create) { privateDir(root); privateDir(runtime); }
  else if (fs.existsSync(runtime)) { privateDir(root); privateDir(runtime); }
  return { session, content: path.join(session, 'content'), runtime };
}
function privateFile(p) {
  const st = fs.lstatSync(p);
  if (!st.isFile() || st.isSymbolicLink() || st.nlink !== 1 || (process.getuid && st.uid !== process.getuid()) || (st.mode & 0o077)) throw Error('Unsafe private runtime file.');
}
function readJson(p) {
  try { privateFile(p); return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { if (e.code === 'ENOENT' || e instanceof SyntaxError) return null; throw e; }
}
function identity(info) {
  if (!info || !Number.isSafeInteger(info.pid) || info.pid <= 0 || !/^[a-f0-9]{32}$/.test(info.instance_id || '')) return false;
  try {
    let args;
    if (process.platform === 'linux') args = fs.readFileSync(`/proc/${info.pid}/cmdline`, 'utf8').split('\0');
    else args = cp.execFileSync('ps', ['-p', String(info.pid), '-o', 'command='], { encoding: 'utf8' }).trim().split(/\s+/);
    return args.includes(info.instance_id) && args.some(x => x.endsWith('server.cjs'));
  } catch { return false; }
}
function regular(root, rel) {
  if (!rel || rel.includes('\0') || rel.includes('\\') || path.isAbsolute(rel)) throw Error('Invalid path');
  const parts = rel.split('/');
  if (parts.some(p => !p || p === '.' || p === '..' || p.startsWith('.'))) throw Error('Invalid path');
  const rootStat = fs.lstatSync(root);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) throw Error('Content directory denied');
  let p = root;
  for (const part of parts) {
    p = path.join(p, part);
    const st = fs.lstatSync(p);
    if (st.isSymbolicLink()) throw Error('Link denied');
  }
  const st = fs.statSync(p);
  if (!st.isFile() || st.nlink !== 1 || !within(fs.realpathSync(root), fs.realpathSync(p))) throw Error('File denied');
  return p;
}
function manifest(content) {
  const data = JSON.parse(fs.readFileSync(regular(content, 'manifest.json'), 'utf8'));
  if (data.version !== 1 || typeof data.title !== 'string' || !Array.isArray(data.alternatives)) throw Error('Invalid manifest');
  const ids = new Set();
  for (const a of data.alternatives) {
    if (!a || typeof a.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.id) || ids.has(a.id) || typeof a.title !== 'string' || typeof a.entry !== 'string' || !a.entry.startsWith(a.id + '/') || !/\.html?$/i.test(a.entry)) throw Error('Invalid alternative');
    regular(content, a.entry);
    ids.add(a.id);
  }
  return data;
}
async function healthy(info) {
  if (!identity(info) || typeof info.url !== 'string') return false;
  try { const r = await fetch(info.url + 'health', { signal: AbortSignal.timeout(1000) }); return r.ok && (await r.text()) === info.instance_id; } catch { return false; }
}
async function start(s, foreground) {
  const infoPath = path.join(s.runtime, 'server-info.json');
  const lock = path.join(s.runtime, 'lock');
  const old = readJson(infoPath);
  let previousPort = 0;
  try { const file = path.join(s.runtime, 'port'); privateFile(file); previousPort = Number(fs.readFileSync(file, 'utf8')) || 0; } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (await healthy(old)) { const result = { ...old, type: 'reused' }; atomic(infoPath, JSON.stringify(result)); console.log(JSON.stringify(result)); return; }
  try { fs.mkdirSync(lock, { mode: 0o700 }); }
  catch (e) {
    if (e.code !== 'EEXIST') throw e;
    const st = fs.lstatSync(lock);
    if (!st.isDirectory() || st.isSymbolicLink() || (process.getuid && st.uid !== process.getuid()) || (st.mode & 0o077)) throw Error('Unsafe runtime lock.');
    const ownerPath = path.join(lock, 'owner.json');
    const owner = readJson(ownerPath);
    if (Date.now() - st.mtimeMs < 10000 || identity(old) || identity(owner)) throw Error('Initialization in progress or instance identity remains active; retry later.');
    if (owner) fs.unlinkSync(ownerPath);
    fs.rmdirSync(lock);
    fs.mkdirSync(lock, { mode: 0o700 });
  }
  let instance = crypto.randomBytes(16).toString('hex');
  try {
    manifest(s.content);
    let token;
    const tokenPath = path.join(s.runtime, 'token');
    try { const st = fs.lstatSync(tokenPath); if (!st.isFile() || st.isSymbolicLink() || st.nlink !== 1 || (st.mode & 0o077) || (process.getuid && st.uid !== process.getuid())) throw Error('Unsafe token'); token = fs.readFileSync(tokenPath, 'utf8'); if (!/^[a-f0-9]{64}$/.test(token)) throw Error('Invalid token'); }
    catch (e) { if (e.code !== 'ENOENT') throw e; token = crypto.randomBytes(32).toString('hex'); atomic(tokenPath, token); }
    if (foreground) {
      const child = cp.spawn(process.execPath, [__filename, 'serve', s.session, instance], { stdio: 'inherit', env: { ...process.env, VISUAL_PREVIEW_FOREGROUND: '1' } });
      atomic(path.join(lock, 'owner.json'), JSON.stringify({ pid: child.pid, instance_id: instance }));
      for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { if (identity({ pid: child.pid, instance_id: instance })) child.kill(signal); });
      const result = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', (code, signal) => resolve(code === null ? 1 : code)); });
      if (result) throw Error('Foreground preview failed.');
      return;
    }
    const logPath = path.join(s.runtime, 'server.log');
    try { privateFile(logPath); } catch (e) { if (e.code !== 'ENOENT') throw e; }
    const log = fs.openSync(logPath, fs.constants.O_WRONLY | fs.constants.O_APPEND | fs.constants.O_CREAT | (fs.constants.O_NOFOLLOW || 0), 0o600);
    const child = cp.spawn(process.execPath, [__filename, 'serve', s.session, instance], { detached: true, stdio: ['ignore', log, log] });
    fs.closeSync(log);
    atomic(path.join(lock, 'owner.json'), JSON.stringify({ pid: child.pid, instance_id: instance }));
    child.unref();
    const deadline = Date.now() + 9000;
    while (Date.now() < deadline) {
      await sleep(100);
      const info = readJson(infoPath);
      if (info && info.instance_id === instance && await healthy(info)) { if (previousPort && previousPort !== info.port) console.error('Previous port is occupied; navigate the old tab to the new URL.'); console.log(JSON.stringify(info)); return; }
      if (child.exitCode !== null) break;
    }
    if (identity({ pid: child.pid, instance_id: instance })) process.kill(child.pid, 'SIGTERM');
    throw Error('Server did not become ready within 10 seconds; inspect the private runtime log.');
  } catch (e) { try { const ownerPath = path.join(lock, 'owner.json'); const owner = readJson(ownerPath); if (owner && owner.instance_id === instance && !identity(owner)) fs.unlinkSync(ownerPath); fs.rmdirSync(lock); } catch {} throw e; }
}
async function stop(s) {
  const infoPath = path.join(s.runtime, 'server-info.json');
  const info = readJson(infoPath) || readJson(path.join(s.runtime, 'lock', 'owner.json'));
  if (!info) { console.error('No identifiable active instance; nothing signalled.'); return; }
  if (!identity(info)) { console.error('Instance is stale or identity cannot be verified; nothing signalled.'); return; }
  process.kill(info.pid, 'SIGTERM');
  for (let i = 0; i < 50 && identity(info); i++) await sleep(100);
  if (identity(info)) process.kill(info.pid, 'SIGKILL');
}
function snapshot(root) {
  const result = {};
  function walk(dir, prefix) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name.endsWith('~') || entry.name.endsWith('.tmp') || entry.isSymbolicLink()) continue;
      const rel = prefix ? prefix + '/' + entry.name : entry.name;
      const file = path.join(dir, entry.name);
      const st = fs.lstatSync(file);
      if (st.isDirectory()) walk(file, rel);
      else if (st.isFile() && st.nlink === 1) result[rel] = `${st.size}:${st.mtimeMs}:${st.ino}`;
    }
  }
  walk(root, ''); return result;
}
function openBrowser(url) {
  const graphical = Boolean(process.env.DISPLAY || process.env.WAYLAND_DISPLAY);
  const wsl = /microsoft/i.test(os.release());
  const candidates = process.platform === 'darwin' ? [['open', [url]]] : wsl ? [['rundll32.exe', ['url.dll,FileProtocolHandler', url]], ...(graphical ? [['xdg-open', [url]]] : [])] : graphical ? [['xdg-open', [url]]] : [];
  function attempt(index) {
    if (index >= candidates.length) { console.error('Browser opening unavailable; use the URL manually.'); return; }
    const [command, args] = candidates[index];
    const child = cp.spawn(command, args, { stdio: 'ignore' });
    let settled = false;
    const finish = success => { if (settled) return; settled = true; clearTimeout(timer); if (!success) attempt(index + 1); };
    const timer = setTimeout(() => { try { child.kill(); } catch {} finish(false); }, 3000);
    timer.unref(); child.on('error', () => finish(false)); child.on('exit', code => finish(code === 0)); child.unref();
  }
  attempt(0);
}

async function serve(s, instance, token, old) {
  const lock = path.join(s.runtime, 'lock');
  const infoPath = path.join(s.runtime, 'server-info.json');
  let current = manifest(s.content), manifestError = null;
  let revision = instance + ':0', count = 0, clients = new Set(), activity = Date.now(), previous = snapshot(s.content), pending = new Set(), debounce, contentUnavailable = false;
  const templatePath = path.join(__dirname, '../assets/preview-template.html');
  let templateMtime = fs.statSync(templatePath).mtimeMs;
  let boundPort;
  const server = http.createServer((req, res) => {
    const origin = `http://127.0.0.1:${boundPort}`;
    const baseHeaders = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'SAMEORIGIN' };
    function reply(status, body, headers = {}) { res.writeHead(status, { ...baseHeaders, ...headers }); res.end(req.method === 'HEAD' ? undefined : body); }
    if (req.headers.host !== `127.0.0.1:${boundPort}` || (req.headers.origin && req.headers.origin !== origin)) return reply(403, 'Forbidden');
    if (req.method !== 'GET' && req.method !== 'HEAD') return reply(405, 'Method not allowed', { Allow: 'GET, HEAD' });
    let url;
    try { url = new URL(req.url, origin); } catch { return reply(400, 'Bad request'); }
    const raw = req.url.split('?')[0];
    let decoded;
    try { decoded = decodeURIComponent(raw); } catch { return reply(400, 'Bad request'); }
    if (decoded.includes('\0') || decoded.includes('\\') || decoded.split('/').some(p => p === '..' || p === '.')) return reply(400, 'Bad request');
    const prefix = '/' + token + '/';
    if (!decoded.startsWith(prefix)) return reply(403, 'Forbidden');
    const route = decoded.slice(prefix.length);
    if (route === 'health') return reply(200, instance, { 'Content-Type': 'text/plain; charset=utf-8' });
    activity = Date.now();
    if (route === 'events') {
      if (req.method !== 'GET') return reply(405, 'Method not allowed');
      res.writeHead(200, { ...baseHeaders, 'Content-Type': 'text/event-stream', Connection: 'keep-alive' });
      res.write(`data: ${JSON.stringify({ revision, paths: [] })}\n\n`);
      clients.add(res); req.on('close', () => clients.delete(res)); return;
    }
    if (route === 'catalog') return reply(200, JSON.stringify({ catalog: current, error: manifestError }), { 'Content-Type': 'application/json; charset=utf-8' });
    if (route === '') {
      const csp = `default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src ${origin}; frame-src ${origin}; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`;
      return reply(200, fs.readFileSync(templatePath), { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': csp });
    }
    if (!route.startsWith('content/')) return reply(404, 'Not found');
    try {
      const file = regular(s.content, route.slice(8));
      const ext = path.extname(file).toLowerCase();
      const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.woff': 'font/woff', '.woff2': 'font/woff2' };
      const csp = `default-src 'none'; script-src 'unsafe-inline' ${origin}; style-src 'unsafe-inline' ${origin}; img-src ${origin} data:; font-src ${origin} data:; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors ${origin}`;
      return reply(200, fs.readFileSync(file), { 'Content-Type': types[ext] || 'application/octet-stream', 'Content-Security-Policy': csp });
    } catch (e) { return reply(e.code === 'ENOENT' ? 404 : 403, 'Not found or denied'); }
  });
  const poll = setInterval(() => {
    try {
      const nextTemplateMtime = fs.statSync(templatePath).mtimeMs;
      if (templateMtime !== nextTemplateMtime) { templateMtime = nextTemplateMtime; revision = instance + ':' + ++count; for (const client of clients) client.write(`data: ${JSON.stringify({ revision, paths: ['@template'] })}\n\n`); }
      const next = snapshot(s.content);
      if (contentUnavailable) { contentUnavailable = false; pending.add('manifest.json'); }
      for (const key of new Set([...Object.keys(previous), ...Object.keys(next)])) if (previous[key] !== next[key]) pending.add(key);
      previous = next;
      if (pending.size) {
        activity = Date.now(); clearTimeout(debounce);
        debounce = setTimeout(() => {
          const paths = [...pending]; pending.clear();
          try { current = manifest(s.content); manifestError = null; } catch { manifestError = 'Catalog is invalid or a referenced file is unavailable. Correct it to recover.'; }
          revision = instance + ':' + ++count;
          for (const client of clients) client.write(`data: ${JSON.stringify({ revision, paths })}\n\n`);
        }, 150);
      }
    } catch { if (!contentUnavailable) { contentUnavailable = true; manifestError = 'Content is unavailable. Correct it to recover.'; revision = instance + ':' + ++count; for (const client of clients) client.write(`data: ${JSON.stringify({ revision, paths: ['manifest.json'] })}\n\n`); } }
    if (!clients.size && Date.now() - activity > 4 * 60 * 60 * 1000) shutdown();
  }, 500);
  const heartbeat = setInterval(() => { for (const client of clients) client.write(': heartbeat\n\n'); }, 15000);
  let shutting = false;
  function shutdown() {
    if (shutting) return; shutting = true;
    clearInterval(poll); clearInterval(heartbeat); clearTimeout(debounce);
    for (const client of clients) client.end();
    server.close(() => { const info = readJson(infoPath); if (info && info.instance_id === instance) { try { fs.unlinkSync(infoPath); } catch {} } try { const ownerPath = path.join(lock, 'owner.json'); const owner = readJson(ownerPath); if (owner && owner.instance_id === instance) { fs.unlinkSync(ownerPath); fs.rmdirSync(lock); } } catch {} process.exit(0); });
    server.closeAllConnections();
  }
  process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
  const portFile = path.join(s.runtime, 'port');
  let oldPort = 0;
  try { privateFile(portFile); oldPort = Number(fs.readFileSync(portFile, 'utf8')) || 0; } catch (e) { if (e.code !== 'ENOENT') throw e; }
  async function listen(port) { return new Promise((resolve, reject) => { const fail = e => { server.removeListener('listening', ok); reject(e); }; const ok = () => { server.removeListener('error', fail); resolve(); }; server.once('error', fail); server.once('listening', ok); server.listen(port, '127.0.0.1'); }); }
  try { await listen(oldPort); } catch (e) { if (e.code !== 'EADDRINUSE' || !oldPort) throw e; await listen(0); }
  const port = server.address().port;
  boundPort = port;
  atomic(portFile, String(port));
  const info = { type: 'started', session_dir: s.session, content_dir: s.content, pid: process.pid, instance_id: instance, port, url: `http://127.0.0.1:${port}/${token}/`, runtime_dir: s.runtime };
  const deadline = Date.now() + 7000;
  while (!(await healthy(info))) { if (Date.now() >= deadline) throw Error('HTTP readiness check failed.'); await sleep(100); }
  atomic(infoPath, JSON.stringify(info));
  if (oldPort && oldPort !== port) console.error('Previous port is occupied; navigate the old tab to the new URL.');
  if (process.env.VISUAL_PREVIEW_FOREGROUND === '1') console.log(JSON.stringify(info));
  openBrowser(info.url);
}
async function main() {
  const [action, session, option] = process.argv.slice(2);
  if (!session) throw Error('Session directory is required.');
  const s = state(session, action !== 'stop');
  if (action === 'start') await start(s, option === '--foreground');
  else if (action === 'stop') await stop(s);
  else if (action === 'serve') { const token = fs.readFileSync(path.join(s.runtime, 'token'), 'utf8'); await serve(s, option, token, readJson(path.join(s.runtime, 'server-info.json'))); }
  else throw Error('Unknown action.');
}
main().catch(e => { console.error(e.message); process.exit(1); });
