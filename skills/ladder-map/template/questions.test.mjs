import test from 'node:test';
import assert from 'node:assert/strict';
import { parseQuestions, checkQuestions, answerIn, serialize } from './questions.mjs';

const ENTRY = {
  id: 'q1',
  date: '2026-08-13',
  row: 'sharing',
  kind: 'taste',
  state: 'decided',
  asks: 'Should a live channel be shareable as a link?',
  because: 'A share is a snapshot of one song, kept for thirty days.',
  meanwhile: 'Refused it at the route and hid the button.',
  options: ['Refuse it, as now', 'Allow it while the channel is live'],
  answer: null,
  answeredAt: null,
};
const file = (...qs) => serialize(qs);

test('an answer lands in the file and the file still parses', () => {
  const out = answerIn(file(ENTRY), 'q1', 'kept');
  assert.equal(out.entries, 1);
  const [q] = parseQuestions(out.text);
  assert.equal(q.answer, 'kept');
  assert.equal(q.asks, ENTRY.asks); // the question itself is never reworded
});

test('an answer is dated the day it was given', () => {
  const [q] = parseQuestions(answerIn(file(ENTRY), 'q1', 'kept').text);
  assert.match(q.answeredAt, /^\d{4}-\d{2}-\d{2}$/);
});

test('answering one question leaves its neighbours alone', () => {
  const other = { ...ENTRY, id: 'q2', asks: 'Something else entirely?' };
  const list = parseQuestions(answerIn(file(ENTRY, other), 'q2', 'no').text);
  assert.equal(list[0].answer, null);
  assert.equal(list[1].answer, 'no');
});

test('a question nobody asked cannot be answered', () => {
  const out = answerIn(file(ENTRY), 'q9', 'sure');
  assert.equal(out.code, 404);
  assert.ok(!out.text);
});

// A second thought is a NEW question. Editing an answer would make the record worth nothing —
// the whole point of the file is that it says what was decided and when.
test('an answered question refuses a second answer', () => {
  const once = answerIn(file(ENTRY), 'q1', 'kept');
  assert.equal(answerIn(once.text, 'q1', 'actually no').code, 409);
});

test('an empty answer is not an answer', () => {
  assert.equal(answerIn(file(ENTRY), 'q1', '   ').code, 400);
});

// The rule that makes a question a note rather than a gate: it must say what happened anyway.
test('an entry with no meanwhile is named and refused', () => {
  const complaint = checkQuestions([{ ...ENTRY, meanwhile: '' }]);
  assert.match(complaint, /q1/);
  assert.match(complaint, /meanwhile/);
});

test('a complete entry has nothing to complain about', () => {
  assert.equal(checkQuestions([ENTRY]), null);
});

test('two entries may not share an id', () => {
  assert.match(checkQuestions([ENTRY, { ...ENTRY }]), /q1/);
});

test('a kind or state the board does not know is refused', () => {
  assert.match(checkQuestions([{ ...ENTRY, kind: 'priority' }]), /taste/);
  assert.match(checkQuestions([{ ...ENTRY, state: 'pending' }]), /waiting/);
});

test('a round trip through the file keeps every field', () => {
  const [q] = parseQuestions(serialize([ENTRY]));
  assert.deepEqual(q, ENTRY);
});
