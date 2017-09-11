import { idleEnd, idleStart } from '../idle-action';

describe('idle actions', () => {
  it('starts idle', () => {
    expect(idleStart().type).toEqual('IDLE_START');
  });
  it('ends idle', () => {
    expect(idleEnd().type).toEqual('IDLE_END');
  });
});
