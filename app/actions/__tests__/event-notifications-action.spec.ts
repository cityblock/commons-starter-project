import { updateEventNotificationsCount } from '../event-notifications-action';

describe('event notifications action', () => {
  it('correctly changes updates the event notifications count', () => {
    expect(updateEventNotificationsCount(10).count).toEqual(10);
  });
});
