import { IEventNotificationsCountUpdated } from '../../actions/event-notifications-action';
import { eventNotificationsReducer } from '../event-notifications-reducer';

describe('event notifications reducer', () => {
  it('correctly updates the event notifications count', () => {
    const action: IEventNotificationsCountUpdated = {
      type: 'EVENT_NOTIFICATIONS_COUNT_UPDATED',
      count: 10,
    };
    expect(eventNotificationsReducer(undefined, action).count).toEqual(10);
  });
});
