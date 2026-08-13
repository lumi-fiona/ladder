#!/usr/bin/env node
/**
 * The board's answer desk — the only part of it that needs a server.
 *
 *   node docs/quality/serve.mjs        then open the address it prints
 *
 * The board itself opens from disk with nothing running, and that promise is not being traded away
 * here: everything still renders from a file:// URL. Two things need a process, and both of them are
 * things a page opened from a file may not do — write an answer back into questions.js, and ask git
 * anything. Node's own http, no dependencies, like everything else here.
 *
 * LOOPBACK ONLY. This writes to disk when asked, so the machine it runs on is the only place that may
 * ask. Never 0.0.0.0, never a LAN address, no matter how convenient a phone would be.
 */
import { createServer } from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { answerIn } from './questions.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const QFILE = join(here, 'questions.js');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
// An answer is a sentence, not a document. The cap is on the BODY as it arrives, not on the parsed
// value — a refusal that has to buffer the whole thing first is not a refusal.
const MAX_BODY = 8 * 1024;

const server = createServer((req, res) => {
  const send = (code, body, type = 'application/json') => {
    res.writeHead(code, { 'content-type': type });
    res.end(body);
  };
  if (req.method === 'POST' && req.url === '/answer') {
    /**
     * Insist on a JSON content type, which is a security check rather than pedantry: any page open in
     * the same browser can POST a form or a text/plain body to a loopback port with no permission
     * asked, and this one writes a file. Requiring application/json forces the browser to ask
     * permission first (a preflight OPTIONS), which the 405 below refuses. Nothing legitimate here
     * sends anything else — the page's own fetch sets it.
     */
    if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) {
      return send(415, JSON.stringify({ error: 'answers are sent as JSON' }));
    }
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY) {
        send(413, JSON.stringify({ error: 'an answer is a sentence, not a document' }));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (res.writableEnded) return; // already refused above
      try {
        const { id, answer } = JSON.parse(body);
        const out = answerIn(readFileSync(QFILE, 'utf8'), id, answer);
        if (out.error) return send(out.code, JSON.stringify({ error: out.error }));
        // tmp + rename, like every other store in this family: a crash halfway through a write must
        // not leave the board unreadable, and questions.js is loaded by a <script> tag that would
        // simply blank the tab if it were truncated.
        writeFileSync(QFILE + '.tmp', out.text);
        renameSync(QFILE + '.tmp', QFILE);
        console.log(`answered ${id}: ${String(answer).slice(0, 60)}`);
        send(200, JSON.stringify({ entries: out.entries }));
      } catch (e) {
        send(400, JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  if (req.method !== 'GET') return send(405, JSON.stringify({ error: 'no' }));
  // This directory and nothing above it. `startsWith(here)` alone is not the check it looks like —
  // it also accepts a sibling directory whose name merely begins with this one's.
  const asked = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = resolve(here, '.' + (asked === '/' ? '/index.html' : asked));
  if ((file !== here && !file.startsWith(here + sep)) || !existsSync(file)) return send(404, 'not found', 'text/plain');
  send(200, readFileSync(file), TYPES[extname(file)] ?? 'application/octet-stream');
});

// A fixed port so the address survives a restart and can be bookmarked; an ephemeral one when
// something already holds it, because refusing to start over a port number would be silly.
const wanted = Number(process.env.PORT) || 7373;
server.on('error', (e) => {
  if (e.code !== 'EADDRINUSE') throw e;
  console.log(`port ${wanted} is taken — picking another`);
  server.listen(0, '127.0.0.1');
});
/**
 * It opens the page itself, because the version that did not was the whole feature failing.
 * Everything worked — the tab, the buttons, the writing — and the owner opened index.html the way
 * anyone opens a file, saw a page with no buttons on it, and asked why it was not interactive. A
 * command somebody has to remember is a door that is locked. --no-open is there for scripts.
 */
const openBrowser = (url) => {
  const [cmd, args] = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try {
    spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
  } catch { /* the address is printed either way */ }
};
/**
 * The numbers are worked out HERE, at the moment somebody opens the board, instead of whenever
 * anyone last remembered to type the command. It is the one thing a served board can offer that a
 * board opened from a file cannot, and it is what makes this window worth starting for a reader who
 * has nothing to answer. Measured at 1.8s on a fourteen-row project, and it is spent BEFORE the page
 * is served rather than beside it: a board that opens and then changes its numbers under the reader
 * is worse than one that takes a second, and the line above says what the second is for.
 *
 * A SEPARATE PROCESS whose failure is IGNORED, never folded into this file: refresh.mjs exits on a
 * repository with no commits and on a questions.js whose entry forgot a line, and a board that will
 * not open because of one missing sentence is a worse failure than the stale number it prevented.
 * The board opens anyway, printing the date it last computed — the same honesty the file:// board
 * has always had.
 *
 * Its complaint is HELD and printed WHENEVER THERE IS ONE, not only when it failed. The version that
 * printed it only on a non-zero exit had swallowed the one complaint that matters most: refresh.mjs
 * warns about an explain.js it cannot parse and then exits 0 on purpose, and hiding that on the path
 * this change makes everybody's front door would silence the alarm whose own comment says a broken
 * file must never be reported for months as "nobody has written these yet". git's noise is silenced
 * at ITS source instead (see refresh.mjs), which is what makes "print everything it says" safe.
 */
console.log('Working out the numbers…');
// The timeout is what makes "ignored" true. Without it a refresh that hangs — a huge repository, a
// git credential prompt — does not degrade the board, it stops the door opening at all, which is the
// one thing this was not allowed to do. A killed run leaves only a .tmp behind, never a torn file.
const refreshed = spawnSync(process.execPath, [join(here, 'refresh.mjs')], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 30_000 });
if (refreshed.status !== 0) console.log('Could not work them out just now — the board opens with whatever it last computed.');
const complaint = String(refreshed.stderr ?? '').trim();
if (complaint) console.log(complaint);

server.listen(wanted, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${server.address().port}/`;
  console.log(`The board is at ${url}`);
  console.log(`Answers are written to ${QFILE}`);
  console.log('Leave this window open while you use it. Ctrl+C when you are done.');
  if (!process.argv.includes('--no-open')) openBrowser(url);
});
