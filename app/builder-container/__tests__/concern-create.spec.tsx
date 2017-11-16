import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import ConcernCreate, { ConcernCreate as Component } from '../concern-create';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders concern create', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <ConcernCreate routeBase="/builder/concerns" onClose={() => false} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('shallow rendered', () => {
  const createConcern = jest.fn();
  let instance: any;

  beforeEach(() => {
    const component = shallow(
      <Component
        routeBase="/builder/concerns"
        createConcern={createConcern}
        onClose={() => false}
      />,
    );
    instance = component.instance() as Component;
  });

  it('submits changed property', async () => {
    instance.onChange({
      target: {
        name: 'title',
        value: 'title to create',
      },
      preventDefault: jest.fn(),
    });
    await instance.onSubmit({
      preventDefault: jest.fn(),
    });

    expect(createConcern).toBeCalledWith({
      variables: {
        title: 'title to create',
      },
    });
  });
});
