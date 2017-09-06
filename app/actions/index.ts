import { IBrowserChanged } from './browser-action';
import { IEventNotificationsCountUpdated } from './event-notifications-action';
import { ILocaleSelected } from './locale-action';
import { ITaskSelected } from './task-action';

export type Action =
  | ILocaleSelected
  | IBrowserChanged
  | ITaskSelected
  | IEventNotificationsCountUpdated;
export type ActionType = Action['type'];
