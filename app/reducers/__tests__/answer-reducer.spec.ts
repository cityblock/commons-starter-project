import { IAnswersReset, IAnswerAdd, IAnswerRemove } from '../../actions/answer-action';
import { answerReducer } from '../answer-reducer';

const answer = {
  id: 'answer-id',
  value: 'value',
};

describe('answer reducer', () => {
  describe('answer add', () => {
    it('adds an answer without previous state', () => {
      const action: IAnswerAdd = {
        type: 'ANSWER_ADD',
        answer,
        key: '360',
      };
      const actionResponse = answerReducer(undefined, action) as any;
      expect(actionResponse['360']).toEqual({
        answers: [answer],
        oldAnswers: [],
        changed: true,
      });
    });
    it('does not modify previous state', () => {
      const previousState = {};
      const action: IAnswerAdd = {
        type: 'ANSWER_ADD',
        answer,
        key: '360',
      };
      const actionResponse = answerReducer(previousState, action) as any;
      expect(actionResponse['360']).toEqual({
        answers: [answer],
        oldAnswers: [],
        changed: true,
      });
      expect(previousState).toEqual({});
    });
    it('adds answer if one exists', () => {
      const answer2 = { id: 'answer-id-2', value: 'foo' };
      const previousState: any = {};
      previousState['360'] = {
        answers: [answer2],
        oldAnswers: [],
        changed: false,
      };
      const action: IAnswerAdd = {
        type: 'ANSWER_ADD',
        answer,
        key: '360',
      };
      const actionResponse = answerReducer(previousState, action) as any;
      expect(actionResponse['360']).toEqual({
        answers: [answer2, answer],
        oldAnswers: [],
        changed: true,
      });
    });
  });
  describe('answer remove', () => {
    it('does not modify previous state', () => {
      const previousState = {};
      const action: IAnswerRemove = {
        type: 'ANSWER_REMOVE',
        answer,
        key: '360',
      };
      const actionResponse = answerReducer(previousState, action) as any;
      expect(actionResponse['360']).toEqual({
        answers: [],
        oldAnswers: [],
        changed: true,
      });
      expect(previousState).toEqual({});
    });
    it('removes answer if one exists', () => {
      const previousState: any = {};
      previousState['360'] = {
        answers: [answer],
        oldAnswers: [],
        changed: false,
      };
      const action: IAnswerRemove = {
        type: 'ANSWER_REMOVE',
        answer,
        key: '360',
      };
      const actionResponse = answerReducer(previousState, action) as any;
      expect(actionResponse['360']).toEqual({
        answers: [],
        oldAnswers: [],
        changed: true,
      });
    });
  });
  describe('answer reset', () => {
    it('does not modify previous state', () => {
      const previousState = {};
      const action: IAnswersReset = {
        type: 'ANSWERS_RESET',
        answers: [answer],
        key: '360',
      };
      const actionResponse = answerReducer(previousState, action) as any;
      expect(actionResponse['360']).toEqual({
        answers: [answer],
        oldAnswers: [answer],
        changed: false,
      });
      expect(previousState).toEqual({});
    });
    it('resets to setup old answers and answers', () => {
      const previousState: any = {};
      previousState['360'] = {
        answers: [answer],
        oldAnswers: [],
        changed: false,
      };
      const action: IAnswersReset = {
        type: 'ANSWERS_RESET',
        answers: [answer],
        key: '360',
      };
      const actionResponse = answerReducer(previousState, action) as any;
      expect(actionResponse['360']).toEqual({
        answers: [answer],
        oldAnswers: [answer],
        changed: false,
      });
    });
  });
});
