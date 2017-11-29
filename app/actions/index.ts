import { IBrowserChanged } from './browser-action';
import { IEventNotificationsCountUpdated } from './event-notifications-action';
import { IIdleEnd, IIdleStart } from './idle-action';
import { ILocaleSelected } from './locale-action';
import { IProgressNoteClose, IProgressNoteOpen } from './popup-action';

export type Action =
  | ILocaleSelected
  | IBrowserChanged
  | IEventNotificationsCountUpdated
  | IIdleStart
  | IIdleEnd
  | IProgressNoteOpen
  | IProgressNoteClose;
export type ActionType = Action['type'];
