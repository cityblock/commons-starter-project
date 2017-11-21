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
import { PatientConcern } from '../concerns/concern';
import PatientConcernOptions from '../concerns/options-menu';
import { patientConcern } from '../util/test-data';
const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const oldDate = Date.now;

beforeAll(() => {
  Date.now = jest.fn(() => 1500494779252);
});
afterAll(() => {
  Date.now = oldDate;
});

it('renders patient concern', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PatientConcern
              patientConcern={patientConcern}
              selected={true}
              onClick={() => true}
              onOptionsToggle={() => e => true}
              optionsOpen={false}
              selectedTaskId=''
            />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Patient Concern Component', () => {
  const onClick = () => true;
  const onOptionsToggle = () => (e: React.MouseEvent<HTMLDivElement>) => true;
  const selectedTaskId = 'aryaStark';

  it('does not render menu if options menu is closed', () => {
    const wrapper = shallow(
      <PatientConcern
        patientConcern={patientConcern}
        selected={true}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={false}
        selectedTaskId={selectedTaskId}
      />,
    );

    expect(wrapper.find(PatientConcernOptions).length).toBe(0);
  });

  it('renders menu if options menu is option', () => {
    const wrapper = shallow(
      <PatientConcern
        patientConcern={patientConcern}
        selected={true}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={true}
        selectedTaskId={selectedTaskId}
      />,
    );

    expect(wrapper.find(PatientConcernOptions).length).toBe(1);
  });

  it('is styled as inactive if a task is selected', () => {
    const wrapper = shallow(
      <PatientConcern
        patientConcern={patientConcern}
        selected={true}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={false}
        selectedTaskId={selectedTaskId}
      />,
    );

    expect(wrapper.find('.inactive').length).toBe(1);
  });

  it('is not styled as inactive if a task is not selected', () => {
    const wrapper = shallow(
      <PatientConcern
        patientConcern={patientConcern}
        selected={true}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={false}
        selectedTaskId=''
      />,
    );

    expect(wrapper.find('.inactive').length).toBe(0);
  });
});
