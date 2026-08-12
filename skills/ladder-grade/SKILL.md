---
name: ladder-grade
description: Grade one part of a project's quality ladder (docs/quality/ladder.js) against threshold bars — two letters with staged proof, a fresh field check against what else exists, an adversarial pass that must try to refute the grade, a standing exam the part keeps, and a mandatory "what the next floor needs" list. Use when asked to grade, re-grade, or re-check a ladder row, or when a row shows re-check after its code moved.
---

# Grading a ladder row

One row, one session. The output is two letters (`feels`, `guts`), what the next floor needs, a
field check, and proof a non-technical owner can watch.

**The bars, the letters and what S means live in a design spec — read it first.** Use the project's
own if it has one (`docs/superpowers/specs/*quality-ladder*design.md` or wherever it keeps specs);
otherwise read **`references/quality-ladder-design.md`**, which ships beside this file and is the
same document the first project was graded against. They are deliberately NOT repeated here: two
copies of a rule is how the two copies diverge — and one copy per project is what lets a project
tighten a bar without every other project silently inheriting it.

In one line: **C** it works, **B** nothing a normal person meets in ordinary use is wrong, **A** it
survived someone actively trying to break it, **S** is a crown the owner grants and you never award.

Worked examples of every rule below — the sessions that produced them, including the ones that went
wrong — are in `references/first-project.md`. Read it once; do not let its stories creep back into
this file.

## The two rules everything else serves

**1. A floor is a gate, not an average.** The grade is the highest floor whose bar is met IN FULL.
One unmet requirement caps the row, no matter how good everything else is. **If the sentence
explaining a grade contains the word "despite", the grade is one floor too high.**

**2. You do not get to grade your own reading.** The adversarial pass (step 6) is not optional, and
it is not a formality: on this instrument's first four gradings it changed the answer every time.

"Ordinary use" means what the owner actually does, not a corner case you had to construct. Searching
for a famous song is ordinary use. Feeding it a malformed URL is not.

## Procedure

1. **Set the scene.** Read the row in `ladder.js` — its promise, its `parts`, its `exams`. Run
   `node docs/quality/refresh.mjs`. Note whether the app is running and how to reach it.

2. **Re-run the row's standing exams first** (see below). They are the checks earlier grades earned
   by catching real defects. A failure here is a finding before you have looked at anything else.

3. **Read the parts, then run their tests.** Record the count and that they passed. Note whether the
   tests encode real incidents or invented strings — fixtures named after bugs that actually happened
   are worth more than a bigger number of synthetic ones, and that judgement belongs in the proof.

4. **Attack the pure logic with cases the tests do not cover** — what a real feed produces: empty
   fields, missing values, concatenated names, boundary numbers, words its vocabulary does not know.
   Throwaway probes only; delete anything you put in the repo.

5. **Probe the live behaviour, with ORDINARY inputs as well as hostile ones.** Hostile inputs test
   the guard rails; ordinary inputs test the promise, and the promise is what the bar is about.
   **Run any surprising result twice** — a lane that fails soft on a network error returns the same
   shape as a genuine refusal, and one transient failure otherwise reads as proof of good behaviour.

6. **Earn the feels letter in a real browser.** Two cases minimum: one that should work, one that
   should honestly fail, refuse or degrade. Screenshot both and say what you SAW. Read the component
   for selectors rather than guessing twice.

7. **Write the draft to a file, then dispatch an adversary to REFUTE it.** It gets the draft path,
   the repo, permission to run things, and instructions to default to refuting. Point it at (a) the
   letters against the bars, (b) any finding the draft talked itself out of, (c) what was never
   probed at all, (d) any claim that this part is good, fast or ahead of others, and (e) the
   description you are about to write into `explain.js` (step 13) — a sentence about how something
   works is a claim, and it is the one a non-technical owner is least able to check. Use a model
   whose strength is review, at high effort. **This step decides the grade.**

8. **Re-verify what it found, yourself.** A subagent's finding is a claim. Reproduce it. If it does
   not reproduce, try the exact shape they used before dismissing it.

