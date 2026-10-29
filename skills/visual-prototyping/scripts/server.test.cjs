'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const start = path.join(__dirname, 'start-server.sh');

test('start rejects missing session argument with an actionable error', () => {
  const result = spawnSync('bash', [start], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--session-dir/);
});

const fs = require('node:fs');
const os = require('node:os');
const http = require('node:http');
const crypto = require('node:crypto');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const runtimeFor = session => path.join(os.tmpdir(), 'visual-prototyping-' + digest(os.homedir()), digest(fs.realpathSync(session)));

test('starts, serves a private preview, reuses and stops its own session', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'visual-prototype-test-'));
  const session = path.join(root, 'session with spaces');
  fs.mkdirSync(path.join(session, 'content', 'first'), { recursive: true });
  fs.writeFileSync(path.join(session, 'content', 'first', 'index.html'), '<h1>Example</h1>');
  fs.writeFileSync(path.join(session, 'content', 'manifest.json'), JSON.stringify({ version: 1, title: 'Example', alternatives: [{ id: 'first', title: 'First', entry: 'first/index.html' }] }));
  const stop = path.join(__dirname, 'stop-server.sh');
  const linkedSkill = path.join(root, 'linked skill');
  fs.symlinkSync(path.dirname(__dirname), linkedSkill, 'dir');
  let runtime = runtimeFor(session);
  try {
    const started = spawnSync('bash', [path.join(linkedSkill, 'scripts', 'start-server.sh'), '--session-dir', session], { encoding: 'utf8', timeout: 12000 });
    assert.equal(started.status, 0, started.stderr);
    const info = JSON.parse(started.stdout.trim());
    runtime = info.runtime_dir;
    assert.equal(info.type, 'started');
    assert.equal((await fetch(info.url)).status, 200);
    assert.equal((await fetch(`http://127.0.0.1:${info.port}/`)).status, 403);
    assert.equal((await fetch(info.url + 'content/first/index.html')).status, 200);
    assert.equal((await fetch(info.url + 'catalog')).status, 200);
    assert.equal((await fetch(info.url, { headers: { Origin: 'https://example.invalid' } })).status, 403);
    assert.equal((await fetch(info.url, { method: 'POST' })).status, 405);
    fs.symlinkSync('/etc/passwd', path.join(session, 'content', 'first', 'link'));
    assert.equal((await fetch(info.url + 'content/first/link')).status, 403);
    fs.linkSync(path.join(session, 'content', 'first', 'index.html'), path.join(session, 'content', 'first', 'hardlink'));
    assert.equal((await fetch(info.url + 'content/first/hardlink')).status, 403);
    fs.unlinkSync(path.join(session, 'content', 'first', 'hardlink'));
    assert.equal((await fetch(info.url + 'content/first/%2e%2fmanifest.json')).status, 400);
    const hostStatus = await new Promise((resolve, reject) => { http.get(info.url, { headers: { Host: 'evil.example' } }, response => { response.resume(); resolve(response.statusCode); }).on('error', reject); });
    assert.equal(hostStatus, 403);
    const events = await fetch(info.url + 'events');
    const reader = events.body.getReader();
    await reader.read();
    fs.writeFileSync(path.join(session, 'content', 'first', 'index.html'), '<h1>Changed</h1>');
    const changed = await Promise.race([reader.read(), new Promise((_, reject) => setTimeout(() => reject(Error('No change notification')), 3000))]);
    assert.match(new TextDecoder().decode(changed.value), /first\/index.html/);
    fs.writeFileSync(path.join(session, 'content', 'first', 'new.css'), 'body{}');
    const created = await reader.read();
    assert.match(new TextDecoder().decode(created.value), /first\/new.css/);
    fs.unlinkSync(path.join(session, 'content', 'first', 'new.css'));
    const removed = await reader.read();
    assert.match(new TextDecoder().decode(removed.value), /first\/new.css/);
    await reader.cancel();
    fs.writeFileSync(path.join(session, 'content', 'manifest.json'), '{');
    await new Promise(resolve => setTimeout(resolve, 900));
    const invalid = await (await fetch(info.url + 'catalog')).json();
    assert.ok(invalid.error);
    assert.equal(invalid.catalog.alternatives[0].id, 'first');
    fs.writeFileSync(path.join(session, 'content', 'manifest.json'), JSON.stringify({ version: 1, title: 'Recovered', alternatives: [] }));
    await new Promise(resolve => setTimeout(resolve, 900));
    const recovered = await (await fetch(info.url + 'catalog')).json();
    assert.equal(recovered.error, null);
    assert.equal(recovered.catalog.title, 'Recovered');
    const reused = spawnSync('bash', [start, '--session-dir', session], { encoding: 'utf8', timeout: 12000 });
    assert.equal(reused.status, 0, reused.stderr);
    assert.equal(JSON.parse(reused.stdout.trim()).pid, info.pid);
    const infoPath = path.join(runtime, 'server-info.json');
    fs.unlinkSync(infoPath);
    fs.utimesSync(path.join(runtime, 'lock'), new Date(0), new Date(0));
    const ambiguous = spawnSync('bash', [start, '--session-dir', session], { encoding: 'utf8', timeout: 12000 });
    assert.notEqual(ambiguous.status, 0);
    assert.match(ambiguous.stderr, /active|progress/i);
    fs.writeFileSync(infoPath, JSON.stringify(info), { mode: 0o600 });
    const socket = require('node:net').createConnection(info.port, '127.0.0.1');
    await new Promise((resolve, reject) => { socket.once('connect', resolve); socket.once('error', reject); });
    socket.write('GET / HTTP/1.1\r\nHost: 127.0.0.1\r\n');
    const stopped = spawnSync('bash', [stop, session], { encoding: 'utf8', timeout: 12000 });
    socket.destroy();
    assert.equal(stopped.status, 0, stopped.stderr);
    assert.equal(fs.existsSync(path.join(runtime, 'lock')), false);
    fs.writeFileSync(path.join(runtime, 'server-info.json'), JSON.stringify({ pid: process.pid, instance_id: '0123456789abcdef0123456789abcdef' }), { mode: 0o600 });
    const foreign = spawnSync('bash', [stop, session], { encoding: 'utf8', timeout: 12000 });
    assert.equal(foreign.status, 0, foreign.stderr);
    assert.match(foreign.stderr, /identity|stale/i);
    assert.doesNotThrow(() => process.kill(process.pid, 0));
  } finally {
    spawnSync('bash', [stop, session], { timeout: 12000 });
    fs.rmSync(root, { recursive: true, force: true });
    if (runtime) fs.rmSync(runtime, { recursive: true, force: true });
  }
});

