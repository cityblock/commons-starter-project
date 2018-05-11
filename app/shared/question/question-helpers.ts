import { values } from 'lodash';
import {
  getQuestionsQuery,
  FullPatientAnswerFragment,
  FullQuestionFragment,
} from '../../graphql/types';

export interface IQuestionAnswerHash {
  [questionId: string]: Array<{
    id: string;
    value: string;
  }>;
}

export interface IQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}

interface IConditionState {
  total: number;
  satisfied: number;
}

export function getQuestionAnswerHash(nextPatientAnswers?: FullPatientAnswerFragment[] | null) {
  const questionAnswerHash: IQuestionAnswerHash = {};
  if (!nextPatientAnswers) {
    return questionAnswerHash;
  }

  // Existing PatientAnswers have loaded, update to include those answers
  nextPatientAnswers.forEach(patientAnswer => {
    const { question, answerId, answerValue } = patientAnswer;

    if (question) {
      const existingQuestionState = questionAnswerHash[question.id] || [];
      questionAnswerHash[question.id] = [
        ...existingQuestionState,
        {
          id: answerId,
          value: answerValue,
        },
      ];
    }
  });

  return questionAnswerHash;
}

export function evaluateQuestionConditions(
  questionConditions: IQuestionCondition[],
  questions: IQuestionAnswerHash,
): IConditionState {
  const questionAnswers = values(questions).map(questionValue => questionValue);

  const conditionsStatus = {
    total: questionConditions.length,
    satisfied: 0,
  };

  if (questionAnswers.length) {
    const flattenedAnswers = questionAnswers.reduce((answers1, answers2) =>
      answers1.concat(answers2),
    );

    questionConditions.forEach(condition => {
      if (flattenedAnswers.some(answer => answer.id === condition.answerId)) {
        conditionsStatus.satisfied += 1;
      }
    });
  }

  return conditionsStatus;
}

export const getQuestionVisibility = (
  question: FullQuestionFragment,
  questions: IQuestionAnswerHash,
): boolean => {
  let visible: boolean = true;

  const questionConditions = question.applicableIfQuestionConditions;

  if (questionConditions && questionConditions.length) {
    const conditionsMet = evaluateQuestionConditions(questionConditions, questions);

    const allTrue = conditionsMet.satisfied === conditionsMet.total;
    const oneTrue = conditionsMet.satisfied > 0;

    switch (question.applicableIfType) {
      case 'allTrue': {
        if (!allTrue) {
          visible = false;
          break;
        }
      }
      case 'oneTrue': {
        if (!oneTrue) {
          visible = false;
          break;
        }
      }
      default: {
        visible = true;
        break;
      }
    }
  }

  return visible;
};

export const getAnswerDataForQuestion = (
  question: FullQuestionFragment,
  patientAnswers: FullPatientAnswerFragment[],
) => {
  const answerData = { answers: [] as any, oldAnswers: [] as any, changed: false };
  patientAnswers.forEach(answer => {
    if (answer && answer.question && answer.question.id === question.id) {
      const data = { id: answer.answerId, value: answer.answerValue };
      answerData.oldAnswers.push(data);
      answerData.answers.push(data);
    }
  });
  return answerData;
};

export const allQuestionsAnswered = (
  questions: getQuestionsQuery['questions'],
  answerData: IQuestionAnswerHash,
) => {
  for (const question of questions || []) {
    const isVisible = getQuestionVisibility(question, answerData);

    if (isVisible) {
      if (!answerData[question.id] || answerData[question.id].length < 1) {
        return false;
      }
    }
  }
  return true;
};