9. **Field check — fetched this session, never recalled.** Two researchers in parallel: one on
   open-source implementations, one on how commercial products behave. Both cite URLs and prefer
   primary sources. Out come `best` (what exists), `standing` (ahead, level, behind), `trade` (why
   our choice is or is not right here). Naming one thing the field does better is a healthy result.
   **If you could not do it, leave it empty and say so** — an invented field check is worse than a
   missing one.
   **Then write `verdict` — the same finding, in a shape the board can count.** A list of
   `{ stand: 'ahead' | 'level' | 'behind', on: '<one plain sentence>' }`, one entry per distinct
   claim, and a row is usually several: ahead on one thing while behind on another is the normal
   result, not a contradiction. It is not a summary you compose afterwards — `standing` already
   states every verdict outright, so this is that same sentence written short enough to read in a
   list. The front page renders all of them together as **How this compares to everything else out
   there**, with ahead first, which is the only place on the board that answers "is this good
   COMPARED TO WHAT" rather than "is this good". Each `on` finishes the sentence "*ahead / level /
   behind* …", starts lowercase, and names what a person would notice — "on refusing to guess — a
   census of 399 tracks found not one wrong cover", never "on the abstention logic".
   Why it is worth the extra minute: on the first project these checks came to roughly 41,000
   characters of the most readable writing on the whole board, and every word of it was invisible
   unless you clicked into a part.

10. **Write `next`** — the floor above and the specific things standing in the way. Each item names
    the change AND, separately, **the check that proves it**, broader than the single case that
    failed. A short list is a good day, never a reason to grant the floor early.

11. **Say what you did NOT examine.** Every grade names its own blind spots in `notExamined`: the
    dimension you never got to, the platform you did not try, the check you could not run. This is
    coverage as an admission rather than a checklist — a checklist gets taught to and fills with
    empty boxes, while a blind spot someone wrote down is a finding for the next session. A grade
    that claims to have examined everything is the one to distrust.

12. **Propose what this part should be, with its reason** (see below). Before the whole project has
    been graded once, leave it unset.

13. **Write the part's own page — `explain.js`, keyed by row id.** You are the only thing allowed
    to. Mapping a project deliberately leaves this empty, because a description nobody checked would
    be the single claim on the board that nothing stands behind; you have just spent a session
    proving how this part behaves, so you are the one who can write it. Carry today's `date` and the
    `commit` you graded at, so the board can later say "written before six of these files changed".
    - **`how`** — what this part is and how it behaves. Two to five short paragraphs, for someone who
      does not read code: not an API tour, not a file list. Where the project has its own
      architecture notes this is a TRANSLATION of them, never a link — the board opens from disk and
      cannot read another file, and the person it is for cannot read that register anyway.
    - **`traps`** — what would catch out the next person here, **including the things that are
      deliberate**; those are the most valuable and they appear in no other field. The line against
      `next`: *if fixing it would remove the entry it is a `need`; if it would still be true
      afterwards it is a trap.* Each `what` names something a person would SEE, never what a function
      does. A trap must be something that HAPPENED or that the code states about itself.
    **Traps already there are KEPT, with the date they were first written.** A re-grade adds ones it
    found and removes ones that have stopped being true; restamping them all with today loses the
    only thing that says how long something has been the case. Removing one is a decision worth a
    line in `notes` saying why.
    **The commonest way this section goes wrong is a defect wearing a trap's clothes** — an entry
    saying "this is on purpose and has to stay this way" about something your own `next` list says
    to go and fix. Read your finished `traps` against your finished `next` line by line: any overlap
    is a trap that must go. On the first project eleven of twenty-nine failed this check, every one
    of them in that same direction.
    Step 7's adversary covers this too — a description is a claim about how something works, and it
    gets refuted like any other. Name it in the dispatch.

14. **Write it in and look at it.** Letters, proofs, field, `next`, `notExamined`, `explain`, `date`,
    and the `commit` you graded at. Proof text is plain language for a non-technical owner: name the
    command, name the actual wrong output, no jargon. Re-run `refresh.mjs`, open the board, click
    into the row's own page and READ it as the owner would.

## Standing exams: the part keeps what caught it

Every `next` item carries a check. Today those checks die when the item is cleared, which throws away
the only exams anyone has ever written for this project.

**When a `next` item is cleared, its check moves into the row's `exams` and stays there**, re-run at
the start of every future grading (step 2), ideally promoted into a real test. Each exam records what
it is, and the defect that earned it.

