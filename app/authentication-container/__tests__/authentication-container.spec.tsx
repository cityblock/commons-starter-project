import { shallow } from 'enzyme';
import { clone } from 'lodash';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { currentUser } from '../../shared/util/test-data';
import { AuthenticationContainer as Component } from '../authentication-container';
import { Header } from '../header';

describe('shallow rendered', () => {
  const idleStart = jest.fn();
  const idleEnd = jest.fn();
  const selectLocal = jest.fn();
  const setCurrentUser = jest.fn();
  let instance: any;
  let component: any;

  beforeEach(() => {
    component = shallow(
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

  it('logout should set current user to null', async () => {
    await instance.logout();
    expect(setCurrentUser).toBeCalledWith(null);
  });

  it('renders header if authenticated', async () => {
    component.setProps({
      isAuthenticated: true,
      loading: false,
      currentUser,
    });
    // Can't yet match against Fragment
    expect(component).toMatchSnapshot();
  });

  it('renders redirect if not authenticated', async () => {
    component.setProps({
      isAuthenticated: false,
      currentUser: null,
      loading: false,
    });
    expect(component.find(Header).length).toBe(0);
    expect(component.find(Redirect).length).toBe(1);
    expect(component.find(Redirect).props().to).toMatchObject({
      pathname: '/',
      state: { from: 'blank' },
    });
  });

  it('renders null if authenticated but no current user', async () => {
    component.setProps({
      isAuthenticated: true,
      loading: false,
      currentUser: null,
    });
    expect(component.find(Header).length).toBe(0);
    expect(component.find(Redirect).length).toBe(0);
  });
});
