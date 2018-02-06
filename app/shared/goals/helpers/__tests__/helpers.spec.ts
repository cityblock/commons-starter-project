import { assignedTask, completedTask } from '../../../util/test-data';
import { isGoalTasksComplete } from '../helpers';

describe('Goal helpers', () => {
  describe('isGoalTasksComplete', () => {
    it('returns false true if no tasks under patient goal', () => {
      expect(isGoalTasksComplete({ tasks: [] } as any)).toBeTruthy();
    });

    it('returns false if at least task is not complete', () => {
      expect(isGoalTasksComplete({ tasks: [assignedTask, completedTask] } as any)).toBeFalsy();
    });

    it('returns true if all tasks completed', () => {
      expect(isGoalTasksComplete({ tasks: [completedTask] } as any)).toBeFalsy();
    });
  });
});