The admission bar is what makes this different from a checklist, and it cannot be padded: **a check
earns a place only by having caught a real defect.** Nobody may add one because it seems wise. That
is the same rule the project already applies to test fixtures — the ones named after bugs that really
happened are worth more than a larger number of invented ones.

This is also the answer to "should each rank have its own examination". It should not: **the rank is
the exam's OUTPUT, not its input** — a session cannot pick the B examiner before the examination has
decided the row is a B. The exam that matters is per-part and grown from that part's real failures.

## What a part SHOULD be: you propose the cost, the owner owns the worth

Asking an owner to set a target per row stalls them, and it should: it is one decision per row, each
needing the thing only the reviewing knows — what excellence COSTS in that corner. So the review
proposes every expectation with its reason attached, and the owner corrects the ones that are wrong
about their life. Silence is agreement. **Never present a blank field.**

**Split it honestly, because half of it you cannot know.** Cost is a finding: the field check tells
you what the best thing out there does and whether this trade is right. Worth is a preference — how
much this corner matters to the people who use it — and no evidence in the repo contains it.
**Never infer worth from where the commits went.** That is circular: work goes where work goes, and
the pile becomes proof of importance.

**A reason travels with every expectation**, in the row and on the card. One without a reason is a
number the owner cannot argue with, which makes it a number they ignore.

**The guard, because a bar-setter who also grades can lower the bar to pass.** An expectation may be
RAISED by any session. **Lowering one requires a session that did not grade that row, and takes
effect only when the owner acknowledges it.** Record every change either way.

**Always name ONE next action.** A menu hands the deciding back — to the agent as much as to the
owner. The first unfinished step of the roadmap's order IS the answer. The same rule governs how you
talk: end with a recommendation and an easy correction, never with a list of options to weigh.

## A is earned by a SECOND look, never by the session that did the work

**A row may not reach A in the same session that changed its code.** The A bar says someone actively
tried to break the promise and failed, and an attacker who watched the repair is not that person —
they know where the fix is and inherit its assumptions.

A requires, in order: graded, work done, code settles, then a LATER session grades it again at a new
commit with a fresh adversary who has not seen the fixing session. So **the best a fixing session can
honestly produce is B**, however good the work was. Same reason S is never self-awarded.

For the same reason, do not hand an adversary a list of what previous attackers tried and found
solid. A fresh attacker is valuable precisely because they do not inherit anyone's assumptions.

## Grade first, fix after

**A grading session does not fix things.** Repairing what you are measuring destroys the measurement:
the board can no longer say where the row stood at commit X. Write what you found into `next` and
stop.

Fix afterwards, and prefer fixing once the WHOLE map exists: the same defect usually spans rows, so
one fix lifts three, and fixing row by row means repairing the first row with the least knowledge you
will ever have. Three narrow exceptions: **the fix is the proof** (you cannot tell it is a defect
without changing it — then say the code moved mid-session); **it is actively harmful** (data loss, a
leaked credential — stop and say so); **the owner asked for this row now**.

When a climb happens, it clears the whole `next` list, not the smallest edit that satisfies one
item's wording.

**Probing is not free of side effects, and the owner's credentials are the place that bites.** Never
point a tool at a real credential file to see what it does: a cookie jar is usually a TWO-WAY file —
the tool rewrites it with whatever the server hands back — so one diagnostic run gambles with a login
the owner may not be able to replace. Copy it somewhere disposable and point the tool at the copy;
a codebase that downloads things has usually already had to solve this and you can follow what it
does. Driving the app through its own routes is always safe. The same care goes for anything else
that writes where it looks: a session that leaves the thing it measured in a different state than it
found it has stopped being a measurement.

## The loop, once the map exists

Mapping happens once. Then: **take a theme** from the roadmap (never a row — one fix usually lifts
several) → **clear it** → **re-grade every row it touched** (they flag themselves; changing their
files flips them to re-check) → **add a history entry and regenerate the roadmap**. New work joins
the same loop: a feature that ships gets a row, starting unrated.

