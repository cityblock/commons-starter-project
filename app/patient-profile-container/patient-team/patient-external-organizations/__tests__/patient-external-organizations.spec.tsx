import { mount } from 'enzyme';
import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import ReduxConnectedIntlProvider from '../../../../redux-connected-intl-provider';
import EmptyPlaceholder from '../../../../shared/library/empty-placeholder/empty-placeholder';
import ApolloTestProvider from '../../../../shared/util/apollo-test-provider';
import {
  externalOrganization,
  externalOrganization2,
  patient,
} from '../../../../shared/util/test-data';
import createStore from '../../../../store';
import PatientExternalOrganization from '../patient-external-organization';
import PatientExternalOrganizations, {
  PatientExternalOrganizations as Component,
} from '../patient-external-organizations';

const history = createHistory();
const store = createStore(history);

describe('Render Patient External Organizations', () => {
  const graphqlMocks = () => ({
    PatientExternalOrganization: () => null,
  });
  const container = mount(
    <ApolloTestProvider graphqlMocks={graphqlMocks()}>
      <PatientExternalOrganizations patientId={patient.id} />
    </ApolloTestProvider>,
  );

  it('renders empty external members tab', () => {
    const wrapper = container.update();
    expect(wrapper.find(PatientExternalOrganization)).toHaveLength(0);

    const placeholder = wrapper.find(EmptyPlaceholder);
    expect(placeholder).toHaveLength(1);
    expect(placeholder.props().headerMessageId).toBe('patientTeam.externalOrganizationsEmptyTitle');
    expect(placeholder.props().detailMessageId).toBe(
      'patientTeam.externalOrganizationsEmptyDetail',
    );
    expect(placeholder.props().icon).toBe('inbox');
  });

  it('renders external members tab with organizations', () => {
    const wrapper2 = mount(
      <Provider store={store}>
        <ApolloProvider client={{} as any}>
          <ReduxConnectedIntlProvider defaultLocale="en">
            <Component
              patientId={patient.id}
              patientExternalOrganizations={[externalOrganization, externalOrganization2]}
            />
          </ReduxConnectedIntlProvider>
        </ApolloProvider>
      </Provider>,
    );
    expect(wrapper2.find(EmptyPlaceholder)).toHaveLength(0);

    const organizations = wrapper2.find(PatientExternalOrganization);
    expect(organizations).toHaveLength(2);
    expect(organizations.at(0).props().patientExternalOrganization).toMatchObject(
      externalOrganization,
    );
    expect(organizations.at(1).props().patientExternalOrganization).toMatchObject(
      externalOrganization2,
    );
  });
});
