import { FullAnswer, FullQuestion } from '../../graphql/types';

function formatQuestionCondition(question: FullQuestion, answer: FullAnswer) {
  const questionText = question.title;
  const answerText = answer.displayValue;
  return `${questionText}: ${answerText}`;
}

export default formatQuestionCondition;
