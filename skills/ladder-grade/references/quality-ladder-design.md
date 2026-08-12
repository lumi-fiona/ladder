# The Quality Ladder — design

2026-08-09 · brainstormed and approved in-session · Written for one project; kept here as the source of the bars for every project that installs this plugin.

## Why

An owner wants every part of their project held to a named standard — "a powerhouse of quality code, visuals,
feel" — with grades that are earned, not claimed. Three rules shaped everything below:

1. **Proof over claims.** A grade nobody can demonstrate is an opinion. If Claude calls something
   S, it must prove it to the OWNER *as the simple-minded user* — they watch it be true, or it isn't.
2. **The field check.** For every feature: does something better already exist, open or closed
   source — and if yes, why is ours not as good or better? Answered with fresh research at grading
   time, never from Claude's training memory (which is stale for moving projects).
3. **Fit for scope.** Perfection is not S if it doesn't fit the project. A simpler system that is
   as good on outcomes (speed, correctness, feel) OUTRANKS a bigger one that is barely better and
   slower. Comparisons judge outcomes, never feature count or cleverness.

## The rows

One row = one feature in user language. Each row lists the code parts that are its guts; parts may
appear under several rows (streams.ts backs half the app — that is expected, not a bug).

| Row | The promise, one line | Main parts |
|---|---|---|
| Search | Type anything, find it across all three platforms, ranked sanely | providers, ytmusic, soundcloud, spotify, searchRank |
| Playing music | Click a song and it plays fast, at the right quality, with nobody ever served someone else's stream | streams, streamCache, ytdlp, auth |
| Your library | Favorites, playlists, history — instant even at 15,000 songs | storage, libraryRoutes, userDb |
| Offline & downloads | Keep songs on the server; they always play, always full quality | pins, pinsRoutes |
| Artists & albums | Browse a musician's whole world from any song | ytmusic, soundcloud, spotify (artist/album lanes), covers |
| The Spotify tab | Spotify search, artists and your library — with no official API at all | spotify.ts (both token lanes) |
| Song identity & honesty | Right album art or none — never wrong; the same song recognized across platforms | match/*, identity, metadata |
| Smart playlists & connected libraries | Rules over everyone's libraries that never lie when a source is down | mirror, smartPlaylist, extLibraryRoutes, connections |
| Listening together & friends | See friends live, share a room, stay in step | presence, social, socialRoutes, socialDb |
| Sharing | Send a song to anyone — no account, the real stage | shares, shareRoutes, PlayerStage caps |
| The stage | Now Playing: the loom, the breathing room, lyrics | PlayerStage, Scrubber, audioAnalyser, lyrics |
| Radio | Endless autoplay that actually fits what you played | radio (server + client), radioRoutes |
| Watching | Video and Twitch live, in a music player, including rooms' watch lane | video route in streams/index, liveStream, videoStage |
| Running the house | Accounts, invites, admin, health, backups, feedback — the operator's life | users, invites, adminRoutes, logBuffer, sqlite/backups, feedback |

Rows are not fixed forever: a future feature gets a new row, a split feature splits its row.

## Grades

Scale: **S / A / B / C**, plus two non-grades: **unrated** (never graded) and **re-check** (graded,
but its files changed since — see Staleness).

Every row carries **two letters**:

- **feels** — how it is to use. Proved by demo: the owner uses it, or watches Claude drive the real app
  through it (including failure: dead cookie, hostile input, two accounts). For invisible parts
  the feels-proof is a torture demo — watch it not flinch.
- **guts** — how the code holds. Proved by review actually performed and tests actually run, with
  the commands and results written down.

### A floor is a threshold, not an impression

Each letter is a **bar with requirements you either meet or do not**. The grade is the highest floor
whose bar is met IN FULL. **One unmet requirement caps the row below that floor** — floors are gates,
never averages, and excellence elsewhere never compensates. There is no partial credit and no
"granted despite": if a proof needs the word *despite*, the grade is already wrong.

Bars, instantiated per row against that row's promise:

- **C — it works.** The common case does what the row promises. Nothing loses data.
- **B — nothing visibly wrong.** C's bar, plus: no defect a normal person meets in ordinary use,
  and the row's own tests exist and pass. One reproducible user-visible defect keeps a row at C
  however good the rest is.
- **A — it holds under attack.** B's bar, plus: someone actively tried to break the row's promise
  and failed; the remaining failure modes are known, written down, and none of them break that
  promise; and nothing here is embarrassing beside what else exists in the field.
- **S is not a letter — it is the row's crown**: both letters at A, the field check answered, and the
  proof staged in front of the owner. They have veto: if they are not convinced from their seat, it is not S yet.
  The board shows a row at S when crowned, otherwise at the lower of its two letters.

### Every grade names the next floor

A graded row carries **`next`**: the floor above it and the specific, checkable things standing in
the way — the shortest true path up, not a wish list. This is the encouraging half and it is
mandatory: a grade that says only "B" tells the owner nothing to do, while "C, and B needs exactly these
two things" is an invitation. If the list is genuinely short, that is a good day, not a reason to
grant the floor early. Clearing the list is what earns the floor, and clearing it means re-running
the check that failed.

Letters are deliberately three. If grading ever shows A is too wide a bucket — two A rows clearly
not the same class — an **A+** letter can be added then (grades are plain strings; it costs one
line) and the crown moves to require it. Not before: a finer letter without a finer proof is grade
inflation waiting to happen.

On THIS project the crown is meant to be chased, not admired: the board exists to make the gap
visible and worth spending real energy on. Ambition and realism meet in the per-row target —
chasing harder is done by raising a target, a deliberate act on the board rather than a mood.

### Targets come after the map

A row's **target** starts as `null` and stays there until the whole project has been graded once.
Aiming a row before you know what any of it is worth is guessing, and a board of guessed S targets
makes the honest ones meaningless. Once every row has been looked at, the owner sets targets with real
knowledge of what each part is and what it cost — S where they want to chase, lower where S doesn't
fit the row's importance ("Running the house only needs B" is a legal call).

The exception is deliberate, not accidental: they may set a target early for a row she wants to work
on **now**, before the map is finished. That is a choice to skip ahead, made on purpose.

The board follows the same two phases. While anything is ungraded the progress bar tracks the
mapping ("1 of 14 rows graded · targets come after the whole map"); once every row is graded it
tracks the climb toward the targets, and says plainly when none have been set yet.

## The field check

Per row, three short answers, each dated:

- **best out there** — the strongest thing that exists for this feature, open or closed source
  (checked fresh: web research at grading time; names in Claude's memory are leads, not verdicts)
- **where we stand** — ahead / even / behind, on outcomes
- **the trade** — why our version is or isn't the right call for this project's scope

S requires the field check *answered* — not won. "Behind Spotify's search, on purpose, because X"
is a legal S-supporting answer if the trade is real and named.

## Proofs and staleness

Each letter stores `{ grade, proof, date, commit }` — proof is plain text naming what was run or
shown and what happened. The commit is the repo commit the proof was made at. The row also stores
`next: { floor, needs: [] }` — the floor above and what stands in the way (see "Every grade names
the next floor"); `null` once a row is crowned or while it is unrated.

Staleness is **computed, never maintained**: `refresh.mjs` asks git which of the row's files
changed since each letter's commit, and flips that letter to **re-check** when they did. Nobody
keeps an "unreviewed list" by hand, so the list cannot rot — this replaces the hook idea from the
brainstorm. A nagging hook can be added later only if computed staleness proves not enough.

## The skeleton (what gets built first)

Three authored files plus one generated, all in `docs/quality/`, zero dependencies, no server —
the model-gap dashboard shape:

- **`ladder.js`** — the data: `window.LADDER = { rows: [...] }`. A plain script file (not JSON) so
  `index.html` works opened straight from disk. Hand-edited by Claude only. Row shape:
  `{ id, name, promise, parts: [file globs], target, feels: {grade, proof, date, commit},
  guts: {grade, proof, date, commit}, field: {best, standing, trade, date}, notes }`
- **`staleness.js`** — machine-owned: written by `refresh.mjs`, read by the page. Keeping it out
  of ladder.js means the script never rewrites a hand-edited file.
- **`index.html`** — the dashboard: a tier board (rows grouped by current grade, both letters
  visible per card), re-check and unrated badges, progress against targets ("3 of 14 rows at
  target"), and a per-row detail view (promise, parts, letters with proofs and dates, field check,
  notes). It must meet its own standard: this page gets opened for joy, so it gets designed, not
  slapped together.
- **`refresh.mjs`** — small node script, no dependencies: for each row and letter, run git to list
  the row's files changed since the recorded commit; write `staleness.js`. Run by hand
  (`node docs/quality/refresh.mjs`) whenever either of us wants the truth; Claude runs it before
  every grading session.

Initial state after the skeleton ships: every row **unrated**, targets all S until the owner says
otherwise. The board starting all-grey is honest and is the point.

## The ritual

One row at a time, no fixed order — the owner picks what itches. A grading session = Claude reads the
row's guts, runs the demos, does the field research, stages the feels-proof; both argue until both
letters are agreed; proofs, dates and commit go into `ladder.js`. Rows revisit when re-check flips
them or when either party wants the grade to move.

Endgame: the board shows nothing below target and nothing stale, and both the owner and Claude agree it
is telling the truth.

## Later, explicitly not now

- **The init-once skill** — generalize the ladder for any project (`init` maps the project, drafts
  rows, ships the same files). Its opening interview asks what the project IS and how far the
  owner is aiming, then proposes realistic per-row targets — S being rare or entirely unwanted is
  a correct outcome for most projects, not a failure. Built only after a real project's ladder has worked
  once.
- **A proactive hook** that flags new code the moment it lands — only if computed staleness misses
  things in practice.
- **CI or metric integration** — never auto-grade from lint/coverage numbers; grades are judgment
  plus proof by design.

## Open questions

- **How much work is one climb?** Clearing a `next` item is not the same as making the smallest edit
  that satisfies its wording. On the first climb (2026-08-09, song identity C→B) the item named one
  fix, the twenty-song check it demanded surfaced three defects, and stopping at the named one would
  have been the same pity-grading the bars were written to prevent — so the session fixed all three
  and the thing that stopped the fix reaching saved libraries. That was the right call, and it is
  currently a judgement rather than a rule. What the rule should be, whether a climb may keep growing
  until the floor is genuinely met or should stop and re-scope, and how an agent decides that without
  either sandbagging or sprawling, is unresolved.
- **Where a bug report lands.** A ticket names a symptom; a row owns a promise. Nothing yet says how
  a report gets attached to the row that owns it, or whether an incoming bug in a row already graded
  should force a re-check rather than waiting for the code to change.

## Non-goals

- No server, no build step, no database for the ladder itself.
- No public face — this is an operator's instrument, it lives in the repo.
- The dashboard never edits data; writes go through Claude (ladder.js) and refresh.mjs
  (staleness.js) only.

## Next step

Implementation plan via the writing-plans skill (with plan-hard discipline) for the skeleton:
`ladder.js` with all 14 rows unrated, `index.html`, `refresh.mjs`. Grading sessions start after
the skeleton renders.
