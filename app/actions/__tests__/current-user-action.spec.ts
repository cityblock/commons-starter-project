import { currentUser } from '../../shared/util/test-data';
import { setCurrentUser, SET_CURRENT_USER } from '../current-user-action';

describe('Current User Actions', () => {
  describe('setCurrentUser', () => {
    it('returns an action with current user and list of feature flags', () => {
      const action = setCurrentUser(currentUser);

      expect(action.type).toBe(SET_CURRENT_USER);
      expect(action.currentUser).toEqual(currentUser);
    });
  });
});
