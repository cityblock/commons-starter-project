import { FullCBOReferralFragment } from '../../../graphql/types';

export const isCBOReferralRequiringAction = (
  CBOReferral: FullCBOReferralFragment | null,
): boolean => {
  if (!CBOReferral) return false;

  return !CBOReferral.CBO && !(CBOReferral.name && CBOReferral.url);
};
