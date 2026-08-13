# Your call — a place on the board where decisions wait

2026-08-13. Design, agreed in conversation before anything was built.

## The problem, from a real night

An agent worked a board for about seven hours: forty-seven stale items retired, six repairs shipped,
four parts re-checked, one production deploy. Over all of it, four things were put to the owner. Two
were physical acts nobody else could do (click Deploy, update a plugin). One was a mistake reported
after the fact (four of her uncommitted design documents were swept into a commit). One was a real
question — what the right first search result is for the query "nirvana" — where the agent measured
two approaches, found each traded one class of error for another, and stopped.

So the interruptions were not the problem. The problem is the shape of the ones that remain:

- The **taste calls got made silently.** "Should a live Twitch channel be shareable at all?" was
  decided by the agent, implemented, and mentioned in passing. It is probably the right answer. It
  is also a decision about what the product IS, and it left no trace anywhere the owner would look.
- The **question it could not answer stopped the work.** The ranking problem is exactly the kind a
  person settles in one line and no amount of measuring settles at all.
- The **permission question was not asked**, because asking it in chat felt like an interruption —
  so it became an accident instead.

A board that already answers "is anyone looking after this place" has no answer for "what did it
decide while I was asleep, and what is it waiting on".

## What this adds

One list, rendered as a fourth view beside *Where things stand · What to do · What's moved*, called
**Your call**. Every entry is one of two things:

