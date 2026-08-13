#!/usr/bin/env node
// Computes which graded letters have gone stale: for each row letter with a recorded
// commit, ask git which of the row's files changed since. Writes staleness.js
// (machine-owned, gitignored). Zero dependencies.
//
//   node docs/quality/refresh.mjs                        refresh staleness.js
//   node docs/quality/refresh.mjs --probe <commit> <path...>   print files changed since <commit>
//
// git pathspecs resolve relative to git's working directory, so every git call runs
// from the REPO ROOT — run from docs/quality/ instead and every path silently matches
// nothing, which reads as "everything is clean forever".
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
/**
 * ASK git where the root is; never count directories up from this file.
 *
 * It used to be `resolve(here, '..', '..')` — correct for `docs/quality/` and wrong for every other
 * placement, while the skill that installs this file says in as many words "or wherever the project
 * keeps documents". One level up instead of two and git ran outside the repository, which is the
 * failure the comment at the top of this file warns about: paths match nothing and the board reads
 * as everything-is-clean-forever. Asking removes the trap instead of documenting it.
 *
 * The two refusals below exist because this script is the FIRST command the mapping skill tells a
 * new user to run, and both of these states used to end in `Error: Command failed` over thirty
 * lines of node internals. One of them — a repository with no commits yet — is exactly the state a
 * project is in on the day somebody reaches for a skill whose whole pitch is day one.
 */
const fail = (msg) => { console.error(msg); process.exit(1); };
let root;
try {
  root = execFileSync('git', ['rev-parse', '--show-toplevel'],
    { cwd: here, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
  fail(`${here} is not inside a git repository.\nEverything this script writes is read out of git history, so there is nothing here for it to compute.`);
}
const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
try {
  execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, stdio: 'ignore' });
} catch {
  fail('This repository has no commits yet, so there is nothing a grade could be measured against.\nMake one commit, then run this again.');
}
const changedSince = (commit, paths) =>
  git(['diff', '--name-only', `${commit}..HEAD`, '--', ...paths]).split('\n').filter(Boolean);
const probeAt = process.argv.indexOf('--probe');
if (probeAt !== -1) {
  const [commit, ...paths] = process.argv.slice(probeAt + 1);
  if (!commit) {
    console.error('usage: node docs/quality/refresh.mjs --probe <commit> [path...]');
    process.exit(2);
  }
  console.log(changedSince(commit, paths.length ? paths : ['.']).join('\n'));
  process.exit(0);
}

const window = {};
// eval, deliberately: ladder.js is a file in this repo written by the people who run this script,
// at the same trust level as this script itself. It is JS with comments, not JSON, so it cannot be
// parsed. Never point this at a file that came from anywhere else.
eval(readFileSync(join(here, 'ladder.js'), 'utf8'));
// A MISSING explain.js is a state — nothing writes one until the first real check of a part. A
// PRESENT one that will not parse is a failure, and swallowing both the same way is how a broken
// file gets reported as "nobody has written these yet" for months.
try {
  eval(readFileSync(join(here, 'explain.js'), 'utf8'));
} catch (e) {
  window.EXPLAIN = {};
  if (existsSync(join(here, 'explain.js'))) console.error(`explain.js is present but did not parse — ${e.message}`);
}
// Same reading of a hand-written row as the board's: an absent letter block means "never graded",
// an absent `parts` means "watches nothing" (see letter() below, which refuses to fake a diff for
// it), and one row missing one is not a reason to refuse to compute the other rows in the file.
for (const r of window.LADDER.rows) { r.feels ||= {}; r.guts ||= {}; r.parts ||= []; }
const head = git(['rev-parse', 'HEAD']);
// git is SILENT about a pathspec that matches nothing, so a renamed or deleted part would report
// clean forever — the one way this list could rot. ONE listing of HEAD answers it for every row;
// asking git per part is ~90 process spawns and 2.5s on Windows (measured).
const atHead = git(['ls-tree', '-r', '--name-only', 'HEAD']).split('\n');
const goneAtHead = (paths) =>
  // a part ending in '/' means everything under it, so it exists if anything is under it
  paths.filter((p) => !atHead.some((f) => (p.endsWith('/') ? f.startsWith(p) : f === p)));

