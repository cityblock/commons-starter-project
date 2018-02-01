import {
  task,
  taskWithComment as CBOTask,
  CBOReferralOther,
  CBOReferralRequiringAction,
} from '../../../util/test-data';
import { isCBOReferralRequiringAction } from '../helpers';

describe('Task helpers', () => {
  describe('isCBOReferralRequiringAction', () => {
    it('returns false if not CBO referral task', () => {
      expect(isCBOReferralRequiringAction(task.CBOReferral)).toBeFalsy();
    });

    it('returns false if CBO referral task with defined CBO', () => {
      expect(isCBOReferralRequiringAction(CBOTask.CBOReferral)).toBeFalsy();
    });

    it('returns false if CBO referral task with complete other CBO', () => {
      expect(isCBOReferralRequiringAction(CBOReferralOther)).toBeFalsy();
    });

    it('returns true if CBO referral task without CBO or other data', () => {
      expect(isCBOReferralRequiringAction(CBOReferralRequiringAction)).toBeTruthy();
    });
  });
});
