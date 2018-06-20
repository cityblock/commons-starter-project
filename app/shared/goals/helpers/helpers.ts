import { FullPatientGoal } from '../../../graphql/types';

export const isGoalTasksComplete = (patientGoal: FullPatientGoal): boolean => {
  // return true if every task is complete
  return patientGoal.tasks.every(task => !!task.completedAt);
};