**Re-grade per FINISHED THEME, never per repair.** A re-grade is the expensive act in this whole
system — it is this entire procedure again — so a row whose repair belongs to a theme still in
flight waits for that theme to land. The board works this out for itself and says which rows are
ready now and which are being held; do what it says rather than re-deriving it. (Written down after
a night of repairs where the honest answer was "re-check one of the six, hold the rest", and the
reasoning had to be done by hand because the page could not yet say it.)

### Writing the two events this loop produces

Both go in `history.js`, append-only, in its own plain voice.

- **A repair** is `kind: 'fixed'`, and it may carry **`clears: [0, 4]`** — the INDEXES of the items
  in that row's `next.needs` *as currently written* that the repair believes it addressed. It is a
  claim, not a fact, and the board renders it as one ("says it clears 2 of the 8"). Indexes are safe
  only because they die with the next re-grade, which rewrites the list. Leave it off when a repair
  does not map cleanly onto a listed item — an absent `clears` reads honestly as "a repair landed,
  the count does not know about it yet".
- **A re-check** has two possible kinds and BOTH must be recorded. `kind: 'regraded'` when a letter
  moved. **`kind: 'rechecked'` when you re-verified and the letters held** — which is a real result
  and the payoff of the whole loop. Before this kind existed, a verified repair that did not move a
  letter left no trace anywhere, so the board could only ever show work going in and never show it
  landing. Either one is what moves a row out of "waiting for a re-check", so forgetting to write it
  leaves the row claiming forever that nobody has looked.

## When the last row is graded: the synthesis

Rows produce dozens of `next` items. That is a backlog, and nobody executes a backlog. The useful
knowledge lives ACROSS rows and no single grade can see it — one missing retry surfaces in three
places, one failure that logs no reason blinds three rows at once. Folded by shared root cause,
dozens become a handful.

