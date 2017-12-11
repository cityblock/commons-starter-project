import { clone, isEqual, keys, values } from 'lodash';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import {
  getQuestionsQuery,
  FullPatientAnswerFragment,
  FullQuestionFragment,
} from '../../graphql/types';

export interface IQuestionsState {
  [questionId: string]: {
    answers: Array<{
      id: string;
      value: string;
    }>;
    oldAnswers: Array<{
      id: string;
      value: string;
    }>;
    changed: boolean;
  };
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

export function setupQuestionsState(
  questionsState: IQuestionsState,
  currentQuestions?: FullQuestionFragment[],
  nextQuestions?: FullQuestionFragment[],
) {
  // Questions just loaded
  if (nextQuestions && !currentQuestions) {
    nextQuestions.forEach(question => {
      if (!questionsState[question.id]) {
        questionsState[question.id] = { answers: [], oldAnswers: [], changed: false };
      }
    });
    // Questions have changed
  } else if (
    nextQuestions &&
    currentQuestions &&
    (nextQuestions[0] || {}).id !== (currentQuestions[0] || {}).id
  ) {
    nextQuestions.forEach(question => {
      if (!questionsState[question.id]) {
        questionsState[question.id] = { answers: [], oldAnswers: [], changed: false };
      }
    });
  }
  return questionsState;
}

export function updateQuestionAnswersState(
  questionsState: IQuestionsState,
  nextPatientAnswers: FullPatientAnswerFragment[],
  currentPatientAnswers?: FullPatientAnswerFragment[],
) {
  // Existing PatientAnswers have loaded, update to include those answers
  if (nextPatientAnswers && !currentPatientAnswers) {
    nextPatientAnswers.forEach(patientAnswer => {
      const { question, answerId, answerValue } = patientAnswer;

      if (question) {
        const existingQuestionState = questionsState[question.id] || {
          answers: [],
          oldAnswers: [],
        };

        questionsState[question.id] = {
          answers: [
            ...existingQuestionState.answers,
            {
              id: answerId,
              value: answerValue,
            },
          ],
          oldAnswers: [
            ...existingQuestionState.oldAnswers,
            {
              id: answerId,
              value: answerValue,
            },
          ],
          changed: false,
        };
      }
    });
  }
  return questionsState;
}

export function getLastUpdated(
  patientAnswers: FullPatientAnswerFragment[],
  patientAnswersLoading?: boolean,
  patientAnswersError?: string,
) {
  if (patientAnswersLoading) {
    return 'Loading...';
  }

  if (patientAnswersError) {
    return 'Error';
  }

  if (!patientAnswers || !patientAnswers.length) {
    return 'Never';
  }

  const latestAnswer = clone(patientAnswers).sort((answerA, answerB) => {
    const answerAUpdatedAt = new Date(answerA.updatedAt).valueOf();
    const answerBUpdatedAt = new Date(answerB.updatedAt).valueOf();

    if (answerAUpdatedAt < answerBUpdatedAt) {
      return -1;
    } else if (answerBUpdatedAt < answerAUpdatedAt) {
      return 1;
    } else {
      return 0;
    }
  })[0];

  return (
    <FormattedRelative value={latestAnswer.updatedAt}>
      {(date: string) => <span>{date}</span>}
    </FormattedRelative>
  );
}

export function getChangedQuestionIds(questions: IQuestionsState) {
  const questionIds = keys(questions);

  return questionIds.filter(questionId => !!questions[questionId] && questions[questionId].changed);
}

export function getNewPatientAnswers(
  patientId: string,
  questions: IQuestionsState,
  currentQuestions: FullQuestionFragment[],
) {
  const questionIds = keys(questions);

  return questionIds
    .filter(questionId => !!questions[questionId] && questions[questionId].changed)
    .map(questionId => questions[questionId].answers.map(answer => ({ ...answer, questionId })))
    .reduce((answers1, answers2) => answers1.concat(answers2))
    .map(answer => {
      const question = (currentQuestions || []).find(q => q.id === answer.questionId);
      return {
        patientId,
        questionId: answer.questionId,
        applicable: question ? getQuestionVisibility(question, questions) : false,
        answerId: answer.id,
        answerValue: answer.value,
      };
    });
}

export function getUpdatedMutiselectAnswer(
  questionId: string,
  answerId: string,
  value: string | number,
  questions: IQuestionsState,
): IQuestionsState {
  const questionData = questions[questionId];
  if (!questionData) {
    throw new Error(`No question data for ${questionId}`);
  }

  const answerIndex = questionData.answers.findIndex((answer: any) => answer.id === answerId);

  if (answerIndex > -1) {
    questionData.answers.splice(answerIndex, 1);
  } else {
    (questionData as any).answers.push({ id: answerId, value });
  }

  const changed = !isEqual(questionData.answers, questions[questionId].oldAnswers);

  return { ...questions, [questionId]: { ...questionData, changed } };
}

export function getUpdatedStandardAnswer(
  questionId: string,
  answerId: string,
  value: string | number,
  questions: IQuestionsState,
): IQuestionsState {
  const questionData = questions[questionId];
  if (!questionData) {
    throw new Error(`No question data for ${questionId}`);
  }
  (questionData as any).answers = [{ id: answerId, value }];

  const changed = !isEqual(questionData.answers, questions[questionId].oldAnswers);

  return { ...questions, [questionId]: { ...questionData, changed } };
}

export function getUpdateForAnswer(
  questionId: string,
  answerId: string,
  value: string | number,
  questions: FullQuestionFragment[],
  questionsState: IQuestionsState,
): IQuestionsState | null {
  const fetchedQuestion = (questions || []).find(question => question.id === questionId);

  if (fetchedQuestion && fetchedQuestion.answerType === 'multiselect') {
    return getUpdatedMutiselectAnswer(questionId, answerId, value, questionsState);
  } else if (fetchedQuestion) {
    return getUpdatedStandardAnswer(questionId, answerId, value, questionsState);
  }
  return null;
}

export function evaluateQuestionConditions(
  questionConditions: IQuestionCondition[],
  questions: IQuestionsState,
): IConditionState {
  const questionAnswers = values(questions).map(questionValue => questionValue.answers);

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

// New question helpers
// TODO: remove above helpers
export const getQuestionVisibility = (
  question: FullQuestionFragment,
  questions: IQuestionsState,
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
  answerData: IQuestionsState,
) => {
  for (const question of questions || []) {
    const isVisible = getQuestionVisibility(question, answerData);

    if (isVisible) {
      if (!answerData[question.id] || answerData[question.id].answers.length < 1) {
        return false;
      }
    }
  }
  return true;
};
