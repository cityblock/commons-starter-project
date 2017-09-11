import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
/* tslint:enable:max-line-length */
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { eventNotification } from '../../shared/util/test-data';
/* tslint:disable:max-line-length */
import EventNotificationsContainer, {
  EventNotificationsContainer as Component,
} from '../event-notifications-container';

it('renders event notifications containers', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();
  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const tree = create(
    <MockedProvider
      mocks={[]}
      store={mockStore({
        locale,
        eventNotifications: {
          count: 1,
        },
      })}
    >
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <EventNotificationsContainer
            eventNotificationType={'tasks'}
            eventNotificationsLoading={false}
            eventNotifications={[eventNotification]}
            fetchMoreEventNotifications={() => false}
            updateNotificationsCount={(n: number) => false}
            notificationsCount={1}
            match={{ params: { eventNotificationType: 'tasks' } }}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
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
      eventNotifications={[eventNotification]}
      fetchMoreEventNotifications={() => false}
      updateNotificationsCount={updateNotificationsCount}
      notificationsCount={1}
      match={{ params: { eventNotificationType: 'tasks', patientId: 'patient-id' } }}
    />,
  );
  const instance = component.instance() as Component;
  instance.componentWillReceiveProps({
    eventNotificationsResponse: { edges: [{ node: eventNotification }] },
  } as any);

  expect(updateNotificationsCount).toBeCalledWith(1);
});
