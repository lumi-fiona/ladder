// What each part IS, in plain words — the half of this board written to be READ rather than scanned.
//
// SEPARATE from ladder.js on purpose. This is the only file here holding paragraphs, paragraphs
// contain backticks and ${…}, and one bad character in ladder.js blanks the entire board. Here the
// same mistake loses the explanations and nothing else.
//
// ONLY A REAL CHECK MAY WRITE AN ENTRY. Mapping a project does not fill this in — a description
// written by a pass that skims is the one thing on this board that nobody verified, and the whole
// point of the board is that everything on it is either computed or earned. A part with no entry
// says so on its page, which is a true sentence and costs nothing.
//
// Keyed by row id. Every field optional; a missing entry is the honest empty state.
//
//   how    — what this part is and how it behaves, for someone who does not read code.
//   traps  — what would catch out the next person here, INCLUDING things that are deliberate.
//            The line against `next.needs`: if fixing it would remove the entry it is a need;
//            if it would still be true afterwards it is a trap.
//   date   — when it was written · commit — what the code looked like then, so the board can say
//            "written before 6 of these files changed" instead of quietly ageing.
window.EXPLAIN = {
  // 'row-id': {
  //   how: `Two to five short paragraphs.`,
  //   traps: [
  //     { what: 'One sentence a non-coder understands.', why: 'Why it is like that.',
  //       where: 'src/thing.ts', since: '2026-01-01' },
  //   ],
  //   date: '2026-01-01', commit: '',
  // },
};