/**
 * Code in nobody's care. The map claims to cover the project, and until this was computed it was
 * covering two thirds of it: a third of the source — including the largest file in the repo, which
 * one row's own proof names as a root cause — belonged to no part at all. A grade cannot go stale
 * from a file nothing watches, so an unmapped file is a hole in every guarantee above.
 * Scans the WHOLE repository, not the directories the map already points into. Deriving the search
 * area from the map is circular in the worst possible way: a file no part mentions would define
 * itself out of the census, so the code most likely to be orphaned is exactly the code that could
 * never be reported. Found on the first repo this ran on that was not the one it was written for.
 */
const SKIP = /(^|\/)(node_modules|vendor|third_party|dist|build|out|coverage|\.next|\.venv|docs\/quality)\//;
function unmappedCensus(ladderRows) {
  const parts = ladderRows.flatMap((r) => r.parts);
  const tracked = git(['ls-files']).split('\n')
    .filter((f) => !SKIP.test(f))
    // Stylesheets and single-file components are source. Leaving them out let the largest file in
    // one project's web app — the one holding its reduce-motion kill switch and the geometry of its
    // waveform — sit in no part at all AND stay invisible to the check whose whole job is saying so.
    .filter((f) => /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rs|rb|java|kt|swift|c|h|cpp|cs|php|css|scss|sass|less|vue|svelte)$/.test(f))
    .filter((f) => !/(^|\/)(__tests__|test|tests)\//.test(f) && !/\.(test|spec)\.[a-z]+$/.test(f) && !/\.d\.ts$/.test(f));
  const covered = (f) => parts.some((p) => (p.endsWith('/') ? f.startsWith(p) : f === p));
  const orphans = tracked.filter((f) => !covered(f));
  const sized = orphans.map((f) => {
    try { return [f, readFileSync(join(root, f), 'utf8').split('\n').length]; } catch { return [f, 0]; }
  }).sort((a, b) => b[1] - a[1]);
  return {
    files: orphans.length,
    ofFiles: tracked.length,
    lines: sized.reduce((n, [, l]) => n + l, 0),
    biggest: sized.slice(0, 10).map(([file, lines]) => ({ file, lines })),
  };
}

const rows = {};
for (const row of window.LADDER.rows) {
  const letter = (l) => {
    if (!l.commit) return null; // ungraded — nothing to go stale
    // An empty pathspec is not "no files", it is EVERY file: `git diff A..HEAD --` diffs the whole
    // repository, so a graded row that lists nothing would report every commit in the project as a
    // reason to re-check it. Say the true thing instead.
    if (!row.parts.length) return { error: 'this row lists no files, so nothing can be checked' };
    try {
      return { changed: changedSince(l.commit, row.parts) };
    } catch {
      return { error: `commit ${l.commit} not found` }; // rebased away — page shows re-check
    }
  };
  // missing belongs to the ROW, not a letter: a vanished path stops both letters watching it.
  // The written explanation ages exactly like a grade does and is watched by the same three lines.
  rows[row.id] = {
    feels: letter(row.feels), guts: letter(row.guts), missing: goneAtHead(row.parts),
    explain: letter(window.EXPLAIN?.[row.id] ?? {}),
  };
}

const out =
  '// GENERATED by refresh.mjs — do not edit by hand.\n' +
  // Local time, not toISOString(): a UTC clock printed unlabelled beside true things is a small lie.
  `window.STALENESS = ${JSON.stringify({ generatedAt: new Date().toLocaleString('sv'), head, rows, unmapped: unmappedCensus(window.LADDER.rows) }, null, 2)};\n`;
writeFileSync(join(here, 'staleness.js'), out);
console.log(`staleness.js written · head ${head.slice(0, 7)} · ${window.LADDER.rows.length} rows`);
