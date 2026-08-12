// The parts of this project. Hand-edited only — the board renders it, nothing generates it.
//
// COPY THIS SHAPE EXACTLY — every field below on every row, even when it is empty. A row missing
// `feels`, `guts`, `field` or `parts` still renders (both the board and refresh.mjs read an absent
// block as "never graded"), but writing them out is what keeps the file readable by a person.
//
// Letters are 'C' | 'B' | 'A' | null (never graded). S is not a letter — a row is S only when
// `crown` is set, and only the owner grants that. `target` stays null until the whole project has
// been graded once. A `parts` entry is a file path, or a directory path ending in `/` meaning
// everything under it.
//
// `group` is the one OPTIONAL field, and it is cosmetic: which part of the app a row belongs to, so
// that a dozen rows read as a handful of runs rather than a list. It must be one of 'finding music',
// 'playing it', 'keeping it', 'sharing it', 'running it' — anything else sorts last and prints as
// written. The nouns are load-bearing: on the first project these shipped as the bare verbs
// ('finding', 'keeping') and the owner read them on the page and could not tell what either meant.
// Those words are about what the PERSON is doing, which is the same axis a part is drawn on. Do not
// reach for frontend/backend: on the first project 13 of 14 rows listed both, so that split would
// have cut almost every row in half. Leave it off entirely if the project has no natural runs.
window.LADDER = {
  project: 'PROJECT NAME',
  spec: 'docs/superpowers/specs/quality-ladder-design.md', // wherever the rules live, or ''
  rows: [
    {
      id: 'example',
      group: 'finding music', // optional — see the note above; drop the field if it does not fit
      name: 'A part, named the way its owner would name it',
      // The promise is what a grade is measured against later. Write what a person would NOTICE if
      // it broke — not what the code is. "Click a song and it plays fast" beats "the audio layer".
      promise: 'What this part promises the person using it',
      parts: [
        'src/thing.ts',
        'src/thing-helpers/',
      ],
      target: null,
      targetWhy: '',
      feels: { grade: null, proof: '', date: '', commit: '' },
      guts: { grade: null, proof: '', date: '', commit: '' },
      field: { best: '', standing: '', trade: '', date: '' },
      crown: null,
      next: null,
      exams: [],
      notExamined: '',
      notes: '',
    },
  ],
};