Write the roadmap FROM the grades, never from memory or opinion. **It goes on the board, not in a
document beside it** (`roadmap.js`, rendered as a second view): a document is a second place to look
and a second place to drift, and putting it on the page buys what a document cannot — every row named
inside a theme becomes a button that opens that row's evidence. It holds three things: **themes**
(which findings are one finding, with each row's evidence), **order** (what unblocks what), and
**what each theme buys** (which rows move up which floor). Regenerate it when grades move a theme.
It is derived — if it ever disagrees with the rows, the rows are right.

## Who the board is for

The owner may not read their own code. They are not looking for letters; they are trying to find out
whether the thing they built is being looked after. That is a question about MOVEMENT, and a snapshot
cannot answer it. So the board carries, beyond the grades:

- **"Has any of this amounted to anything?"** → THE RECORD, the first thing on the page: parts
  checked, repairs shipped, surprises written down, exams earned. It exists because the rule "a
  repair does not move a letter" — which is right, and which governs LETTERS — escaped into the
  page's whole voice. Four days of work, nine shipped repairs and fourteen write-ups rendered as
  "counts for nothing until a re-check says so", under a masthead whose four opening facts were all
  bad news. **A shipped repair is a fact; only the grade it earns is unproven.** Two rules keep it
  honest and both are load-bearing: **every number is COUNTED from the data files on load, with
  nowhere to write one by hand** — a celebration surface is the first place a flattering number
  appears, and a number that flatters you is one you stop checking — and **a zero never renders as a
  number**, because this board ships to projects where all of them are zero on the first day.
- **"Is it getting better?"** → `history.js` as a *What's moved* view: every check, re-grade, repair
  and change of expectation, dated, in plain words, grouped by day. **Append-only.** Never edit or
  delete an entry, and never quietly drop an embarrassing regrade — a snapshot can be flattered
  afterwards and this is the one part that must not be. It is also the only view whose content is
  WRITTEN rather than counted, so write each entry as the thing a person will read, with its
  measurement in it.
- **"What here has been proven, and what is only claimed?"** → the board sections every row by what
  needs attention — waiting for a re-check, changed underneath, current, not looked at yet — and the
  open counts sit under the record, carrying the date the letters were set. This exists because the
  rule "a repair is not a grade" used to cost the board its honesty: the morning after twelve fixes
  it still announced "97 things to fix" and "8 to go", numbers from before the work, rendered as if
  current. **The rule to keep: a count that only a re-grade can refresh either carries its as-of
  date, or does not render.**
- **"Is anyone still looking?"** → grades go quiet on their own after a while and the board says so.
  Staleness only fires when code CHANGES, so a part that talks to the outside world rots while its
  files sit still.
- **"Where do I start?"** → how many things stand between each row and its next floor, and the gap
  between where it is and where it should be. When most rows share a letter, letters stop
  discriminating and these restore it. Both are derived; do not write them down. The gap needs the
  TARGET on the row, in words — a board showing fourteen identical Cs and encoding "should be
  outstanding" as a shade of orange gives the eye nothing, which is how it shipped first.
- **"Compared to WHAT?"** → the field checks' `verdict` lines, all of them, on the front page, ahead
  first. Every other number here counts down from the grades; this is the one section that counts
  up, and it is the one a person who does not read code can actually enjoy. It went missing for a
  simple reason worth naming: each field check was written into the row that earned it, and nothing
  ever gathered them.
- **"Has it been going anywhere?"** → `history.js` drawn, not just listed: one mark per event grouped
  by the day it happened, and the fix list showing how much of itself already has a repair claiming
  it. Both come free from data the board already holds. Before this the front page stated "98 things
  to fix" on a morning when repairs claiming 29 of them had shipped, and the owner's read of four
  days of work was "just numbers and texts" — a fair one, since the only thing ever drawn was a
  three-pixel bar.
- **"What does this mean?"** → one plain sentence at the top, computed from the rows.

**Never state a total in prose that the page can count itself.** If a number can be derived, derive
it. Write for that reader everywhere: say what a person would SEE, not what the code does.

## Findings that belong to another row

The code is shared, so grading one promise walks you through several. Do not silently fix them and do
not drop them: write the finding into the OTHER row's `notes`, dated, one sentence, so it is waiting
when that row is graded. A finding recorded in the wrong row still counts; a finding recorded nowhere
is a defect you personally introduced into the board's honesty.

## When another agent is working in the same repo

Reviews are read-only and always safe; fixes are not. Grade now, hold every fix until they are done,
and say in the notes that the tree was moving — a grade taken during that is worth less and the
reader deserves to know.

## What belongs in the proof

- The exact command or browser action, and the exact result — including the wrong one, quoted.
- Which bar was missed, in one sentence a stranger could check.
- What you did not examine.
- Never "graded X despite Y". If there is a Y, the grade is X minus one.

## Refused on the record

Ideas considered and rejected, so they are not re-litigated every time someone has them again:

- **A skill per rank.** The rank is the exam's output, not its input — nobody enrols. It would also
  be four copies of the same 95% shared text, and the bars already drift between two files.
- **A skill per kind of part.** `feels` and `guts` ARE the kind split, already in the data model.
- **A structured list of "what we tried that held".** It is already in the proofs, and handing it to
  a fresh adversary re-contaminates the one perspective the A bar exists to protect.
- **Recording which examiner graded it.** Every examiner is a Claude session; the distinction that
  matters is temporal (fixing session versus later session), not personal.
- **A fixed checklist of dimensions.** A published syllabus gets taught to, and this project already
  measured what mandatory boxes produce: eight of fourteen field checks came back empty. `notExamined`
  is the honest inverse — it cannot be left blank and cannot be padded.

## Common ways this goes wrong

| Temptation | What to do instead |
|---|---|
| "The tests pass, so the guts are good" | Tests encode what someone already thought of. Steps 4 and 5 are about what they did not. |
| "I found six issues and still graded A, so I was clearly being tough" | Counting findings is not calibration. Ask which bar each one breaks. One that breaks a bar sets the grade by itself. |
| "It's only one bug in an otherwise excellent row" | That is the gate rule in its exact failure shape. One user-visible defect is a C. |
| "The adversary will just repeat what I found" | On this instrument's first four gradings it changed the answer every time. |
| "It abstained, so abstention works" | Check the same shape abstains twice. A soft-failing network lane looks identical to a refusal. |
| "The fix is small, so it's basically the next floor already" | Then it will be the next floor shortly, honestly. Write it into `next` and let clearing it be the event. |
| "I fixed everything it needed, so it's an A now" | Not from the session that fixed it. B is the honest ceiling for a fixing session. |
| "This is clearly S" | You cannot crown. Stage the proof and let the owner decide. |
| "I examined everything" | Then you did not look at your own blind spots. Fill `notExamined`. |
