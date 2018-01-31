import { FullTaskFragment } from '../../../graphql/types';

export const isCBOReferralRequiringAction = (task: FullTaskFragment): boolean => {
  if (!task.CBOReferral) return false;

  return !task.CBOReferral.CBO && !(task.CBOReferral.name && task.CBOReferral.url);
};
