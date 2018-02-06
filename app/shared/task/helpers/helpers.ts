import { CBO_REFERRAL_ACTION_TITLE } from '../../../../shared/constants';
import { FullCBOReferralFragment, ShortTaskFragment } from '../../../graphql/types';

export const isCBOReferralRequiringAction = (
  CBOReferral: FullCBOReferralFragment | null,
): boolean => {
  if (!CBOReferral) return false;

  return !CBOReferral.CBO && !(CBOReferral.name && CBOReferral.url);
};

export const isCBOReferralRequiringActionForUser = (
  task: ShortTaskFragment,
  userId: string,
): boolean => {
  if (task.assignedToId !== userId) return false;

  return task.title === CBO_REFERRAL_ACTION_TITLE;
};