test('foreground emits a ready record and stops on SIGTERM', async () => {
  const { spawn } = require('node:child_process');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'visual-foreground-test-'));
  fs.mkdirSync(path.join(root, 'content'));
  fs.writeFileSync(path.join(root, 'content', 'manifest.json'), JSON.stringify({ version: 1, title: 'Empty', alternatives: [] }));
  const child = spawn('bash', [start, '--session-dir', root, '--foreground'], { stdio: ['ignore', 'pipe', 'pipe'] });
  let runtime = runtimeFor(root);
  try {
    const output = await Promise.race([
      new Promise((resolve, reject) => { child.stdout.once('data', b => resolve(b.toString())); child.once('exit', () => reject(Error('Foreground exited before readiness'))); }),
      new Promise((_, reject) => setTimeout(() => reject(Error('Foreground readiness timed out')), 10000))
    ]);
    const info = JSON.parse(output.trim());
    runtime = info.runtime_dir;
    assert.equal((await fetch(info.url + 'health')).status, 200);
    child.kill('SIGTERM');
    await Promise.race([new Promise(resolve => child.once('exit', resolve)), new Promise((_, reject) => setTimeout(() => reject(Error('Foreground did not exit')), 8000))]);
    assert.equal(fs.existsSync(path.join(runtime, 'server-info.json')), false);
  } finally {
    if (child.exitCode === null) child.kill('SIGTERM');
    fs.rmSync(root, { recursive: true, force: true });
    if (runtime) fs.rmSync(runtime, { recursive: true, force: true });
  }
});

