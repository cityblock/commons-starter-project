import { FullAnswerFragment, FullQuestionFragment } from '../../graphql/types';

function formatQuestionCondition(question: FullQuestionFragment, answer: FullAnswerFragment) {
  const questionText = question.title;
  const answerText = answer.displayValue;
  return `${questionText}: ${answerText}`;
}

export default formatQuestionCondition;
