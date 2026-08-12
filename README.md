# ladder

Two skills for [Claude Code](https://claude.com/claude-code) that answer a question a test suite
cannot: **is anything in this codebase in nobody's care, and is any of it getting better?**

It works by dividing a project into **parts that make promises to a person** — "type anything, find
it across all three platforms" is a part; "the services directory" is not — and then grading one
part at a time against bars you either meet or do not. The output is a board that opens from disk in
a browser, with no server and no build step, written for an owner who does not read their own code.

## Install

Two commands inside Claude Code:

```
/plugin marketplace add lumi-fiona/ladder
/plugin install ladder@ladder
```

Then start a new session. To pick up later versions:

```
/plugin marketplace update ladder
/plugin update ladder@ladder
```

The `@ladder` suffix is required — the bare name reports "plugin not found". Restart the session
afterwards.

### Without the plugin system

```sh
git clone https://github.com/lumi-fiona/ladder
cp -r ladder/skills/ladder-map   ~/.claude/skills/ladder-map
cp -r ladder/skills/ladder-grade ~/.claude/skills/ladder-grade
```

## The two skills

**`ladder-map` — the cheap first pass, and for most people the whole product.** It divides the
project into 8–20 parts, writes each one's promise, and censuses every tracked source file that no
part claims. **It grades nothing.** Every letter stays `null`, because a map with invented grades is
worse than no map: everything downstream trusts the letters.

The census is the point, and expect the number to be embarrassing. On the first project it found
**46 of 136 files, 7,430 lines** in nobody's care after a full manual mapping — including the
largest file in the repo and the login gate. On the second it found **60 files, 9,987 lines**, of
which 59 were stylesheets nobody had thought of as source.

**`ladder-grade` — one part, one session.** Read the part, run its tests, attack the pure logic with
what the tests do not cover, drive the live thing in a real browser, then **dispatch an adversary
whose instructions are to refute the draft**. That step is not a formality: on the first four
gradings it changed the answer every time. Out comes two letters (how it *feels* to use, how the
*guts* hold), a list of what the next floor needs with the check that proves each one, a field check
against what else exists in the world, and an explicit list of what was **not** examined.

## The board

Everything both skills produce is rendered by one self-contained HTML file, copied into the project
and checked in beside its data. It carries:

- **The record** — parts checked, repairs shipped, surprises written down, exams earned. Every number
  is counted from the data files on load, with nowhere to write one by hand.
- **How this project compares to everything else out there** — the field checks, gathered, ahead
  first. Each line is lifted from the grading that wrote it and clicks through to its evidence.
- **What has been happening** — one mark per recorded event, grouped by the day it happened.
- **Where things stand** — every part, its two letters, what it *should* be, what it promises, and
  how many things stand between it and its next floor.
- **What to do** — findings folded across parts by shared root cause, because nobody executes a
  backlog of dozens of items.
- **What's moved** — append-only, and the one view that must never be flattered after the fact.

Design rules the board holds itself to: a zero never renders as a number; a count that only a
re-grade can refresh either carries its as-of date or does not render; and every empty state names
its own window rather than claiming all-clear over a buffer that already rotated the problem away.

## What it costs

Measured on the first project: roughly **380,000 tokens per part per grading**, and **4.6 million**
to grade everything. Mapping the whole repository costs about one part's grading, which is what makes
the expensive step optional instead of compulsory.

A re-grade is this entire procedure again, so the skill tells you to re-grade per finished **theme**
rather than per repair, and the board works out for itself which rows are ready and which are being
held.

## What has not been shown

This is a discipline that is argued for, not one that is proven.

- It has run on **two** projects, both of which happened to be thoroughly documented. `ladder-map`'s
  first step is "read the project's own words" — on a project with no architecture notes that step is
  empty and the rest has never actually been tested.
- **Nothing measures whether the grades are right.** The adversarial pass changes answers, which is
  evidence it is doing something, not evidence the result is correct.
- The board is **copied** into each project, so it never hears about an improvement on its own. It
  prints its own version under the title and `ladder-map` documents how to update one, but that is a
  manual step a person has to take — found the hard way, when the second project's board turned out
  to be 854 lines out of date and only a hand-run diff ever noticed.
- A row **cannot reach A in the session that changed its code**, by design, so the loop is slow on
  purpose and the best a fixing session can honestly produce is B.

## Where it came from

A working project whose owner wanted to know whether the thing they had built was being looked after
— a question about *movement*, which a snapshot cannot answer. Most of the rules in these two files
are not preferences. Each one is an incident: a board that announced "97 things to fix" the morning
after twelve of them were fixed; eleven of twenty-nine "this is deliberate" notes that its own fix
list said to go and repair; eight of fourteen mandatory field checks that came back empty, which is
what a published checklist gets you and why the honest inverse — name your own blind spots — replaced
it.

## License

MIT
