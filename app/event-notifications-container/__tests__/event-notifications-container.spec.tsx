import { shallow } from 'enzyme';

import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { eventNotification, patient } from '../../shared/util/test-data';
import EventNotificationsContainer, {
  EventNotificationsContainer as Component,
} from '../event-notifications-container';

it('renders event notifications containers', () => {
  const mockStore = configureMockStore([]);

  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider
        store={mockStore({
          locale,
          eventNotifications: {
            count: 1,
          },
        })}
      >
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <EventNotificationsContainer
              dismissEventNotification={() => false as any}
              match={{ params: { eventNotificationType: 'tasks', patientId: patient.id } }}
            />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('updates notification count with new props', () => {
  const updateNotificationsCount = jest.fn();
  const component = shallow(
    <Component
      eventNotificationType={'tasks'}
      eventNotificationsLoading={false}
      eventNotifications={[eventNotification] as any}
      fetchMoreEventNotifications={() => false}
      updateNotificationsCount={updateNotificationsCount}
      notificationsCount={1}
      dismissEventNotification={() => false as any}
      match={{ params: { eventNotificationType: 'tasks', patientId: 'patient-id' } }}
    />,
  );
  const instance = component.instance() as Component;
  instance.componentWillReceiveProps({
    eventNotificationsResponse: { edges: [{ node: eventNotification }] },
  } as any);

  expect(updateNotificationsCount).toBeCalledWith(1);
});
