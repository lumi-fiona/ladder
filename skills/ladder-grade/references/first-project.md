# The first project: what actually happened

Every rule in SKILL.md came from something going wrong on Lumify, a self-hosted music player, over
two days in August 2026. The stories live here so the skill can stay rules. Read once; do not let
them creep back into the skill, because every future project will want to add its own.

## The founding failure: a draft that graded itself A/A

The first row ever graded was song identity. The drafting session had already written down **six
findings** and still proposed A on both letters. The adversary found a reproducible wrong album on a
top-ten single — BTS's "Butter" displaying "Permission to Dance" behind a badge reading 92% confident
— within one probe. The row ended at C/C.

That is where "you do not get to grade your own reading" comes from, and why the adversarial pass
decides the grade rather than confirming it.

## The word "despite"

The same row was first written up as B "despite" a known wrong album. The owner caught it: a grade
granted despite a known visible fault is the definition of a floor not being met. The bars were
rewritten as gates that day, and the tell was made a rule — if the sentence needs "despite", the
grade is one floor too high.

## One passing song is not a check

The C grade demanded a check broader than the case that failed: twenty well-known songs, none wearing
another song's album. Running it found **three** wrong albums, not one. Fixing only the named one
would have been pity-grading with extra steps. That is why every `next` item must name a check
broader than its instance, and why a climb clears the whole list.

## The transient that looked like a verdict

A song reported as broken turned out to extract, fetch and play perfectly. What actually failed was a
momentary refusal — and the app asked exactly once, then went looking for a *different* upload, and
the route that finds one discards the answer when it is the same song. Meanwhile the grader's own
first probe of that song returned "abstain" from a network hiccup and nearly became evidence of good
behaviour. Hence: run any surprising result twice, and treat a soft failure as indistinguishable from
a refusal until proven otherwise.

## Circular importance

The first attempt at proposing expectations inferred importance from where the commits had gone. It
proposed a waveform visualiser as the project's highest bar while sharing — the only part a stranger
ever touches, and failing on production that same day — sat at the default. Radio was marked "good
enough" while its own field check said nothing comparable exists anywhere.

Work goes where work goes, and the pile becomes proof of importance. Cost is a finding; worth is the
owner's.

## The guard that was void before it was written

The rule "lowering an expectation must be recorded" was proposed on the same day the first
expectations were set — and that setting, which included a lowering, went unrecorded. A reviewer
found it by reading the commit rather than the intention. Guards are only real once the thing they
guard has actually been logged at least once.

## Mandatory boxes fill with nothing

Eight of fourteen field checks came back empty in the overnight pass — one honestly, because web
search failed. That is what a required box produces when the work behind it is expensive. It is the
argument against a checklist of dimensions, and the reason `notExamined` is phrased as an admission
instead.

## The console that lied by omission

A view switch was verified by console output: "6 themes, 57 links", no errors. The screenshot showed
the old view still on screen — `hidden` is a presentation hint and any display rule outranks it. The
DOM existed; it was in the wrong place. Console output proves a thing exists, never that a person can
see it.

## The efficiency claim, measured — and it failed

The instrument was about to grow a feature on the belief that handing an agent the map for the code
it is about to touch saves context. That belief was tested before it was built.

Two agents, same model, same task, same rules, run in parallel. The task was stated as a user
symptom ("I pressed play, it found a version, and skipped it — that link plays fine elsewhere"), not
as a diagnosis. A was handed the graded part's record, 2,464 tokens of it. B was handed nothing. The
scoring was written down before either answer was read.

| | with the map | without |
|---|---|---|
| tokens | **152,286** | **136,714** |
| tool calls | 28 | 16 |
| verdict | found the real cause, and isolated it with a probe nobody had run | found a DIFFERENT real defect |

**The map cost 11% MORE, not less.** It did not save context. What it did was change the answer: the
agent holding it found the cross-file cause (a rescue route discarding the correct answer because it
matched the one that just failed) and proved it by calling the same route twice, once with a bogus
input, to isolate the guard. The agent without it produced a plausible, evidence-backed, *different*
diagnosis — and that diagnosis turned out to be a second real defect the map had never recorded.

Three things follow, and the third is the uncomfortable one:

1. **Do not sell this as a context saver.** Measured, it is not one. Its value is depth and
   consistency of diagnosis, which is a different promise and an honest one.
2. **A grade's record is worth roughly a hundred and fifty thousand tokens of investigation**, so it
   is worth writing carefully — but reading it does not skip the investigation, it aims it.
3. **A map can narrow attention as well as focus it.** The unmapped agent went looking with no
   prior, and found something the mapped one walked past. Any future handout must say "here is what
   was found; it is not everything", and the honest version of that sentence is the row's own
   `notExamined`.

## Two numbers that drifted within a day

A total written into prose ("roughly sixty-five items") disagreed with the page's own count (76)
inside twenty-four hours, in two separate files. Both were deleted rather than corrected.
