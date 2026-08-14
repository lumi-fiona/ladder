// What has actually MOVED. Append-only: never edit an entry, never delete one, and never quietly
// drop an embarrassing one. A snapshot can always be made to look fine after the fact — this is the
// one part of the board that cannot be, which is the only reason it is worth reading.
//
// kind: 'mapped'    the project was divided into parts (this file starts with one of these)
//     | 'promised'  a part went on the board BEFORE its code existed — see ladder-map's
//                   "A part nobody has built yet". Its own word rather than a second use of
//                   'mapped', which means something else and would read as a lie here.
//     | 'graded'    a part got its letters for the first time
//     | 'regraded'  letters changed — `from` says what they were
//     | 'rechecked' re-verified after a repair and the letters HELD. The payoff of the whole loop,
//                   and the one most easily forgotten — without it a verified repair leaves no
//                   trace, so the board can only ever show work going in, never landing.
//     | 'fixed'     code changed to clear something the board named
//     | 'expected'  what a part SHOULD be was set or changed
//     | 'described' a part was written up in plain words
//
// A 'fixed' entry may carry `clears: [0, 4]` — the indexes of that row's `next.needs` items it
// believes it addressed. A CLAIM, rendered as one ("says it clears 2 of the 8"), and it dies at the
// next re-grade, which rewrites the list. Leave it off when a repair does not map onto a listed
// item; an absent `clears` reads honestly as "a repair landed, the count does not know about it".
//
// THE FRONT PAGE IS BUILT FROM THIS FILE. Position is time, so a 'fixed' entry with no later
// 'graded'/'regraded'/'rechecked' for its row is what the board reads as "repaired, not yet
// verified" — which is how it shows both facts at once without recording anything extra.
window.HISTORY = [
  {
    date: 'YYYY-MM-DD', kind: 'mapped', row: 'ALL', commit: '',
    what: 'The project was divided into parts for the first time. Nothing is graded yet — the board says how much of the code no part is watching, and grading happens one part at a time, when someone is about to work on it.',
  },
];
