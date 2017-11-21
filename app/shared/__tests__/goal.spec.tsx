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
import { patientGoal } from '../../shared/util/test-data';
import PatientGoal from '../goals/goal';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const oldDate = Date.now;

beforeAll(() => {
  Date.now = jest.fn(() => 1500494779252);
});
afterAll(() => {
  Date.now = oldDate;
});

it('renders patient goal', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PatientGoal patientGoal={patientGoal} goalNumber={1} selectedTaskId="" />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Patient Goal Component', () => {
  it('applies inactive styles if a task selected', () => {
    const wrapper = shallow(
      <PatientGoal goalNumber={1} patientGoal={patientGoal} selectedTaskId="aryaStark" />,
    );

    expect(wrapper.find('.inactive').length).toBe(1);
  });

  it('does not apply inactive styles if a task is not selected', () => {
    const wrapper = shallow(
      <PatientGoal goalNumber={1} patientGoal={patientGoal} selectedTaskId="" />,
    );

    expect(wrapper.find('.inactive').length).toBe(0);
  });
});
