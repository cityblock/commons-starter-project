import { shallow } from 'enzyme';
import { clone } from 'lodash';
import * as React from 'react';
import { currentUser } from '../../shared/util/test-data';
import { AuthenticationContainer as Component } from '../authentication-container';

describe('shallow rendered', () => {
  const idleStart = jest.fn();
  const idleEnd = jest.fn();
  const selectLocal = jest.fn();
  const setCurrentUser = jest.fn();
  let instance: any;

  beforeEach(() => {
    const component = shallow(
      <Component
        loading={false}
        error={null}
        isAuthenticated={true}
        currentUser={currentUser}
        isIdle={false}
        idleStart={idleStart}
        idleEnd={idleEnd}
        selectLocale={selectLocal}
        setCurrentUser={setCurrentUser}
      >
        <div />
      </Component>,
    );
    instance = component.instance() as Component;
  });

  it('check idle calls idle start', async () => {
    await localStorage.setItem('lastAction', new Date(1500494779252).valueOf().toString());
    await instance.checkIdle();
    expect(idleStart).toBeCalled();
  });

  it('updates locale and current user', async () => {
    const newCurrentUser = clone(currentUser);
    newCurrentUser.id = 'newUserId';
    newCurrentUser.locale = 'es';
    await instance.componentWillReceiveProps({
      currentUser: newCurrentUser,
    });
    expect(selectLocal).toBeCalled();
    expect(setCurrentUser).toBeCalled();
  });
});
