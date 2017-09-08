import { IBrowserChanged } from './browser-action';
import { IEventNotificationsCountUpdated } from './event-notifications-action';
import { IIdleEnd, IIdleStart } from './idle-action';
import { ILocaleSelected } from './locale-action';
import { ITaskSelected } from './task-action';

export type Action =
  | ILocaleSelected
  | IBrowserChanged
  | ITaskSelected
  | IEventNotificationsCountUpdated
  | IIdleStart
  | IIdleEnd;
export type ActionType = Action['type'];
