import { addAnswer, removeAnswer, resetAnswers } from '../answer-action';

const answer = {
  id: 'answer-id',
  value: 'value',
};

describe('answer actions', () => {
  it('returns with key', () => {
    expect(addAnswer(answer, '360').key).toEqual('360');
    expect(removeAnswer(answer, '360').key).toEqual('360');
    expect(resetAnswers([answer], '360').key).toEqual('360');
  });

  it('includes answer', () => {
    expect(addAnswer(answer, '360').answer).toEqual(answer);
    expect(removeAnswer(answer, '360').answer).toEqual(answer);
    expect(resetAnswers([answer], '360').answers).toEqual([answer]);
  });
});
