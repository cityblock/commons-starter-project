import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { patientConcern } from '../../shared/util/test-data';
import PatientConcern from '../patient-concern';
import PatientConcernOptions from '../patient-concern-options/index';

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
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientConcern
            patientConcern={patientConcern}
            selected={true}
            onClick={() => true}
            onOptionsToggle={() => e => true}
            optionsOpen={false}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Toggle Options Menu', () => {
  const onClick = () => true;
  const onOptionsToggle = () => (e: React.MouseEvent<HTMLDivElement>) => true;

  it('does not render menu if options menu is closed', () => {
    const wrapper = shallow(
      <PatientConcern
        patientConcern={patientConcern}
        selected={true}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={false}
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
      />,
    );

    expect(wrapper.find(PatientConcernOptions).length).toBe(1);
  });
});
