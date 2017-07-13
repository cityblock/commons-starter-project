import { selectTask } from '../task-action';

describe('task action', () => {
  it('correctly changes locale', () => {
    expect(selectTask('en').taskId).toEqual('en');
  });
});