test('restarts on a new port without disturbing its occupant', async () => {
  const net = require('node:net');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'visual-port-test-'));
  fs.mkdirSync(path.join(root, 'content'));
  fs.writeFileSync(path.join(root, 'content', 'manifest.json'), JSON.stringify({ version: 1, title: 'Empty', alternatives: [] }));
  const stop = path.join(__dirname, 'stop-server.sh');
  let runtime = runtimeFor(root), occupant;
  try {
    const first = spawnSync('bash', [start, '--session-dir', root], { encoding: 'utf8', timeout: 12000 });
    assert.equal(first.status, 0, first.stderr);
    const info = JSON.parse(first.stdout.trim()); runtime = info.runtime_dir;
    assert.equal(spawnSync('bash', [stop, root], { timeout: 12000 }).status, 0);
    occupant = net.createServer(socket => socket.destroy());
    await new Promise((resolve, reject) => { occupant.once('error', reject); occupant.listen(info.port, '127.0.0.1', resolve); });
    const second = spawnSync('bash', [start, '--session-dir', root], { encoding: 'utf8', timeout: 12000 });
    assert.equal(second.status, 0, second.stderr);
    const next = JSON.parse(second.stdout.trim());
    assert.notEqual(next.port, info.port);
    assert.match(second.stderr, /port/i);
    assert.equal(occupant.listening, true);
    assert.equal((await fetch(next.url)).status, 200);
  } finally {
    spawnSync('bash', [stop, root], { timeout: 12000 });
    if (occupant) await new Promise(resolve => occupant.close(resolve));
    fs.rmSync(root, { recursive: true, force: true });
    if (runtime) fs.rmSync(runtime, { recursive: true, force: true });
  }
});


test('rejects temporary runtime inside the project', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'visual-isolation-test-'));
  const session = path.join(root, '.development', 'prototypes', 'one');
  const tmp = path.join(root, 'temp');
  fs.mkdirSync(path.join(session, 'content'), { recursive: true });
  fs.mkdirSync(tmp);
  fs.writeFileSync(path.join(session, 'content', 'manifest.json'), JSON.stringify({ version: 1, title: 'Empty', alternatives: [] }));
  try {
    const result = spawnSync('bash', [start, '--session-dir', session], { encoding: 'utf8', env: { ...process.env, TMPDIR: tmp } });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /TMPDIR|project/i);
    assert.deepEqual(fs.readdirSync(tmp), []);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('concurrent starts cannot create two instances', async () => {
  const { spawn } = require('node:child_process');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'visual-concurrent-test-'));
  fs.mkdirSync(path.join(root, 'content'));
  fs.writeFileSync(path.join(root, 'content', 'manifest.json'), JSON.stringify({ version: 1, title: 'Empty', alternatives: [] }));
  const stop = path.join(__dirname, 'stop-server.sh');
  function launch() {
    return new Promise((resolve, reject) => {
      const child = spawn('bash', [start, '--session-dir', root]);
      let stdout = '', stderr = '';
      child.stdout.on('data', b => { stdout += b; }); child.stderr.on('data', b => { stderr += b; });
      child.on('error', reject); child.on('exit', status => resolve({ status, stdout, stderr }));
    });
  }
  let runtime = runtimeFor(root);
  try {
    const results = await Promise.all([launch(), launch()]);
    const successful = results.filter(r => r.status === 0).map(r => JSON.parse(r.stdout.trim()));
    assert.ok(successful.length >= 1);
    assert.equal(new Set(successful.map(info => info.pid)).size, 1);
    for (const result of results.filter(r => r.status !== 0)) assert.match(result.stderr, /progress/i);
    runtime = successful[0].runtime_dir;
  } finally {
    spawnSync('bash', [stop, root], { timeout: 12000 });
    fs.rmSync(root, { recursive: true, force: true });
    if (runtime) fs.rmSync(runtime, { recursive: true, force: true });
  }
});
