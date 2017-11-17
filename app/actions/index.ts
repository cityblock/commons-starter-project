import { IBrowserChanged } from './browser-action';
import { IEventNotificationsCountUpdated } from './event-notifications-action';
import { IIdleEnd, IIdleStart } from './idle-action';
import { ILocaleSelected } from './locale-action';

export type Action =
  | ILocaleSelected
  | IBrowserChanged
  | IEventNotificationsCountUpdated
  | IIdleStart
  | IIdleEnd;
export type ActionType = Action['type'];
