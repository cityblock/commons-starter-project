import { CBO_REFERRAL_ACTION_TITLE } from '../../../../../shared/constants';
import {
  task,
  taskWithComment as CBOTask,
  CBOReferralOther,
  CBOReferralRequiringAction,
} from '../../../util/test-data';
import { isCBOReferralRequiringAction, isCBOReferralRequiringActionForUser } from '../helpers';

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

  describe('isCBOReferralRequiringActionForUser', () => {
    it('returns false if task not assigned to user', () => {
      const userId = 'sansStark';
      expect(isCBOReferralRequiringActionForUser(task, userId)).toBeFalsy();
    });

    it('returns false if task is assigned but referral is null', () => {
      const userId = 'jonSnow';
      expect(isCBOReferralRequiringActionForUser(task, userId)).toBeFalsy();
    });

    it('returns true if CBO referral task is assigned to user and requires action', () => {
      const userId = 'jonSnow';
      const actionTask = {
        ...task,
        title: CBO_REFERRAL_ACTION_TITLE,
      };

      expect(isCBOReferralRequiringActionForUser(actionTask, userId)).toBeTruthy();
    });
  });
});
