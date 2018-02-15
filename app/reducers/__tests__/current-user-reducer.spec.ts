import { permissionsMappings } from '../../../shared/permissions/permissions-mapping';
import { SET_CURRENT_USER } from '../../actions/current-user-action';
import { currentUser } from '../../shared/util/test-data';
import { currentUserReducer, initialState } from '../current-user-reducer';

describe('Current User Reducer', () => {
  it('sets state to current user with relevant feature flags if current user present', () => {
    const action = {
      type: SET_CURRENT_USER,
      currentUser,
    };

    const newState = currentUserReducer(initialState, action);
    const expectedFeatureFlags = (permissionsMappings as any)[currentUser.permissions];

    expect(newState.currentUser).toEqual(currentUser);
    expect(newState.featureFlags).toEqual(expectedFeatureFlags);
  });

  it('returns initial state if action not of correct type', () => {
    const action = {
      type: 'OTHER_TYPE',
    } as any;

    const newState = currentUserReducer(initialState, action);
    expect(newState.currentUser).toBeNull();
    expect(newState.featureFlags).toEqual({});
  });
});
