import { task, taskWithComment as CBOTask, CBOReferralOther } from '../../../util/test-data';
import { isCBOReferralRequiringAction } from '../helpers';

describe('Task helpers', () => {
  describe('isCBOReferralRequiringAction', () => {
    it('returns false if not CBO referral task', () => {
      expect(isCBOReferralRequiringAction(task as any)).toBeFalsy();
    });

    it('returns false if CBO referral task with defined CBO', () => {
      expect(isCBOReferralRequiringAction(CBOTask as any)).toBeFalsy();
    });

    it('returns false if CBO referral task with complete other CBO', () => {
      const CBOTaskOther = {
        ...task,
        CBOReferral: CBOReferralOther,
      };
      expect(isCBOReferralRequiringAction(CBOTaskOther as any)).toBeFalsy();
    });

    it('returns true if CBO referral task without CBO or other data', () => {
      const CBOTaskRequiringAction = {
        id: 'defeatNightKing',
        CBOReferral: {
          name: "Night's Watch",
        },
      };
      expect(isCBOReferralRequiringAction(CBOTaskRequiringAction as any)).toBeTruthy();
    });
  });
});
