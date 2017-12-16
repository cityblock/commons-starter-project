import { shallow } from 'enzyme';
import { clone } from 'lodash-es';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { currentUser } from '../../shared/util/test-data';
import AuthenticationContainer, {
  AuthenticationContainer as Component,
} from '../authentication-container';

it('renders authentication container correctly', () => {
  const mockStore = configureMockStore([]);
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ idle: { isIdle: false } })}>
        <AuthenticationContainer loading={true} isIdle={false}>
          <div />
        </AuthenticationContainer>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('shallow rendered', () => {
  const idleStart = jest.fn();
  const idleEnd = jest.fn();
  const selectLocal = jest.fn();
  let instance: any;

  beforeEach(() => {
    const component = shallow(
      <Component
        loading={false}
        currentUser={currentUser}
        isIdle={false}
        idleStart={idleStart}
        idleEnd={idleEnd}
        selectLocale={selectLocal}
      >
        <div />
      </Component>,
    );
    instance = component.instance() as Component;
  });

  it('renders authentication container correctly with current user', () => {
    expect(instance.render()).toMatchSnapshot();
  });

  it('check idle calls idle start', async () => {
    await localStorage.setItem('lastAction', new Date(1500494779252).valueOf().toString());
    await instance.checkIdle();
    expect(idleStart).toBeCalled();
  });

  it('updates locale', async () => {
    const newCurrentUser = clone(currentUser);
    newCurrentUser.locale = 'es';
    await instance.componentWillReceiveProps({
      currentUser: newCurrentUser,
    });
    expect(selectLocal).toBeCalled();
  });
});
