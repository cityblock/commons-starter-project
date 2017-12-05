export type answerGroup = 'progress-note' | '360';

export interface IAnswer {
  id: string;
  value: string;
}

export interface IAnswerAdd {
  type: 'ANSWER_ADD';
  answer: IAnswer;
  key: answerGroup;
}

export interface IAnswerRemove {
  type: 'ANSWER_REMOVE';
  answer: IAnswer;
  key: answerGroup;
}

export interface IAnswersReset {
  type: 'ANSWERS_RESET';
  key: answerGroup;
  answers: IAnswer[];
}

export function addAnswer(answer: IAnswer, key: answerGroup): IAnswerAdd {
  return {
    type: 'ANSWER_ADD',
    answer,
    key,
  };
}

export function removeAnswer(answer: IAnswer, key: answerGroup): IAnswerRemove {
  return {
    type: 'ANSWER_REMOVE',
    answer,
    key,
  };
}

export function resetAnswers(answers: IAnswer[], key: answerGroup): IAnswersReset {
  return {
    type: 'ANSWERS_RESET',
    key,
    answers,
  };
}