**Decided — overturn me.** The agent made the call, the work went ahead, and the entry records what
it did and why. Silence is agreement. This is the same contract the board already uses for what each
part should be worth (`target` + `targetWhy`, rendered "proposed by the review from evidence — say
so if it is wrong about your life"), generalised beyond that one question.

**Waiting — nothing happened.** The agent did not decide, and says what is on hold and what it did
instead. Two reasons only: it genuinely could not judge, or the act was on the owner's property and
needs a yes. Everything not depending on the answer carried on.

The second state is what the existing mechanism cannot express, and it is why this is a new list
rather than a wider `targetWhy`.

## What may be asked, and what may not

Agreed explicitly:

- **Product taste.** What the thing is and is not.
- **Judgment the agent cannot make.** Where measuring has been tried and does not settle it — the
  entry must say what was measured, or it is a lazy question wearing a hard one's clothes.
- **Permission to touch the owner's property.** Committing their uncommitted work, deploying,
  anything on a machine or in a repository that is theirs to decide about.

Explicitly NOT:

- **What to work on next.** The board's own order decides that, and the agent follows it and reports
  afterwards. This was declined by name: priority is the thing the roadmap already answers, and a
  queue of "which first?" questions would put the owner back in the loop for the one decision the
  board was built to make for them.
- **Anything the code, the tests or one cheap probe can answer.** The kernel rule already governs
  this: a question that a five-minute measurement settles is not a question, it is avoidance.

## The data: `questions.js`

A new file beside `ladder.js`, `history.js` and `explain.js`, loaded the same way (a `window.QUESTIONS`
assignment, no build, no imports). Append-only, like `history.js`, and for the same reason: this is a
record of what was decided and when, and a record that can be edited afterwards is worth nothing.

```js
window.QUESTIONS = [
  {
    id: 'q7',                       // stable, referenced by an answer; never reused
    date: '2026-08-13',             // when it was raised
    row: 'sharing',                 // the part it belongs to, or 'ALL'
    kind: 'taste',                  // 'taste' | 'judgment' | 'permission'
    state: 'decided',               // 'decided' | 'waiting'
    asks: 'Should a live Twitch channel be shareable as a link?',
    because: 'A share is a snapshot of one song kept for thirty days. A live channel is neither…',
    meanwhile: 'Refused it at the route and hid the button, matching what a download already does.',
    options: ['Refuse it, as now', 'Allow it and show the picture', 'Allow it, audio only'],
    answer: null,                   // set by the owner; free text is always allowed
    answeredAt: null,
  },
];
```

Four fields carry the weight:

- **`meanwhile`** is what makes this not a stop sign. Every entry states what happened while the
  question stood — for a `decided` entry, what was built; for a `waiting` one, what was done instead
  and what is on hold. An entry without it is not allowed.
- **`because`** is the reasoning, in the board's own voice: plain words, for somebody who does not
  read code.
- **`options`** are 2–4 concrete answers so the page can offer buttons. Free text is always available
  as well; the options are a convenience, never a constraint.
- **`state`** decides everything about how it renders and how it is read back.

An answer is written in place (`answer`, `answeredAt`) rather than appended, because a question and
its answer are one fact. The append-only rule governs ENTRIES: none is ever deleted or reworded.

## The page

A fourth tab, **Your call**, with a count in the tab when anything is open. Inside it, in order:

1. **Waiting on you** — the entries where nothing happened. Each shows what is on hold, what was done
   instead, and its buttons. If this is empty, the section says so plainly, because "nothing is
   waiting" is the good news the owner came for.
2. **Decided while you were away** — the `decided` entries with no answer yet, newest first, each
   with what was built and two buttons: **Overturn** (which writes a real answer and puts the work
   back on the agent) and **Fine** (which writes `answer: 'kept'`). Both set `answeredAt`, so there
   is no third piece of state for "seen": an entry is here until it has an answer, and the cheap
   answer is one click. These are not problems; they are a briefing.
3. **Settled** — everything with an answer, collapsed, oldest last. The record.

Opened from a file with nothing running, all of it renders and none of it is clickable: a line at the
top says how to make it interactive. That keeps the board's one portability promise — it opens
anywhere, with no build and no server — while making the interactive half opt-in.

Row cards elsewhere on the board gain a small mark when that part has something waiting, so the
question is reachable from the part it is about.

## The server: `docs/quality/serve.mjs`

Run with `node docs/quality/serve.mjs`. Node's own http module, no dependencies, matching the board's
existing rule that it needs nothing installed.

- Binds `127.0.0.1` only, on a port it prints. Never `0.0.0.0`: this writes to disk on request, and
  the machine it runs on is the only place that may ask.
- `GET /*` serves the files in its own directory, and nothing above it.
- `POST /answer` takes `{id, answer}`, rewrites that entry in `questions.js` in place, and answers
  with the new file's entry count so the page can confirm rather than assume.
- It refuses an unknown id, an id that is already answered (an answer is not editable — a second
  thought is a new question), and a body over 8 KB — an answer is a sentence, not a document.
- It writes through a temporary file and a rename, like every other store in this family, so a
  crash mid-write cannot leave the board unreadable.

## The skill side

Three rules in `ladder-grade`, in the section that already governs what the review proposes and what
the owner owns:

1. **Which questions may be written at all** — the three kinds above, with priority named as
   excluded, and the existing "measure before you ask" bar applied to the judgment kind.
2. **An entry names what happened meanwhile.** This is the rule that makes the whole thing safe: a
   question is a note, never a gate. A session that stops working because something is unanswered has
   broken the contract, and the honest move when nothing else can proceed is to say so in the report
   and end the run — not to sit waiting.
3. **Answers are read first.** At the start of every run, before anything else, read `questions.js`,
   act on every answer that arrived, and mark those entries settled. An answer nobody acts on is
   worse than no answer, because it teaches the owner the page is decorative.

## What this deliberately does not do

- **No chat.** Nothing here is raised in conversation, and no run waits for an answer. Agreed
  explicitly: the board is the only surface.
- **No notifications, no email, no badge outside the page.** If a question sits unread for a week,
  that is a real answer about how much it mattered.
- **No blocking.** There is no state in which the agent is idle because of an unanswered question.
- **No re-asking.** An unanswered question is asked once. If the same decision comes up again, the
  entry gains a line saying it happened again; it does not multiply.

## How we will know it worked

Three checks, and the first one is the only one that really matters:

1. **Over a full working session, the number of times the agent stops to ask something in chat is
   zero, and the questions it would have asked are on the page.** Measured the same way tonight was
   measured: count them.
2. Every entry on the page has a `meanwhile` line. A single entry without one means rule 2 is being
   skipped, and the thing has become a gate.
3. An answer given on the page changes what the next run does, and that run says so. If the first
   answered question does not visibly land, the mechanism is decorative and should be deleted rather
   than kept for politeness.
