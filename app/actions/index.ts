import { ISetCurrentUser } from './current-user-action';
import { IEventNotificationsCountUpdated } from './event-notifications-action';
import { IIdleEnd, IIdleStart } from './idle-action';
import { ILocaleSelected } from './locale-action';
import { IUpdatePatientLeftNavSelected } from './patient-left-nav-action';
import { IPopupClose, IPopupOpen } from './popup-action';

export type Action =
  | ILocaleSelected
  | IEventNotificationsCountUpdated
  | IIdleStart
  | IIdleEnd
  | IPopupOpen
  | IPopupClose
  | ISetCurrentUser
  | IUpdatePatientLeftNavSelected;
export type ActionType = Action['type'];
