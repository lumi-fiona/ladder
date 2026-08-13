// Questions the board is holding for its owner — see index.html's "Your call" tab.
//
// Hand-written by whoever is working the board, and REWRITTEN BY serve.mjs when an answer arrives:
// comments inside an entry do not survive that, so reasoning belongs in `because`, never in a comment.
// Append-only — no entry is ever deleted or reworded. An answer is written in place, once.
//
// THE ONE RULE: every entry says what happened MEANWHILE. A question here is a note, never a gate —
// nothing waits for an answer, and `node refresh.mjs` refuses a file whose entries forget to say so.
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
// To answer from the page rather than by hand: node serve.mjs
window.QUESTIONS = [];
