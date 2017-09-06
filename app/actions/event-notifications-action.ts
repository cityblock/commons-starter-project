export interface IEventNotificationsCountUpdated {
  type: 'EVENT_NOTIFICATIONS_COUNT_UPDATED';
  count: number;
}

export function updateEventNotificationsCount(count: number): IEventNotificationsCountUpdated {
  return {
    type: 'EVENT_NOTIFICATIONS_COUNT_UPDATED',
    count,
  };
}
