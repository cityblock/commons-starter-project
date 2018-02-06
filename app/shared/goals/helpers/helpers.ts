import { FullPatientGoalFragment } from '../../../graphql/types';

export const isGoalTasksComplete = (patientGoal: FullPatientGoalFragment): boolean => {
  // return true if every task is complete
  return patientGoal.tasks.every(task => !!task.completedAt);
};
