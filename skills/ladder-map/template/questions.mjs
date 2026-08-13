/**
 * The questions file — how it is read, checked and answered.
 *
 * ONE module rather than logic in two places: serve.mjs answers a question and refresh.mjs refuses a
 * malformed file, and if each held its own idea of a valid entry the server would happily write a
 * file the board's own check then rejects.
 */

/**
 * eval, deliberately, and for the same reason refresh.mjs does it: questions.js is a file in this
 * repository written by the people who run these scripts, at the same trust level as this one. It is
 * JS with comments, not JSON, so it cannot be parsed. NEVER point this at a file from anywhere else.
 */
export function parseQuestions(text) {
  const window = {};
  eval(text);
  if (!Array.isArray(window.QUESTIONS)) {
    throw new Error('questions.js did not set window.QUESTIONS to an array');
  }
  return window.QUESTIONS;
}

const KINDS = ['taste', 'judgment', 'permission'];
const STATES = ['decided', 'waiting'];
// Every one of these is a sentence the reader needs. An entry missing `because` is a question with
// no reasoning, and one missing `meanwhile` is the failure this whole surface exists to prevent:
// a question that stopped the work. The complaint says so in as many words, because whoever reads
// it is about to decide whether to add the line or delete the entry.
const NEEDED = ['date', 'row', 'asks', 'because', 'meanwhile'];

export function checkQuestions(list) {
  if (!Array.isArray(list)) return 'window.QUESTIONS is not a list';
  const seen = new Set();
  for (let i = 0; i < list.length; i++) {
    const q = list[i] ?? {};
    const at = q.id ? `question ${q.id}` : `the question in position ${i + 1}`;
    if (!q.id) return `${at} has no id — an answer is written against an id, so it needs one`;
    if (seen.has(q.id)) return `two questions share the id ${q.id} — an answer would land on whichever came first`;
    seen.add(q.id);
    for (const f of NEEDED) {
      if (!String(q[f] ?? '').trim()) {
        return f === 'meanwhile'
          ? `${at} does not say what happened meanwhile — every question must name what was done anyway, or it is a stop sign rather than a note`
          : `${at} has no ${f}`;
      }
    }
    if (!KINDS.includes(q.kind)) return `${at} is a "${q.kind}" — it must be one of ${KINDS.join(', ')} (priority is never asked: the board's own order answers it)`;
    if (!STATES.includes(q.state)) return `${at} is "${q.state}" — it must be decided or waiting`;
  }
  return null;
}

/**
 * The header the file always carries. It lives HERE rather than in questions.js because the file is
 * rewritten on every answer: a legend written by hand at the top would explain the shape until the
 * first click and then vanish, exactly when the next person needs it.
 */
export const HEADER = `// Questions the board is holding for its owner — see index.html's "Your call" tab.
//
// Hand-written by whoever is working the board, and REWRITTEN BY serve.mjs when an answer arrives:
// comments inside an entry do not survive that, so reasoning belongs in \`because\`, never in a comment.
// Append-only — no entry is ever deleted or reworded. An answer is written in place, once.
//
// THE ONE RULE: every entry says what happened MEANWHILE. A question here is a note, never a gate —
// nothing waits for an answer, and \`node refresh.mjs\` refuses a file whose entries forget to say so.
//
//   id          stable, referenced by an answer; never reused
//   date        when it was raised, YYYY-MM-DD
//   row         the part it belongs to (a row id from ladder.js), or 'ALL'
//   kind        'taste'      — what the thing is and is not
//               'judgment'   — measuring was tried and did not settle it (say what was measured)
//               'permission' — it touches the owner's property: their machine, their repository
//               (never priority: the board's own order answers that, and never what a probe settles)
//   state       'decided' — the call was made and the work went ahead; silence is agreement
//               'waiting' — nothing happened; say what is on hold and what was done instead
//   asks        the question, in one line
//   because     the reasoning, in plain words, for somebody who does not read code
//   meanwhile   what happened while the question stood — REQUIRED
//   options     2–4 concrete answers, so the page can offer buttons; free text always works too
//   answer      null until the owner says; written by serve.mjs
//   answeredAt  the day they said it
//
// To answer from the page rather than by hand: double-click board.cmd (or run \`node serve.mjs\`).
// Opening index.html straight from disk shows everything but cannot save an answer, so it offers no
// buttons — a page opened from a file is not allowed to write one.
`;

// The file is REWRITTEN whole rather than patched in place: a regex over hand-written JS is a way to
// corrupt the record, and JSON is valid JS. The cost is that comments inside an entry do not survive
// an answer — which is what the header above tells the next writer.
export const serialize = (list) => HEADER + `window.QUESTIONS = ${JSON.stringify(list, null, 2)};\n`;

/**
 * Answer one question. Returns the new file text, or a refusal with the status the route should send.
 * An answered question is never re-answered: a second thought is a new entry, and a record that can
 * be edited afterwards is worth nothing.
 */
export function answerIn(text, id, answer) {
  const list = parseQuestions(text);
  const q = list.find((x) => x.id === id);
  if (!q) return { error: 'no question has that id', code: 404 };
  if (q.answer != null) return { error: 'that one is already answered — a second thought is a new question', code: 409 };
  const clean = String(answer ?? '').trim();
  if (!clean) return { error: 'an answer needs words', code: 400 };
  q.answer = clean;
  // Local date, like every other date on the board: a UTC day printed unlabelled beside true things
  // is a small lie for anyone not on Greenwich.
  q.answeredAt = new Date().toLocaleString('sv').slice(0, 10);
  return { text: serialize(list), entries: list.length };
}
