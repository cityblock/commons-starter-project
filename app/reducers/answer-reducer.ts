import { Action } from '../actions';
import { IAnswer } from '../actions/answer-action';

interface IAnswerData {
  answers?: IAnswer[];
  oldAnswers?: IAnswer[];
  changed?: boolean;
}

export interface IState {
  [key: string]: IAnswerData | undefined;
}

const initialState: IState = {};

const addAnswerToState = (
  answer: IAnswer,
  currentState: IAnswerData = {
    answers: [],
    oldAnswers: [],
    changed: true,
  },
): IAnswerData => {
  const answerData = { ...currentState, changed: true };
  if (answerData.answers) {
    answerData.answers = answerData.answers.filter(a => a.id !== answer.id);
    answerData.answers.push(answer);
  }
  return answerData;
};

const removeAnswerFromState = (
  answer: IAnswer,
  currentState: IAnswerData = {
    answers: [],
    oldAnswers: [],
    changed: true,
  },
): IAnswerData => {
  const answerData = { ...currentState, changed: true };
  if (answerData.answers) {
    answerData.answers = answerData.answers.filter(a => a.id !== answer.id);
  }
  return answerData;
};

const setupAnswers = (answers: IAnswer[]): IAnswerData => {
  const answerData = {
    answers,
    oldAnswers: answers,
    changed: false,
  };
  return answerData;
};

export const answerReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'ANSWER_ADD':
      return {
        ...state,
        [action.key]: addAnswerToState(action.answer, state[action.key]),
      };
    case 'ANSWER_REMOVE':
      return {
        ...state,
        [action.key]: removeAnswerFromState(action.answer, state[action.key]),
      };
    case 'ANSWERS_RESET':
      return {
        ...state,
        [action.key]: setupAnswers(action.answers),
      };
    default:
      return state;
  }
};
