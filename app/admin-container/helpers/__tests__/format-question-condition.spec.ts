import { answer, question } from '../../../shared/util/test-data';
import formatQuestionCondition from '../format-question-condition';

it('formats question condition', () => {
  expect(formatQuestionCondition(question, answer)).toBe('Question Title: answer value');
});
